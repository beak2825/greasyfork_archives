// ==UserScript==
// @name THZ
// @namespace THZ
// @version 20181027.03
// @description THZ for myself
// @homepageURL https://greasyfork.org/zh-CN/users/186552-wotmcaishiguachazhe
// @require http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.4.min.js
// @include http://*
// @include https://*


// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/372915/THZ.user.js
// @updateURL https://update.greasyfork.org/scripts/372915/THZ.meta.js
// ==/UserScript==


var tlzurl="http://thzw.cc/";
var ignoreExistCheck = false;
$(document).ready(function() {

    if (document.title.indexOf('AVMOO') != -1) {
        linkNode = $('.info').find('span:eq(1)');
        var link = "http://192.168.0.18/?search=" + linkNode.text() + "|" + linkNode.text().replace("-", "");
        linkNode.after('<span><a target="_blank" href="' + link + '">!!!' + linkNode.text() + '!!!</a></span>');
    }
    if (document.title.indexOf('色花堂') != -1 && document.title.indexOf('有码') != -1) {
        if ($("#threadlist").length > 0) {
            if (confirm("HAHAHAHAHAHA!")) {
                $("tbody").each(function() {
                    var iid = $(this).attr('id');
                    if (iid && iid.indexOf('normalthread') != -1) {
                        var href = $(this).find('a.s.xst').attr('href');
                        var txt = $(this).find('a.s.xst').text();
                        txt = txt.replace(/\[[a-zA-Z0-9 \.\/\[\]]*\]/, "");

                        if (txt.indexOf("最新Real Street Angels ") != -1) {
                            txt = txt.replace(/最新Real Street Angels /, "");
                        }

                        if (txt.indexOf("【") != -1) {
                            txt = txt.replace(/【/, " ");
                        }
                        if (txt.indexOf(" ") == -1) {
                            txt = txt.replace(/[^a-zA-Z0-9-]/g, "");
                        } else {
                            txt = txt.substring(0, txt.indexOf(" "));
                        }
                        if (txt.indexOf("-") == -1) {
                            txt = txt.replace(/([a-zA-Z]+)/, "$1-");
                        }
                        if(ignoreExistCheck){
                            window.open("https://www.98lst.space/" + href);
                        } else {
		                        link = "http://192.168.0.18/?search=" + txt + "|" + txt.replace("-", "");
		                        console.log(link);
		                        GM_xmlhttpRequest({
		                            method: "GET",
		                            //大图地址
		                            url: link,
		                            onload: function(result) {
		                                var doc = Common.parsetext(result.responseText);
		                                if ($(doc).find(".numresults").text() == "0 个结果") {

		                                    window.open("https://www.98lst.space/" + href);
		                                }
		                            },
		                            onerror: function(e) {
		                                console.log(e);
		                            }
		                        }); //end  GM_xmlhttpRequest
                       }
                    }

                });
            }
        } else {
            var title = document.title;
            title = title.replace(/\[[a-zA-Z0-9 \.\/\[\]]*\]/, "");
            console.log(title);


            if (title.indexOf("最新Real Street Angels ") != -1) {
                title = title.replace(/最新Real Street Angels /, "");
            }
            if (title.indexOf("【") != -1) {
                title = title.replace(/【/, " ");
            }

            if (title.indexOf(" ") == -1) {
                title = title.replace(/[^a-zA-Z0-9-]/g, "");
            } else {
                title = title.substring(0, title.indexOf(" "));
            }
            if (title.indexOf("-") == -1) {
                title = title.replace(/([a-zA-Z]+)/, "$1-");
            }
            console.log(title);

            link = "http://192.168.0.18/?search=" + title + "|" + title.replace("-", "");

            Common.addAvImg(title, function($img) {
                var divEle = $("div[class='pattl']");
                console.log(divEle);
                if (divEle) {
                    $(divEle).append($img);
                }
            });
        }
    }
    if (document.title.indexOf('高清下载吧') != -1 && document.title.indexOf('无码') != -1) {
        if ($("#postlist").length == 0) {
            if (confirm("HAHAHAHAHAHA!")) {
                $("tbody").each(function() {
                    var iid = $(this).attr('id');
                    if (iid && iid.indexOf('normalthread') != -1) {
                        var href = $(this).find('a.s.xst').attr('href');
                        var txt = $(this).find('a.s.xst').text();
                        if(txt.indexOf("HEYZO") != -1){
                            txt = txt.match(/HEYZO \d{4}/)[0];
                        } else if(txt.indexOf("fc2") != -1){
                            if(txt.indexOf("fc2-ppv") != -1){
                                txt = txt.replace("fc2-ppv", "fc2-");
                            }
                            if(txt.match(/fc2-\d{6}/)){
                               txt = txt.match(/fc2-\d{6}/)[0];
                               txt = txt.replace("fc2-", "");
                            }
                        } else if(txt.indexOf("FC2-PPV") != -1){
                            txt = txt.match(/FC2-PPV[ -]\d{6}/)[0];
                            txt = txt.replace(/FC2-PPV[ -]/, "");
                        } else if(txt.indexOf("一本道") != -1){
                            txt = txt.match(/\d{6}_\d{3}/)[0];
                        }else if(txt.indexOf("加勒比") != -1 || txt.indexOf("カリビアンコム") != -1){
                            if(txt.match(/\d{6}-\d{3}/)){
                                txt = txt.match(/\d{6}-\d{3}/)[0];
                            }
                        } else if(txt.indexOf("天然むすめ") != -1){
                            if(txt.match(/\d{6}_\d{2}/)){
                                txt = txt.match(/\d{6}_\d{2}/)[0];
                            }
                        } else if(txt.indexOf("pacopaco") != -1|| txt.indexOf("パコパコ") != -1){
                            if(txt.match(/\d{6}_\d{3}/)){
                                txt = txt.match(/\d{6}_\d{3}/)[0];
                            }
                        } else if(txt.indexOf("heydouga") != -1){
                            txt = txt.match(/\d{4}-\d{3,4}/)[0];
                        } else if(txt.indexOf("Tokyo") != -1 && txt.indexOf("Hot") != -1){
                            if(txt.match(/n\d{4}/)){
                                txt = txt.match(/n\d{4}/)[0];
                            }else if(txt.match(/SKY-\d{3}/)){
                                txt = txt.match(/SKY-\d{3}/)[0];
                            }else{
                            }
                        } else {
                            //txt = txt.replace(/\[[a-zA-Z0-9 \.\/\[\]]*\]/, "");
                        }
                        if(ignoreExistCheck){
                            window.open("https://www.kan224.com/" + href);
                        } else {
                            link = "http://192.168.0.18/?search=" + txt + "|" + txt.replace("-", "_")+ "|" + txt.replace("_", "-");
                            console.log(link);
                            GM_xmlhttpRequest({
                                method: "GET",
                                //大图地址
                                url: link,
                                onload: function(result) {
                                    var doc = Common.parsetext(result.responseText);
                                    if ($(doc).find(".numresults").text() == "0 个结果") {
                                        window.open("https://www.kan224.com/" + href);
                                    }
                                },
                                onerror: function(e) {
                                    console.log(e);
                                }
                            }); //end  GM_xmlhttpRequest
                        }
                    }
                });
            }
        }else{
            var txt = document.title;
            if(txt.indexOf("HEYZO") != -1){
                            txt = txt.match(/HEYZO \d{4}/)[0];
                        } else if(txt.indexOf("fc2") != -1){
                            if(txt.match(/fc2-\d{6}/)){
                               txt = txt.match(/fc2-\d{6}/)[0];
                            txt = txt.replace("fc2-", "");
                            }
                        } else if(txt.indexOf("FC2-PPV") != -1){
                            txt = txt.match(/FC2-PPV[ -]\d{6}/)[0];
                            txt = txt.replace(/FC2-PPV[ -]/, "");
                        } else if(txt.indexOf("一本道") != -1){
                            txt = txt.match(/\d{6}_\d{3}/)[0];
                        }else if(txt.indexOf("加勒比") != -1 || txt.indexOf("カリビアンコム") != -1){
                            if(txt.match(/\d{6}-\d{3}/)){
                                txt = txt.match(/\d{6}-\d{3}/)[0];
                            }
                        } else if(txt.indexOf("天然むすめ") != -1){
                            if(txt.match(/\d{6}_\d{2}/)){
                                txt = txt.match(/\d{6}_\d{2}/)[0];
                            }
                        } else if(txt.indexOf("pacopaco") != -1|| txt.indexOf("パコパコ") != -1){
                            if(txt.match(/\d{6}_\d{3}/)){
                                txt = txt.match(/\d{6}_\d{3}/)[0];
                            }
                        } else if(txt.indexOf("heydouga") != -1){
                            txt = txt.match(/\d{4}-\d{3,4}/)[0];
                        } else if(txt.indexOf("Tokyo") != -1 && txt.indexOf("Hot") != -1){
                            if(txt.match(/n\d{4}/)){
                                txt = txt.match(/n\d{4}/)[0];
                            }else if(txt.match(/SKY-\d{3}/)){
                                txt = txt.match(/SKY-\d{3}/)[0];
                            }else{
                            }
                        } else {
                            //txt = txt.replace(/\[[a-zA-Z0-9 \.\/\[\]]*\]/, "");
                        }


            Common.addAvImg(txt, function($img) {
                var divEle = $("div[class='pattl']");
                if (divEle) {
                    $(divEle).append($img);
                }
            });
        }
    }

    if (document.title.indexOf('高清下载吧') != -1 && document.title.indexOf('有码') != -1) {
        if ($("#postlist").length == 0) {
            if (confirm("HAHAHAHAHAHA!")) {
                $("tbody").each(function() {
                    var iid = $(this).attr('id');
                    if (iid && iid.indexOf('normalthread') != -1) {
                        var href = $(this).find('a.s.xst').attr('href');
                        var txt = $(this).find('a.s.xst').text();
                        txt = txt.replace(/\[[a-zA-Z0-9 \.\/\[\]]*\]/, "");

                        if (txt.indexOf("最新Real Street Angels ") != -1) {
                            txt = txt.replace(/最新Real Street Angels /, "");
                        }

                        if (txt.indexOf("【") != -1) {
                            txt = txt.replace(/【/, " ");
                        }
                        if (txt.indexOf(" ") == -1) {
                            txt = txt.replace(/[^a-zA-Z0-9-]/g, "");
                        } else {
                            txt = txt.substring(0, txt.indexOf(" "));
                        }
                        if (txt.indexOf("-") == -1) {
                            txt = txt.replace(/([a-zA-Z]+)/, "$1-");
                        }
                        if(ignoreExistCheck){
                            window.open("https://www.kan224.com/" + href);
                        } else {
		                        link = "http://192.168.0.18/?search=" + txt + "|" + txt.replace("-", "");
		                        console.log(link);
		                        GM_xmlhttpRequest({
		                            method: "GET",
		                            //大图地址
		                            url: link,
		                            onload: function(result) {
		                                var doc = Common.parsetext(result.responseText);
		                                if ($(doc).find(".numresults").text() == "0 个结果") {

		                                    window.open("https://www.kan224.com/" + href);
		                                }
		                            },
		                            onerror: function(e) {
		                                console.log(e);
		                            }
		                        }); //end  GM_xmlhttpRequest
                       }
                    }

                });
            }
        } else {
            var title = document.title;
            title = title.replace(/\[[a-zA-Z0-9 \.\/\[\]]*\]/, "");
            console.log(title);


            if (title.indexOf("最新Real Street Angels ") != -1) {
                title = title.replace(/最新Real Street Angels /, "");
            }
            if (title.indexOf("【") != -1) {
                title = title.replace(/【/, " ");
            }

            if (title.indexOf(" ") == -1) {
                title = title.replace(/[^a-zA-Z0-9-]/g, "");
            } else {
                title = title.substring(0, title.indexOf(" "));
            }
            if (title.indexOf("-") == -1) {
                title = title.replace(/([a-zA-Z]+)/, "$1-");
            }
            console.log(title);

            link = "http://192.168.0.18/?search=" + title + "|" + title.replace("-", "");

            Common.addAvImg(title, function($img) {
                var divEle = $("div[class='pattl']");
                if (divEle) {
                    $(divEle).append($img);
                }
            });
        }
    }




    if (document.title.indexOf('SexInSex') != -1 && document.title.indexOf('无码') != -1) {
        if ($("#headfilter").length > 0) {
            if (confirm("GOGOGO!")) {
                var htmlStr2 = $('form').html();
                htmlStr2 = htmlStr2.replace(/<tbody.{1,30}>/g, "").replace(/<tbody>/g, "").replace(/<\/tbody>/g, "");
                htmlStr2 = htmlStr2.replace(/<thead class.{1,30}>/g, "").replace(/<thead>/g, "").replace(/<\/thead>/g, "");
                htmlStr2 = htmlStr2.replace(/<\/table><table.{1,70}>/g, "");
                htmlStr2 = htmlStr2.replace("</td><td colspan=\"6\">", "");
                htmlStr2 = htmlStr2.replace("</td></tr>", "");
                htmlStr2 = htmlStr2.replace(/<!-- 三級置頂分開 -->/g, "");
                htmlStr2 = htmlStr2.replace(/<input.{1,50}>/g, "");
                $('form').replaceWith("<form>" + htmlStr2 + "</form>");
                htmlStr2 = $("form").find('table').find('tbody').html();
                $(htmlStr2).find('span').each(function() {
                    var href = $(this).find('a').attr('href');
                    var txt = $(this).find('a').text();
//                     if(txt.indexOf("HEYZO") != -1){
//                         txt = txt.match(/HEYZO \d{4}/)[0];
//                     } else if(txt.indexOf("heyzo") != -1){
//                         txt = txt.match(/heyzo[ _]\d{4}/)[0];
//                         txt = txt.replace(/heyzo[ _]/, "heyzo ");
//                     } else if(txt.indexOf("fc2ppv") != -1){
//                         txt = txt.match(/fc2ppv_\d{6}/)[0];
//                         txt = txt.replace("fc2ppv_", "");
//                     } else if(txt.indexOf("FC2 PPV") != -1){
//                         txt = txt.match(/FC2 PPV[ -]\d{6}/)[0];
//                         txt = txt.replace(/FC2 PPV[ -]/, "");
//                     } else if(txt.indexOf("pacopaco") != -1|| txt.indexOf("パコパコ") != -1){
//                         txt = txt.match(/\d{6}_\d{3}/)[0];
//                     } else if(txt.indexOf("heydouga") != -1){
//                         txt = txt.match(/\d{4}-\d{3,4}/)[0];
//                     } else if(txt.indexOf("Tokyo") != -1 && txt.indexOf("Hot") != -1){
//                         if(txt.match(/n\d{4}/)){
//                             txt = txt.match(/n\d{4}/)[0];
//                         }else if(txt.match(/SKY-\d{3}/)){
//                             txt = txt.match(/SKY-\d{3}/)[0];
//                         }else{
//                             txt = "";
//                         }
//                     } else {
//                         txt = "";
//                     }
                    if(txt){
                        if(ignoreExistCheck){
                            window.open("http://www.sexinsex.net/bbs/" + href);
                        } else {
                            window.open("http://www.sexinsex.net/bbs/" + href);
// 		                        link = "http://192.168.0.18/?search=" + txt + "|" + txt.replace("-", "_")+ "|" + txt.replace("_", "-");
// 		                        console.log(link);
// 		                        GM_xmlhttpRequest({
// 		                            method: "GET",
// 		                            //大图地址
// 		                            url: link,
// 		                            onload: function(result) {
// 		                                var doc = Common.parsetext(result.responseText);
// 		                                if ($(doc).find(".numresults").text() == "0 个结果") {
// 		                                    window.open("http://www.sexinsex.net/bbs/" + href);
// 		                                }
// 		                            },
// 		                            onerror: function(e) {
// 		                                console.log(e);
// 		                            }
// 		                        }); //end  GM_xmlhttpRequest
		                    }
                    }
                });
            }
        }else{
            txt = document.title;
            if(txt.indexOf("HEYZO") != -1){
                txt = txt.match(/HEYZO \d{4}/)[0];
            } else if(txt.indexOf("heyzo") != -1){
                txt = txt.match(/heyzo[ _]\d{4}/)[0];
                txt = txt.replace(/heyzo[ _]/, "heyzo ");
            } else if(txt.indexOf("fc2ppv") != -1){
                txt = txt.match(/fc2ppv_\d{6}/)[0];
                txt = txt.replace("fc2ppv_", "");
            } else if(txt.indexOf("FC2 PPV") != -1){
                txt = txt.match(/FC2 PPV[ -]\d{6}/)[0];
            } else if(txt.indexOf("pacopaco") != -1|| txt.indexOf("パコパコ") != -1){
                txt = txt.match(/\d{6}_\d{3}/)[0];
            } else if(txt.indexOf("heydouga") != -1){
                txt = txt.match(/\d{4}-\d{3,4}/)[0];
            } else if(txt.indexOf("Tokyo") != -1 && txt.indexOf("Hot") != -1){
                if(txt.match(/n\d{4}/)){
                    txt = txt.match(/n\d{4}/)[0];
                }else if(txt.match(/SKY-\d{3}/)){
                    txt = txt.match(/SKY-\d{3}/)[0];
                }else{
                    txt = "";
                }
            } else {
                txt = "";
            }
            title=txt;
            link = "http://192.168.0.18/?search=" + title + "|" + title.replace("-", "");

            var replaceNode = $(".postmessage.defaultpost > h2");
            replaceNode.replaceWith('<a target="_blank" href="' + link + '"><b>###' + replaceNode.text() + '###</b></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank" href="https://avmoo.xyz/ja/search/' + title + '"><b>' + title + '</b></a><br /><br /><br />');

//             Common.addAvImg(title, function($img) {
//                 //https://www.javbus.com/CHN-141
//                 var divEle = $("div[class='t_msgfont']");
//                 if (divEle) {
//                     $(divEle).append($img);
//                 }
//             });
        }
    }

    if (document.title.indexOf('SexInSex') != -1 && document.title.indexOf('有码') != -1) {
        if ($("#headfilter").length > 0) {
            if (confirm("Press a button!")) {
                var htmlStr = $('form').html();
                htmlStr = htmlStr.replace(/<tbody.{1,30}>/g, "").replace(/<tbody>/g, "").replace(/<\/tbody>/g, "");
                htmlStr = htmlStr.replace(/<thead class.{1,30}>/g, "").replace(/<thead>/g, "").replace(/<\/thead>/g, "");
                htmlStr = htmlStr.replace(/<\/table><table.{1,70}>/g, "");
                htmlStr = htmlStr.replace("</td><td colspan=\"6\">", "");
                htmlStr = htmlStr.replace("</td></tr>", "");
                htmlStr = htmlStr.replace(/<!-- 三級置頂分開 -->/g, "");
                htmlStr = htmlStr.replace(/<input.{1,50}>/g, "");

                $('form').replaceWith("<form>" + htmlStr + "</form>");
                htmlStr = $("form").find('table').find('tbody').html();

                $(htmlStr).find('span').each(function() {
                    var href = $(this).find('a').attr('href');
                    var txt = $(this).find('a').text();
                    txt = txt.replace(/\[[a-zA-Z0-9 \.\/\[\]]*\]/, "");

                    if (txt.indexOf("最新Real Street Angels ") != -1) {
                        txt = txt.replace(/最新Real Street Angels /, "");
                    }

                    if (txt.indexOf("【") != -1) {
                        txt = txt.replace(/【/, " ");
                    }
                    if (txt.indexOf(" ") == -1) {
                        txt = txt.replace(/[^a-zA-Z0-9-]/g, "");
                    } else {
                        txt = txt.substring(0, txt.indexOf(" "));
                    }
                    if (txt.indexOf("-") == -1) {
                        txt = txt.replace(/([a-zA-Z]+)/, "$1-");
                    }
                    console.log(txt);
                    if(ignoreExistCheck){
                        window.open("http://www.sexinsex.net/bbs/" + href);
                    } else {
		                    link = "http://192.168.0.18/?search=" + txt + "|" + txt.replace("-", "");
		                    GM_xmlhttpRequest({
		                        method: "GET",
		                        //大图地址
		                        url: link,
		                        onload: function(result) {
		                            var doc = Common.parsetext(result.responseText);
		                            if ($(doc).find(".numresults").text() == "0 个结果") {
		                                window.open("http://www.sexinsex.net/bbs/" + href);
		                            }
		                        },
		                        onerror: function(e) {
		                            console.log(e);
		                        }
		                    }); //end  GM_xmlhttpRequest
		                }
                });
            }
        } else if ($("#headfilter").length == 0) {
            title = document.title;
            title = title.replace(/\[[a-zA-Z0-9 \.\/\[\]]*\]/, "");
            console.log(title);


            if (title.indexOf("最新Real Street Angels ") != -1) {
                title = title.replace(/最新Real Street Angels /, "");
            }
            if (title.indexOf("【") != -1) {
                title = title.replace(/【/, " ");
            }

            if (title.indexOf(" ") == -1) {
                title = title.replace(/[^a-zA-Z0-9-]/g, "");
            } else {
                title = title.substring(0, title.indexOf(" "));
            }
            if (title.indexOf("-") == -1) {
                title = title.replace(/([a-zA-Z]+)/, "$1-");
            }
            console.log(title);

            link = "http://192.168.0.18/?search=" + title + "|" + title.replace("-", "");

            replaceNode = $(".postmessage.defaultpost > h2");
            replaceNode.replaceWith('<a target="_blank" href="' + link + '"><b>###' + replaceNode.text() + '###</b></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank" href="https://javfree.me/?s=' + title + '"><b>' + title + '</b></a><br /><br /><br />');

            Common.addAvImg(title, function($img) {
                //https://www.javbus.com/CHN-141
                var divEle = $("div[class='t_msgfont']");
                if (divEle) {
                    $(divEle).append($img);
                }
            });
        }
    }




if (document.title.indexOf('thz.la') != -1 && document.title.indexOf('亚洲有碼原創') != -1) {
    if ($("#threadlisttableid").length > 0) {
        if (confirm("Press a button!")) {
            var htmlStr11 = $('#threadlisttableid').html();
            htmlStr11 = htmlStr11.replace(/<tbody.{1,30}>/g, "").replace(/<tbody>/g, "").replace(/<\/tbody>/g, "");
            htmlStr11 = htmlStr11.replace(/<input.{1,50}>/g, "");

            $('#threadlisttableid').replaceWith("<table summary=\"forum_220\" cellspacing=\"0\" cellpadding=\"0\" id=\"threadlisttableid\">" + htmlStr11 + "</table>");
            htmlStr11 = $("#threadlisttableid").html();

            $(htmlStr11).find('tr').each(function() {
                var src = $(this).find('td.icn').find('img').attr('src');

                if (src && src.indexOf('folder_common.gif') != -1) {
                    var xst = $(this).find('th.common').find('a.xst');
                    var txt = xst.text();
                    var hrf = xst.attr('href');
                    //txt = txt.match(/\[[a-zA-Z0-9-]+\]/);
                    txt = txt.substring(txt.indexOf('[') + 1, txt.indexOf(']'));
                    //console.log(txt);
                    if(ignoreExistCheck){
                        window.open(tlzurl + hrf);
                    } else {
		                    link = "http://192.168.0.18/?search=" + txt + "|" + txt.replace("-", "");
		                    console.log(link);

		                    GM_xmlhttpRequest({
		                        method: "GET",
		                        url: link,
		                        onload: function(result) {
		                            var doc = Common.parsetext(result.responseText);
		                            if ($(doc).find(".numresults").text() == "0 个结果") {
		                                window.open(tlzurl + hrf);
		                            }
		                        },
		                        onerror: function(e) {
		                            console.log(e);
		                        }
		                    }); //end  GM_xmlhttpRequest
		                }
                }
            });
        }
    }
}
if (document.title.indexOf('thz.la') != -1 && document.title.indexOf('亚洲無碼原創') != -1) {
    if ($("#threadlisttableid").length > 0) {
        if (confirm("Press a button!")) {
            var htmlStr12 = $('#threadlisttableid').html();
            htmlStr12 = htmlStr12.replace(/<tbody.{1,30}>/g, "").replace(/<tbody>/g, "").replace(/<\/tbody>/g, "");
            htmlStr12 = htmlStr12.replace(/<input.{1,50}>/g, "");

            $('#threadlisttableid').replaceWith("<table summary=\"forum_220\" cellspacing=\"0\" cellpadding=\"0\" id=\"threadlisttableid\">" + htmlStr12 + "</table>");
            htmlStr12 = $("#threadlisttableid").html();

            $(htmlStr12).find('tr').each(function() {
                var src = $(this).find('td.icn').find('img').attr('src');

                if (src && src.indexOf('pin_') == -1) {
                    var xst = $(this).find('th.common').find('a.xst');
                    var txt = xst.text();
                    var hrf = xst.attr('href');


                    if(txt.indexOf("HEYZO") != -1){
                        txt = txt.match(/HEYZO \d{4}/)[0];
                    } else if(txt.indexOf("heyzo") != -1){
                        txt = txt.match(/heyzo_\d{4}/)[0];
                        txt = txt.replace("_", " ");
                    } else if(txt.indexOf("fc2ppv") != -1){
                        txt = txt.match(/fc2ppv_\d{6}/)[0];
                        txt = txt.replace("fc2ppv_", "");
                    } else if(txt.indexOf("FC2-PPV") != -1){
                        txt = txt.match(/FC2-PPV[ -]\d{6}/)[0];
                        txt = txt.replace(/FC2-PPV[ -]/, "");
                    } else if(txt.indexOf("一本道") != -1||txt.indexOf("1pon") != -1){
                        txt = txt.match(/\d{6}_\d{3}/)[0];
                    }else if(txt.indexOf("加勒比") != -1 || txt.indexOf("カリビアンコム") != -1||txt.indexOf("carib") != -1){
                        txt = txt.match(/\d{6}[-_]\d{3}/)[0];
                    } else if(txt.indexOf("天然むすめ") != -1||txt.indexOf("10mu") != -1){
                        txt = txt.match(/\d{6}_\d{2}/)[0];
                    } else if(txt.indexOf("pacopaco") != -1|| txt.indexOf("パコパコ") != -1|| txt.indexOf("paco") != -1){
                        txt = txt.match(/\d{6}_\d{3}/)[0];
                    } else if(txt.indexOf("heydouga") != -1){
                        txt = txt.match(/\d{4}-\d{3,4}/)[0];
                    } else if(txt.indexOf("Tokyo") != -1 && txt.indexOf("Hot") != -1){
                        if(txt.match(/n\d{4}/)){
                            txt = txt.match(/n\d{4}/)[0];
                        }else if(txt.match(/SKY-\d{3}/)){
                            txt = txt.match(/SKY-\d{3}/)[0];
                        }else{
                        }
                    } else {
                        //txt = txt.replace(/\[[a-zA-Z0-9 \.\/\[\]]*\]/, "");
                    }
                    console.log(txt);

                    if(ignoreExistCheck){
                        window.open(tlzurl + hrf);
                    } else {
		                    link = "http://192.168.0.18/?search=" + txt + "|" + txt.replace("-", "_")+ "|" + txt.replace("_", "-");
		                    //console.log(link);

		                    GM_xmlhttpRequest({
		                        method: "GET",
		                        url: link,
		                        onload: function(result) {
		                            var doc = Common.parsetext(result.responseText);
		                            if ($(doc).find(".numresults").text() == "0 个结果") {
		                                window.open(tlzurl + hrf);
		                            }
		                        },
		                        onerror: function(e) {
		                            console.log(e);
		                        }
		                    }); //end  GM_xmlhttpRequest
		                }
                }
            });
        }
    }
}

if (document.title.indexOf('thz.la') != -1) {
    if ($("#threadlisttableid").length == 0) {
        if($(".switchwidth").attr("title")=="切换到宽版"){
            $(".switchwidth").trigger('click');
        }
        var linkNode = $('p.attnm > a');
        if (linkNode.length != 0) {
            var orginLink = linkNode.attr('href');
            var pureLink = 'forum.php?mod=attachment&' + orginLink.substring(orginLink.indexOf('?') + 1);;
            linkNode.attr('href', pureLink);
            linkNode.removeAttr('onclick');
        }
        var pt = $('div#pt > div.z').text();
        if(pt.indexOf('亚洲無碼原創') != -1){
            title = document.title;
            txt = title;
            if(txt.indexOf("HEYZO") != -1){
                txt = txt.match(/HEYZO \d{4}/)[0];
            } else if(txt.indexOf("heyzo") != -1){
                txt = txt.match(/heyzo_\d{4}/)[0];
                txt = txt.replace("_", " ");
            } else if(txt.indexOf("fc2ppv") != -1){
                txt = txt.match(/fc2ppv_\d{6}/)[0];
            } else if(txt.indexOf("FC2-PPV") != -1){
                txt = txt.match(/FC2-PPV[ -]\d{6}/)[0];
            } else if(txt.indexOf("一本道") != -1||txt.indexOf("1pon") != -1){
                txt = txt.match(/\d{6}_\d{3}/)[0];
            }else if(txt.indexOf("加勒比") != -1 || txt.indexOf("カリビアンコム") != -1||txt.indexOf("carib") != -1){
                txt = txt.match(/\d{6}[-_]\d{3}/)[0];
            } else if(txt.indexOf("天然むすめ") != -1||txt.indexOf("10mu") != -1){
                txt = txt.match(/\d{6}_\d{2}/)[0];
            } else if(txt.indexOf("pacopaco") != -1|| txt.indexOf("パコパコ") != -1|| txt.indexOf("paco") != -1){
                txt = txt.match(/\d{6}_\d{3}/)[0];
            } else if(txt.indexOf("heydouga") != -1){
                txt = txt.match(/\d{4}-\d{3,4}/)[0];
            } else if(txt.indexOf("Tokyo") != -1 && txt.indexOf("Hot") != -1){
                if(txt.match(/n\d{4}/)){
                    txt = txt.match(/n\d{4}/)[0];
                    txt = "Tokyo-Hot"+txt;
                }else if(txt.match(/SKY-\d{3}/)){
                    txt = txt.match(/SKY-\d{3}/)[0];
                }else{
                }
            } else {
                //txt = txt.replace(/\[[a-zA-Z0-9 \.\/\[\]]*\]/, "");
            }
            title = txt;
            console.log(title);
        }else{
            title = document.title;
            title = title.substring(title.indexOf('[') + 1, title.indexOf(']'));
            console.log(title);
        }

        Common.addAvImg(title, function($img) {
            var divEle = $("div[class='pattl'] + table");
            if (divEle) {
                $(divEle).replaceWith($img);
            }
        });
    }
}




    if (document.title.indexOf('SiS001') != -1 && document.title.indexOf('无码') != -1) {
//         if ($("#headfilter").length > 0) {
//             if (confirm("GOGOGO!")) {
//                 $('form').find('table')[0].remove();
//                 $('.category').parents('tbody').remove();
//                 htmlStr1 = $('form').html().replace(/<tbody.{26}>/g, "").replace(/<tbody>/g, "").replace(/<\/tbody>/g, "");
//                 $('form').replaceWith("<form>" + htmlStr1 + "</form>");
//                 $('form').find('.separation').remove();
//                 htmlStr1 = $("form").find('table').find('tbody').html();

//                 $(htmlStr1).find('span').each(function() {
//                     var href = $(this).find('a').attr('href');
//                     var txt = $(this).find('a').text();
//                     if(txt.indexOf("HEYZO") != -1){
//                         txt = txt.match(/HEYZO \d{4}/)[0];
//                     } else if(txt.indexOf("heyzo") != -1){
//                         txt = txt.match(/heyzo[ _]\d{4}/)[0];
//                         txt = txt.replace(/heyzo[ _]/, "heyzo ");
//                     } else if(txt.indexOf("fc2ppv") != -1){
//                         txt = txt.match(/fc2ppv_\d{6}/)[0];
//                         txt = txt.replace("fc2ppv_", "");
//                     } else if(txt.indexOf("FC2 PPV") != -1){
//                         txt = txt.match(/FC2 PPV[ -]\d{6}/)[0];
//                         txt = txt.replace(/FC2 PPV[ -]/, "");
//                     } else if(txt.indexOf("pacopaco") != -1|| txt.indexOf("パコパコ") != -1){
//                         txt = txt.match(/\d{6}_\d{3}/)[0];
//                     } else if(txt.indexOf("heydouga") != -1){
//                         txt = txt.match(/\d{4}-\d{3,4}/)[0];
//                     } else if(txt.indexOf("Tokyo") != -1 && txt.indexOf("Hot") != -1){
//                         if(txt.match(/n\d{4}/)){
//                             txt = txt.match(/n\d{4}/)[0];
//                         }else if(txt.match(/SKY-\d{3}/)){
//                             txt = txt.match(/SKY-\d{3}/)[0];
//                         }else{
//                             txt = "";
//                         }
//                     } else {
//                         txt = "";
//                     }
//                     if(txt){
//                         link = "http://192.168.0.18/?search=" + txt + "|" + txt.replace("-", "_")+ "|" + txt.replace("_", "-");
//                         console.log(link);
//                         GM_xmlhttpRequest({
//                             method: "GET",
//                             //大图地址
//                             url: link,
//                             onload: function(result) {
//                                 var doc = Common.parsetext(result.responseText);
//                                 if ($(doc).find(".numresults").text() == "0 个结果") {
//                                     window.open("http://www.sexinsex.net/bbs/" + href);
//                                 }
//                             },
//                             onerror: function(e) {
//                                 console.log(e);
//                             }
//                         }); //end  GM_xmlhttpRequest
//                     }
//                 });
//             }
//         }else{
//             txt = document.title;
//             if(txt.indexOf("HEYZO") != -1){
//                 txt = txt.match(/HEYZO \d{4}/)[0];
//             } else if(txt.indexOf("heyzo") != -1){
//                 txt = txt.match(/heyzo[ _]\d{4}/)[0];
//                 txt = txt.replace(/heyzo[ _]/, "heyzo ");
//             } else if(txt.indexOf("fc2ppv") != -1){
//                 txt = txt.match(/fc2ppv_\d{6}/)[0];
//                 txt = txt.replace("fc2ppv_", "");
//             } else if(txt.indexOf("FC2 PPV") != -1){
//                 txt = txt.match(/FC2 PPV[ -]\d{6}/)[0];
//             } else if(txt.indexOf("pacopaco") != -1|| txt.indexOf("パコパコ") != -1){
//                 txt = txt.match(/\d{6}_\d{3}/)[0];
//             } else if(txt.indexOf("heydouga") != -1){
//                 txt = txt.match(/\d{4}-\d{3,4}/)[0];
//             } else if(txt.indexOf("Tokyo") != -1 && txt.indexOf("Hot") != -1){
//                 if(txt.match(/n\d{4}/)){
//                     txt = txt.match(/n\d{4}/)[0];
//                 }else if(txt.match(/SKY-\d{3}/)){
//                     txt = txt.match(/SKY-\d{3}/)[0];
//                 }else{
//                     txt = "";
//                 }
//             } else {
//                 txt = "";
//             }
//             title=txt;
//             link = "http://192.168.0.18/?search=" + title + "|" + title.replace("-", "");

//             replaceNode = $(".postmessage.defaultpost > h2");
//             replaceNode.replaceWith('<a target="_blank" href="' + link + '"><b>###' + replaceNode.text() + '###</b></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank" href="https://avmoo.net/ja/search/' + title + '"><b>' + title + '</b></a><br /><br /><br />');

//             Common.addAvImg(title, function($img) {
//                 //https://www.javbus.com/CHN-141
//                 var divEle = $("div[class='t_msgfont']");
//                 if (divEle) {
//                     $(divEle).replaceWith($img);
//                 }
//             });
//         }
    }

    if (document.title.indexOf('SiS001') != -1 && document.title.indexOf('亚洲有码原创区') != -1) {
         if ($(".threadlist").length > 0) {
             if (confirm("Press a button!")) {
                htmlStr = $('form').html();
                htmlStr = htmlStr.replace(/<tbody.{1,30}>/g, "").replace(/<tbody>/g, "").replace(/<\/tbody>/g, "");
                htmlStr = htmlStr.replace(/<thead class.{1,30}>/g, "").replace(/<thead>/g, "").replace(/<\/thead>/g, "");
                htmlStr = htmlStr.replace(/<\/table><table.{1,70}>/g, "");
                htmlStr = htmlStr.replace("</td><td colspan=\"6\">", "");
                htmlStr = htmlStr.replace("</td></tr>", "");
                htmlStr = htmlStr.replace(/<!-- 三級置頂分開 -->/g, "");
                htmlStr = htmlStr.replace(/<input.{1,50}>/g, "");

                $('form').replaceWith("<form>" + htmlStr + "</form>");
                htmlStr = $("form").find('table').find('tbody').html();

                $(htmlStr).find('span').each(function() {
                    var href = $(this).find('a').attr('href');
                    var txt = $(this).find('a').text();
                    if(txt.match(/[a-zA-Z]{2,5}-\d{3,5}/)){
                        txt = txt.match(/[a-zA-Z]{2,5}-\d{3,5}/)[0];
                    } else if(txt.match(/[a-zA-Z]{2,5}\d{3,5}/)){
                        txt = txt.match(/[a-zA-Z]{2,5}\d{3,5}/)[0];
                    }

                    if (txt.indexOf("-") == -1) {
                        txt = txt.replace(/([a-zA-Z]+)/, "$1-");
                    }
                    console.log(txt);

                    if(ignoreExistCheck){
                        window.open("http://67.220.92.12/forum/" + href);
                    } else {
		                    link = "http://192.168.0.18/?search=" + txt + "|" + txt.replace("-", "");

		                    GM_xmlhttpRequest({
		                        method: "GET",
		                        //大图地址
		                        url: link,
		                        onload: function(result) {
		                            var doc = Common.parsetext(result.responseText);
		                            if ($(doc).find(".numresults").text() == "0 个结果") {
		                                window.open("http://67.220.92.12/forum/" + href);
		                            }
		                        },
		                        onerror: function(e) {
		                            console.log(e);
		                        }
		                    }); //end  GM_xmlhttpRequest
                  	}
                 });
             }
//         } else if ($("#headfilter").length == 0) {
//             title = document.title;
//             title = title.replace(/\[[a-zA-Z0-9 \.\/\[\]]*\]/, "");
//             console.log(title);


//             if (title.indexOf("最新Real Street Angels ") != -1) {
//                 title = title.replace(/最新Real Street Angels /, "");
//             }
//             if (title.indexOf("【") != -1) {
//                 title = title.replace(/【/, " ");
//             }

//             if (title.indexOf(" ") == -1) {
//                 title = title.replace(/[^a-zA-Z0-9-]/g, "");
//             } else {
//                 title = title.substring(0, title.indexOf(" "));
//             }
//             if (title.indexOf("-") == -1) {
//                 title = title.replace(/([a-zA-Z]+)/, "$1-");
//             }
//             console.log(title);

//             link = "http://192.168.0.18/?search=" + title + "|" + title.replace("-", "");

//             replaceNode = $(".postmessage.defaultpost > h2");
//             replaceNode.replaceWith('<a target="_blank" href="' + link + '"><b>###' + replaceNode.text() + '###</b></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank" href="https://avmoo.net/ja/search/' + title + '"><b>' + title + '</b></a><br /><br /><br />');

//             Common.addAvImg(title, function($img) {
//                 //https://www.javbus.com/CHN-141
//                 var divEle = $("div[class='t_msgfont']");
//                 if (divEle) {
//                     $(divEle).replaceWith($img);
//                 }
//             });
         }
    }


	if (document.title.indexOf('このAV女優の名前教えてwiki') != -1) {

	    $("div#page-social-link-top").replaceWith('<button type="button" id="asaca"> click me</button>');
	    $("#asaca").click(function() {
	        var cids = new Array();
	        $("a.outlink").each(function() {
	            var sss = $(this).attr("href");
	            if (sss.indexOf("cid=") != -1) {
	                sss = sss.substring(sss.indexOf("cid=") + 4);
	                sss = sss.substring(0, sss.indexOf("/"));
	                sss = sss.replace(/^(h_)?\d+/, "");
	                if (sss.indexOf("-") == -1) {
	                    sss = sss.replace(/([a-zA-Z]+)/, "$1-");
	                }
	                if (sss.match(/[a-zA-Z]{2,5}-\d{3,5}/)) {
	                    if (sss.match(/[a-zA-Z]{2,5}-00\d{3,5}/)) {
	                        sss = sss.replace("-00", "-");
	                    }
	                    cids.push(sss);
	                }
	            } else if (sss.indexOf("product_detail/") != -1) {

	                sss = sss.substring(sss.indexOf("product_detail/") + 15);
	                sss = sss.substring(0, sss.indexOf("/"));
	                sss = sss.replace(/^(h_)?\d+/, "");
	                if (sss.indexOf("-") == -1) {
	                    sss = sss.replace(/([a-zA-Z]+)/, "$1-");
	                }
	                if (sss.match(/[a-zA-Z]{2,5}-\d{3,5}/)) {
	                    if (sss.match(/[a-zA-Z]{2,5}-00\d{3,5}/)) {
	                        sss = sss.replace("-00", "-");
	                    }
	                    cids.push(sss);
	                }
	            }
	        });
            cids.sort();

	        console.log(cids.toString());

	    });

	}

    if (document.title.indexOf('素人系総合') != -1) {

	    $("div#page-social-link-top").replaceWith('<button type="button" id="asaca"> click me</button><div id="asacaddd" style="color:#FFFFFF"></div>');
	    $("#asaca").click(function() {
	        var cids = new Array();
	        $("a.outlink").each(function() {
	            var sss = $(this).attr("href");
	            if (sss.indexOf("cid=") != -1) {
	                sss = sss.substring(sss.indexOf("cid=") + 4);
	                sss = sss.substring(0, sss.indexOf("/"));
	                sss = sss.replace(/^(h_)?\d+/, "");
	                if (sss.indexOf("-") == -1) {
	                    sss = sss.replace(/([a-zA-Z]+)/, "$1-");
	                }
	                if (sss.match(/[a-zA-Z]{2,5}-\d{3,5}/)) {
	                    if (sss.match(/[a-zA-Z]{2,5}-00\d{3,5}/)) {
	                        sss = sss.replace("-00", "-");
	                    }
	                    cids.push(sss);
	                }
	            } else if (sss.indexOf("product_detail/") != -1) {

	                sss = sss.substring(sss.indexOf("product_detail/") + 15);
	                sss = sss.substring(0, sss.indexOf("/"));
	                sss = sss.replace(/^(h_)?\d+/, "");
	                if (sss.indexOf("-") == -1) {
	                    sss = sss.replace(/([a-zA-Z]+)/, "$1-");
	                }
	                if (sss.match(/[a-zA-Z]{2,5}-\d{3,5}/)) {
	                    if (sss.match(/[a-zA-Z]{2,5}-00\d{3,5}/)) {
	                        sss = sss.replace("-00", "-");
	                    }
	                    cids.push(sss);
	                }
	            }
	        });
            cids.sort();
            $("#asacaddd").text(cids.toString());

	        console.log(cids.toString());

	    });

	}
	if (document.title.indexOf('AVMOO') != -1) {
	    $("footer").replaceWith('<button type="button" id="bbbbb"> click me</button>');
	    $("#bbbbb").click(function() {
	        var acmoo = "";
	        $("date:even").each(function() {
	            acmoo = acmoo + " " + $(this).text();
	        });
	        console.log(acmoo);

	    });
	}

});


