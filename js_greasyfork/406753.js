// ==UserScript==
// @name         显示当前网站所有可用的油猴脚本【没有bug，不更新】
// @name:zh      显示当前网站所有可用的油猴脚本【没有bug，不更新】
// @name:zh-CN   显示当前网站所有可用的油猴脚本【没有bug，不更新】
// @name:zh-TW   顯示當前網站所有可用的油猴腳本【没有bug，不更新】
// @homepage     https://greasyfork.org/zh-CN/scripts/403916-%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E7%BD%91%E7%AB%99%E6%89%80%E6%9C%89%E5%8F%AF%E7%94%A8%E7%9A%84%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC-%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0-%E6%94%BE%E5%BF%83%E4%BD%BF%E7%94%A8
// @namespace    https://greasyfork.org/zh-CN/users/33431-chenshao
// @version      1.0.4
// @description         Show all Tampermonkey scripts for the current site.
// @description:zh      显示适用于当前网站所有可用的油猴脚本【持续更新，放心使用！】
// @description:zh-CN   显示适用于当前网站所有可用的油猴脚本【持续更新，放心使用！】
// @description:zh-TW   顯示適用於當前網站所有可用的油猴腳本【持續更新，放心使用！】
// @author       ChenShao(chenshao@qq.com)
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAG1klEQVRogeWZe2ydZR3HP7/nnHZdabm023rOkUWdGQrbEtnAhfW0HiNxaU87JNJ4iYwx4oJojDCNwIwGGAZ1JGgMbqIhJk6N5Y/R00sKqGXt6dwE/cMNko2By9ae092ArF1v73l//tFuNN17O5cJ0c+fz/O7fH/nvO/z/p7ngf8R5L+V6K1EoqKi2toMbBTl4yiHIl0D8VLFD5cq0AWGW+JpgZUKB1DZEevq7x26rXGpyVl7UFYDKIBglzJvyf+RTEu8H7j4SwtsV2gC1gCHQbaphPpiqb7Tpcx7WR6t4dbEItHcZtAfAaHZ4cMq4fpSF3CBy/qODLfGt4myHUCEr0RSA3+4XLlKUsiJ5vh1JsRaUT4JxBCNobIEIYpy1azZ20AW0VOoyYAOqco/wyL7l3TuPVKshoILyTY3rkJyd6vIbcCyInW8CewRtZ+NdA0eLCRA3oUMt8bjAo+ifKaQhH4ovBRS88O6rr2D+fgFLuRYMn5NufAUcGc+fgWiqP52oqzs/o/u6XsniEMgQdnmxlVq7D0U/wjlh3BUcub2SPfef/mb+pBpXXczanqBa0oiLn/Oqq3rY93pV7yMPAvJfD7xESzrALC4pNLyRs6YXG5tXc/gUTcL4zahiUQYy3qO970IAK21jfmjJhKuLZVrIdkrrK3MtBUfDISbstXT33afduDsrbdeNVkx8Rbv33vhiMA7k8qyD3cNvD1/zvEfmVw4/jU+YEUAKFxdbvQepznnR0vF0TgAYwjvBrAbBcYKyqCy2Wn4kkJONMevAz4RMOxpVHaobT4tU5VV0c6Bqmhq4OrQwnC1iPksyE7gPJADOlXkDms6VxvtHKiOdg5UyVRlFSIJVHYAQbvi60+2NC6fP3jJO5JpiX8D+IVPsJwoT4RC+uPFHelzXoYnmxMRi6kFse7BY152pzbUV+dy8j0VHuS91t8ZlfuiXf2/nDvktJyt9gwivGtE2+o60i962s2ypLsvG8Ru9gf5/siG+pdtlfY5XfMlqNiXaHR6R25wzSZMi8oXghZRCHUd6ReNzR0I0+5WcolGp0I+5Opv62ORzv4/FyIwH+q6Bl4C2e42L3Dt/LGLhWhbWyjT2rAJiLr4n7Aq7R1FqwyIVWH9FDjhMh3LtDR893jbLQsvDBiAE7d/qjY7ntmP6rO4nawIu5e27xsvtWA3lrbvG0fY7TIdBv1JeCK0P9PUsBjA6Jo1ZaHp8l582hFbJFVqsX4odPoYrCJk92oiETYjscq7CNBThZl6o1QCg1I2Ja7d7nvIjdkq686wqt4VJOiSIeus03gm2ZAU0V0KiuiWaCrd4xcrqM/JK8+eqRkP1Cndawj4Fc/Eqp3XddGdOrPSXYvKriCxgvrUjNa4fkvmsdIAFYFy29OrAgYtHcZeGdAyZ0BeDxZUko7joluYWSaPq82WQLEC+5jmQPHgdckk41sRgnwfToeNLvPrrUrFybZEVW7cepMAO1RVvd9YlbmnUV4LEHtRLscjxUsMhjVubSPYNvvg5FjZToGLhwzdwPU+TjbIF6Od/c8VK9SLbGu8RZXn8diKz3JIbTsZ6x48ZgCie/r+PTEaXq2wFeTvzOwhnDCguzMt8Y2lFD6XTDLepsqfcC9iDDigIg9MjIZvurA9cNyzH2lqWlAdOndUPRpIEf1dXUVsk7S354pWz0yvl53I/gbVjW66BIbO5ao/trynZ3L+nGPVy3t6JlX0Kc/EKl/NjA3fWJBqB0bGRm5g5uPsetZmizzpVAR4PINhYRczVwGuiNuSXAiiCR+DM+GK0DNus66FLO5In1PVR33S33ukqWmBj40vCqKiX/eyEeWRJe19o27znqtC9Ob0z0VJe5hEqkLnHvLR6Uu2JX4f3ivm3+oqI097xfA9xM4m161UMa8Abr+8JWLWR1J7/+IXy4nZQ/K/Ale4mEwQkjXR5/s9v3V+6zSRrsGDit7D7K2yA2FVu2M42bDeL9Z8hpP1DaLmBdyLUFG5268IyOPCZu7Fpgu2qP5s2rK3L+3d59jyX+D4+ltqwmXmQZAH8Dj6EeGhSGrgiSD68rp5Gm6tf1xUHvYxGxXh9zbygkH+YTM2YiZrRcrO19kiqwX9nMKXgSpvZfJYNNX/g6Da8r5Cy7Q2bEJ1F1Cer29ALBX9ZiyVDra3maWgu8ChDQ31Jqe/QjzOwArjkFGzJd+LUCjiUvNQ24ry2vM131HRh3F/WYMyKsLjdcPjT8qrr3oczLlT9O3smaa1V06asi+J8C1gRZ7p30D115aVe8ZvgfCNVIzzXBRkJLluhRrTiNIALGdmP7Fo1uQ0cEqVw2IYAH05kkq/Ju7L+v8n/wHOPnmIcXbMTAAAAABJRU5ErkJggg==
// @match        *://*/*
// @resource     siteData  https://greasyfork.org/scripts/by-site.json
// @grant        GM_xmlHttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        unsafeWindow
// @connect      greasyfork.org
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/406753/%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E7%BD%91%E7%AB%99%E6%89%80%E6%9C%89%E5%8F%AF%E7%94%A8%E7%9A%84%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E3%80%90%E6%B2%A1%E6%9C%89bug%EF%BC%8C%E4%B8%8D%E6%9B%B4%E6%96%B0%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/406753/%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E7%BD%91%E7%AB%99%E6%89%80%E6%9C%89%E5%8F%AF%E7%94%A8%E7%9A%84%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E3%80%90%E6%B2%A1%E6%9C%89bug%EF%BC%8C%E4%B8%8D%E6%9B%B4%E6%96%B0%E3%80%91.meta.js
// ==/UserScript==

