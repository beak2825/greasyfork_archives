// ==UserScript==
// @name         weibofanhei
// @description  for lixian fanhei
// @version      1.2
// @namespace    http://tampermonkey.net/
// @include      https://m.weibo.cn/detail/*
// @include      https://m.weibo.cn/status/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.staticfile.org/toastr.js/latest/toastr.min.js
// @include      https://service.account.weibo.com/*
// @downloadURL https://update.greasyfork.org/scripts/396465/weibofanhei.user.js
// @updateURL https://update.greasyfork.org/scripts/396465/weibofanhei.meta.js
// ==/UserScript==

(function () {
    /* 判断是否该执行 */
    const whiteList = ['m.weibo.cn/detail','m.weibo.cn/status','service.account.weibo.com/reportspamobile'];
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    const indexPath = pathname.substr(1).indexOf('/')
    const projectName = (indexPath == -1) ? pathname : pathname.substring(0, indexPath + 1);
    const finalName = hostname + projectName;
    console.log(finalName);
    const thispath = whiteList.indexOf(finalName);
    if (thispath < 0){
      console.log("Not WhiteList");
      return;
    }
    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.href = 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.css';
    document.head.appendChild(link2);
    console.log("READY")

    setTimeout(function () {
        console.log("HELLO")
        function getStyle(obj, styleName) {
            if (obj.currentStyle) {
                return obj.currentStyle[styleName];
            } else {
                return getComputedStyle(obj, null)[styleName];
            }
        }
        toastr.options = {
            timeOut: "8000",
        };
        var ale = 0
        var ok = 0
        var repeat = 0
        var inexistence = 0
        var nowhost = window.location.host;
        console.log(nowhost);
        whatPage(nowhost);

        function whatPage(host){
            if (nowhost == "service.account.weibo.com") {
                toastr.warning("跳转成功")
                $('#toast-container').css("font-size","medium");
                var search = window.location.search;
                var mytypes = getSearchString('mytypes', search);
                var mylinks = getSearchString('mylinks', search);
                console.log(mytypes)
                console.log(mylinks)
                console.log("getData")
                for (var j = 0; j < mylinks.length; j++) {
                    getData(mylinks.length, mytypes, mylinks[j]);
                }
            } else {
                toastr.info("初始化")
                getList();
            }
        }

        function getSearchString(key, Url) {
            var str = Url;
            str = str.substring(1, str.length);
            var arr = str.split("&");
            var obj = new Object();
            for (var i = 0; i < arr.length; i++) {
                var tmp_arr = arr[i].split("=")
                var tmp_arr_emp_list = [];
                var tmp_arr_emp = decodeURIComponent(tmp_arr[1]).split(",");
                for (var j = 0; j < tmp_arr_emp.length; j++) {
                    tmp_arr_emp_list.push(tmp_arr_emp[j])
                }
                obj[decodeURIComponent(tmp_arr[0])] = tmp_arr_emp_list;
            }
            return obj[key];
        }

        function getSearchStringForList(key, Url) {
            var str = Url;
            var arr = str.split("&");
            var obj = new Object();
            for (var i = 0; i < arr.length; i++) {
                var tmp_arr = arr[i].split("=");
                obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
            }
            return obj[key];
        }

        function getList() {
            var lxuid = document.getElementsByTagName('h3');
            var fhz = lxuid[0].parentNode.href.search("6437234139");
            var lx = (fhz != -1)
            if (lx) {
                console.log("LX")
                var html = getWeiboText();
                var a = html.getElementsByTagName('a');

                var linkTemp = [];
                var link = []
                for (var i = 0; i < a.length; i++) {
                    var temp = a[i].href
                    if (temp.search("service") != -1 && temp.search("myexposures") == -1) {
                        if(a[i].nextSibling.textContent != ""){
                            temp = temp+a[i].nextSibling.textContent
                        }
                        linkTemp.push(temp)
                    }
                }
                for (var n =0; n<linkTemp.length; n++){
                    var search = linkTemp[n].split('?')[1]
                    var rid = getSearchStringForList("rid",search)
                    var type = getSearchStringForList("type",search)
                    var formenLink = "https://service.account.weibo.com/reportspamobile?rid=" + rid + "&type=" + type + "&from=40000";
                    link.push(formenLink)
                }
                var types = getTypes()
                var num = link.length
                var lxurl =link[0] + "&mytypes=" + escape(types) + "&mylinks=" + escape(link);
                console.log(lxurl)
                toastr.success("共" + link.length + "条待举报 即将跳转")
                setTimeout(function () {
                    window.open(lxurl,'_self')
                }, 1500)
            } else {
                console.log("NOT LX")
                toastr.error("非反黑微博")
            }
        }

        function getTypes() {
            var textclass = document.getElementsByClassName("weibo-text");
            var textInter = textclass[0].innerHTML;

            var lj_rz = textInter.search("垃圾-认证") != -1
            var lj_at = textInter.search("垃圾-@") != -1
            var lj_yh = textInter.search("垃圾-用户") != -1
            var lj_tx = textInter.search("垃圾-头像") != -1
            var lj_jj = textInter.search("垃圾-简介") != -1
            var lj_xx = textInter.search("垃圾-信息") != -1
            var lj_gg = textInter.search("垃圾-广告") != -1
            var lj_qt = textInter.search("垃圾-其他") != -1
            var sh_ds = textInter.search("涉h-低俗") != -1
            var sh_sq = textInter.search("涉h-s情") != -1
            var sh_nc = textInter.search("涉h-昵称") != -1
            var bs_bz = textInter.search("不实-不在") != -1
            var rs_gj = textInter.search("人身-人身攻击") != -1
            var yh_bk = textInter.search("有害-bk") != -1
            var yh_qt = textInter.search("有害-其他") != -1
            var wf_sm = textInter.search("违f-售m") != -1

            var types = []

            if (lj_rz) {
                toastr.warning("垃圾营销-卖粉丝认证")
                types.push(101);
            }
            if (lj_at) {
                toastr.warning("垃圾营销-广告信息@我")
                types.push(102);
            }
            if (lj_yh) {
                toastr.warning("垃圾营销-广告用户关注我")
                types.push(103);
            }
            if (lj_tx) {
                toastr.warning("垃圾营销-头像垃圾内容")
                types.push(104);
            }
            if (lj_jj) {
                toastr.warning("垃圾营销-昵称简介广告")
                types.push(105);
            }
            if (lj_xx) {
                toastr.warning("垃圾营销-广告信息")
                types.push(106);
            }
            if (lj_gg) {
                toastr.warning("垃圾营销-昵称头像广告")
                types.push(107);
            }
            if (lj_qt) {
                toastr.warning("垃圾营销-其他广告")
                types.push(108);
            }
            if (sh_ds) {
                toastr.warning("涉黄信息-低俗信息")
                types.push(202);
            }
            if (sh_sq) {
                toastr.warning("涉黄信息-色情图文")
                types.push(204);
            }
            if (sh_nc) {
                toastr.warning("涉黄信息-头像昵称违规")
                types.push(207);
            }
            if (bs_bz) {
                toastr.warning("不实信息-不在以上分类")
                types.push(504);
            }
            if (rs_gj) {
                toastr.warning("人身攻击-人身攻击我")
                types.push(601);
            }
            if (yh_bk) {
                toastr.warning("有害信息-暴恐血腥")
                types.push(801);
            }
            if (yh_qt) {
                toastr.warning("有害信息-其他有害信息")
                types.push(804);
            }
            if (wf_sm) {
                toastr.warning("违法信息-售卖个人信息")
                types.push(1507);
            }
            if (types.length == 0) {
                toastr.warning("未能在博文中找到举报类型，默认其他有害")
                types.push(804);
            }
            return types
        }

        function getWeiboText() {
            var textclass = document.getElementsByClassName("weibo-text");
            var textInter = textclass[0].innerHTML;
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(textInter, "text/html");
            return htmlDoc
        }

        function getData(numlink, types, url) {
            $.ajax({
                type: 'GET',
                url: url,
                success: function (response) {
                    var text = response;
                    var parser = new DOMParser();
                    var htmlDoc = parser.parseFromString(text, "text/html");
                    var extraData = htmlDoc.getElementById('extra_data').value;
                    for (var m = 0; m < types.length; m++) {
                        var category = types[m].toString().slice(0, -2);
                        var data
                        var rsReson
                        if (types[m] == 601) {
                            rsReson = "&extra=%E8%AF%A5%E7%94%A8%E6%88%B7%E6%81%B6%E6%84%8F%E4%BA%BA%E8%BA%AB%E6%94%BB%E5%87%BB%E8%89%BA%E4%BA%BA%E6%9D%8E%E7%8E%B0%EF%BC%8C%E6%8D%8F%E9%80%A0%E6%95%A3%E5%B8%83%E8%99%9A%E5%81%87%E6%B6%88%E6%81%AF%EF%BC%8C%E8%BF%9B%E8%A1%8C%E6%81%B6%E6%84%8F%E8%BE%B1%E9%AA%82%E3%80%81%E7%94%A8%E8%AF%8D%E7%9B%B8%E5%BD%93%E6%81%B6%E5%8A%A3%EF%BC%8C%E5%AF%B9%E6%9D%8E%E7%8E%B0%E4%B8%AA%E4%BA%BA%E5%90%8D%E8%AA%89%E9%80%A0%E6%88%90%E9%9D%9E%E5%B8%B8%E6%81%B6%E5%8A%A3%E7%9A%84%E5%BD%B1%E5%93%8D%EF%BC%8C%E5%BE%AE%E5%8D%9A%E6%98%AF%E4%B8%80%E4%B8%AA%E5%A4%A7%E4%BC%97%E5%8C%96%E7%9A%84%E5%B9%B3%E5%8F%B0%E6%9C%89%E7%9D%80%E5%B9%BF%E5%A4%A7%E7%9A%84%E5%BD%B1%E5%93%8D%E5%8A%9B%EF%BC%8C%E5%AF%B9%E4%BA%8E%E6%81%B6%E6%84%8F%E4%BA%BA%E8%BA%AB%E6%94%BB%E5%87%BB%E8%AF%B7%E5%8A%A1%E5%BF%85%E4%B8%A5%E8%82%83%E5%A4%84%E7%90%86%EF%BC%8C%E8%B0%A2%E8%B0%A2%E3%80%82&blackUser=1"
                            data = "category=" + category + "&tag_id=" + types[m] + "&" + extraData + rsReson + "&appGet=0&weiboGet=0&blackUser=0&_t=0";
                        } else if (types[m] == 504) {
                            rsReson = "&extra=%E6%AD%A4%E5%BE%AE%E5%8D%9A%E6%8D%8F%E9%80%A0%E4%B8%8D%E5%AE%9E%E4%BF%A1%E6%81%AF%EF%BC%8C%E6%81%B6%E6%84%8F%E6%95%A3%E5%B8%83%EF%BC%8C%E6%89%AD%E6%9B%B2%E4%BA%8B%E5%AE%9E%EF%BC%8C%E5%AF%B9%E8%89%BA%E4%BA%BA%E8%BF%9B%E8%A1%8C%E4%BA%BA%E8%BA%AB%E6%94%BB%E5%87%BB%EF%BC%8C%E9%80%A0%E6%88%90%E4%BA%86%E6%81%B6%E5%8A%A3%E5%BD%B1%E5%93%8D%EF%BC%8C%E4%B8%A5%E9%87%8D%E4%BE%B5%E7%8A%AF%E4%BA%86%E8%89%BA%E4%BA%BA%E7%9A%84%E5%90%8D%E8%AA%89%E6%9D%83%E3%80%82%E5%90%8C%E6%97%B6%E8%AF%A5%E7%94%A8%E6%88%B7%E7%9A%84%E4%BD%8E%E4%BF%97%E8%A8%80%E8%AE%BA%E4%B8%A5%E9%87%8D%E5%8D%B1%E5%AE%B3%E6%9C%AA%E6%88%90%E5%B9%B4%E7%BD%91%E5%8F%8B%E8%BA%AB%E5%BF%83%E5%81%A5%E5%BA%B7%EF%BC%8C%E4%B8%A5%E9%87%8D%E8%BF%9D%E5%8F%8D%E4%BA%86%E3%80%8A%E5%BE%AE%E5%8D%9A%E7%A4%BE%E5%8C%BA%E7%AE%A1%E7%90%86%E8%A7%84%E5%AE%9A(%E8%AF%95%E8%A1%8C)%E3%80%8B%EF%BC%8C%E4%B8%A5%E9%87%8D%E7%A0%B4%E5%9D%8F%E7%BD%91%E7%BB%9C%E6%B2%BB%E5%AE%89%E7%8E%AF%E5%A2%83%E3%80%82%E8%AF%B7%E5%B0%BD%E5%BF%AB%E4%B8%A5%E8%82%83%E5%A4%84%E7%90%86%EF%BC%8C%E8%B0%A2%E8%B0%A2%E3%80%82"
                            data = "category=" + category + "&tag_id=" + types[m] + "&" + extraData + rsReson + "&appGet=0&weiboGet=0&blackUser=0&_t=0";
                        } else {
                            data = "category=" + category + "&tag_id=" + types[m] + "&" + extraData + "&appGet=0&weiboGet=0&blackUser=0&_t=0";
                        }
                        var numtype = types.length
                        report(numlink, numtype, m, url, data)
                        console.log('成功获得链接\n' + url + '\n' + data)
                    }
                },
                error: function (err) {
                    toastr.error("错误 " + err);
                    console.log("错误 " + err);
                }
            });
        }

        function report(numlink, numtype, indextype, referer, data) {
            var num = numlink * numtype;
            var timestamp = (new Date()).valueOf();
            var url = "https://service.account.weibo.com/aj/reportspamobile?__rnd=" + timestamp;
            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-Requested-With": "XMLHttpRequest"
                },
                success: function (response) {
                    if (indextype == 0) {
                        var code = JSON.parse(response).code;
                        if (code == 100000) {
                            ok++
                        }
                        if (code == 100003) {
                            repeat++
                        }
                        if (code == 100009) {
                            inexistence++
                        }
                    }
                    var txtRse = unescape(response.replace(/\\u/g, '%u'))
                    console.log('成功提交举报\n' + referer + '\n' + txtRse);
                    ale++
                    if (ale == num) {
                        toastr.info(ok + "条成功反黑");
                        toastr.info(repeat + "条反黑重复");
                        toastr.info(inexistence + "条已不存在");
                        toastr.success("本条反黑完成哦耶！");
                    }

                },
                onerror: function (err) {
                    console.log("错误 " + err);
                    if (ale == 0) {
                        ale = 1;
                        toastr.error("错误 " + err);
                    }
                }
            });
        }
    }, 2000)
})();