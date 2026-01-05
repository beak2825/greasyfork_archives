// ==UserScript==
// @name         NEU6 Info Clone
// @namespace    neu6infoclone
// @author       Rhilip,baishuangxing
// @description  一键复制六维已有种子的信息
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_download
// @include      http://bt.neu6.edu.cn/search*
// @include      http://bt.neu6.edu.cn/forum*
// @include      http://bt.neu6.edu.cn/thread*
// @require      https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @icon         http://bt.neu6.edu.cn/favicon.ico
// @supportURL   http://bt.neu6.edu.cn/thread-1555682-1-1.html
// @version      20190107
// @downloadURL https://update.greasyfork.org/scripts/24581/NEU6%20Info%20Clone.user.js
// @updateURL https://update.greasyfork.org/scripts/24581/NEU6%20Info%20Clone.meta.js
// ==/UserScript==

// jQuery链接(为避免流量，请将第10行juqery源换为下面2的链接)
// 1：https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// 2：http://bt.neu6.edu.cn/static/js/mobile/jquery-1.8.3.min.js


// ~~~~~~~~~~~~~~~~~~~~~~~~可配置选项~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~常用链接配置~~~~~~~~~~~~~~~~~~~~~~~
const common_links = {
    "剧版常见问题": "http://bt.neu6.edu.cn/thread-1523211-1-1.html",
    "高清剧集版规": "http://bt.neu6.edu.cn/thread-1529941-1-1.html",
    "普通剧集版规": "http://bt.neu6.edu.cn/thread-1531028-1-1.html"
};
// ~~~~~~~~~~~~~~~~~~~~~~功能开启与关闭~~~~~~~~~~~~~~~~~~~~~~
const AutoAdd = true; //自动增加集数，可选true,false
const OpenSearchEnhance = true; //开启搜索加强工具，可选true,false
const SearchEnhanceDefaultShow = true; //搜索默认显示/隐藏，可选true,false
const SeedTitleBigFont = false; //标题框放大，可选true,false

const ShowCommonLink = true; //显示常用链接，可选true,false
const ShowSubtitle = true; //显示搜索字幕，可选true,false
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// 脚本预处理阶段
const jq = jQuery.noConflict();

