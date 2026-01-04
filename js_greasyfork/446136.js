// ==UserScript==
// @name         openseahelper
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  opsea
// @author       aridrop
// @match        https://*.opensea.io/*
// @match        https://*.x2y2.io/*
// @match        https://*.gem.xyz/*
// @match        https://*.hcaptcha.com/*
// @match        https://democaptcha.com/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/Base64/1.1.0/base64.min.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/index.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/unibabel.hex.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/unibabel.base32.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/forge/dist/forge.min.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/botp/sha1-hmac.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/botp/index.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/authenticator.js
// @grant        GM_xmlhttpRequest
// @connect      weleader5.oss-cn-shenzhen.aliyuncs.com
// @connect      2captcha.com
// @connect      airdropapi.beetaa.cn
// @connect      43.134.27.147
// @connect      localhost
// @connect      api.yescaptcha.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_info
// @license		 lly
// @downloadURL https://update.greasyfork.org/scripts/446136/openseahelper.user.js
// @updateURL https://update.greasyfork.org/scripts/446136/openseahelper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var taskId = "";
    $(function () {
        //加载浮动层
        var mainView = $("<section style='pointer-events: none; position:fixed;left: 220px;top: 15%;transform: translate(0,-30%);display: flex;z-index:100000;height:100px;'>   <div id='dm' style='border-radius:10px ;margin: 0px 0px;display: flex;flex-direction: column;justify-content: center;align-items: center;padding: 10px ;background-color: #1ca1f1;'> <p style='font-size: 40px;letter-spacing:5px ;font-weight: bold;color: #FFFFFF;padding: 0px 0px;' id='baomingjilu'>0.000</p> </div> </section>");
        var pageurl = window.location.href.split('//')[1].split('?')[0];
        if (pageurl.indexOf('opensea.io') > -1 || pageurl.indexOf('premint.xyz') > -1) {
            pageurl = 'opensea.io';
        }
        if (pageurl.indexOf('x2y2.io') > -1) {
            pageurl = 'x2y2.io';
        }
        if (pageurl.indexOf('gem.xyz') > -1) {
            pageurl = 'gem.xyz';
        }
        //界面操作
        initData(pageurl);
    })
    function initData(pageurl) {
        switch (pageurl) {
            case "opensea.io":
                var initReply = setInterval(function () {
                    var contract = window.location.href.replace('/zh-cn', '').split('//')[1].split('/')[3];
                    var number = window.location.href.replace('/zh-cn', '').split('//')[1].split('/')[4];
                    if (contract == undefined || number == undefined) {
                        var nftList = document.querySelectorAll("article");
                        $.each(nftList, function (index, item) {
                            var itemdata = item.firstElementChild.href;
                            var itemcontract = item.firstElementChild.href.split('//')[1].split('/')[3];
                            var itemnumber = item.firstElementChild.href.split('//')[1].split('/')[4];
                            console.log(itemdata);
                            GM_xmlhttpRequest({
                                url: "http://43.134.27.147:5082/api/OpenSea_WhoNFTLogs/GetByNo?Contract=" + itemcontract + "&nftno=" + itemnumber,
                                method: "GET",
                                data: "",
                                headers: {
                                    "Content-type": "application/x-www-form-urlencoded"
                                },
                                onload: function (xhr) {
                                    var itemdata = xhr.responseText;
                                    var jsondata = JSON.parse(itemdata);
                                    if (jsondata.status == 200) {
                                        if (jsondata.response.Type == 1) {
                                            $($(item).find("a")[0]).before("<div style='display:flex;align-items: center;justify-content: space-between; background-color: green;color:#fff;padding:5px 10px;width: 100%;position: absolute;top: 0px;z-index: 1000;'><div style=''><div>编号：客户</div><div>ETH：" + jsondata.response.Balance + "</div><div>WETH：" + jsondata.response.WBalance + "</div></div><button style='padding:8px 10px;border-radius: 5px; border:none;background:#fff;color:#000;font-size:16px;'>提取</button></div>");
                                        } else {
                                            $($(item).find("a")[0]).before("<div style='display:flex;align-items: center;justify-content: space-between; background-color: red;color:#fff;padding:5px 10px;width: 100%;position: absolute;top: 0px;z-index: 1000;'><div style=''><div>编号：" + jsondata.response.PName + "</div><div>ETH：" + jsondata.response.Balance + "</div><div>WETH：：" + jsondata.response.WBalance + "</div></div><button style='padding:8px 10px;border-radius: 5px; border:none;background:#fff;color:#000;font-size:16px;'>提取</button></div>");
                                        }
                                    } else {

                                    }

                                    //clearInterval(initReply)
                                    console.log(itemdata);
                                }
                            })

                        });
                    } else {
                        GM_xmlhttpRequest({
                            url: "http://43.134.27.147:5082/api/OpenSea_Wallet/GetWalletInfo?contract=" + contract + "&nftno=" + number,
                            method: "GET",
                            data: "",
                            headers: {
                                "Content-type": "application/x-www-form-urlencoded"
                            },
                            onload: function (xhr) {
                                var cldata = xhr.responseText;
                                switch (pageurl) {
                                    case 'opensea.io':
                                        var jsondata = JSON.parse(cldata);
                                        var walletAddress = jsondata.response.WalletAddress;
                                        if ($(".js_msg") != undefined) {
                                            $(".js_msg").remove()
                                        }
                                        $(".item--title").after("<div class='js_msg' style='font-size: 30px;font-weight: 600;'></div>")
                                        if (jsondata.response.Type == 0) {
                                            if ($(".js_msg") != undefined) {

                                                $(".js_msg").append("机器编号：" + jsondata.response.Pname + " <br/> ETH余额:" + jsondata.response.Balance + " <br/> WETH余额:" + jsondata.response.WBalance)
                                            }
                                        } else {
                                            if ($(".js_msg") != undefined) {
                                                $(".js_msg").append("机器编号：客户 <br/> ETH余额:" + jsondata.response.Balance + " <br/> WETH余额:" + jsondata.response.WBalance)
                                            }
                                        }
                                        //$("#baomingjilu").html(jsondata.response.Pname + "</br>" + jsondata.response.IP + "</br>" + jsondata.response.Balance)
                                        //clearInterval(initReply)
                                        if (walletAddress != undefined) {
                                            if (jsondata.response.Type == 0) {

                                                document.querySelectorAll("button")[11].style = "background-color:red"
                                                document.querySelectorAll("button")[12].style = "background-color:red"

                                            } else {

                                                document.querySelectorAll("button")[11].style = "background-color:green"
                                                document.querySelectorAll("button")[12].style = "background-color:green"
                                            }
                                        }
                                        break;
                                }
                            }
                        });
                    }
                }, 5000);
                var initbalance = setInterval(function () {
                    GM_xmlhttpRequest({
                        url: "https://weleader5.oss-cn-shenzhen.aliyuncs.com/APP/opseajson.json?tt" + Date.parse(new Date()).toString(),
                        method: "GET",
                        data: "fid=1037793830&act=1&re_src=11&jsonp=jsonp&csrf=e37f1881fd98f16756d16ab71109d37a",
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded"
                        },
                        onload: function (xhr) {
                            var cldata = xhr.responseText;
                            var jsondata = JSON.parse(cldata);
                            var offerlist = document.querySelectorAll("div[data-testid='AccountLink']>a");
                            $.each(offerlist, function (index, item) {
                                var wallet = item.href.replace("https://opensea.io/", "");
                                item.parentElement.parentElement.parentElement.style = "background:green;color:#fff;";
                                item.parentElement.parentElement.parentElement.previousSibling.style = "background:green;color:#fff !important;";
                                item.parentElement.parentElement.parentElement.previousSibling.previousSibling.style = "background:green;color:#fff;font-weight: bold;";
                                item.parentElement.parentElement.parentElement.previousSibling.previousSibling.textContent = '客户';
                                $(".hMhaZw .hmVtez.jQBTGb").attr("style", "color:#fff");
                                $("span.gUvutB").attr("style", "color:#fff");
                                $.each(jsondata, function (windex, witem) {
                                    if (witem.WalletAddress.toString().toLowerCase() == wallet.toLowerCase()) {
                                        item.parentElement.parentElement.parentElement.style = "background:red;color:#fff;";
                                        item.parentElement.parentElement.parentElement.previousSibling.style = "background:red;color:#fff;color: rgb(255 255 255);font-color:rgb(255 255 255);";
                                        item.parentElement.parentElement.parentElement.previousSibling.previousSibling.style = "font-weight: bold;font-size:30px;";
                                        item.parentElement.parentElement.parentElement.previousSibling.previousSibling.textContent = witem.Pname;
                                    }
                                })
                            })
                        }
                    })
                }, 3000);
                break;
            case "x2y2.io":
                var initx2y2Reply = setInterval(function () {
                    var contract = window.location.href.split('//')[1].split('/')[2];
                    var number = window.location.href.split('//')[1].split('/')[3];
                    GM_xmlhttpRequest({
                        url: "http://43.134.27.147:5082/api/OpenSea_Wallet/GetWalletInfo?contract=" + contract + "&nftno=" + number,
                        method: "GET",
                        data: "",
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded"
                        },
                        onload: function (xhr) {
                            var cldata = xhr.responseText;
                            var jsondata = JSON.parse(cldata);
                            if (jsondata != null) {
                                var walletAddress = jsondata.response.WalletAddress;
                                if ($(".js_msg") != undefined) {
                                    $(".js_msg").remove()
                                }
                                $(".space-y-3 .space-y-2").after("<div class='js_msg' style='font-size: 30px;font-weight: 600;'></div>")
                                if (jsondata.response.Type == 0) {
                                    if ($(".js_msg") != undefined) {
                                        $(".js_msg").append("机器编号：" + jsondata.response.Pname + " <br/> ETH余额:" + jsondata.response.Balance + " <br/> WETH余额:" + jsondata.response.WBalance)
                                    }
                                } else {
                                    if ($(".js_msg") != undefined) {
                                        $(".js_msg").append("机器编号：客户 <br/> ETH余额:" + jsondata.response.Balance + " <br/> WETH余额:" + jsondata.response.WBalance)
                                    }
                                }
                                //$("#baomingjilu").html(jsondata.response.Pname + "</br>" + jsondata.response.IP + "</br>" + jsondata.response.Balance)
                                //clearInterval(initReply)
                                if (walletAddress != undefined) {
                                    if (jsondata.response.Type == 0) {

                                        document.querySelectorAll("button")[11].style = "background-color:red"
                                        document.querySelectorAll("button")[12].style = "background-color:red"

                                    } else {

                                        document.querySelectorAll("button")[11].style = "background-color:green"
                                        document.querySelectorAll("button")[12].style = "background-color:green"
                                    }
                                }

                            }
                        }
                    });

                }, 5000);
                break;
            case "gem.xyz":
                var initx2y2Reply = setInterval(function () {
                    var contract = window.location.href.split('//')[1].split('/')[2];
                    var number = window.location.href.split('//')[1].split('/')[3];
                    GM_xmlhttpRequest({
                        url: "http://43.134.27.147:5082/api/OpenSea_Wallet/GetWalletInfo?contract=" + contract + "&nftno=" + number,
                        method: "GET",
                        data: "",
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded"
                        },
                        onload: function (xhr) {
                            var cldata = xhr.responseText;
                            var jsondata = JSON.parse(cldata);
                            if (jsondata != null) {
                                var walletAddress = jsondata.response.WalletAddress;
                                if ($(".js_msg") != undefined) {
                                    $(".js_msg").remove()
                                }
                                $(".items-start>.items-center.mb-2").after("<div class='js_msg' style='font-size: 30px;font-weight: 600;'></div>")
                                if (jsondata.response.Type == 0) {
                                    if ($(".js_msg") != undefined) {
                                        $(".js_msg").append("机器编号：" + jsondata.response.Pname + " <br/> ETH余额:" + jsondata.response.Balance + " <br/> WETH余额:" + jsondata.response.WBalance)
                                    }
                                } else {
                                    if ($(".js_msg") != undefined) {
                                        $(".js_msg").append("机器编号：客户 <br/> ETH余额:" + jsondata.response.Balance + " <br/> WETH余额:" + jsondata.response.WBalance)
                                    }
                                }
                                //$("#baomingjilu").html(jsondata.response.Pname + "</br>" + jsondata.response.IP + "</br>" + jsondata.response.Balance)
                                //clearInterval(initReply)
                                if (walletAddress != undefined) {
                                    if (jsondata.response.Type == 0) {
                                        document.querySelector("body > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > span:nth-child(2) > div:nth-child(1)").style = "background-color:red;color:#fff;";
                                    } else {
                                        document.querySelector("body > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > span:nth-child(2) > div:nth-child(1)").style = "background-color:green;color:#fff;"

                                    }
                                }

                            }
                        }
                    });

                }, 5000);
                break;
        }
    }
})();