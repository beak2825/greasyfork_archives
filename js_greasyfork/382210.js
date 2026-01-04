// ==UserScript==
// @name         CDD老司机
// @namespace    http://www.c-dd.cn
// @version      1.5.0
// @description  黑科云：自动弹出磁链框，自动清理磁链框内容，粘贴后自动解析。
// @description  黑科云：解析和云盘页面，自动执行下载/转存/删除等操作。
// @description  JAVLib：配合JAV老司机脚本，搜索到的磁链可以直接点击用黑科云解析
// @description  JAVLib：替换dmm预览视频网址（.dmm.co.jp在除日本外地区不可用），允许全屏。
// @description  BTSOW：搜索列表可直接复制磁链。
// @description  种子帝：点击磁力链接自动复制。
// @description  xp1024.com：增加磁链复制按钮。
// @description  downsx.rocks：增加磁链复制按钮。
// @description  LoveBB：点击链接直接进入播放页。
// @author       CDD
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_getResourceURL
// @resource     icon http://geekdream.com/image/115helper_icon_001.jpg

// @downloadURL https://update.greasyfork.org/scripts/382210/CDD%E8%80%81%E5%8F%B8%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/382210/CDD%E8%80%81%E5%8F%B8%E6%9C%BA.meta.js
// ==/UserScript==
// https://wiki.greasespot.net

