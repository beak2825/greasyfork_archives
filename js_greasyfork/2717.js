// ==UserScript==
// @name        Baidu.Inbox.Any.Share 
// @namespace   footroot.baiduinbox
// @include     http://pan.baidu.com/inbox/i/*
// @description 使过期的度盘邮箱分享链接长期有效，可转存
// @version     0.5
// @copyright   footroot
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2717/BaiduInboxAnyShare.user.js
// @updateURL https://update.greasyfork.org/scripts/2717/BaiduInboxAnyShare.meta.js
// ==/UserScript==
function proxy(fn) { //代码插入网页
	var script = document.createElement('script');
	script.textContent = '(' + fn.toString() + ')();';
	document.body.appendChild(script);
}

function main(){ //主要部分
     if (FileUtils.last_time <= 0){ //恢复功能区域和文件浏览HTML，目前未对不同类型（文档、视频）的分享分别处理。 #todo
        var ss = $('.slide-show'), lt = $('.lasttime').children();
        lt.html('长 期').css({"display": "inline-block", "padding": "5px 7px", "border-radius": "2px", "background-color": "green", "color": "white"});
        ss.html('<header class="slide-show-header clearfix b-bdr-slv">\n</header>\n<div class="module-point">\n<div id="pointContainer"></div>\n</div>');
        var ssh = $('.slide-show-header'), savebtn = '<a class="new-sbtn okay" hidefocus="true" href="javascript:;" id="emphsizeButton"><em class="icon-share-save"></em>\n<b>保存至网盘</b>\n</a>\n', sshstr1 = '<h2 class="b-fl ellipsis" title="'+FileUtils.session_title+'"><span class="entity-icon sprite-list-ic b-in-blk b-ic-book"></span>'+FileUtils.session_title+'</h2>\n<span class="slide-header-funcs">', sshstr2 = '<a class="new-dbtn" hidefocus="true" href="javascript:;" id="downFileButtom"><em class="icon-download"></em><b>下载</b></a>\n<a class="new-dbtn wd2" hidefocus="true" href="javascript:;" id="shareqr"><em class="icon-share-qr"></em><b>二维码</b></a>\n</span>\n<div class="session-desc fn-ellipsis">'+FileUtils.session_desc+'</div>', sshstr = FileUtils.founder_uk.toString()===FileUtils.sysUK.toString() ? sshstr1 + sshstr2 : sshstr1 + savebtn + sshstr2;
        ssh.html(sshstr)
    }

    (function(A) { //重写度盘自身的启动脚本，去除对过期文件的限制。
        var _ = disk.util.ViewShareUtils, C = disk.ui.SharePointView, E = disk.util.PreviewManager, D = {resolveIcon: function(E, B, F) {
                var D = E === 1 ? 1 : 0;
                if (F) {
                    var C = F.match(/\.[^\.]+$/);
                    C = C != null ? C[0] : "";
                    _.resolveFileSmallIcon(D, null, C, A(".sprite-list-ic"), 1);
                }
                if (/[1-4]/.test(B) === false) {
                    _.resolveFileLargeIcon(F.slice(F.lastIndexOf(".")), A(".view-file-image"));
                }
            },showTwoDimension: function(H) {
                if (typeof disk.ui.TwoDimension !== "undefined") {
                    var G = H.split("."), I = G[G.length - 1], I = I.length > 10 ? "na" : I, F;
                    if (location.href.indexOf("#") > 0) {
                        F = location.href.substring(0, location.href.indexOf("#"));
                    } else {
                        F = location.href;
                    }
                    if (!/\?/.test(F)) {
                        F = F + "?qrfrom=1";
                    }
                    var B = disk.getParam("qrfrom", F);
                    if (B == "") {
                        F = F + "&qrfrom=1";
                    }
                    var _ = disk.getParam("qrtype", F);
                    if (_ == "") {
                        F = F + "&qrtype=" + encodeURIComponent(I);
                    }
                    if (FileUtils.spublic == 0) {
                        var K = disk.getParam("sekey", F), J = FileUtils.share_sekey;
                        if (K == "" && J) {
                            F = F + "&sekey=" + encodeURIComponent(J);
                        }
                    }
                    var L = "/share/qrcode?w=148&h=148&url=" + encodeURIComponent(F), D = A("#shareqr").hasClass("down") ? "down" : "top", C = A("#shareqr").hasClass("down") ? -224 : 8, E = {target: A("#shareqr"),imgSrc: L,imgTit: "",flagAddIframe: true,imgDes: "\u626b\u63cf\u4e8c\u7ef4\u7801\uff0c\u5c06\u6587\u4ef6\u53d1\u9001\u5230\u624b\u673a",topOffset: C,changetextdec: true,panlclick: true,arrowPos: D,showsource: "shareqr",hoverCallBack: function() {
                            A("#shareqr .icon-share-qr").css("backgroundPosition", "-230px -443px");
                        },leaveCallBack: function() {
                            A("#shareqr .icon-share-qr").css("backgroundPosition", "-208px -443px");
                        }}, M = new disk.ui.TwoDimension(E);
                }
            },bindDesc: function() {
                A(".session-desc").click(function() {
                    var _ = A(this);
                    if (_.hasClass("fn-ellipsis") === true) {
                        _.removeClass("fn-ellipsis");
                    } else {
                        _.addClass("fn-ellipsis");
                    }
                });
            }}, F = {hideHtmlOverflow: function() {
                A("html").css("overflow-y", "hidden");
            },bindSaveToNetdisk: function(_) {
                A("#emphsizeButton").click(function() {
                    _.doTransfer();
                    FileUtils._mDiskLog.send({type: "p2p_middle_page_save"});
                });
            },bindDownloadFile: function(_) {
                A("#downFileButtom").click(function() {
                    _.doDownload();
                });
                FileUtils._mDiskLog.send({type: "p2p_middle_page_download"});
            },resizeListHeight: function() {
                var C = A("#pointContainer .m-table .table-tbody"), _ = A(window).height(), B = _ - (49 + 20 + 109 + 59 + 34 + 41 + 78 + 22);
                C.height(B > 0 ? B : 0);
            },bindResizeListHeight: function() {
                A(window).bind("resize", function() {
                    F.resizeListHeight();
                });
            }}, B = {bindSaveToNetdisk: function() {
                var B = A("#emphsizeButton");
                if (B.length) {
                    B.click(function() {
                        if (FileUtils.viewdata != null) {
                            var B = A(this).hasClass("okay");
                            if (B) {
                                _.transferFiles({filetype: FileUtils.session_category,founder_uk: FileUtils.founder_uk,session_id: FileUtils.session_id,object_array: [FileUtils.single_object_id],fsid_array: [FileUtils.single_fsid]});
                                FileUtils._mDiskLog.send({type: "p2p_middle_page_save"});
                            }
                        } else {
                            _.useToast(disk.ui.Toast.MODE_CAUTION, "\u670d\u52a1\u5668\u9519\u8bef\uff0c\u8bf7\u7a0d\u5019\u91cd\u8bd5", false);
                        }
                    });
                }
            },bindDownloadFile: function() {
                A("#downFileButtom").click(function(B) {
                    B.preventDefault();
                    if (!FileUtils.viewdata) {
                        _.useToast(disk.ui.Toast.MODE_CAUTION, "\u670d\u52a1\u5668\u9519\u8bef\uff0c\u8bf7\u7a0d\u5019\u91cd\u8bd5", false);
                    } else {
                        _.downloadFile({session_id: FileUtils.session_id,founder_uk: FileUtils.founder_uk,object_array: A.stringify([FileUtils.single_object_id]),fsid_array: A.stringify([FileUtils.single_fsid]),file: FileUtils.viewdata});
                        FileUtils._mDiskLog.send({type: "p2p_middle_page_download"});
                    }
                    return false;
                });
            },bindSaveAndPlay: function(C) {
                var B = A("#emphsizePlayButton");
                if (B.length) {
                    B.click(function() {
                        _.startTransferVideo(C);
                        FileUtils._mDiskLog.send({type: "p2p_middle_page_save"});
                    });
                }
            }};
        A(function() {
            FileUtils = A.extend(FileUtils, _);
            D.resolveIcon(FileUtils.file_type, FileUtils.session_category, FileUtils.session_title);
            D.showTwoDimension(FileUtils.session_title);
            D.bindDesc();
            if (FileUtils.file_type === 0) {
                var H = function(D, B) {
                    var _ = this;
                    A.ajax({url: C.REST_API_UNPAN_FILEINFO,type: "GET",data: D,dataType: "JSON",success: function(_) {
                            if (_.errno === 0) {
                                typeof B === "function" && B(_);
                            } else {
                                if (disk.DEBUG) {
                                    console.log("[AJAX] " + C.REST_API_UNPAN_FILEINFO + " fail and the errno is " + _.errno);
                                }
                                Utilities.useToast({toastMode: disk.ui.Toast.MODE_CAUTION,msg: C.MSG_ERROR_SERVER,sticky: true,position: disk.ui.Panel.TOP,closeType: true});
                                typeof B === "function" && B(_);
                            }
                        },error: function() {
                            if (disk.DEBUG) {
                                console.log("AJAX " + C.REST_API_UNPAN_FILEINFO + " ERROR !");
                            }
                        }});
                };
                dataObj = {session_id: FileUtils.session_id,founder_uk: FileUtils.founder_uk,object_id: FileUtils.object_id,fs_id: FileUtils.fs_id};
                H(dataObj, function(_) {
                    A(".slide-show-viewer-loading").hide();
                    FileUtils.viewdata = _.list[0];
                    if (FileUtils.session_category === 1) {
                        B.bindSaveAndPlay({session_id: FileUtils.session_id,object_id: FileUtils.single_object_id,founder_uk: FileUtils.founder_uk});
                    } else {
                        B.bindSaveToNetdisk();
                    }
                    B.bindDownloadFile();
                    switch (FileUtils.session_category) {
                        case 1:
                            E.previewVideo(_.list[0]);
                            break;
                        case 2:
                            E.previewMusic(_.list[0]);
                            break;
                        case 3:
                            E.previewPicture(_.list[0].thumbs.url3);
                            break;
                        case 4:
                            E.previewDocument(_.list[0]);
                            break;
                        default:
                            E.previewOthers(_.list[0].size);
                    }
                });
            } else {
                var G = new C({self: FileUtils.self,session_id: FileUtils.session_id,founder_uk: FileUtils.founder_uk,last_time: FileUtils.last_time,$container: A("#pointContainer")});
                F.hideHtmlOverflow();
                F.bindSaveToNetdisk(G);
                F.bindDownloadFile(G);
                F.resizeListHeight();
                F.bindResizeListHeight();
            }
        });
    })(jQuery);
}

proxy(main);