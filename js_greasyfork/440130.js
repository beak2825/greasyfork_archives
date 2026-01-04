// ==UserScript==
// @name        tame JS basc
// @namespace   Violentmonkey Scripts

// @match       http://172.24.129.6:8001/*
// @match       http://47.92.204.243:8100/*

// @match       *://*.*.gov.cn/*

// @grant       none
// @version     1.0.0
// @author      someone
// @license     MIT
// @description tame mess sites

// @downloadURL https://update.greasyfork.org/scripts/440130/tame%20JS%20basc.user.js
// @updateURL https://update.greasyfork.org/scripts/440130/tame%20JS%20basc.meta.js
// ==/UserScript==

if (location.host.endsWith('.gov.cn')) {
  // 高亮可能的规范性文件
  let date = new Date();
  let now_year = date.getFullYear();
  const highlightList = () => {
    /**
     * 无锡：
     * http://www.wuxi.gov.cn/zfxxgk/szfxxgkml/index.shtml?url=/zfxxgk/szfxxgkml/fgwjjjd/index.shtml
     * 实际：http://www.wuxi.gov.cn/zfxxgk/szfxxgkml/fgwjjjd/index.shtml
     *
     * 江阴：http://www.jiangyin.gov.cn/xxgk/zfxxgkml_17a82c54pe6vn_arjk73731zj4/index.shtml
     * 宜兴：http://www.yixing.gov.cn/zgyx/zfxxgk/szfxxgkml/fgwjjjd/index.shtml
     * 梁溪：http://www.wxlx.gov.cn/xxgk/sqzfxxgkml/fgwjjjd/index.shtml
     * 锡山：http://www.jsxishan.gov.cn/zfxxgk/sqzfxxgkml/fgwjjjd/index.shtml
     * 惠山：http://www.huishan.gov.cn/zfxxgk/sqzfxxgkml/fgwjjjd/index.shtml
     * 滨湖：http://www.wxbh.gov.cn/zfxxgk/sqzfxxgkml_1/fgwjjjd/index.shtml
     * 新吴：http://www.wnd.gov.cn/xxgk/sqzfxxgkml/fgwjjjd/index.shtml
     */
    if (!location.pathname.includes('xxgkml')) return;
    let doclist = document.querySelectorAll('li');
    for (let i of doclist) {
      // 可能遇到不是文件列表的元素
      if (!i.querySelector('a')) continue;
      let title = i.querySelector('a').textContent;
      if (!i.querySelector('span')) continue;
      let time = i.querySelector('span').textContent;
      let this_year = Number(time.split('-')[0]);

      let colorElement = (element) => {
        element.style.cssText = `background-color: hsla(${this_year * 120}, 70%, 80%, ${
          1 - (now_year - this_year) / 100
        }) !important;`;
      };

      let colorTitleTime = (j) => {
        if (title.includes(j)) {
          colorElement(i.querySelector('a'));
        } else {
          // 不如预期：还会给所有条目的时间着色，没有跳过标题高亮条目
          colorElement(i.querySelector('span'));
        }
      };

      let maybeTitle = ['决定', '办法', '规定', '细则', '意见', '通告'];
      maybeTitle.some(colorTitleTime);
    }
  };

  // 保证延迟载入也能生效
  const document_observer = new MutationObserver(() => {
    highlightList();
  });
  document_observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// 备案审查系统
if (location.host === '172.24.129.6:8001' || location.host === '47.92.204.243:8100') {
  window.addEventListener('load', () => {
    // 重写登录函数，去除验证码校验
    const autoLogin = () => {
      const userName = document.getElementById('inputUserName').value;
      const userPwd = document.getElementById('inputPwd').value;
      const url = '/login';
      if (userName === undefined || userName === '') {
        $('.code-layer').hide();
        $('#userTips').show();
        $('#userTips').html('请输入用户名！');
        return false;
      } else {
        $('#userTips').hide();
      }
      if (userPwd === undefined || userPwd === '') {
        $('.code-layer').hide();
        $('#pwdTips').show();
        $('#pwdTips').html('请输入密码！');
        return false;
      } else {
        $('#pwdTips').hide();
      }

      $.ajax({
        beforeSend: () => {
          $('#userTips').hide();
          $('#pwdTips').hide();
          $('#loginBtn').html('正在登录...');
        },
        url: url,
        type: 'POST',
        async: true,
        data: { LoginName: unescape(userName), LoginPwd: userPwd },
        success: (result) => {
          if (result.Status) {
            const returnUrl = '';
            window.location.href = returnUrl !== null ? returnUrl : '/Home/Index';
          } else {
            $('#drag').html('');
            $('#drag').drag();
            if (result.Code == 'CodeError') {
              $('#validateTips').show();
              $('#validateTips').html(result.Message);
            } else if (result.Code == 'UserError') {
              $('#validateTips').show();
              $('#validateTips').html('您输入的用户名或统一社会信用代码有误！');
            } else {
              $('#pwdTips').show();
              $('#pwdTips').html(result.Message);
            }
            $('#loginBtn').html('登&nbsp;&nbsp;录');
          }
        },
      });
    };
    // document.getElementById('loginBtn').onclick = null;
    document.getElementById('loginBtn').addEventListener('click', autoLogin);

    // 模拟拖动滑块后的样式
    document.getElementById('drag').style.color = 'rgb(255, 255, 255)';
    document.querySelector('#drag > .drag_bg').style.width = '266px';
    document.querySelector('#drag > .drag_text').textContent = '验证通过';
    document.querySelector('#drag > .handler.handler_bg').style = 'left: 266px;';

    // 自动接收所有报备文件
    const autoRecord = () => {
      // 首页
      if (location.pathname === '/PutOnRecord/Home/IndexProvinceGx') {
        if (document.getElementsByClassName('currentSelect')[2].textContent !== '备案员未接收') {
          console.log(document.querySelector('dd[value="2"]'));
          document.querySelector('dd[value="2"]').click();
        } else {
          console.log(document.querySelector('td>div>a'));
          document.querySelector('td>div>a').click();
        }
      }

      // 接收
      if (location.search.startsWith('?id=')) {
        if (document.getElementsByClassName('layui-layer-btn0').length === 0) {
          document.querySelector('.btn-blue.btn-receive').click();
        } else {
          document.getElementsByClassName('layui-layer-btn0')[0].click();
          document.getElementsByClassName('layui-layer-btn0')[0].click();
        }
      }
    };

    // setInterval(autoRecord, 1000);

    // 按照预定文件名规则填写文件基本信息
    const autoFill = () => {
      // 获取文件名 简单处理，需要确保第一个上传word
      const tdtitle = document
        .querySelectorAll('#tdtile')[1]
        .innerText.trim()
        .split(/\n/)[0]
        .split('-');
      const index = tdtitle[0];
      const date =
        tdtitle[1].slice(0, 4) + '-' + tdtitle[1].slice(4, 6) + '-' + tdtitle[1].slice(6);
      const title = tdtitle[2].replace('.docx', '');
      // console.log(index, date, title);
      // 选择文件性质 规章：413 规范性文件：1413
      document.querySelector('dd[value="1413"]').click();
      // 制定机关
      let zdjg = '';
      if (index.startsWith('锡政办发')) {
        zdjg = '无锡市人民政府办公室';
      } else {
        zdjg = '无锡市人民政府';
      }
      document.querySelector('input[name="F_ZDJG"]').value = zdjg;
      // 文件名称
      document.querySelector('input[name="F_BBBT"]').value = title;
      // 发文字号
      document.querySelector('input[name="F_FWZH"]').value = index;
      // 报备文号
      document.querySelector('input[name="F_BBWH"]').value = index;
      // 通过机构
      document.querySelector('input[name="F_TGJGBS"]').value = '无锡市人民政府';
      // 通过日期
      document.querySelector('input[name="F_TGRQ"]').value = date;
      // 公布日期
      document.querySelector('input[name="F_GBRQ"]').value = date;
      // 实施日期
      document.querySelector('input[name="F_SSRQ"]').value = date;
      // 失效日期
      // document.querySelector('input[name="F_SXRQ"]').value = '';
      // 联系人及电话
      document.querySelector('input[name="F_LXY"]').value = '任凭之';
      document.querySelector('input[name="F_DH"]').value = '0510-81822146';
      // 制定程序
      const zdcxs = document.querySelectorAll('input[type="checkbox"]');
      for (let i of zdcxs) {
        if (i.checked === false) {
          i.checked = true;
        }
      }
      // clearInterval(fill);
      // 是否废止历史版本
      // 自动确认提交
      document.querySelector('a.layui-layer-btn0').click();
    };

    if (location.pathname !== '/ReportSystem/Report/CreateReportProvinceGx') {
      // const fill = setInterval(autoFill, 1000);
    }
  });
}