(function() {
    'use strict';

    let icon = GM_getResourceURL('icon');

    /**
     * 公用类
     * @Class
     */
    let Common = {
        /**
         * 方法: 通用chrome通知
         * @param title
         * @param body
         * @param icon
         * @param click_url
         */
        notifiy: function (title, body, icon, click_url) {
            var notificationDetails = {
                text: body,
                title: title,
                timeout: 3000,
                image: icon,
                onclick: function () {
                    window.open(click_url);
                }
            };
            GM_notification(notificationDetails);
        },
        /**
         * 方法: 使用黑科云解析磁链
         */
        heike: function (maglink, done) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'http://lx.heikeyun.net/Main.aspx',
                    onload: function (responseDetails) {
                        if ((/(login)/i).test(responseDetails.finalUrl)) {
                            Common.notifiy("黑科云还没有登录",
                                '请先登录黑科云后,再离线下载！',
                                icon,
                                'http://lx.heikeyun.net'
                            );
                            if (done && done.fail) done.fail();
                            return;
                        }
                        // console.log(responseDetails.responseText);
                        let r = new RegExp(/id\=\"__VIEWSTATE\"\s+value\=\"(.+?)\"[\s\S]+id\=\"__VIEWSTATEGENERATOR\"\s+value\=\"(.+?)\"/i);
                        let data = r.exec(responseDetails.responseText);
                        if (data.length != 3) return;
                        let post = '------WebKitFormBoundaryIAY6eACPf5D59ukq\r\nContent-Disposition: form-data; name="__EVENTTARGET"\r\n\r\n\r\n------WebKitFormBoundaryIAY6eACPf5D59ukq\r\nContent-Disposition: form-data; name="__EVENTARGUMENT"\r\n\r\n\r\n------WebKitFormBoundaryIAY6eACPf5D59ukq\r\nContent-Disposition: form-data; name="__VIEWSTATE"\r\n\r\n' + data[1] + '\r\n------WebKitFormBoundaryIAY6eACPf5D59ukq\r\nContent-Disposition: form-data; name="__VIEWSTATEGENERATOR"\r\n\r\n' + data[2] + '\r\n------WebKitFormBoundaryIAY6eACPf5D59ukq\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$FileOpenTorrent"; filename=""\r\nContent-Type: application/octet-stream\r\n\r\n\r\n------WebKitFormBoundaryIAY6eACPf5D59ukq\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$txtBtHash"\r\n\r\n' + maglink + '\r\n------WebKitFormBoundaryIAY6eACPf5D59ukq\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$btnGoHash"\r\n\r\n解析\r\n------WebKitFormBoundaryIAY6eACPf5D59ukq--';
                        // console.log(post);
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: 'http://lx.heikeyun.net/Main.aspx',
                            headers: {
                                "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryIAY6eACPf5D59ukq",
                                "Referer": "http://lx.heikeyun.net/Main.aspx",
                                "Origin": "http://lx.heikeyun.net"
                            },
                            data: post,
                            onload: function (responseDetails) {
                                // console.log(responseDetails.finalUrl);
                                if (!(/(HashList)/i).test(responseDetails.finalUrl)) {
                                    if (done && done.fail) done.fail();
                                    return;
                                }
                                window.open(responseDetails.finalUrl, "_blank");
                                if (done && done.ok) done.ok();
                            }
                        });
                    }
                });

        }
    }

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    if (location.host.search(/heikeyun\.net/i) >= 0) {
        //////////////////////////
        //                      //
        //        黑科云        //
        //                      //
        //////////////////////////

	    var ctrl_type = GM_getValue("ctrl_type");
	    var ctrl_close = GM_getValue("ctrl_close");

	    if (location.pathname.substring(0,11) == "/MyYun.aspx") {
            ctrl_window();
            box_ctrl();
	    } else if (location.pathname.substring(0,14) == "/HashList.aspx") {
            ctrl_window();
            box_ctrl();
	    } else if (typeof OpenHash === "function") {
            main();
	    }

	    // 粘贴磁链自动解析 ------------------------------------------------------------------------------------------------
	    function main() {
		OpenHash();
		// var a = document.getElementsByTagName("a");
		// a[5].click();
		setTimeout(main_input, 200);
	    }
	    function main_input(){
		var input = document.getElementById("txtBtHash");
		input.value="";
		input.focus();
		setInterval(main_check, 500);
	    }
	    var last = "";
	    function main_check() {
		var input = document.getElementById("txtBtHash").value;
		if (input != last && input.substring(0,20).toLowerCase() == "magnet:?xt=urn:btih:") {
		    last = input;
		    document.getElementById("btnGoHash").click();
		}
	    }

	    // 漂浮选项窗 -----------------------------------------------------------------------------------------------------
	    function ctrl_window() {
		var oneInner = document.createElement("div");
		oneInner.setAttribute("style","background:#FFF;border:solid 2px #666;border-radius:5px;position:fixed;width:80px;padding:5px 0;top:5px;left:5px;");

		var btn_style = "background:#F0F0F0;border:solid 1px #666;border-radius:4px;width:60px;height:25px;display:flex;overflow:hidden;margin:3px auto;cursor:pointer;justify-content:center;align-items:center;";
		var Button1 = document.createElement("label");
		Button1.setAttribute("style", btn_style);
		Button1.innerHTML = "<input type='radio' name='ctrl_type' value='down' " + (ctrl_type == "down" ? "checked" : "") + ">&nbsp;下载";
		Button1.getElementsByTagName("input")[0].addEventListener("click", ctrl_change, false);
		var Button2 = document.createElement("label");
		Button2.setAttribute("style", btn_style);
		Button2.innerHTML = "<input type='radio' name='ctrl_type' value='save' " + (ctrl_type == "save" ? "checked" : "") + ">&nbsp;转存";
		Button2.getElementsByTagName("input")[0].addEventListener("click", ctrl_change, false);
		var Button3 = document.createElement("label");
		Button3.setAttribute("style", btn_style);
		Button3.innerHTML = "<input type='radio' name='ctrl_type' value='delete' " + (ctrl_type == "delete" ? "checked" : "") + ">&nbsp;删除";
		Button3.getElementsByTagName("input")[0].addEventListener("click", ctrl_change, false);
		var Button4 = document.createElement("label");
		Button4.setAttribute("style", btn_style);
		Button4.innerHTML = "<input type='radio' name='ctrl_type' value='view' " + (ctrl_type == "view" ? "checked" : "") + ">&nbsp;预览";
		Button4.getElementsByTagName("input")[0].addEventListener("click", ctrl_change, false);

		btn_style = "border:solid 1px #666;border-radius:4px;width:60px;height:25px;display:flex;overflow:hidden;margin:8px auto 4px auto;cursor:pointer;justify-content:center;align-items:center;";
		var Button9 = document.createElement("label");
		Button9.setAttribute("style", btn_style);
		Button9.innerHTML = "<input type='checkbox' name='ctrl_close' value='close' " + (ctrl_close ? "checked" : "") + ">&nbsp;关闭";
		Button9.getElementsByTagName("input")[0].addEventListener("click", ctrl_change, false);

		oneInner.appendChild(Button4);
		oneInner.appendChild(Button1);
		oneInner.appendChild(Button2);
		oneInner.appendChild(Button3);
		oneInner.appendChild(Button9);
		document.body.appendChild(oneInner);
	    }
	    function ctrl_change() {
		var obj = this; // .getElementsByTagName("input")[0]
		var name = obj.name;
		if (name == "ctrl_type") {
		    ctrl_type = obj.value;
		    GM_setValue("ctrl_type", ctrl_type);
		} else if (name == "ctrl_close") {
		    ctrl_close = obj.checked ? true : false;
		    GM_setValue("ctrl_close", ctrl_close);
		}
	    }

	    // 解析/云盘 点击文件自动操作 --------------------------------------------------------------------------------------
	    function box_ctrl() {
            box_decode();
            setInterval(box_check, 300);
	    }
	    function box_check() {
            var boxhidden = (box.getAttribute("class").indexOf("hidden",0) >= 0) ? true : false;
            var boxctrl   = ctrl_get(box);
            if (boxhidden) {
                if (boxctrl) ctrl_rm(box);
                return;
            }
            if (boxctrl) return;
            if (btn[ctrl_type]) {
                if (btn[ctrl_type].style.display == "none") return
                ctrl_set(box);
                btn[ctrl_type].click();
                if (ctrl_close) setTimeout(box_close, 200);                       // 关闭小窗
            }
	    }
	    function box_decode() {
            window.box = document.getElementById("target4");
            window.btn = new Object;
            var btn = box.getElementsByTagName("button");
            for (var i = 0; i < btn.length; i++) {
                if (!window.btn.view && btn[i].innerHTML.indexOf("预览",0) != -1) {
                    window.btn.view = btn[i];
                    continue;
                }
                if (!window.btn.down && btn[i].innerHTML.indexOf("下载",0) != -1) {
                    window.btn.down = btn[i];
                    continue;
                }
                if (!window.btn.save && btn[i].innerHTML.indexOf("转存",0) != -1) {
                    window.btn.save = btn[i];
                    continue;
                }
                if (!window.btn.delete && btn[i].innerHTML.indexOf("删除",0) != -1) {
                    window.btn.delete = btn[i];
                    continue;
                }
            }
	    }
	    function box_close() { document.getElementById("MenuClose").click(); }
	    function ctrl_get(obj) { return obj.getAttribute("ctrl") ? true : false; }
	    function ctrl_set(obj) { obj.setAttribute("ctrl", "true"); }
	    function ctrl_rm(obj) { obj.removeAttribute("ctrl"); }
    } else if (document.title.search(/JAVLibrary/i) >= 0 && (/\/\?v\=jav[a-zA-Z0-9]+/i).test(location.href)) {
        //////////////////////////
        //                      //
        //       JAVLib         //
        //                      //
        //////////////////////////

        var add_heike = {
            check: 5, // 循环检测时间限制，超过这个时间没有在页面找到JAV磁链表格，则认为无JAV插件，停止检测。
            wait_table : function () {
                add_heike.check--;
                if (add_heike.check <= 0) clearInterval(clock_heike);
                let table = document.getElementById("nong-table-new");
                if (!table) return;
                let select = table.getElementsByTagName("select");
                if (select.length < 1) return;
                clearInterval(clock_heike);
                select[0].addEventListener("change", add_heike.select);
                clock_heike = setInterval(add_heike.wait_row, 1000);
            },
            wait_row : function () {
                // console.log("waiting ... search resault");
                let tr = document.getElementById("nong-table-new").getElementsByTagName("tr");
                if (tr.length < 2) return;
                if (tr.length == 2) {
                    if ((/No search result/i).test(tr[1].firstChild.textContent)) clearInterval(clock_heike); // 搜索完成，结果为空
                    return;
                }
                clearInterval(clock_heike);
                for (var i = 0; i < tr.length; i++) {
                    let td = tr[i].lastChild.cloneNode(true);
                    if (i > 0) {
                        td.firstChild.firstChild.className = null;
                        td.firstChild.firstChild.textContent = '黑科云';
                        td.firstChild.firstChild.setAttribute('heike', true);
                        td.firstChild.firstChild.href = 'javascript:void(0);';
                        td.firstChild.firstChild.addEventListener("click", add_heike.click);
                    }
                    tr[i].appendChild(td);
                }
            },
            select : function () {
                clock_heike = setInterval(add_heike.wait_row, 1000);
            },
            click : function () {
                this.setAttribute("style","color:#999 !important");
                this.innerHTML = '跳转...';
                var maglink = this.parentNode.parentNode.getAttribute('maglink') || this.parentNode.parentNode.parentNode.getAttribute('maglink');
                Common.heike(maglink);
            }
        }
        var clock_heike = setInterval(add_heike.wait_table, 1000);

        setInterval(replace_dmm_video, 1000);
        // 替换dmm.co.jp网址
        function replace_dmm_video() {
            var list = document.body.getElementsByTagName("iframe");
            for (var i = 0; i < list.length; i++) {
                if (!list[i].getAttribute("ok") || (/^(https?\:\/\/(?:www\.)?)dmm.co.jp(\/.*)$/i).test(list[i].src)) {
                    list[i].setAttribute("ok", true);
                    list[i].setAttribute("allowfullscreen", true);
                    list[i].setAttribute("allowtransparency", true);
                    list[i].src = (list[i].src.replace(/^(https?\:\/\/(?:www\.)?)dmm.co.jp(\/.*)$/i, "$1dmm.com$2"));
                }
            }
        }
    } else if (document.title.search(/btsow/i) >= 0 && location.pathname.substr(0,7) == '/search') {
        //////////////////////////
        //                      //
        //        btsow         //
        //                      //
        //////////////////////////

        btsow_list();

        function btsow_list() {
            var list = document.body.getElementsByClassName("data-list")[0].getElementsByTagName("a");
            var r = new RegExp(/^.*\/hash\/([\d\w]{20,40})$/i);
            for (var i = 0; i < list.length; i++) {
                var a = list[i];
                var hash = r.exec(a.href);
                if (hash.length != 2) continue;
                var link = "magnet:?xt=urn:btih:" + hash[1];
                var Button = document.createElement("button");
                Button.setAttribute("type", "button");
                Button.setAttribute("style", "width:100px;height:26px;line-hight:26px;overflow:hidden;margin-left:12px;");
                Button.setAttribute("link", link);
                Button.innerHTML = "复制磁链";
                Button.addEventListener("click", function(){
                    GM.setClipboard(this.getAttribute("link"));
                    var btn = this
                    var txt = this.innerHTML;
                    this.innerHTML = txt + " OK";
                    setTimeout(function(){btn.innerHTML=txt}, 1000);
                }, false);
                a.nextSibling.nextSibling.insertBefore(Button, a[i]);
                a.nextSibling.nextSibling.style.width = '18%';
                a.nextSibling.nextSibling.nextSibling.nextSibling.style.width = '10%';
                a.getElementsByTagName("div")[0].style.width = '72%';
            }
        }
    } else if (location.host.search(/zhongzijun\.com/i) >= 0 && location.pathname.substr(0,5) == '/list') {
        //////////////////////////
        //                      //
        //      zhongziso       //
        //                      //
        //////////////////////////

        click_copy();

        function click_copy() {
            var list = document.body.getElementsByClassName("ls-magnet");
            for (var i = 0; i < list.length; i++) {
                var a = list[i].getElementsByTagName("a");
                a[0].addEventListener("click", function(e){
                    GM.setClipboard(this.getAttribute("href"));
                    var btn = this
                    var txt = this.innerHTML;
                    this.innerHTML = txt + " OK";
                    setTimeout(function(){btn.innerHTML=txt}, 1000);
                    e.preventDefault();
                }, false);
            }
        }
    } else if (document.title.search(/fast torrent/i) >= 0) {
        //////////////////////////
        //                      //
        //     fast torrent     //
        //                      //
        //////////////////////////

	    add_button();

	    function add_button() {
            var a = document.body.getElementsByTagName("a");
            for (var i = 0; i < a.length; i++) {
                if (a[i].href.substring(0,20).toLowerCase() != "magnet:?xt=urn:btih:") continue;
                var Button = document.createElement("a");
                Button.setAttribute("class", "uk-button");
                Button.setAttribute("style", "color:red;");
                Button.setAttribute("link", a[i].href);
                Button.innerHTML = "复制磁链";
                Button.addEventListener("click", function(){
                    GM.setClipboard(this.getAttribute("link"));
                    var btn = this
                    var txt = this.innerHTML;
                    this.innerHTML = txt + " OK";
                    setTimeout(function(){btn.innerHTML=txt}, 1000);
                }, false);
                a[i].parentNode.appendChild(Button);
                break;
		    }
		}
    } else if (document.title.search(/xp1024\.com/i) >= 0) {
        //////////////////////////
        //                      //
        //      xp1024.com      //
        //                      //
        //////////////////////////

	    add_button();

	    function add_button() {
            var a = document.getElementById("read_tpc").getElementsByTagName("a");
            var r = new RegExp(/^https?:\/\/[^\/]+\/torrent\/([\d\w]{20,40})$/i);
            for (var i = 0; i < a.length; i++) {
                var hash = r.exec(a[i].href);
                if (hash.length != 2) continue;
                var link = "magnet:?xt=urn:btih:" + hash[1];
                var Button = document.createElement("button");
                Button.setAttribute("type", "button");
                Button.setAttribute("style", "width:150px;height:40px;line-hight:40px;overflow:hidden;margin-right:20px;color:red;");
                Button.setAttribute("link", link);
                Button.innerHTML = "复制磁链";
                Button.addEventListener("click", function(){
                    GM.setClipboard(this.getAttribute("link"));
                    var btn = this
                    var txt = this.innerHTML;
                    this.innerHTML = txt + " OK";
                    setTimeout(function(){btn.innerHTML=txt}, 1000);
                }, false);
                a[i].parentNode.insertBefore(Button, a[i]);
		    }
	    }
    } else if (location.host.search(/lovebb\d+\.com/i) >= 0) {
        //////////////////////////
        //                      //
        //       LoveBB         //
        //                      //
        //////////////////////////

        replace_play();

        // 替换播放网址，跳过展示页
        function replace_play() {
            var list = document.body.getElementsByTagName("a");
            for (var i = 0; i < list.length; i++) {
                if ((/^(.*)\/show\/(\d+\.html)$/i).test(list[i].href)) {
                    list[i].href = (list[i].href.replace(/^(.*)\/show\/(\d+\.html)$/i, "$1/play/$2"));
                }
            }
        }
    }

})();