let Common = {
    /**
     * html文本转换为Document对象
     * @param {String} text
     * @returns {Document}
     */
    parsetext: function(text) {
        var doc = null;
        try {
            doc = document.implementation.createHTMLDocument('');
            doc.documentElement.innerHTML = text;
            return doc;
        } catch (e) {
            alert('parse error');
        }
    },

    /**
     * 判断日期是否最近X个月份的日期
     * @param {String} DateStr 日期
     * @param {Number} MonthNum 月数(X)
     * @returns {boolean}
     */
    isLastXMonth: function(DateStr, MonthNum) {
        let now = new Date(); //当前日期
        let compDate = new Date(DateStr);
        let m2 = now.getFullYear() * 12 + now.getMonth();
        let m1 = compDate.getFullYear() * 12 + compDate.getMonth();
        if ((m2 - m1) < MonthNum) {
            return true;
        }
        return false;
    },

    /**
     * 方法: 通用chrome通知
     * @param title
     * @param body
     * @param icon
     * @param click_url
     */
    notifiy: function(title, body, icon, click_url) {
        var notificationDetails = {
            text: body,
            title: title,
            timeout: 10000,
            image: icon,
            onclick: function() {
                window.open(click_url);
            }
        };
        GM_notification(notificationDetails);
    },
    /**
     * 加入AV预览内容图
     * @param avid av唯一码
     * @param @function func 函数
     */
    addAvImg: function(avid, func) {
        //异步请求搜索blogjav.net的番号
        GM_xmlhttpRequest({
            method: "GET",
            //大图地址
            url: 'http://blogjav.net/?s=' + avid,
            onload: function(result) {
                //console.log("时间111111:"+ new Date().getTime());
                var doc = Common.parsetext(result.responseText);
                //console.log("时间222222:"+ new Date().getTime());
                let a_array = $(doc).find(".more-link");
                let a = a_array[0];
                for (let i = 0; i < a_array.length; i++) {
                    var fhd_idx = a_array[i].innerHTML.search(/FHD/);
                    //debugger;
                    if (fhd_idx > 0) {
                        a = a_array[i];
                        break;
                    }
                }

                if (a) {
                    //异步请求调用内页详情的访问地址
                    GM_xmlhttpRequest({
                        method: "GET",
                        //大图地址
                        url: a.href,
                        headers: {
                            referrer: "http://pixhost.to/" //绕过防盗图的关键
                        },
                        onload: function(XMLHttpRequest) {
                            //console.log("时间333333:"+ new Date().getTime());
                            var bodyStr = XMLHttpRequest.responseText;
                            var yixieBody = bodyStr.substring(bodyStr.search(/<span id="more-(\S*)"><\/span>/), bodyStr.search(/<div class="category/));

                            var img_start_idx = yixieBody.search(/"><img .*src="https*:\/\/(\S*)pixhost.to\/thumbs\//);
                            //debugger;
                            //如果找到内容大图
                            if (img_start_idx > 0) {
                                var new_img_src = yixieBody.substring(yixieBody.indexOf('src', img_start_idx) + 5, yixieBody.indexOf('alt') - 2);
                                var targetImgUrl = new_img_src.replace('thumbs', 'images').replace('//t', '//img').replace(/[\?*\"*]/, '').replace('https', 'http');

                                //如果找到全高清大图优先显示全高清的
                                console.log("图片地址:" + targetImgUrl);

                                //创建img元素,加载目标图片地址
                                //创建新img元素
                                var $img = $('<img name="javRealImg" title="点击可放大缩小 (图片正常时)"></img>');
                                $img.attr("src", targetImgUrl);
                                $img.attr("style", "float: left;cursor: pointer;");

                                //将新img元素插入指定位置
                                func($img);
                                console.log("时间444444:" + new Date().getTime());
                            }
                        },
                        onerror: function(e) {
                            console.log(e);
                        }
                    }); //end  GM_xmlhttpRequest
                }
            },
            onerror: function(e) {
                console.log(e);
            }
        }); //end  GM_xmlhttpRequest
    },
};