/* #eslint-disable no-undef */
(function() {
  'use strict';
  // ==============================参数配置
  var settingData = {
      storageNamePrefix: 'csStorageName_', // 储存名称前缀
      positionTop: '100',
      positionLeft: '0',
      positionRight: 'auto',
      domainList: [],
      // 待续。。。
  };

  // ==============================变量定义
  let thisDomain = ''; // 当前域名

  // ==============================函数定义
  // 返回当前顶级域名
  let getCurDomain = function() {
      return document.domain.split('.').slice(-2).join('.').toLowerCase();
  };
  // 检查是否提醒
  let store = {
      checkQuiet: function(domain) {
          // domain = domain.toLowerCase();// 先转小写
          if (csx_userData.domainList.indexOf(domain) === -1) {
              return false;
          } else {
              return true;
          }
      },
      setQuiet: function(domain) {
          // domain = domain.toLowerCase();// 先转小写
          let userData = GetDbValue();
          if (userData.domainList.indexOf(domain) === -1) {
              userData.domainList.push(domain);
              SetDbValue(userData);
          }
      },
  };
  // 检查域名对应的脚本数量
  let getDomainCount = function(domain) {
      let siteData = GM_getResourceText('siteData');
      siteData = JSON.parse(siteData);
      let count = 0;
      if (siteData.hasOwnProperty(domain)) {
          count = siteData[domain];
      }
      return count;
  };
  // 从数据库取配置数据
  let GetDbValue = function() {
    //20200613 修复bug：domainList取出来后变成字符串（存进去的时候是数组）
    let userData = GM_getValue(settingData.storageNamePrefix + 'csx_userData') || settingData;
    userData.domainList = eval(userData.domainList);
      return userData;
  }
  // 写入配置数据到数据库中
  let SetDbValue = function(userData) {
      GM_setValue(settingData.storageNamePrefix + 'csx_userData', userData);
  }

  // START
  // 添加按钮 func
  function showToolbar(doaminCout) {
      var node = document.createElement('remove-web-limits-iqxin');
      node.id = 'csx-iqxin';

      // 再次打开窗口小于之前窗口的情况,导致按钮出现在可视窗口之外
      var screenClientHeight = document.documentElement.clientHeight;
      var tempHeight;
      if (csx_userData.positionTop > screenClientHeight) {
          tempHeight = screenClientHeight - 40;
      } else {
          tempHeight = csx_userData.positionTop;
      }
      // 改变窗口大小的情况
      window.onresize = function() {
          var screenClientHeight = document.documentElement.clientHeight;
          var tempHeight;

          if (csx_userData.positionTop > screenClientHeight) {
              tempHeight = screenClientHeight - 40;
          } else {
              tempHeight = csx_userData.positionTop;
          }

          node.style.top = tempHeight + 'px';
      };

      tempHeight = tempHeight < 0 ? 0 : tempHeight;
      node.style.cssText =
          'top:' + tempHeight + 'px;' +
          'left:' + csx_userData.positionLeft + 'px;' +
          'right:' + csx_userData.positionRight + 'px;';
      node.innerHTML = `<label id="lblDomainCount">${doaminCout}</label>
          <csxbutton type="csxbutton" id="csx-gobtn" class="csxBtn" title="跳转至Greasyfork查看当前网站脚本"> 查看 </csxbutton>
          <csxbutton type="csxbutton" id="csx-quietbtn" class="csxBtn" title="不再提示当前网站的油猴脚本数\n如需重新开启提示，可到白名单设置页面中删除当前域名"> 关闭 </csxbutton>`;
      if (window.self === window.top) {
          if (document.querySelector('body')) {
              document.body.appendChild(node);
          } else {
              document.documentElement.appendChild(node);
          }
      }
      node.addEventListener('mouseover', function() {
          node.classList.add('csx-active-iqxin');
      });
      node.addEventListener('mouseleave', function() {
          setTimeout(function() {
              node.classList.remove('csx-active-iqxin');
          }, 100);
      });
      // 如果脚本数是2位数，宽度为95，如果为3位数，宽度为105；暂不考虑4位数的情况
      let barWidth = domainCount >= 100 ? 155 : 145;
      let domainWidth = domainCount >= 100 ? 30 : 20;

      var style = document.createElement('style');
      style.type = 'text/css';

      var styleInner = `
          #csx-iqxin {
              position: fixed;
              transform: translate(-112px, 0);
              width: ${barWidth}px;
              height: 31px;
              line-height: 32px;
              font-size: 14px;
              color: #fff;
              background: #333;
              z-index: 2147483647;
              margin: 0;
              opacity: 0.50;
              transition: 0.3s;
              overflow: hidden;
              text-align: center;
              white-space: nowrap;
              border: 1px solid #ccc;
              border-width: 1px 1px 1px 0;
              border-bottom-right-radius: 5px;
              border-top-right-radius: 5px;
              box-sizing: content-box;
              cursor: move;
          }

          #csx-iqxin.csx-active-iqxin {
              left: 0px;
              transform: translate(0, 0);
              opacity: 0.9;
          }

          #csx-iqxin label {
              margin: 0;
              padding: 0;
              font-weight: 500;
          }

          #csx-iqxin #lblDomainCount {
              border-radius: 50%;
              width: ${domainWidth}px;
              height: 20px;
              padding: 4px 4px;
              background: #fff;
              color: #666;
              text-align: center;
              font: 16px Arial, sans-serif;
              overflow: hidden;
              line-height: 20px;
              float: right;
              margin-right: 1px;
              margin-top: 1px;
              cursor: move;
              box-sizing: unset;
          }

          #csx-iqxin .csxBtn {
              margin: 0 2px;
              padding: 0 10px;
              border: none;
              border-radius: 2px;
              cursor: pointer;
              background: #fff;
              color: #000;
              font: 14px/2em "微软雅黑", "Microsoft YaHei";
          }
      `;
      style.innerHTML = styleInner;
      if (document.querySelector('#csx-iqxin')) {
          // console.log("通过style插入");
          document.querySelector('#csx-iqxin').appendChild(style);
      } else {
          // console.log("通过GM插入");
          GM_addStyle(styleInner);
      }
  }

  // 给按钮绑定点击事件
  function setBtnClick() {
      document.querySelector('#csx-gobtn').addEventListener('click', goGreasyfork);
      document.querySelector('#csx-quietbtn').addEventListener('click', setQuiet);
      // document.querySelector('#csx-setbtn').addEventListener('click', setMenu);
  }

  function goGreasyfork() {
      let url = `https://greasyfork.org/zh-CN/scripts/by-site/${thisDomain}?filter_locale=0`;
      GM_openInTab(url, {
          active: true
      });
  }

  function setQuiet() {
      store.setQuiet(thisDomain);
      document.querySelector('#csx-iqxin').remove();
      alert(`已不再提示${thisDomain}的油猴脚本数目\n如需重新开启提示，可到白名单设置页面中删除当前域名`);
  }

  // 打开菜单
  function openMenu() {
      var oldEditBox = document.querySelector('#csx-setMenu');
      if (oldEditBox) {
          oldEditBox.parentNode.removeChild(oldEditBox);
          return;
      }
      // 排序后，用换行符连串
      let userData = GetDbValue(); // 踩坑：这里不能直接使用全局变量 csx_userData
      let strDomainList = userData.domainList.sort().join('\n');
      var odom = document.createElement('div');
      odom.id = 'csx-setMenu';
      odom.style.cssText = `
          position: fixed;
          top: 100px;
          left: 50px;
          padding: 10px;
          background: #fff;
          border-radius: 4px;
      `;
      GM_addStyle(`
          #csx-setMenuSave,
          #csx-setMenureset,
          #csx-setMenuClose {
              margin: 0;
              padding: 0 2px;
              border: none;
              border-radius: 2px;
              cursor: pointer;
              background: #fff;
              color: #000;
              font: 14px/2em "微软雅黑", "Microsoft YaHei";
          }
          #csx-setMenureset {
              border: 1px solid #666;
          }
          #csx-setMenuSave {
              border: 1px solid green;
          }
          #csx-setMenuClose {
              border: 1px solid red;
          }
          #csx-setMenu {
              text-align: left;
              font-size: 14px;
              z-index: 999999;
              border: 1px solid cornflowerblue;
          }
          #csx-setMenu p {
              margin: 5px auto;
          }
          #csx-setMenu #csx-setMenuTextArea {
              border: 1px solid;
              padding: 4px;
              overflow: auto;
              border-radius: 4px;
          }
      `);
      var innerH = `
          <p>不再提示的网站列表（一行一个域名）。</P>
          <p>仅需填写顶级域名，<br />例如：填写baidu.com，就包含了image.baidu.com</P>
          <textarea id='csx-setMenuTextArea' wrap='off' cols='45' rows='15'>${strDomainList}</textarea>
          <br>
          <csxbutton id='csx-setMenuSave'>保存</csxbutton> &nbsp;&nbsp;&nbsp;
          <csxbutton id='csx-setMenureset'>重置</csxbutton> &nbsp;&nbsp;&nbsp;
          <csxbutton id='csx-setMenuClose' title='如果无法关闭 请刷新界面'>关闭</csxbutton> &nbsp;&nbsp;&nbsp;
          <span style='font-size:0.7em;'>--| 感谢使用 |--</span>
      `;
      odom.innerHTML = innerH;
      document.body.appendChild(odom);
      document.querySelector('#csx-setMenuSave').addEventListener('click', saveSetting);
      document.querySelector('#csx-setMenureset').addEventListener('click', domainReset);
      document.querySelector('#csx-setMenuClose').addEventListener('click', closeMenu);
  }

  // 保存选项
  function saveSetting() {
      let domainValue = document.querySelector('#csx-setMenuTextArea').value;
      let arrDomainList = domainValue.split('\n');
      let okDomainList = [];
      let alertString = '';
      let re = new RegExp(/[a-z0-9][-a-z0-9]{0,62}(\.[a-z0-9][-a-z0-9]{0,62})+/i);// 域名匹配规则
      for (let sDomain of arrDomainList) {
          sDomain = sDomain.replace(/\s+/g, '');// 删除不可见字符
          if (sDomain.length === 0) continue; // 空行
          // 验证是否域名 2020-05-22 11:56:05
          if (!re.test(sDomain)) {
              alertString += sDomain + '、';
              continue;
          }
          // 验证通过：自动提取顶级域名
          sDomain = sDomain.toLowerCase();// 先转小写
          sDomain = sDomain.split('.').slice(-2).join('.');
          okDomainList.push(sDomain);
      }
      // 提示非域名行
      if (alertString.length > 0) {
          alertString = alertString.substring(0, alertString.length - 1);// 去掉最后一个顿号
          alert(`以下域名非法，请检查：${alertString}`);
          return;
      }
      let userData = GetDbValue();
      userData.domainList = okDomainList;
      SetDbValue(userData);
      closeMenu();
  }

  // 复原菜单
  function domainReset() {
      let userData = GetDbValue();
      document.querySelector('#csx-setMenuTextArea').value = userData.domainList.join('\n');
  }
  // 关闭菜单
  function closeMenu() {
      var oldEditBox = document.querySelector('#csx-setMenu');
      if (oldEditBox) {
          oldEditBox.parentNode.removeChild(oldEditBox);
      }
  }

  // 增加拖拽事件
  function addDragEven() {
      setTimeout(function() {
          try {
              dragBtn();
          } catch (e) {
              console.error('dragBtn函数 报错');
          }
      }, 1000);
  }

  // 工具条拖拽事件 进行绑定
  function dragBtn() {
      let rwl_node = document.querySelector('#csx-iqxin');
      rwl_node.addEventListener('mousedown', function(event) {
          rwl_node.style.transition = 'null';
          let disX = event.clientX - rwl_node.offsetLeft;
          let disY = event.clientY - rwl_node.offsetTop;

          let move = function(event) {
              rwl_node.style.left = event.clientX - disX + 'px';
              rwl_node.style.top = event.clientY - disY + 'px';
          };

          document.addEventListener('mousemove', move);
          document.addEventListener('mouseup', function() {
              rwl_node.style.transition = '0.3s';
              document.removeEventListener('mousemove', move);
              let userData = GetDbValue();
              rwl_node.style.right = userData.positionRight = 'auto';
              rwl_node.style.left = userData.positionLeft = 0;
              userData.positionTop = rwl_node.offsetTop;
              SetDbValue(userData);
          });
      });
  }
  // END

  // ############### 开始
  // console.log('开始');
  let csx_userData = GetDbValue();
  // 查看本地是否存在旧数据
  if (!csx_userData) {
      csx_userData = settingData;
  }
  // 自动更新数据
  for (let value in settingData) {
      if (!csx_userData.hasOwnProperty(value)) {
          csx_userData[value] = settingData[value];
      }
  }
  SetDbValue(csx_userData);

  GM_registerMenuCommand('域名白名单 配置', openMenu); // 设置油猴插件的菜单
  // 检查当前域名是否提醒
  thisDomain = getCurDomain();
  let isQuiet = store.checkQuiet(thisDomain);
  // console.log('isQuiet：' + isQuiet);
  if (isQuiet) return;
  // 检查当前域名是否有对应油猴脚本
  let domainCount = getDomainCount(thisDomain);
  // console.log('domainCount：' + domainCount);
  if (domainCount === 0) return;

  // 添加提示（半透明、隐藏）
  // console.log('addBtn() 开始');
  showToolbar(domainCount); // 添加按钮
  addDragEven(); // 添加按钮拖放事件
  setBtnClick(); // 设置按钮点击事件
  // console.log('addBtn() 结束');
  // ########
})();