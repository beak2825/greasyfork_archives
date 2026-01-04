// ==UserScript==
// @name         【最新】夸克网盘文件SVIP解析不限速下载-🚀火箭加速🚀
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.2.4
// @description  夸克网盘SVIP解析不限速下载脚本，长期稳定使用，下载速度可达10M-50M/S,支持谷歌，火狐，360，IE等主流浏览器
// @author       You
// @match        https://pan.quark.cn/s/*
// @match        https://pan.quark.cn/list*
// @license MIT
// @connect      quark.cn
// @icon         https://pan.quark.cn/favicon.ico
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-body
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.14/layui.min.js
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @resource     layuiCSS https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.14/css/layui.css
// @grant             GM_addStyle
// @grant             GM_getResourceText
// @grant             GM_xmlhttpRequest
// @connect           api.gssource.com
// @connect           127.0.0.1
// @downloadURL https://update.greasyfork.org/scripts/547309/%E3%80%90%E6%9C%80%E6%96%B0%E3%80%91%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E6%96%87%E4%BB%B6SVIP%E8%A7%A3%E6%9E%90%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD-%F0%9F%9A%80%E7%81%AB%E7%AE%AD%E5%8A%A0%E9%80%9F%F0%9F%9A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/547309/%E3%80%90%E6%9C%80%E6%96%B0%E3%80%91%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E6%96%87%E4%BB%B6SVIP%E8%A7%A3%E6%9E%90%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD-%F0%9F%9A%80%E7%81%AB%E7%AE%AD%E5%8A%A0%E9%80%9F%F0%9F%9A%80.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const layuicss = GM_getResourceText('layuiCSS');
    GM_addStyle(layuicss);
    var $ = $ || window.$;
    var obj = {
        file_page: {
            share_list: [],
            home_list: [],
        }
    };

    obj.httpListener = function () {
        (function(send) {
            XMLHttpRequest.prototype.send = function (sendParams) {
                this.addEventListener("load", function(event) {
                    if (this.readyState == 4 && this.status == 200) {
                        var response = this.response || this.responseText, responseURL = this.responseURL;
                        if (responseURL.indexOf("/clouddrive/share/sharepage/detail") > 0) {
                            obj.initFileList(response);
                        }
                        else if (responseURL.indexOf("/clouddrive/file/sort") > 0) {
                            if ($(".ant-modal-mask").length && !$(".ant-modal-mask").hasClass("ant-modal-mask-hidden")) return;
                            obj.initFileList(response);
                        }
                    }
                }, false);
                send.apply(this, arguments);
            };
        })(XMLHttpRequest.prototype.send);
    };

    obj.initFileList = function (response) {
        try { response = JSON.parse(response) } catch (error) { };
        var list = response?.data?.list;
        if ((list || []).length) {
            var index = parseInt(list.length / 3);
            if (list[index].fid === obj.file_page.share_list[index]?.fid || list[index].fid === obj.file_page.home_list[index]?.fid) {
                return;
            }
            if (obj.getShareId()) {
                obj.file_page.share_list = list;
                obj.showTipSuccess("share文件加载完成 共：" + list.length + "项");
            }
            else {
                obj.file_page.home_list = response.data.list;
                obj.showTipSuccess("home文件加载完成 共：" + list.length + "项");
            }
            obj.initDownloadPage();
        }
    };

    obj.initSharePage = function () {
        obj.httpListener();
        obj.openVideoSharePage();
    };

    obj.initHomePage = function () {
        obj.httpListener();
        if (obj.file_page.home_list.length == 0) {
            obj.getFileListHomePage().then(function (response) {
                obj.initFileList(response);
            });
        }
    };

    obj.initVideoPage = function () {
        obj.autoDelFileVideoPage();
    };

    obj.getFileListHomePage = function () {
        var pdir_fid = ((location.hash.match(/.+\/([a-z\d]{32})/) || []) [1]) || 0;
        return fetch("https://drive.quark.cn/1/clouddrive/file/sort?pr=ucpro&fr=pc&pdir_fid=" + pdir_fid + "&_page=1&_size=50&_fetch_total=1&_fetch_sub_dirs=0&_sort=file_type:asc,updated_at:desc", {
            body: null,
            method: "GET",
            credentials: "include"
        }).then(function (result) {
            return result.ok ? result.json() : Promise.reject();
        }).then(function (result) {
            return result.code == 0 ? result : Promise.reject(result);
        });
    };

    obj.openVideoSharePage = function () {
        $(document).on("click", ".file-click-wrap", function (event) {
            var filelist = obj.getSelectedFileList();
            if (filelist.length == 1 && filelist[0].obj_category == "video") {
                obj.dir().then(function (data) {
                    var pdir_fid = data.pdir_fid;
                    return obj.save(filelist, pdir_fid).then(function (data) {
                        var task_id = data.task_id;
                        return obj.waitTask(task_id).then(function (data) {
                            var fids = data.save_as && data.save_as.save_as_top_fids;
                            var fidsStorage = JSON.parse(sessionStorage.getItem("delete_fids") || "[]");
                            sessionStorage.setItem("delete_fids", JSON.stringify(fidsStorage.concat(fids)));
                            $(".pc-cannot-preview-cancel").click();
                            window.open("https://pan.quark.cn/list#/video/" + fids[0], "_blank");
                            window.onmessage = function (event) {
                                var fids = JSON.parse(sessionStorage.getItem("delete_fids") || "[]");
                                if (event.origin == "https://pan.quark.cn" && event.data && fids.includes(event.data)) {
                                    obj.delete([ event.data ]).then(function (data) {
                                        obj.task(data.task_id).then(function (data) {
                                            fids.splice(fids.indexOf(event.data), 1);
                                            sessionStorage.setItem("delete_fids", JSON.stringify(fids));
                                        });
                                    });
                                }
                            }
                            window.onbeforeunload = function () {
                                var fids = JSON.parse(sessionStorage.getItem("delete_fids") || "[]");
                                obj.delete(fids).then(function (data) {
                                    obj.task(data.task_id).then(function (result) {
                                        sessionStorage.removeItem("delete_fids");
                                    });
                                });
                            };
                        });
                    });
                });
            };
        });
    };

    obj.autoDelFileVideoPage = function () {
        var fid = ((location.hash.match(/video\/(\w+)/) || []) [1]) || "";
        window.onbeforeunload = function () {
            window.opener.postMessage(fid, "/");
        };
    };

    obj.initDownloadPage = function () {
        if ($(".btn-show-link").length) {
            return;
        }
        else if ($(".btn-main").length) {
            $(".btn-main").prepend('<button style="margin-right:10px;background:red;color:white;" type="button" class="ant-btn btn-file btn-show-link" title="自动过滤不可下载文件"><span>火箭下载</span></button>');
            $(".btn-show-link").on("click", obj.showDownloadHomePage);
        }
        else {
            setTimeout(obj.initDownloadPage, 500);
        }
    };

    obj.showDownloadSharePage = function () {
        var filelist = obj.getSelectedFileList();
        if ((filelist = filelist.filter(function (item) {
            return item.category; // 0: 文件夹
        })).length === 0) return obj.showTipError("未获取到可下载文件");
        obj.downloadUrlSharePage(filelist).then(function (data) {
            obj.showBox(data);
        });
    };

    obj.showDownloadHomePage = async function () {
        var filelist = obj.getSelectedFileList();
         if(filelist.length > 1){
            swal({
            text: '请选中一个文件解析',
            icon: 'warning',
            });
            return;
         }

         if(filelist[0].dir){
            swal({
            text: '目前不支持文件夹解析',
            icon: 'warning',
            });
            return;
         }

        const fids = [filelist[0].fid];

        layui.use(['layer'], async function () {
        var layer = layui.layer,
        $ = layui.$;
        var form = layui.form;
   

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
                <div>下载器一定要配置好端口: <a style="color:green;" target="_blank" href="https://docs.qq.com/doc/DWmNnb3ZIekdnWHJi?no_promotion=1">点击查看配置说明</a></div>
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
                text: '请先安装下载器并打开运行，下载地址：https://drive.uc.cn/s/ed071cdb13aa4?public=1',
                icon: 'warning',
              });
              $('#parse').html('<p>解析</p>');
              return;
            }
            parse(layer,openLayer,fids);
          });
        },
      });
    });



    };


    async function parse(layer,openLayer,fids){
        const share_id = await fetch("https://drive-pc.quark.cn/1/clouddrive/share?pr=ucpro&fr=pc&uc_param_str=", {
            headers: {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify({
                fid_list:fids,
                expired_type:1,
                url_type:1,
                title:"分享"
            }),
            method: "POST",
            credentials: "include"
        }).then(function (result) {
            return result.ok ? result.json() : Promise.reject();
        }).then(function (result) {
            return result.code == 0 ? result.data.task_resp.data.share_id : Promise.reject(result);
        }).catch(function (err) {

        })

        const pwd_id = await fetch("https://drive-pc.quark.cn/1/clouddrive/share/password?pr=ucpro&fr=pc&uc_param_str=", {
            headers: {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify({
                share_id:share_id
            }),
            method: "POST",
            credentials: "include"
        }).then(function (result) {
            return result.ok ? result.json() : Promise.reject();
        }).then(function (result) {
            return result.code == 0 ? result.data.pwd_id : Promise.reject(result);
        }).catch(function (err) {

        })
        if(!pwd_id){
            layer.close(openLayer);
            swal({
            text: '解析错误，请更换文件解析！',
            icon: 'error',
            });
            return;
        }

        const stoken = await fetch("https://drive-h.quark.cn/1/clouddrive/share/sharepage/token?pr=ucpro&fr=pc", {
            headers: {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify({
                pwd_id:pwd_id
            }),
            method: "POST",
            credentials: "include"
        }).then(function (result) {
            return result.ok ? result.json() : Promise.reject();
        }).then(function (result) {
            return result.code == 0 ? result.data.stoken : Promise.reject(result);
        }).catch(function (err) {

        })
         const result = await fetch("https://api.gssource.com/quark/myParse", {
            headers: {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify({
                pwd_id:pwd_id,
                fid_list:fids,
                stoken:stoken
            }),
            method: "POST",
            credentials: "include"
        }).then(function (result) {
            return result.ok ? result.json() : Promise.reject();
        }).then(function (result) {
            return result.code == 200 ? result : Promise.reject(result);
        }).catch(function (err) {

        })
        if(result.code === 200){
            if(result.data === 100){
                $('#parse').html('<p>解析</p>');
                    layer.alert('解析次数已达上限，不限次数稳定版！地址：pan.gssource.com', {
                      title: '提示',
                });
                return;
            }
           layer.close(openLayer);
           sendToMotrix(result.data.data[0].download_url,result.data.id)
        } else {
          

        }
    }


 function sendToMotrix(url,id) {
    fetch('http://127.0.0.1:9999/api/v1/tasks', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({req:
            {
                url:url,
                extra:{
                header:{
                    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) quark-cloud-drive/3.0.2 Chrome/100.0.4896.160 Electron/18.3.5.12-a038f7b798 Safari/537.36 Channel/pckk_clouddrive_share_ch",
                    "Cookie":id
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
        }).catch(e=>{
    })

    swal({
            text: '文件开始下载,请打开下载器查看！',
            icon: 'success',
            });
    }
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




    obj.getSelectedFileList = function () {
        var list = obj.getShareId() ? obj.file_page.share_list : obj.file_page.home_list, fids = [];
        $(".ant-table-body tbody tr").each(function () {
            var $this = $(this);
            if ($this.find("input").get(0)?.checked) {
                fids.push($this.attr("data-row-key"));
            }
        });
        if (fids.length) {
            return list.filter(function (item) {
                return fids.includes(item.fid);
            });
        }
        else {
            return list;
        }
    };



    obj.downloadUrlHomePage = function (filelist) {
        return obj.download(filelist);
    };



    

    





    obj.getShareId = function () {
        return (window.location.pathname || "").split("/").slice(2)[0] || "";
    };

    obj.showTipSuccess = function (message, timeout) {
        if ($(".ant-message").length == 0) {
            $("body").append('<div class="ant-message"><span></span></div>');
        }
        $(".ant-message span").append('<div class="ant-message-notice"><div class="ant-message-notice-content"><div class="ant-message-custom-content ant-message-success"><i aria-label="icon: check-circle" class="anticon anticon-check-circle"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg></i><span>' + message + '</span></div></div></div>');
        setTimeout(function () {
            $(".ant-message span").empty();
        }, timeout || 3e3)
    };

    obj.showTipError = function (message, timeout) {
        if ($(".ant-message").length == 0) {
            $("body").append('<div class="ant-message"><span></span></div>');
        }
        $(".ant-message span").append('<div class="ant-message-notice"><div class="ant-message-notice-content"><div class="ant-message-custom-content ant-message-error"><i aria-label="icon: close-circle" class="anticon anticon-close-circle"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg></i><span>' + message + '</span></div></div></div>');
        setTimeout(function () {
            $(".ant-message span").empty();
        }, timeout || 3e3)
    };

    obj.run = function () {
        var url = location.href;
        if (url.indexOf(".quark.cn/s/") > 0) {
            obj.initSharePage();
        }
        else if (url.indexOf(".quark.cn/list") > 0) {
            if (url.indexOf(".quark.cn/list#/video/") > 0) {
                obj.initVideoPage();
            }
            else {
                obj.initHomePage();
            }
        }
    }();

    // Your code here...
})();
