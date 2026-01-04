// ==UserScript==
// @name         百度网盘SVIP解析不限速下载-🔥火箭加速🔥
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  加速无止境！百度网盘SVIP解析加速下载脚本，支持谷歌 IE 等浏览器，操作简单，一键下载文件！
// @antifeature  ads
// @author       You
// @icon         https://nd-static.bdstatic.com/m-static/v20-main/home/img/icon-home-new.b4083345.png
// @license           MIT
// @icon              https://nd-static.bdstatic.com/m-static/v20-main/home/img/icon-home-new.b4083345.png
// @match             *://pan.baidu.com/*
// @match             *://yun.baidu.com/*
// @match             *://pan.baidu.com/disk/home*
// @match             *://yun.baidu.com/disk/home*
// @match             *://pan.baidu.com/disk/main*
// @match             *://yun.baidu.com/disk/main*
// @match             *://pan.baidu.com/s/*
// @match             *://yun.baidu.com/s/*
// @match             *://pan.baidu.com/share/*
// @match             *://yun.baidu.com/share/*
// @connect           baidu.com
// @connect           api.aifenxiang.net.cn
// @connect           127.0.0.1
// @grant             GM_cookie
// @grant             GM_addStyle
// @grant             GM_getResourceText
// @grant             GM_xmlhttpRequest
// @require           https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.14/layui.min.js
// @require           https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @resource          layuiCSS https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.14/css/layui.css
// @downloadURL https://update.greasyfork.org/scripts/521185/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98SVIP%E8%A7%A3%E6%9E%90%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD-%F0%9F%94%A5%E7%81%AB%E7%AE%AD%E5%8A%A0%E9%80%9F%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/521185/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98SVIP%E8%A7%A3%E6%9E%90%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD-%F0%9F%94%A5%E7%81%AB%E7%AE%AD%E5%8A%A0%E9%80%9F%F0%9F%94%A5.meta.js
// ==/UserScript==
(function () {
  'use strict';
  const layuicss = GM_getResourceText('layuiCSS');
  GM_addStyle(layuicss);
  layui.use(['layer'], async function () {
    var layer = layui.layer,
      $ = layui.$;
    var form = layui.form;
    if (location.href.startsWith('https://pan.baidu.com/s/')) {
      $('.x-button-box').prepend(
        '<a class="g-button" id="downbtn_share" style="background-color: red;color: #fff;border:none;"  href="javascript:;" ><span class="g-button-right"><em style="top:0;" class="icon icon-download" title=""></em><lable class="text" style="width: auto;">' +
          config.title_name +
          '</lable></span></a>'
      );
    } else {
      if ($('.tcuLAu').is('*')) {
        $('.tcuLAu').prepend(
          '<span class="g-dropdown-button"><a id="downbtn_main"  style=" margin-right: 10px;color: #fff;background-color: red;border:none;" id="downbtn_main" class="g-button" ><span class="g-button-right"><em style="top:0;" class="icon icon-download" ></em><lable class="text" style="width: auto;">' +
            config.title_name +
            '</lable></span></a></span>'
        );
      } else {
        $('.wp-s-agile-tool-bar__header.is-header-tool').prepend(
          '<div class="wp-s-agile-tool-bar__h-group"><button style=" margin-right: 10px;color: #fff;background-color: red;border:none;" id="downbtn_main" class="u-button nd-file-list-toolbar-action-item" ><i style="top:0;" class="iconfont icon-download"></i> <lable>' +
            config.title_name +
            '</lable></button></div>'
        );
      }
    }

    $('#downbtn_share').click(function () {
      swal({
        title: '提示',
        text: '请先保存到自己的网盘后，从网盘里解析!',
        icon: 'warning',
      });
      return false;
    });
    $('#downbtn_main').click(function () {
      let select = selectList();
      let selected = Object.keys(select);
      if (selected.length == 0) {
        swal({
          text: '请先选择一个文件',
          icon: 'warning',
        });
        return false;
      } else if (selected.length > 1) {
        swal({
          text: '目前仅支持单个文件解析',
          icon: 'warning',
        });
        return false;
      } else if (select[selected[0]].isdir == 1) {
        swal({
          text: '目前不支持文件夹解析',
          icon: 'warning',
        });
        return false;
      }

      const newDiv = document.createElement('div');
      let createDiv = `
        <div>
        <img src="https://bd.shzxkq.com/xcx.jpg" style="width:240px;height:240px;">
        </div>
        <div>
         <input style="border:1px solid #ccc; width:60%;height:40px;text-indent:20px;" type="text" autocomplete="off" placeholder="请输入验证码" id="wpCode"/>
        </div>

        `;
      newDiv.innerHTML = createDiv;

      const openLayer = layer.open({
        type: 1, // page 层类型
        area: ['450px', '300px'],
        title: '提示',
        shade: 0.6, // 遮罩透明度
        shadeClose: true, // 点击遮罩区域，关闭弹层
        anim: 0, // 0-6 的动画形式，-1 不开启
        content: `
          <div class="layui-form" lay-filter="filter-test-layer" style="width:360px;margin: 16px auto 0;">
            <div class="demo-login-container">
                <div style="margin-top:50px;">插件解析限制两次</div>
                <div>下载器一定要配置好端口: <a style="color:green;" target="_blank" href="https://docs.qq.com/doc/DWnlpY2pkclpuUEFX?no_promotion=1">点击查看配置说明</a></div>
                <div>不限次数pc网页稳定版: <a style="color:green;" target="_blank" href="https://pan.gssource.com">点击前往</a></div>
               <button style="margin-left:0;margin-top:50px;" id="parse" class="layui-btn layui-btn-fluid" lay-submit lay-filter="demo-login">解析</button>
            </div>
          </div>
            `,
        success: function () {
          form.render();
          form.on('submit(demo-login)', async function (data) {
            $('#parse').html('<p>正在解析中请稍后...</p>');
            let canDown = await testDownLoad();

            if (!canDown) {
              layer.close(openLayer);
              swal({
                text: '请先安装下载器并打开运行，下载地址：https://pan.quark.cn/s/b878b162bb5b',
                icon: 'warning',
              });
              $('#parse').html('<p>解析</p>');
              return;
            }
            share_one_baidu(openLayer);
          });
        },
      });
    });
  });
  function selectList() {
    var select = {};
    var option = [];

    try {
      option =
        require('system-core:context/context.js').instanceForSystem.list.getSelected();
    } catch (e) {
      option = document.querySelector('.wp-s-core-pan').__vue__.selectedList;
    }
    option.forEach((element) => {
      select[element.fs_id] = element;
    });
    return select;
  }
  const config = {
    main_url: 'https://api.gssource.com',
    bd_password: '1234',
    title_name: '火箭加速',
  };
  function share_one_baidu(openLayer) {
    let select = Object.keys(selectList());
    let bdstoken = '';
    let data_json = {};
    try {
      data_json = $('html')
        .html()
        .match(/(?<=locals\.mset\()(.*?)(?=\);)/)[0];
      data_json = JSON.parse(data_json);
      config.username = data_json.username;
      bdstoken = data_json.bdstoken;
    } catch (e) {
      data_json = $('html')
        .html()
        .match(/(?<=window\.locals\s=\s)(.*?)(?=;)/)[0];
      data_json = JSON.parse(data_json);
      config.username = data_json.userInfo.username;
      bdstoken = data_json.userInfo.bdstoken;
    }

    config.data_json = data_json;

    const param = {
      bdstoken: bdstoken,
      period: 1,
      pwd: config.bd_password,
      eflag_disable: true,
      channel_list: '%5B%5D',
      schannel: 4,
      fid_list: JSON.stringify(select),
    };

    $.ajax({
      type: 'GET',
      url: 'https://pan.baidu.com/share/set',
      async: true,
      data: {
        bdstoken: bdstoken,
        period: 1,
        pwd: config.bd_password,
        eflag_disable: true,
        channel_list: '%5B%5D',
        schannel: 4,
        fid_list: JSON.stringify(select),
      },
      dataType: 'json',
      success: function (res) {
        if (res.show_msg.indexOf('禁止') > -1) {
          swal({
            text: '该文件禁止分享',
            icon: 'error',
          });
          return false;
        } else {
          let shorturl = '';
          try {
            shorturl = res.link.split('/').pop();
          } catch (error) {
            swal({
              text: '初始化准备失败',
              icon: 'error',
            });
            return false;
          }
          fetch(config.main_url + '/wp/getCodeNum', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: "1.1.3",
              userKey: 'main',
              fsId: select[0],
            }),
          })
            .then((resp) => resp.json())
            .then((res) => {
              let laysermsg = layer.msg('正在解析中', {
                icon: 6,
                time: 10000,
              });
              if (res.code == 200) {
                if (res.data > 100) {
                  get_down_list(
                    shorturl,
                    config.bd_password,
                    openLayer,
                    res.data,
                    laysermsg
                  );
                } else if (res.data == 80) {
                  layer.msg('解析中', {
                    icon: 6,
                    time: 3000, // 3秒后自动关闭
                  });
                  setTimeout(() => {
                    $('#parse').html('<p>解析</p>');
                    layer.alert('解析通道比较拥堵，请重试！', {
                      title: '提示',
                    });
                  }, 3000);
                } else if (res.data == 60) {
                  layer.msg('解析中', {
                    icon: 6,
                    time: 3000, // 3秒后自动关闭
                  });
                  setTimeout(() => {
                    $('#parse').html('<p>解析</p>');
                    layer.alert('解析次数已达上限，不限次数稳定版！地址：aifenxiang.net.cn', {
                      title: '提示',
                    });
                  }, 3000);
                } else if (res.data == 50) {
                  layer.alert(
                    '验证码错误,一个验证码只能下载一个文件,请重新获取！',
                    {
                      title: '提示',
                    }
                  );
                } else {
                  layer.alert(
                    '验证码错误,一个验证码只能下载一个文件,请重新获取！',
                    {
                      title: '提示',
                    }
                  );
                }
              } else if (res.code == 500) {
                layer.close(openLayer);
                layer.close(laysermsg);
                swal({
                  text: res.msg,
                  icon: 'warning',
                });
              }
            });
        }
      },
      error: function (res) {
        swal({
          text: '初始化准备请求访问失败',
          icon: 'error',
        });
      },
    });
  }

  async function get_down_list(shorturl, password, openLayer, pwd, laysermsg) {
    let ajax_data = {
      shorturl: shorturl,
      pwd: password,
      dir: 1,
      root: 1,
      userKey: 'main',
    };

    fetch(config.main_url + '/wp/parseCopyLink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ajax_data),
    })
      .then((resp) => resp.json())
      .then((res) => {
        if (res.code == 200) {
          const size = parseInt(res.data.data.list[0].size);
          if (size > 3221225472) {
            layer.close(openLayer);
            layer.close(laysermsg);
            $('#parse').html('<p>解析</p>');
            swal({
              text: '文件大于3G,插件暂不支持下载,请前往PC网页版下载！',
              icon: 'warning',
            });
            return false;
          }
          console.log(res);
          const requestData = {
            fsId: res.data.data.list[0].fs_id,
            shareid: res.data.data.shareid,
            uk: res.data.data.uk,
            sekey: res.data.data.seckey,
            randsk:res.data.data.seckey,
            fs_ids: [res.data.data.list[0].fs_id],
            path:res.data.data.list[0].server_filename,
            size:res.data.data.list[0].size,
            surl: shorturl,
            url: `https://pan.baidu.com/s/${shorturl}`,
            userKey: 'main',
            pwd: password,
            dir: '/',
          };
          console.log(requestData);
          GM_xmlhttpRequest({
            method: 'POST',
            url: config.main_url + '/wp/dlink',
            headers: {
              'Content-Type': 'application/json',
            },
            data: JSON.stringify(requestData),
            onload: function (response) {
              const responseData = JSON.parse(response.responseText);
                console.log(responseData);
              if (responseData.code !== 200) {
                layer.close(openLayer);
                layer.close(laysermsg);
                swal({
                  text: responseData.msg,
                  icon: 'warning',
                });
              } else {
                layer.close(laysermsg);
                $('#parse').html('<p>解析</p>');
                  if(responseData.data.vip){
                      config.url = responseData.data.data.dlink;
                      config.ua = responseData.data.data.ua;
                  }else{
                      config.url = responseData.data.data.urls[0].url;
                      config.ua = responseData.data.data.ua;

                  }
                sendToMotrix(res.data.data.list[0]);
              }
            },
            onerror: function (response) {
              layer.close(openLayer);
              layer.close(laysermsg);
              const errorMessage =
                JSON.parse(response.responseText).message || '网络错误';
              swal({
                text: '解析遇到问题了，请刷新重试即可！！',
                icon: 'warning',
              });
            },
          });
        } else {
          layer.close(openLayer);
          layer.close(laysermsg);
          $('#parse').html('<p>解析</p>');
          swal({
            text: '解析遇到问题了，请升级插件刷新重试即可！',
            icon: 'warning',
          });
        }
      });
  }

  function sendToMotrix(item) {
      fetch('http://127.0.0.1:9999/api/v1/tasks', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              req:
              {
                  url:config.url,
                  extra:{
                      header:{
                          "User-Agent":config.ua,
                      }
                  }
              },
              opt:{
                  extra:{
                      connections:256,
                  }
              }
                               }),
      }).then((resp) => resp.json())
          .then((res) => {
          layer.alert(`${item.server_filename}开始下载,请打开下载器查看!`);

      }).catch(e=>{
      })
  }
    setInterval(()=>{

        GM_xmlhttpRequest({
            method: 'get',
            url: 'http://127.0.0.1:9999/api/v1/tasks?status=running',
            headers: {
                'Content-Type': 'application/json',
            },
            onload: function (response) {
               const responseData = JSON.parse(response.responseText);
               const result = responseData.data.filter(e=>
                    e.status === "running"
                ).filter((e)=>e.progress.speed < 1048576).map(e=>e.id);
                const ids = result.map((e)=>{
                    return `id=${e}`
                }).join('&')
                 if(ids && ids.length){
                     GM_xmlhttpRequest({
                         method: 'put',
                         url: `http://127.0.0.1:9999/api/v1/tasks/pause?${ids}`,
                         headers: {
                             'Content-Type': 'application/json',
                         },
                         onload: function (response) {
                             GM_xmlhttpRequest({
                                 method: 'put',
                                 url: `http://127.0.0.1:9999/api/v1/tasks/continue?${ids}`,
                                 headers: {
                                     'Content-Type': 'application/json',
                                 },
                                 onload: function (response) {
                                 }
                             })
                         }
                     })
                 }
                }
             })
    },15000)
  function testDownLoad() {
    return fetch('http://127.0.0.1:9999/api/v1/tasks', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
      })
          .then((resp) => resp.json())
          .then((res) => {
          return true;
      }).catch(e=>{
          return false;
      })
  }
  // Your code here...
})();