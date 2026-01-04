// ==UserScript==
// @name         移动的编辑外挂插件
// @myBlog       http://xiaodongxier.com
// @namespace    undefined
// @version      2.0.1
// @description  编辑插件
// @author       编辑插件
// @match        http://cms.ds.gome.com.cn/gome-mobile-web/pageinfo/pageinfo_edit.do
// @match        *://cms.ds.gome.com.cn/gome-mobile-web/pageinfo/pageinfo_edit.do
// @match        *
// @match        编辑插件
// @downloadURL https://update.greasyfork.org/scripts/412060/%E7%A7%BB%E5%8A%A8%E7%9A%84%E7%BC%96%E8%BE%91%E5%A4%96%E6%8C%82%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/412060/%E7%A7%BB%E5%8A%A8%E7%9A%84%E7%BC%96%E8%BE%91%E5%A4%96%E6%8C%82%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
$(document).ready(function () {
            $("#pageTitle").css({
                    'margin-left': '1100px',
                cursor: 'wait'
            })
            $("#pageTitle").click(function(){
                $(".wangyongjie").slideToggle();
            })
  
  var myStyle = `
<div>
  <style>
    #backTagImgId,
    #tagImgId {
      height: 40px !important;
      width: 40px !important;
    }
.product_list_view .product_list_double .content {
    flex: none;
    width: 80%;
}
  </style>
</div>
`;
    $("body").append(myStyle)

  
  
  
            setTimeout(function () {
                // 模板展示 bug 修复
                $(".product_list_view .pro_list_col3 .flexgrid").css({
                    width: "100%",
                    display: "flex"
                })

                $(".product_list_view .pro_list_col2 .flexgrid").css({
                    width: "100%",
                    display: "flex"
                })

                $(".ui-state-cms").click(function () {
                    setTimeout(function () {
                        $("#backImgId").css({
                            width: "100px",
                            height: "100px"
                        })
                    }, 500)
                })
                // 依赖部分
                function getUrlStr(t) {
                    var e = new RegExp("(^|&)" + t + "=([^&]*)(&|$)", "i"),
                        o = window.location.search.substr(1).match(e);
                    return null != o ? unescape(o[2]) : null
                }

                $("body").append(`<iframe class="yulan" width="300" height="850" src="${getUrlStr("url")}" frameborder="0" style="position: fixed;top: 50px;right: 20px;display:none;box-shadow: 0 0 3px 0px black;"></iframe>`)
                $("body").append(`<iframe class="yulan1" width="300" height="850" src="${'http://cms.ds.gome.com.cn/gome-mobile-web/preview_page/preview.do?key=' + getUrlStr("key")}" frameborder="0" style="position: fixed;top: 50px;right: 20px;display:none;box-shadow: 0 0 3px 0px black;"></iframe>`)
              
                // $("body").append(`<iframe class="yulan" width="300" height="850" src="${getUrlStr("url")}" frameborder="0" style="position: fixed;top: 50px;right: 680px;display:none;"></iframe>`)

                // 插入包装盒子
                $("body").append('<div class="wangyongjie" id="wangyongjie"></div>')
                $(".wangyongjie").css({
                    width: '60%',
                    height: '39px',
                    // border: '1px solid red',
                    position: 'fixed',
                    top: '0px',
                    left: '82px',
                    zIndex: '99999',
                    display: 'flex'
                    // display: 'none'
                })
                // 循环遍历插入按钮
                function addBtn(myClass, myBtnName, myDomNew) {
                    $(".wangyongjie").append('<button class="myBtn ' + myClass + ' " id="' + myClass + ' "> ' + myBtnName + myDomNew + '</button>')
                }
                var myBtnName = ["正删", "倒删", "三列删", "单图吸顶", "三列连击", "全屏", "刷新", "预览", "刷新", "真预览", "真刷新", "待开发", "待开发", "待开发", "待开发", "待开发", "待开发", "待开发", "待开发", "待开发"];
                var myDomNew = ['', "", "", "", "", "", "", '<a href="" target="_blank" class="new_target" style="color:#fff;">/新开</a>', "", '<a href="" target="_blank" class="new_target1" style="color:#fff;">/真新开</a>', "", "", "", "", "", "", "", "", "", "", ""];
                for (var i = 0; i < 12; i++) {
                    addBtn("myBtn" + i, myBtnName[i], myDomNew[i])
                }
                $(".myBtn").css({
                    width: 'auto',
                    "text-align": 'center',
                    height: '30px',
                    "line-height": '30px',
                    background: '#272e34',
                    // #e35f4e
                    color: '#fff',
                    margin: '5px 5px 5px 0',
                    "border-radius": '5px',
                    "font-size": '10px',
                    border: '1px solid #fff'
                })
                // 危险按钮
                $(".myBtn0,.myBtn1,.myBtn2").css({
                    color: 'red'
                })
                // 功能开发部分
                // 新开页面
                $(".new_target").attr("href", getUrlStr("url"))
                $(".new_target1").attr("href", 'http://cms.ds.gome.com.cn/gome-mobile-web/preview_page/preview.do?key=' + getUrlStr("key"))
                
                // 正删
                $(".myBtn0").click(function () {
                    //利用对话框返回的值 （true 或者 false）  
                    if (confirm("此操作无法撤回，谨慎操作⚠")) {
                        alert("点击确定开始执行");
                        var i = 1;
                        console.log("一共" + $(".dragCons>div").length + "个模块")
                        function dele() {
                            $(".dragCons>div").eq(0).find("a.close").click();
                            $("#removeM").css({ "opacity": " 0" })
                            setTimeout(function () {
                                $(".dialogHold div a.yesbtn").click()
                            }, 2000)
                        }
                        var up = setInterval(function () {
                            var list = $(".dragCons>div");
                            if (list.length !== 0) {
                                dele()
                                console.log("成功删除第" + i++ + "个模块", "还剩下" + list.length + "个模块")
                            } else {
                                alert("没有模块可供删除了😝")
                                clearInterval(up);
                            }
                        }, 2000)
                    }
                    else {
                        alert("取消成功");
                    }
                })

                // 倒删
                $(".myBtn1").click(function () {
                    //利用对话框返回的值 （true 或者 false）  
                    if (confirm("此操作无法撤回，谨慎操作⚠")) {
                        alert("点击确定开始执行");
                        var i = 1;
                        console.log("一共" + $(".dragCons>div").length + "个模块")
                        function dele() {
                            $(".dragCons>div:last-child").find("a.close").click();
                            $("#removeM").css({ "opacity": " 0" })
                            setTimeout(function () {
                                $(".dialogHold div a.yesbtn").click()
                            }, 2000)
                        }
                        var up = setInterval(function () {
                            var list = $(".dragCons>div");
                            if (list.length !== 0) {
                                dele()
                                console.log("成功删除第" + i++ + "个模块", "还剩下" + list.length + "个模块")
                            } else {
                                alert("没有模块可供删除了😝")
                                clearInterval(up);
                            }
                        }, 2000)
                    }
                    else {
                        alert("取消成功");
                    }
                })

                // 三品模块删除
                $(".myBtn2").click(function () {
                  //利用对话框返回的值 （true 或者 false）  
                    if (confirm("此操作无法撤回，谨慎操作⚠")) {
                        alert("点击确定开始执行");
                        var conL = $(".shop-content");
                    for (var i = 0; i < conL.length; i++) {
                        conL.eq(i).find(".handle-show").find("a:nth-child(3)").click()
                        // console.log(conL.eq(i).find(".handle-show").find("a:nth-child(3)"))
                    }
                    console.log("三列商批量删除")
                    }
                    else {
                        alert("取消成功");
                    }
                    
                })

                // 单图吸顶
                $(".myBtn3").click(function () {
                    if (confirm("准备初始化，点击确定")) {
                        function add(index) {
                            if ($(".dragCons>div").eq(index).find('data').attr("tempname") == "单图楼层") {
                                $(".dragCons>div").eq(index).click();
                                setTimeout(function () {
                                    $("#myTab li:nth-child(4) a").click();
                                }, 1000)
                                setTimeout(function () {
                                    // $("#goodsLayoutConfig .form-group:nth-child(4) .col-sm-6 .radio-inline:nth-child(2)").attr("checked", "checked");
                                    $(".tab-content #layoutProfile #photoLayoutConfig .form-group:nth-child(5) .col-sm-6 .radio-inline:nth-child(2) input").attr("checked", "checked");
                                }, 2000)
                                setTimeout(function () {
                                    $("#saveTempletLayout").click()
                                }, 3000)
                                setTimeout(function () {
                                    $(".ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default").click()
                                }, 4000)
                            } else {
                                console.log("筛选")
                            }
                        }
                        var i = 0
                        var init3 = $("#sortable .init3").length;
                        setInterval(function () {
                            if (i++ < init3) {
                                add(i)
                                console.log(i)
                            } else {
                                alert("初始化完成");
                                clearInterval(add);
                            }
                        }, 4200)
                    }
                })

                // 三连接
                $(".myBtn4").click(function () {
                    if (confirm("准备初始化，点击确定")) {
                        function add(index) {
                            if ($(".dragCons>div").eq(index).find('data').attr("tempname") == "三列商品") {
                                $(".dragCons>div").eq(index).click();
                                setTimeout(function () {
                                    $("#myTab li:nth-child(4) a").click();
                                }, 1000)
                                setTimeout(function () {
                                    // $("#goodsLayoutConfig .form-control option:nth-child(2)").attr("selected","selected");
                                    $("#goodsLayoutConfig .form-group:nth-child(3) .form-control option:nth-child(2)").attr("selected", "selected");
                                }, 1500)
                                setTimeout(function () {
                                    $("#goodsLayoutConfig .form-group:nth-child(5) #cart_label input").attr("checked", "checked")
                                }, 2000)
                                setTimeout(function () {
                                    $("#goodsLayoutConfig .form-group:nth-child(6) option:nth-child(2)").attr("selected", "selected")
                                    // $("#goodsLayoutConfig .form-horizontal #cart_label input").attr("checked","checked")
                                }, 3500)
                                setTimeout(function () {
                                    $("#saveGoodsLayout").click()
                                }, 4000)
                                setTimeout(function () {
                                    $(".ui-button-text-only .ui-button-text").click()
                                }, 4500)
                            } else {
                                console.log("筛选")
                            }
                        }
                        var i = -1
                        var init3 = $("#sortable .init3").length;
                        setInterval(function () {
                            if (i++ < init3) {
                                add(i)
                                console.log(i)
                            } else {
                                alert("初始化完成");
                                clearInterval(add);
                            }
                        }, 5000)
                    }
                })

                // 全屏
                $(".myBtn5").click(function () {
                    document.documentElement.requestFullscreen()
                })

                //   本页刷新
                $(".myBtn6").click(function () {
                    window.location.reload()
                })

                // 预览

                $(".myBtn7").click(function () {
                    $(".yulan").slideToggle();
                })

                // 预览刷新

                $(".myBtn8").click(function () {
                    $('.yulan').attr('src', $('.yulan').attr('src'));
                })

                // 真预览

                $(".myBtn9").click(function () {
                    $(".yulan1").slideToggle();
                })

                // 真预览刷新

                $(".myBtn10").click(function () {
                    $('.yulan1').attr('src', $('.yulan1').attr('src'));
                })


                
                console.log("王永杰外挂")
            }, 200)
        })