(function () {
    const forum_id = getForumId();

    function atDetailPage() {
        return location.href.match(/thread-|tid=/) ? true : false;
    }

    function getForumId() {
        var forum_match = location.href.match(/(forum-|fid=)(\d+)/);
        if (forum_match) {
            return parseInt(forum_match[2]);
        }
        if (atDetailPage() && jq('#visitedforums>a').length) {
            var type_m = jq('#visitedforums>a').attr('href').match(/(forum-|fid=)(\d+)/);
            return parseInt(type_m ? type_m[2] : 0);
        }
        return 0;
    }

    // 各板块列表
    if (jq('table#threadlisttableid').length) {
        let formhash = jq('input[name="formhash"]').val();
        let listextra = jq('input[name="listextra"]').val();
        jq("table#threadlisttableid tbody").each(function () {
            let tbody = jq(this);
            //id
            let id = tbody.attr('id').match(/(\d+)/) ? tbody.attr('id').match(/(\d+)/)[1] : 0;
            let size_index, copy_index;
            if (tbody.find('tr>td:eq(1)>img').length) {
                copy_index = 1;
                size_index = 2;
            } else {
                copy_index = 2;
                size_index = 3;
            }
            //size
            let size = parseFloat(tbody.find('tr>td:eq(' + size_index + ')').text());
            if (size > 0 && id !== 0) {
                tbody.find('tr>td:eq(' + copy_index + ')>img').click(function () {
                    window.open("http://bt.neu6.edu.cn/forum.php?mod=post&action=newthread&fid=" + forum_id + "#clone_" + id);
                });
                tbody.find('tr td:eq(' + size_index + ')').click(function () {
                    jq.get("http://bt.neu6.edu.cn/thread-" + id + "-1-1.html", function (resp) {
                        let str_link = resp.match(/<p class="attnm">[\s\S]*torrent<\/a>/gi)[0];
                        let downlink_temp = str_link.match(/<a href="([\s\S]*)" onmouseover/)[1];
                        let downlink = "http://bt.neu6.edu.cn/" + downlink_temp.replace(/amp[\S]/, "");
                        window.open(downlink);
                    });
                });
                //
                if (size_index == 3 && /stickthread_/.test(tbody.attr('id'))) {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: "http://bt.neu6.edu.cn/forum.php?mod=topicadmin&action=moderate&infloat=yes&nopost=yes&inajax=1&fid=" + forum_id,
                        data: "formhash=" + formhash + "&listextra=" + listextra + "&moderate[]=" + id + "&optgroup=1&operation=stick",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        onload: function (response) {
                            var doc = (new DOMParser()).parseFromString(response.responseText, 'text/html');
                            var body = doc.querySelector("body");
                            var page = jq(body);
                            if (page.find('input#expirationstick').length) {
                                let expirationstick = page.find('input#expirationstick').val();
                                if (expirationstick != "") {
                                    tbody.find('th').append('<b>(限时:' + calculateStickLeftTime(expirationstick) + ')</b>');
                                }
                            }
                        }
                    });
                }
            }
        });
    }

    function calculateStickLeftTime(str) {
        let m = parseInt((new Date(str) - new Date()) / 60000);
        let ret = [];
        let ret_u = ['分', '时', '天'];
        ret.push(m % 60); //分
        m = parseInt(m / 60);
        ret.push(m % 24); //时
        m = parseInt(m / 24); //天
        ret.push(m);

        let left_time = "",
            count = 0;
        for (let i = 2; i >= 0; i--) {
            if (ret[i] > 0) {
                count++;
                left_time += ret[i] + ret_u[i];
            }
            if (count >= 2) {
                break;
            }
        }
        return left_time ? left_time : (ret[0] + ret_u[0]);
    }

    // 搜索页面
    if (jq('table.dt').length) {
        jq('table.dt tr:gt(0)').each(function () {
            let tr = jq(this);
            tr.find('td:lt(2)').css("text-align", "center");
            let cat = tr.find('td:eq(4) a').attr('href').match(/forum-(\d+)-1/)[1];
            let id = tr.find('td:eq(2) a').attr('href').match(/thread-(\d+)-1/)[1];
            if (tr.find('td:eq(0) img').length) {
                tr.find('td:eq(0) img').click(function () {
                    window.open("http://bt.neu6.edu.cn/forum.php?mod=post&action=newthread&fid=" + cat + "#clone_" + id);
                });
                tr.find('td:eq(1)').click(function () {
                    jq.get("http://bt.neu6.edu.cn/thread-" + id + "-1-1.html", function (resp) {
                        let str_link = resp.match(/<p class="attnm">[\s\S]*torrent<\/a>/gi)[0];
                        let downlink_temp = str_link.match(/<a href="([\s\S]*)" onmouseover/)[1];
                        let downlink = "http://bt.neu6.edu.cn/" + downlink_temp.replace(/amp[\S]/, "");
                        window.open(downlink);
                    });
                });
            }
        });
    }
    var value_of_forums = {
        "forum_big1": [2, 129, 29, 145, 33, 133, 358, 41, 156, 155, 153, 152, 154, 162, 147, 148, 149, 151, 150, 146],
        "forum_big2": [45, 161, 57, 48, 77, 58, 49, 59, 50, 60, 91, 92],
        "forum_big3": [13, 81, 79, 61, 14, 73, 62, 16, 72, 112, 17, 292, 96, 65, 15, 126, 144, 63, 127, 128, 44, 293, 165, 52, 125, 69, 21, 329, 78, 171, 124, 163, 56, 18, 138, 54, 66, 19, 160, 159, 84, 74, 169, 67, 20, 368, 70],
        "forum_big4": [7, 141, 4, 139, 43, 142, 175, 182, 136, 172],
        "forum_big5": [38, 121, 131, 122, 39, 119, 31, 143],
        "forum_big6": [32, 87, 123, 137, 93, 113, 114, 135, 36, 116, 115, 187],
        "forum_resource1": [45, 161, 13, 81, 79],
        "forum_resource2": [48, 77, 14, 73],
        "forum_resource3": [16, 72],
        "forum_resource4": [17, 292, 96],
        "forum_resource5": [50, 91, 15, 126, 144],
        "forum_resource6": [49, 127],
        "forum_resource7": [44, 293, 165, 52, 125],
        "forum_resource8": [21, 329, 78, 171, 124, 163],
        "forum_resource9": [18, 138, 54],
        "forum_resource10": [19, 160, 159, 84, 74, 169],
        "forum_resource11": [20, 368],
        "movie1": [45, 161, 13, 81, ],
        "movie2": [45, 161],
        "movie3": [13, 81],
        "movie4": [45, 161, 57, 13, 81, 79, 61],
        "tvseries1": [48, 77, 14, 73],
        "tvseries2": [48, 77],
        "tvseries3": [14, 73],
        "tvseries4": [77, 73],
        "tvseries5": [48],
        "tvseries6": [14],
        "tvseries7": [48, 77, 58, 14, 73, 62]
    };
    // 搜索页面
    if (OpenSearchEnhance && location.href.match(/search\.php(\Smod=forum)?$/) && jq('div.sttl.mbn').length) {
        jq("table tr:eq(1)").after('<tr><th>搜索范围</th><td><p id="showsearchenhance"><b>----[显示/隐藏]----</b></p><div id="mysearchbox" hidden="true"><table bgcolor="#F0F0F0" cellspacing="0" cellpadding="0"><tr>----[大版块]----</tr><tr><td><label class="lb"><b>[各版块]</b></label></td><td><label class="my_search lb" id="forum_big1"><input type="radio" class="pr" name="searchenhance"/>六维索引互动区</label></td><td><label class="my_search lb" id="forum_big2"><input type="radio" class="pr" name="searchenhance"/>六维高清资源区</label></td><td><label class="my_search lb" id="forum_big3"><input type="radio" class="pr" name="searchenhance"/>六维普通资源区</label></td><td><label class="my_search lb" id="forum_big4"><input type="radio" class="pr" name="searchenhance"/>六维休闲娱乐区</label></td><td><label class="my_search lb" id="forum_big5"><input type="radio" class="pr" name="searchenhance"/>六维事务处理区</label></td><td><label class="my_search lb" id="forum_big6"><input type="radio" class="pr" name="searchenhance"/>六维内部交流区</label></td></tr><tr><td><label class="lb"><b>[资源区]</b></label></td><td><label class="my_search lb" id="forum_resource1"><input type="radio" class="pr" name="searchenhance"/>电影剧场</label></td><td><label class="my_search lb" id="forum_resource2"><input type="radio" class="pr" name="searchenhance"/>电视剧集</label></td><td><label class="my_search lb" id="forum_resource3"><input type="radio" class="pr" name="searchenhance"/>综艺娱乐</label></td><td><label class="my_search lb" id="forum_resource4"><input type="radio" class="pr" name="searchenhance"/>体育天地</label></td><td><label class="my_search lb" id="forum_resource5"><input type="radio" class="pr" name="searchenhance"/>音乐地带</label></td><td><label class="my_search lb" id="forum_resource6"><input type="radio" class="pr" name="searchenhance"/>纪录写实</label></td></tr><tr><td></td><td><label class="my_search lb" id="forum_resource7"><input type="radio" class="pr" name="searchenhance"/>卡通动漫</label></td><td><label class="my_search lb" id="forum_resource8"><input type="radio" class="pr" name="searchenhance"/>游戏天下</label></td><td><label class="my_search lb" id="forum_resource9"><input type="radio" class="pr" name="searchenhance"/>资料文档</label></td><td><label class="my_search lb" id="forum_resource10"><input type="radio" class="pr" name="searchenhance"/>软件快跑</label></td><td><label class="my_search lb" id="forum_resource11"><input type="radio" class="pr" name="searchenhance"/>其他资源</label></td></tr></table><table bgcolor="#F0F0F0" cellspacing="0" cellpadding="0"><tr>----[小版块]----</tr><tr><td><label class="lb"><b>[电- -影]</b></label></td><td><label class="my_search lb" id="movie1"><input type="radio" class="pr" name="searchenhance"/>电影--资源区</label></td><td><label class="my_search lb" id="movie2"><input type="radio" class="pr" name="searchenhance"/>电影--高清</label></td><td><label class="my_search lb" id="movie3"><input type="radio" class="pr" name="searchenhance"/>电影--普清</label></td><td><label class="my_search lb" id="movie4"><input type="radio" class="pr" name="searchenhance"/>电影--所有</label></td></tr><tr><td><label class="lb"><b>[剧- -集]</b></label></td><td><label class="my_search lb" id="tvseries1"><input type="radio" class="pr" name="searchenhance"/>剧集--资源区</label></td><td><label class="my_search lb" id="tvseries2"><input type="radio" class="pr" name="searchenhance"/>剧集--高清</label></td><td><label class="my_search lb" id="tvseries3"><input type="radio" class="pr" name="searchenhance"/>剧集--普清</label></td><td><label class="my_search lb" id="tvseries4"><input type="radio" class="pr" name="searchenhance"/>剧集--合集</label></td><td><label class="my_search lb" id="tvseries5"><input type="radio" class="pr" name="searchenhance"/>高清剧集</label></td><td><label class="my_search lb" id="tvseries6"><input type="radio" class="pr" name="searchenhance"/>电视剧集</label></td><td><label class="my_search lb" id="tvseries7"><input type="radio" class="pr" name="searchenhance"/>剧集--所有</label></td></tr></table></div></td></tr>');
    }
    jq("label.my_search").click(function () {
        let spanid = jq(this).attr("id");
        jq("select#srchfid").val(value_of_forums[spanid]);
    });
    jq("p#showsearchenhance").click(function () {
        jq("div#mysearchbox").toggle();
    });
    // 帖子页面
    if (location.href.match(/thread-\d+-\d+-\d/) || location.href.match(/mod=viewthread\Stid=\d+/)) {
        if (jq('div.pob.cl:first em').length && jq('div.pcb div.mtw.mbw').length) {
            let seedid = location.href.match(/(thread-|tid=)(\d+)/)[2];
            let a_length = jq('div#pt div.z a').length - 2;
            let cat1 = jq('div#pt div.z a:eq(' + a_length + ')').attr("href").match(/(forum-|fid=)(\d+)/)[2];
            let index = 0;

            jq('div.pob.cl').each(function () {
                let seed_p = jq(this).find('p');
                // 常用链接
                if (ShowCommonLink) {
                    let quote_id = jq('td.t_f:eq(' + index + ')').attr("id").match(/postmessage_(\d+)/)[1];
                    let link_reply = "http://bt.neu6.edu.cn/forum.php?mod=post&action=reply&fid=" + cat1 + "&extra=page%3D1&tid=" + seedid + "&reppost=" + quote_id;
                    if (index > 0) {
                        link_reply = "http://bt.neu6.edu.cn/forum.php?mod=post&action=reply&fid=" + cat1 + "&extra=page%3D1&tid=" + seedid + "&repquote=" + quote_id;
                    }
                    index++;
                    let commonlink = "commonlink_" + index;

                    seed_p.find('a:first').before('<a href="javascript:;" id="' + commonlink + '" onmouseover="showMenu(this.id)" class="showmenu">常用链接</a>');
                    // 添加常用链接
                    let commonlink_string = '<ul id="' + commonlink + '_menu" class="p_pop mgcmn" style="display: none;"><li><a style="background: url(http://bt.neu6.edu.cn/data/attachment/forum/201609/29/084832wh4p2z362amsf4mv.png) no-repeat 4px 50%;" target="_blank" href="' + link_reply + '">回复本帖高级</a></li>';
                    for (let key in common_links) {
                        commonlink_string = commonlink_string + "<li><a style=\"background: url(http://bt.neu6.edu.cn/data/attachment/forum/201609/29/104809kzjj6ujkzpv6j6uj.png) no-repeat 4px 50%;\" target=\"_blank\" href=\"" + common_links[key] + "\">" + key + "</a></li>";
                    }
                    commonlink_string = commonlink_string + "</ul>";
                    seed_p.after(commonlink_string);
                }
                // 搜索字幕
                if (ShowSubtitle) {
                    let tvname_cn = jq('title').text().match(/\[([\S\s]+?)[\/\]]/)[1];
                    if (null !== tvname_cn) {
                        let subtitle_id = "subtitle_" + index;
                        seed_p.find('a:first').before('<a href="javascript:;" id="' + subtitle_id + '" onmouseover="showMenu(this.id)" class="showmenu">搜索字幕</a>');
                        let subtitle_links = {
                            "ZIMUZU": "http://www.zimuzu.tv/search?keyword=" + encodeURI(tvname_cn),
                            "SHOOTER": "http://assrt.net/sub/?searchword=" + encodeURI(tvname_cn),
                            "Sub HD": "http://subhd.com/search/" + encodeURI(tvname_cn),
                            "ZIMUKU": "http://www.zimuku.net/search?ad=1&q=" + encodeURI(tvname_cn),
                            "ADDIC7ED": "http://www.addic7ed.com/",
                        };
                        let subtiltelink_string = '<ul id="' + subtitle_id + '_menu" class="p_pop mgcmn" style="display: none;">';
                        for (let key_sub in subtitle_links) {
                            subtiltelink_string = subtiltelink_string + '<li><a style="background: url(http://bt.neu6.edu.cn/data/attachment/forum/201609/29/062944dfdubs5f99gr5mzu.png) no-repeat 4px 50%;" target="_blank" href="' + subtitle_links[key_sub] + '">' + key_sub + '</a></li>';
                        }
                        subtiltelink_string = subtiltelink_string + "</ul>";
                        seed_p.after(subtiltelink_string);
                    }
                }
            });
        }
    }

    // 对发种界面的修改
    if (location.href.match(/action=newthread/) || location.href.match(/action=edit/)) {
        jq('span#custominfo').remove();
        jq('span#subjectchk').remove();
        let d_with = jq('#postbox').width() - 130;
        let seed_with = jq('#postbox').width() - 450;
        jq('div.specialpost.s_clear div.pbt.cl input').attr('style', 'width: 52em');
        if (SeedTitleBigFont) {
            jq('span#subjectchk').remove();
            jq('#subject').attr('style', 'width: ' + d_with + 'px;height: 1.5em;font-size: 1.45em');
        } else {
            jq('#subject').attr('style', 'width: ' + d_with + 'px'); //更改发种界面的输入框宽度
        }
        jq("div.specialpost.s_clear input").attr('style', 'width: ' + seed_with + 'px');
        jq('div#postbox').before('<div class="pbt cl"><div class="ftid"><span width="80">种子信息克隆：</span></div><div class="z"><span><input type="text" style="width:400px;" id="clone_from" class="px" placeholder="要克隆的种子ID、链接" onkeypress="if(event.keyCode==13){clone_btn.click();}"></span><input type="button" id="clone_btn" style="size:100px;" value=" 克   隆 ">&nbsp;&nbsp;&nbsp;&nbsp;<span>克隆状态：[</span><span id="clone_info">要克隆的种子ID、链接</span><span>]</span></div></div>' +
            '<div class="pbt cl"><div class="ftid"><span width="80">电影信息查询：</span></div><div class="z"><span class="ftid"><select id="query_typeid"><option value="1">电影</option><option value="2">动漫</option><option value="3">游戏</option></select></span><span><input type="text" style="width:300px;" id="query_input" class="px" placeholder="名称、豆瓣ID/链接、IMDB、Bangumi、Steam" onkeypress="if(event.keyCode==13){query_btn.click();}"></span><input type="button" id="query_btn" style="size:100px;" value=" 查   询 ">&nbsp;&nbsp;&nbsp;&nbsp;<span>查询状态：[</span><span id="query_info">名称、豆瓣ID/链接、IMDB、Bangumi、Steam</span><span>]</span><span id="d_poster"></span></div></div>' +
            '<div id="seedfilename" hidden="true" class="pbt cl"><div class="ftid"><span width="80">种子文件名称：</span></div><div class="z"><input  type="text" style="width:71.5em;" class="px" id="uploadseedname"></div></div>');
        //展开标签栏，预备填写
        jq('#extra_tag_b').addClass('a');
        jq('#extra_tag_c').css('display', 'block');
    }

    if (jq('#query_typeid').length) {
        var query_typeid = 1;
        if (forum_id == 44 || forum_id == 293 || forum_id == 52) {
            query_typeid = 2;
        } else if (forum_id == 21 || forum_id == 329) {
            query_typeid = 3;
        }
        jq('select#query_typeid').val(query_typeid);
    }

    // 下载海报
    function downloadPoster(img) {
        let img_span = '&nbsp;&nbsp;&nbsp;&nbsp;';
        if (img.length == 1) {
            img_span += '<b>[点击下载图片]</b>';
            jq('span#d_poster').html(img_span);
            jq('span#d_poster').unbind('click');
            jq('span#d_poster').click(function () {
                let s = img[0].split("/");
                let name = (s.length > 0) ? s[s.length - 1] : "default.png";
                name = name.trim().replace(/\?.*$/, '');
                GM_download(img[0], name);
            });
        } else if (img.length > 1) {
            img_span = img_span + '<select width="100px" id="query_img_down"><option value="">选择图片下载</option>';
            for (let i = 0; i < img.length; i++) {
                let s = img[i].split("/");
                let name = (s.length > 0) ? s[s.length - 1] : "default.png";
                name = name.trim().replace(/\?.*$/, '');
                img_span = img_span + '<option value="' + img[i] + '">' + name + '</option>';
            }
            img_span += '</select>';

            jq('span#d_poster').html(img_span);
            jq('span#d_poster').unbind('click');
            jq('select#query_img_down').change(function () {
                let h = jq('select#query_img_down').val();
                if (h != "") {
                    let s = h.split("/");
                    let name = (s.length > 0) ? s[s.length - 1] : "default.png";
                    name = name.trim().replace(/\?.*$/, '');
                    GM_download(h, name);
                    let img_name = jq('select#query_img_down').find("option:selected").text();
                    img_name = img_name.replace(/^√*\s*/, '√ ');
                    jq('select#query_img_down').find("option:selected").text(img_name);
                }
            });
        }
    }

    // 自动处理并复制种子文件名
    function seedname_copy() {
        jq("div#seedfilename").show();
        // 去掉路径
        let tname = jq("div.specialpost.s_clear input").val().replace(/.*\\([^\.\\]+)/g, "$1");
        tname = tname.replace(/(\.torrent$)/, "");
        tname = tname.replace(/(\.mkv$)|(\.mp4$)|(\.rmvb$)|(\.ts$)|(\.avi$)|(\.iso$)/i, "");
        // 空格替换为.
        tname = tname.replace(/(\s)/g, ".");
        let tname_copy = tname;
        // 去掉: [发布组]
        tname = tname.replace(/(\.*\[\S+\]\.*)*/, "");
        // 去掉开头与结尾的.
        tname = tname.replace(/(^\.*)|(\.*$)/g, "");
        if (tname) {
            jq("input#uploadseedname").val(tname);
            let en_name = tname.match(/\w[-￡@\'\w\.]+/);
            if (en_name && ((forum_id == 48 && en_name[0].match(/Ep?\d+/i)) || forum_id == 13 || forum_id == 45)) {
                let t = jq('input[name=subject]').val().replace(/\]\[[^\]]+/, "][" + en_name[0]);
                jq('input[name=subject]').attr('value', t);
            }
        } else {
            jq("input#uploadseedname").val(tname_copy);
        }
    }

    //AutoAdd处理部分内容
    function numatostring2(num) {
        return (num < 10) ? ("0" + num) : (num.toString());
    }

    function leapyear(year) {
        return ((year % 400 === 0) || ((year % 100 !== 0) && (year % 4 === 0)));
    }

    function tvseasonhandle(str, type) {
        if (str.match(/\[\d+[Pp]\]/)) {
            return str;
        }
        let aaatv = str.match(/\d+/g);
        let bbbtv = str.match(/\D+/g);
        if (aaatv && aaatv.length == 1) {
            str = numatostring2(parseInt(aaatv[0]) + 1);
            if (bbbtv) {
                str = bbbtv[0] + str;
                if (bbbtv && bbbtv.length > 1) {
                    str = str + bbbtv[1];
                }
            }
        }
        if (aaatv && aaatv.length == 2) {
            if (bbbtv && bbbtv.length >= 2 && bbbtv[1] == "E") {
                aaatv[1] = numatostring2(parseInt(aaatv[1]) + 1);
            } else {
                let temp = parseInt(aaatv[1]) - parseInt(aaatv[0]);
                aaatv[0] = numatostring2(parseInt(aaatv[1]) + 1);
                aaatv[1] = numatostring2(parseInt(aaatv[0]) + temp);
            }
            if (bbbtv && bbbtv.length == 1) {
                str = aaatv[0] + bbbtv[0] + aaatv[1];
            } else if (bbbtv && bbbtv.length == 2) {
                str = bbbtv[0] + aaatv[0] + bbbtv[1] + aaatv[1];
            } else if (bbbtv && bbbtv.length == 3) {
                str = bbbtv[0] + aaatv[0] + bbbtv[1] + aaatv[1] + bbbtv[2];
            }
        }
        return str;
    }

    function requestData(url, successHandle, timeoutHandle) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            timeout: 5000,
            onreadystatechange: successHandle,
            ontimeout: timeoutHandle,
        });
    }

    function requestHTML(url, successHandle, timeoutHandle) {
        requestData(url, function (response) {
            if (response.readyState == 4) {
                successHandle(response);
            }
        }, function (response) {
            timeoutHandle(response);
        });
    }

    function requestJson(url, successHandle, timeoutHandle) {
        requestData(url, function (response) {
            if (response.readyState == 4) {
                successHandle(JSON.parse(response.responseText));
            }
        }, function (response) {
            timeoutHandle(response);
        });
    }

    //查询电影信息
    jq('#query_btn').click(function () {
        var query_input = jq('#query_input').val().trim();
        var query_info = jq('#query_info');
        jq('span#d_poster').html('');
        if (query_input == '') {
            query_info.html('<b>请输入搜索内容</b>')
            return;
        }
        if (/^\d+$/.test(query_input)) {
            query_input = (forum_id == 44) ? ('https://bgm.tv/subject/' + query_input) : ('https://movie.douban.com/subject/' + query_input);
        }
        if (/^tt\d+/.test(query_input)) {
            query_input = 'http://www.imdb.com/title/' + query_input;
        }
        if (/^http/.test(query_input)) {
            if (/www\.imdb\.com/.test(query_input)) {
                requestJson('https://api.douban.com/v2/movie/search?q=' + query_input.match(/tt\d+/)[0], function (json) {
                    if (json.total == 1) {
                        jq('#query_input').val(json.subjects[0].alt);
                        jq('#query_btn').click();
                    } else {
                        query_info.html('<b>请检查IMDB是否正确</b>');
                    }
                }, function (res) {
                    query_info.html('<b>查询IMDB信息失败</b>');
                });
            } else if (/movie\.douban\.com/.test(query_input)) {
                var fetch = function (anchor) {
                    return anchor[0].nextSibling.nodeValue.trim();
                };
                query_info.text("识别输入为豆瓣链接，查询中......");
                requestHTML(query_input, function (res) {
                    // 以下豆瓣相关解析修改自 `https://greasyfork.org/zh-CN/scripts/38878-电影信息查询脚本` 对此表示感谢
                    var title_match = res.responseText.match(/<title>页面不存在<\/title>/)
                    if (/<title>页面不存在<\/title>/.test(res.responseText)) {
                        query_info.html('<b>该链接对应的资源似乎并不存在，你确认没填错</b>');
                    } else {
                        var page = jq(res.responseText.match(/<body[^>]*?>([\S\s]+)<\/body>/)[1].replace(/<script(\s|>)[\S\s]+?<\/script>/g, ''));
                        var movie_id = res.finalUrl.match(/\/subject\/(\d+)/)[1];

                        var this_title, trans_title;
                        var chinese_title = res.responseText.match(/<title>([\s\S]+)<\/title>/)[1].replace('(豆瓣)', '').trim();
                        var foreign_title = page.find('#content h1>span[property="v:itemreviewed"]').text().replace(chinese_title, '').trim();
                        var aka_anchor = page.find('#info span.pl:contains("又名")');
                        var aka;
                        if (aka_anchor[0]) {
                            aka = fetch(aka_anchor).split(' / ').sort(function (a, b) { //首字(母)排序
                                return a.localeCompare(b);
                            }).join('/');
                        }
                        if (foreign_title) {
                            trans_title = chinese_title + (aka ? ('/' + aka) : '');
                            this_title = foreign_title;
                        } else {
                            trans_title = aka ? aka : '';
                            this_title = chinese_title;
                        }
                        //年代
                        var year = page.find('#content>h1>span.year').text().slice(1, -1);
                        //产地
                        var regions_anchor = page.find('#info span.pl:contains("制片国家/地区")');
                        var region;
                        if (regions_anchor[0]) {
                            region = fetch(regions_anchor).split(' / ').join('/');
                        }
                        //类别
                        var genre = page.find('#info span[property="v:genre"]').map(function () {
                            return jq(this).text().trim();
                        }).toArray().join('/');
                        //语言
                        var language_anchor = page.find('#info span.pl:contains("语言")');
                        var language;
                        if (language_anchor[0]) {
                            language = fetch(language_anchor).split(' / ').join('/');
                        }
                        //上映日期
                        var playdate = page.find('#info span[property="v:initialReleaseDate"]').map(function () {
                            return jq(this).text().trim();
                        }).toArray().sort(function (a, b) { //按上映日期升序排列
                            return new Date(a) - new Date(b);
                        }).join('/');
                        //IMDb链接
                        var imdb_link_anchor = page.find('#info span.pl:contains("IMDb链接")');
                        var imdb_link;
                        if (imdb_link_anchor[0]) {
                            imdb_link = imdb_link_anchor.next().attr('href').replace(/(\/)?$/, '/');
                        }
                        //豆瓣链接
                        var douban_link = 'https://' + res.finalUrl.match(/movie.douban.com\/subject\/\d+\//);
                        //集数
                        var episodes_anchor = page.find('#info span.pl:contains("集数")');
                        var episodes;
                        if (episodes_anchor[0]) {
                            episodes = fetch(episodes_anchor);
                        }
                        //片长
                        var duration_anchor = page.find('#info span.pl:contains("单集片长")');
                        var duration;
                        if (duration_anchor[0]) {
                            duration = fetch(duration_anchor);
                        } else {
                            duration = page.find('#info span[property="v:runtime"]').text().trim();
                        }

                        var director, writer, cast;
                        var awards;
                        var douban_average_rating, douban_votes, douban_rating, introduction = '',
                            poster;
                        var imdb_average_rating, imdb_votes, imdb_rating;
                        var tags;

                        var descriptionGenerator = function () {
                            var descr = "";
                            descr += foreign_title ? ("[b]" + foreign_title + "[/b]\n\n") : "";
                            descr += trans_title ? ('◎译　　名　' + trans_title + "\n") : "";
                            descr += this_title ? ('◎片　　名　' + this_title + "\n") : "";
                            descr += year ? ('◎年　　代　' + year + "\n") : "";
                            descr += region ? ('◎产　　地　' + region + "\n") : "";
                            descr += genre ? ('◎类　　别　' + genre + "\n") : "";
                            descr += language ? ('◎语　　言　' + language + "\n") : "";
                            descr += playdate ? ('◎上映日期　' + playdate + "\n") : "";
                            descr += imdb_rating ? ('◎IMDb评分  ' + imdb_rating + "\n") : "";
                            descr += imdb_link ? ('◎IMDb链接  ' + imdb_link + "\n") : "";
                            descr += douban_rating ? ('◎豆瓣评分　' + douban_rating + "\n") : "";
                            descr += douban_link ? ('◎豆瓣链接　' + douban_link + "\n") : "";
                            descr += episodes ? ('◎集　　数　' + episodes + "\n") : "";
                            descr += duration ? ('◎片　　长　' + duration + "\n") : "";
                            descr += director ? ('◎导　　演　' + director + "\n") : "";
                            descr += writer ? ('◎编　　剧　' + writer + "\n") : "";
                            descr += cast ? ('◎主　　演　' + cast.replace(/\n/g, '\n' + '　'.repeat(4) + '  　').trim() + "\n") : "";
                            descr += tags ? ('\n◎标　　签　' + tags + "\n") : "";
                            descr += introduction ? ('\n◎简　　介\n\n　　' + introduction.replace(/\n/g, '\n' + '　'.repeat(2)) + "\n") : "";
                            descr += awards ? ('\n◎获奖情况\n\n　　' + awards.replace(/\n/g, '\n' + '　'.repeat(2)) + "\n") : "";

                            GM_setClipboard(descr);
                            query_info.html('<b>已复制到剪切板</b>');
                        };
                        // IMDb信息（最慢，最先请求）
                        if (imdb_link) {
                            requestHTML('https://p.media-imdb.com/static-content/documents/v1/title/' + imdb_link.match(/tt\d+/) + '/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json', function (res) {
                                var try_match = res.responseText.match(/imdb.rating.run\((.+)\)/);
                                var a = JSON.parse(try_match[1]);
                                imdb_average_rating = (parseFloat(a.resource.rating).toFixed(1) + '').replace('NaN', '');
                                imdb_votes = a.resource.ratingCount ? a.resource.ratingCount.toLocaleString() : '';
                                imdb_rating = imdb_votes ? imdb_average_rating + '/10 from ' + imdb_votes + ' users' : '';
                                descriptionGenerator();
                            }, function (res) {
                                query_info.html('<b>查询影片的IMDb信息失败</b>');
                            });
                            // IMDb Storyline
                            const TMDB_api_key = atob('OWNmZmQ5MjY4OTUzZDhhYzA1OTYxMWYwMDg2OGNkNmU=');
                            requestJson('https://api.themoviedb.org/3/find/' + imdb_link.match(/tt\d+/) + '?api_key=' + TMDB_api_key + '&external_source=imdb_id', function (res) {
                                let story_line = '';
                                if (res.movie_results.length) {
                                    story_line = res.movie_results[0].overview;
                                } else if (res.tv_episode_results.length) {
                                    story_line = res.tv_episode_results[0].overview;
                                } else if (res.person_results.length) {
                                    story_line = res.person_results[0].overview;
                                } else if (res.tv_results.length) {
                                    story_line = res.tv_results[0].overview;
                                } else if (res.tv_season_results.length) {
                                    story_line = res.tv_season_results[0].overview;
                                }
                                introduction = story_line ? (introduction + '\n\n' + story_line) : introduction;
                                descriptionGenerator();
                            }, function () {
                                query_info.html('<b>查询 IMDb Storyline 失败</b>');
                            });
                        }
                        // 该影片的评奖信息
                        requestHTML(douban_link + 'awards', function (res) {
                            var awards_page = jq(res.responseText.match(/<body[^>]*?>([\S\s]+)<\/body>/)[1].replace(/<script(\s|>)[\S\s]+?<\/script>/g, ''));
                            awards = awards_page.find('#content>div>div.article').html()
                                .replace(/[ \n]/g, '')
                                .replace(/<\/li><li>/g, '</li> <li>')
                                .replace(/<\/a><span/g, '</a> <span')
                                .replace(/<(div|ul)[^>]*>/g, '\n')
                                .replace(/<[^>]+>/g, '')
                                .replace(/&nbsp;/g, ' ')
                                .replace(/ +\n/g, '\n')
                                .trim();
                            descriptionGenerator();
                        }, function (res) {
                            query_info.html('<b>查询影片的获奖情况失败</b>');
                        });
                        //豆瓣评分，简介，海报，导演，编剧，演员，标签
                        requestJson('https://api.douban.com/v2/movie/' + movie_id, function (json) {
                            douban_average_rating = json.rating.average || 0;
                            douban_votes = json.rating.numRaters.toLocaleString() || 0;
                            douban_rating = douban_average_rating + '/10 from ' + douban_votes + ' users';
                            let introduction_t = json.summary.replace(/^None$/g, '暂无相关剧情介绍');
                            introduction = introduction ? (introduction_t + introduction) : introduction_t;
                            poster = json.image.replace(/s(_ratio_poster|pic)/g, 'l$1');
                            director = json.attrs.director ? json.attrs.director.join(' / ') : '';
                            writer = json.attrs.writer ? json.attrs.writer.join(' / ') : '';
                            cast = json.attrs.cast ? json.attrs.cast.join('\n') : '';
                            tags = json.tags.map(function (member) {
                                return member.name;
                            }).join(' | ');
                            descriptionGenerator();
                            downloadPoster([poster]);
                        }, function (res) {
                            query_info.html('<b>查询影片的豆瓣信息失败</b>')
                        });
                    }
                }, function (res) {
                    query_info.html('<b>查询影片的豆瓣信息失败</b>');
                });
            } else if (query_input.match(/(bgm\.tv|bangumi\.tv|chii\.in)\/subject/)) {
                query_info.text("识别输入为Bgm链接，查询中......");
                // 以下Bgm相关解析修改自 `https://github.com/Rhilip/PT-help/blob/master/docs/js/Bangumi%20-%20Info%20Export.user.js` 对此表示感谢a
                const STAFFSTART = 4; // 读取Staff栏的起始位置（假定bgm的顺序为中文名、话数、放送开始、放送星期... ，staff从第四个 导演 起算）；初始值为 4（对于新番比较合适）
                const STAFFNUMBER = 9; // 读取Staff栏数目；初始9，可加大，溢出时按最大可能的staff数读取，如需读取全部请设置值为 Number.MAX_VALUE (或一个你觉得可能最大的值 eg.20)
                requestHTML(query_input, function (res) {
                    var page = jq(res.responseText.match(/<body[^>]*?>([\S\s]+)<\/body>/)[1].replace(/<script(\s|>)[\S\s]+?<\/script>/g, ''));
                    var img = page.find("div#bangumiInfo>div>div:nth-child(1)>a>img").attr("src").replace(/cover\/[lcmsg]/, "cover/l");
                    img = img.match(/^http/) ? img : 'http:' + img;
                    downloadPoster([img]);
                    // 主介绍
                    var story = page.find("div#subject_summary").text(); //Story
                    var raw_staff = [],
                        staff_box = page.find("ul#infobox"); //Staff
                    for (var staff_number = STAFFSTART; staff_number < Math.min(STAFFNUMBER + STAFFSTART, staff_box.children("li").length); staff_number++) {
                        raw_staff[staff_number - STAFFSTART] = staff_box.children("li").eq(staff_number).text();
                    }
                    var raw_cast = [],
                        cast_box = page.find("ul#browserItemList"); //Cast
                    for (var cast_number = 0; cast_number < cast_box.children("li").length; cast_number++) {
                        var cast_name = cast_box.children("li").eq(cast_number).find("span.tip").text();
                        if (!(cast_name.length)) { //如果不存在中文名，则用cv日文名代替
                            cast_name = cast_box.children("li").eq(cast_number).find("div > strong > a").text().replace(/(^\s*)|(\s*$)/g, ""); //#browserItemList > li > div > strong > a
                        }
                        var cv_name = cast_box.children("li").eq(cast_number).find("span.tip_j > a").text();
                        raw_cast[cast_number] = cast_name + ' : ' + cv_name;
                        //console.log(raw_cast[cast_number]);
                    }

                    var outtext = "\n\n" + // img + "\n\n" +
                        "[b]STORY : [/b]\n" + story + "\n\n" +
                        "[b]STAFF : [/b]\n" + raw_staff.join("\n") + "\n\n" +
                        "[b]CAST : [/b]\n" + raw_cast.join("\n") + "\n\n" +
                        "(来源于 " + res.finalUrl + " )\n";

                    GM_setClipboard(outtext);
                    query_info.html('<b>已复制到剪切板</b>');
                }, function (res) {
                    query_info.html('<b>查询影片的豆瓣信息失败</b>');
                });
            } else if (query_input.match(/(store\.steampowered\.com|steamcommunity\.com)/)) {
                query_info.text("识别输入为Steam链接，查询中......");
                requestJson('https://api.rhilip.info/tool/movieinfo/gen?url=' + query_input, function (json) {
                    if (json.success) {
                        var steam_info = json.format;
                        var img_arr = [];
                        steam_info = steam_info.replace(/\[img\][\s\S]*?\[\/img\]/g, function (m) {
                            var h = m.replace(/\[\/?img\]/g, "");
                            img_arr.push(h);
                            return h;
                        });
                        downloadPoster(img_arr);
                        GM_setClipboard(steam_info);
                        query_info.html('<b>已复制到剪切板</b>');
                    } else {
                        query_info.html('<b>查询Steam信息失败</b>');
                    }
                }, function (res) {
                    query_info.html('<b>查询Steam信息失败</b>');
                });
            } else {
                query_info.html('<b>不支持这种链接(ノ｀Д)ノ</b>');
            }
        } else {
            query_info.text('识别输入内容为文字格式，尝试搜索.......');
            var Search_From_API = function (url, successHandle) {
                requestHTML(url, function (resj) {
                    query_info.text("请求成功，请选择对应链接");
                    var search_html = successHandle(resj);
                    if (search_html) {
                        var qshtml = '<h3 class="flb"><em id="return_reply">查询结果</em><span><a href="javascript:;" class="flbc" onclick="hideWindow(\'qszs\')" title="\u5173\u95ed">\u5173\u95ed</a></span></h3><div id="hdsettingdialog" style="width:680px;height:320px;">' +
                            '<div class="c" style="height:357px;">' +
                            '<div id="query_res" style="overflow-y:scroll;width:650px; height:300px;">';
                        qshtml += search_html;
                        qshtml += '</div></div></div><style>#query_res span{display:inline-block;width: 55px}</style>';
                        showWindow('qszs', qshtml, 'html');
                        jq("a.res_search_choose").click(function () {
                            var tag = jq(this);
                            jq('#query_input').val(tag.attr("data-url"));
                            jq('#query_btn').click();
                            hideWindow('qszs');
                        });

                    } else {
                        query_info.html('<b>无搜索结果</b>');
                    }
                }, function (res) {
                    query_info.html('<b>搜索失败</b>');
                });
            };
            let query_typeid = jq('select#query_typeid').val();
            if (query_typeid == 2) { // Bgm
                Search_From_API("https://api.bgm.tv/search/subject/" + query_input + "?responseGroup=large&max_results=20&start=0", function (res) {
                    let resj = JSON.parse(res.responseText);
                    let search_html = "";
                    if (resj.results !== 0) {
                        search_html = '<table id="search_res_table" style="width: 100%" cellspacing="10px"><tr bgcolor="#F3F781">' +
                            '<th style="width: 15%">放送<br>开始</th>' +
                            '<th style="width: 15%">类别</th>' +
                            '<th style="width: 54%">名称</th>' +
                            '<th align="center" style="width: 8%">Bangumi</th>' +
                            '<th align="center" style="width: 8%"></th></tr>';
                        let tp_dict = {
                            1: "漫画/小说",
                            2: "动画/二次元番",
                            3: "音乐",
                            4: "游戏",
                            6: "三次元番"
                        };
                        for (let i_bgm = 0; i_bgm < resj.list.length; i_bgm++) {
                            let i_item = resj.list[i_bgm];
                            let bg_color = (i_bgm % 2 == 1) ? " bgcolor=\"#E8E8E8\"" : "";
                            search_html += "<tr" + bg_color + "><td>" + i_item.air_date + "</td><td>" + tp_dict[i_item.type] + "</td><td>" + i_item.name_cn + " | " + i_item.name + "</td><td align=\"center\"><a href='" + i_item.url + "' target='_blank'>" + i_item.id + "</a></td><td align=\"center\"><a href='javascript:void(0);' class='res_search_choose' data-url='" + i_item.url + "'><b>选择</b></a></td></tr>";
                        }
                        search_html += "</table>";
                    }
                    return search_html;
                });
            } else if (query_typeid == 3) { //Steam
                query_input = query_input.trim().replace(/[\.\s]+/g, '+');
                Search_From_API('https://store.steampowered.com/search/?term=' + query_input, function (res) {
                    let page = jq(res.responseText.match(/<body[^>]*?>([\S\s]+)<\/body>/)[1].replace(/<script(\s|>)[\S\s]+?<\/script>/g, ''));
                    var search_html = "";
                    if (page.find('a.search_result_row').length) {
                        search_html = '<table id="search_res_table" style="width: 100%" cellspacing="10px"><tr bgcolor="#F3F781">' +
                            '<th style="width: 20%">日期</th>' +
                            '<th style="width: 45%">标题</th>' +
                            '<th style="width: 15%">平台</th>' +
                            '<th style="width: 10%">费用</th>' +
                            '<th style="width: 10%" align="center"></th></tr>';
                        let index = 0;
                        page.find('a.search_result_row').each(function () {
                            let a_result = jq(this);
                            let publish_date = a_result.find('div.search_released').text();
                            let title = a_result.find('span.title').text();
                            let plat = a_result.find('div.search_name.ellipsis>p').html().match(/(win|mac|linux)/ig).join('|');
                            let price = a_result.find('div.search_price').text().trim().match(/¥ \d+$/);
                            price = price ? price[0] : '';
                            let alt = 'https://store.steampowered.com/app/' + a_result.attr('data-ds-appid');
                            let bg_color = (index % 2 == 1) ? " bgcolor=\"#E8E8E8\"" : "";
                            index++;
                            search_html += "<tr" + bg_color + "><td>" + publish_date + "</td><td>" + title + "</td><td>" + plat + "</td><td>" + price + "</td><td align=\"center\"><a href='javascript:void(0);' class='res_search_choose' data-url='" + alt + "'><b>选择</b></a></td></tr>";
                        });
                        search_html += "</table>";
                    }
                    return search_html;
                });
            } else { // Douban
                Search_From_API("https://api.douban.com/v2/movie/search?q=" + query_input, function (res) {
                    let resj = JSON.parse(res.responseText);
                    let search_html = "";
                    if (resj.total !== 0) {
                        search_html = '<table id="search_res_table" style="width: 100%" cellspacing="10px"><tr bgcolor="#F3F781">' +
                            '<th style="width: 10%">年代</th>' +
                            '<th style="width: 10%">类别</th>' +
                            '<th style="width: 40%">标题</th>' +
                            '<th style="width: 30%">豆瓣</th>' +
                            '<th style="width: 10%" align="center"></th></tr>';
                        for (let i_douban = 0; i_douban < resj.subjects.length; i_douban++) {
                            let i_item = resj.subjects[i_douban];
                            let bg_color = (i_douban % 2 == 1) ? " bgcolor=\"#E8E8E8\"" : "";
                            search_html += "<tr" + bg_color + "><td>" + i_item.year + "</td><td>" + i_item.subtype + "</td><td>" + i_item.title + "</td><td><a href='" + i_item.alt + "' target='_blank'>" + i_item.alt + "</a></td><td align=\"center\"><a href='javascript:void(0);' class='res_search_choose' data-url='" + i_item.alt + "'><b>选择</b></a></td></tr>";
                        }
                        search_html += "</table>";
                    }
                    return search_html;
                });
            }
        }
    });

    function fillSeedInfo(title, desc, link, tag) {
        jq('#subject').val(title); //填写标题
        jq('#query_input').val(link);

        let m_am = jq('#e_textarea').html().match(/\[table[\s\S]+?\[\/table\]/);
        if (m_am) {
            let gong_gao = "[align=center]" + m_am[0] + "[/align]";
            desc = desc.replace(/^(<br\s*\/*>)*/, '');
            jq('#e_iframe').contents().find('body').html(bbcode2html(gong_gao) + desc);
        } else {
            jq('#e_iframe').contents().find('body').html(desc);
        }
        jq('#tags').val(tag);
    }

    function getMoiveInfoLink(title, desc) {
        let bgm_match = desc.match(/http.+?(bgm\.tv|bangumi\.tv|chii\.in)\/subject\/\d+/);
        if (bgm_match) {
            return bgm_match[0];
        }
        let douban_match = desc.match(/movie\.douban\.com\/subject\/(\d+)/);
        if (douban_match) {
            return 'https://movie.douban.com/subject/' + douban_match[1];
        }
        let imdb_match = desc.match(/www\.imdb\.com\/title\/(tt\d+)/);
        if (imdb_match) {
            return imdb_match[1];
        }
        let steam_match = desc.match(/http.+?(store\.steampowered\.com|steamcommunity\.com)\/app\/\d+/);
        if (steam_match) {
            return steam_match[0];
        }
        let title_match = title.match(/\[([\s\S]+?)[\/\]]/);
        return title_match ? title_match[1].trim() : "";
    }

    jq('#clone_btn').click(function () {
        var info = jq('#clone_info');
        let copy_link = jq('#clone_from').val().trim();
        if (copy_link == '') {
            info.html('<b>请输入链接</b>')
            return;
        }
        if (/^\d+$/.test(copy_link) || copy_link.match(/bt\.neu6\.edu\.cn/)) {
            let seedfrom = (/^\d+$/.test(copy_link)) ? copy_link : copy_link.match(/(thread-|tid=)(\d+)/)[2];
            // 如果输入了有效的编号，开始读取对应的种子页面
            info.html('<b>正在读取...</b>');
            jq.get('http://bt.neu6.edu.cn/thread-' + seedfrom + '-1-1.html', function (resp) {
                info.html('<b>正在分析...</b>');
                let body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0].replace(/来自群组: <a[\s\S]*?a>/, "");
                let page = jq(body); // 构造 jQuery 对象，用于后期处理
                let title = page.find("span#thread_subject").text();
                if (!title) {
                    info.html('<b>失败，可能由于种子不存在或者网络问题</b>');
                    return;
                }
                if (AutoAdd) {
                    if (forum_id == 48) { //高清剧集
                        let tv_name = title.match(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/);
                        if (tv_name) {
                            let tv_season = tvseasonhandle(tv_name[0], 48);
                            title = title.replace(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/, tv_season);
                        }
                    } else if (forum_id == 14) { //电视剧集
                        let tv_name1 = title.match(/\[[ESP]{0,2}\d{2}[-\w]*\d{0,2}\]/);
                        if (tv_name1) {
                            let tv_season1 = tvseasonhandle(tv_name1[0], 14);
                            title = title.replace(/\[[ESP]{0,2}\d{2}[-\w]*\d{0,2}\]/, tv_season1);
                        }
                    } else if (forum_id == 44) { //动漫
                        let tv_name2 = title.match(/\[[ES]{0,2}\d{2,3}[-E\/]{0,2}\d{0,3}[\s\S]*?\]/);
                        if (tv_name2) {
                            let tv_season2 = tvseasonhandle(tv_name2[0], 44);
                            title = title.replace(/\[[ES]{0,2}\d{2,3}[-E\/]{0,2}\d{0,3}[\s\S]*?\]/, tv_season2);
                        }
                    } else if (forum_id == 16) { //综艺娱乐
                        let fields = title.match(/\[[^\]]*\]/g);
                        if (fields[0].length === 10) {
                            let dayofmonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                            let year = fields[0].substring(1, 5);
                            let month = fields[0].substring(5, 7);
                            let day = fields[0].substring(7, 9);
                            if (leapyear(parseInt(year))) {
                                dayofmonths[1] += 1;
                            }
                            let monthadd = parseInt((parseInt(day) + 7) / dayofmonths[parseInt(month) - 1]);
                            day = numatostring2((parseInt(day) + 7) % dayofmonths[parseInt(month) - 1]);
                            let yearadd = 0;
                            if ((parseInt(month) + monthadd) > 12) {
                                yearadd = 1;
                            }
                            year = parseInt(year) + yearadd;
                            month = numatostring2((parseInt(month) + monthadd) % 12);
                            fields[0] = "[" + year + month + day + "]";
                        }
                        fields[3] = "[]";
                        title = "";
                        for (let i = 0; i < fields.length; i++) {
                            title = title + fields[i];
                        }
                    }
                }

                //填写分类
                let oldtype = page.find('a#newspecial').attr("onclick").match(/fid=(\d+)/)[1];
                let newtype = location.href.match(/fid=(\d+)/)[1];
                if (page.find("h1.ts a").length) {
                    let movietype = page.find("h1.ts a").text().replace(/^\[|\]$/g, '');
                    let typeid = page.find("h1.ts a").attr("href").match(/typeid=(\d+)/)[1];
                    // 如果发布种子与引用的种子的版块不一样
                    if (oldtype != newtype) {
                        let type_id_name = {
                            "48": {
                                "247": "大陆",
                                "248": "港台",
                                "249": "其他1",
                                "250": "其他2",
                                "251": "其他",
                                "252": "版务公告"
                            },
                            "77": {
                                "178": "大陆",
                                "179": "港台",
                                "180": "其他1",
                                "181": "其他2",
                                "182": "其他"
                            },
                            "14": {
                                "101": "大陆",
                                "102": "港台",
                                "103": "其他1",
                                "104": "其他2",
                                "105": "其他",
                                "106": "版务公告"
                            },
                            "73": {
                                "298": "大陆",
                                "299": "港台",
                                "300": "其他1",
                                "301": "其他2",
                                "302": "其他",
                                "303": "版务公告"
                            },
                            "45": {
                                "231": "大陆",
                                "232": "港台",
                                "233": "日韩",
                                "234": "欧美",
                                "235": "其他",
                                "236": "版务公告"
                            },
                            "13": {
                                "94": "大陆",
                                "95": "港台",
                                "96": "日韩",
                                "97": "欧美",
                                "98": "其他",
                                "99": "版务公告",
                                "100": "移动视频"
                            }
                        };
                        let matched = false;
                        for (let k in type_id_name[newtype]) {
                            if (movietype == type_id_name[newtype][k]) {
                                typeid = k;
                                matched = true;
                                break;
                            }
                        }
                        typeid = (matched) ? typeid : 0;
                    }
                    if (movietype && typeid) {
                        jq('#typeid_ctrl_menu li').removeClass('current');
                        jq('#typeid_ctrl').html(movietype);
                        jq('#typeid>option').val(typeid);
                    }
                }
                //对将要填入的内容部分进行预处理
                let descr = page.find('td.t_f').first();
                //如果存在修改信息(本帖最后由 xxxxxx 于 yyyy-MM-dd HH:mm 编辑)，则删除
                if (descr.find('.pstatus').length) {
                    descr.find('.pstatus').remove();
                    //删除修改信息与正文之间两个空行
                    descr.find('br').eq(0).remove();
                    descr.find('br').eq(0).remove();
                }
                //图片处理（对上传的图片）
                descr.find('ignore_js_op').each(function () {
                    let img = jq(this).find('img:first');
                    //借用file属性信息修正引用过程中出错的src信息
                    img.attr('src', 'http://bt.neu6.edu.cn' + img.attr('file'));
                    //移除引用过程中原图片无用的img属性
                    img.removeAttr('file id aid zoomfile class inpost onmouseover onclick');
                    let hideimg = img.parent('ignore_js_op'); //移动img结点
                    img.insertAfter(hideimg);
                });
                //代码部分处理
                descr.find('div.quote').remove();
                descr.find('.blockcode').remove();
                descr.find('blockcode').remove();
                //移除含有图片或附件的父节点
                descr.find('ignore_js_op').remove();
                // 影片链接
                let link = getMoiveInfoLink(title, descr.text());
                // 公告
                if (jq('#e_textarea').html().match(/\[table[\s\S]+?\[\/table\]/)) {
                    descr.find('table:first').remove();
                }
                //标签
                let tag = [];
                page.find('div.ptg.mbm.mtn a').each(function () {
                    tag.push(jq(this).text());
                });
                // 填写信息
                fillSeedInfo(title, descr.html(), link, tag.join(','));
                info.html('<b>克隆种子信息完成</b>');
            });
        } else {
            info.html('<b>请输入有效的种子链接</b>');
        }
    });

    jq("div.specialpost.s_clear input").bind("change", seedname_copy);
    if (SearchEnhanceDefaultShow) {
        jq("div#mysearchbox").show();
    }
    let match = location.href.match(/#clone_(\d+)/);
    if (match) {
        jq('#clone_from').val(match[1]);
        history.pushState("", document.title, location.href.replace(/#clone_\d+/, ""));
        jq('#clone_btn').click();
    }
    if (location.href.match(/action=edit/)) {
        jq('#query_input').val(getMoiveInfoLink(jq('#subject').val(), jq('#e_textarea').html()));
    }

    jq(window).resize(function () {
        jq("#subject").width(jq('#postbox').width() - 130);
        jq("div.specialpost.s_clear input").width(jq('#postbox').width() - 450);
    });

})();