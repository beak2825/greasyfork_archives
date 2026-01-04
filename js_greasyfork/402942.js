// ==UserScript==
// @name            PT种子搬运助手
// @name:en         Seed Info Clone
// @author          pt daoshuailx
// @description     一键克隆已有种子的信息，一键搬运种子到其他站点
// @description:en  Clone Seed Info to another site
// @namespace       plexpt
// @include         http*://*/details.php*
// @include         http*://*/upload.php*
// @include         http*://totheglory.im/t/*
// @icon            https://i.loli.net/2020/05/11/VMZodaAxQvBPmy1.png
// @run-at          document-end
// @grant           none
// @version         2020.4
// @note            20171030 用代码美化工具美化代码
// @note            20171031 修改CMCT 发布部分,加入麦田PT 标题的代码
// @note            20171103 修改TTG 候选为 直接发布，并优化TTG发布代码
// @note            20171105 增加 TTG DOA 发布代码
// @note            20171120 增加 极视定制代码
// @note            20171121 修正 TTG 单集发布问题
// @note            20180105 转发时保留字体和文字大小
// @note            20180110 转发时保留字体颜色
// @note            20180112 转发时保留链接属性
// @note            2020 重写
// @downloadURL https://update.greasyfork.org/scripts/402942/PT%E7%A7%8D%E5%AD%90%E6%90%AC%E8%BF%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/402942/PT%E7%A7%8D%E5%AD%90%E6%90%AC%E8%BF%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var New_descr = decodeURI(location.href)

if ((New_descr.match(/http(s*):\/\/.*\/details.php.*/i) || New_descr.match(/http(s*):\/\/totheglory.im\/t\/.*/i)) && !New_descr.match(/http(s*):\/\/.*\/(upload|offer).php#clone/i)) {
    var str_title = ''
    var title = document.getElementById("top")
    if (New_descr.match(/http(s*):\/\/totheglory.im.*/i)) {
        title = document.getElementsByTagName("h1")[0]
    }
    if (location.href.match(/http(s*):\/\/bt.byr.cn\/.*/i)) {
        title = document.getElementById("share")
    }

    for (i = 0; i < title.childNodes.length; i++) {
        str_title = str_title + title.childNodes[i].textContent
    }

    function walkDOM(n) {
        do {
            if (n.nodeName == 'FONT') {
                if (n.size != '') {
                    n.innerHTML = '[size=' + n.size + ']' + n.innerHTML + '[/size]'
                }
                if (n.face != '') {
                    n.innerHTML = '[font=' + n.face + ']' + n.innerHTML + '[/font]'
                }
            }
            if (n.nodeName == 'SPAN') {
                if (n.style.color != '') {
                    n.innerHTML = '[color=' + n.style.color + ']' + n.innerHTML + '[/color]'
                }
            }
            if (n.nodeName == 'A') {
                n.innerHTML = '[URL=' + n.href + ']' + n.innerHTML + '[/URL]'
            }
            if (n.nodeName == 'FIELDSET') {
                n.innerHTML = '[quote]' + n.innerHTML + '[/quote]'
            }
            if (n.nodeName == 'DIV' && n.innerHTML == '代码') {
                n.innerHTML = ''
                n.nextSibling.innerHTML = '[code]' + n.nextSibling.innerHTML + '[/code]'
            }
            if (n.nodeName == 'LEGEND') {
                n.innerHTML = ''
            }
            if (n.nodeName == 'FIELDSET' && n.textContent.match(/(温馨提示|郑重声明|您的保种)/g)) {

            } else {
                if (n.hasChildNodes()) {
                    walkDOM(n.firstChild)
                } else {
                    if (n.nodeType == 1) {
                        if (n.nodeName == 'IMG') {
                            str_seed_descr = str_seed_descr + '[IMG]' + n.src + '[/IMG]'
                        }
                    } else {
                        if (n.nodeType == 3) {
                            str_seed_descr = str_seed_descr + n.textContent
                        }
                    }
                }
            }

        } while (n = n.nextSibling)

        return str_seed_descr;
    }

    if (New_descr.match(/http(s*):\/\/totheglory.im.*/i)) {
        seed_descr = document.getElementById("kt_d")
    } else {
        seed_descr = document.getElementById("kdescr");
    }

    str_seed_descr = ''
    var x = seed_descr.parentNode.parentNode.parentNode;
    seed_descr = seed_descr.cloneNode(true);

    str_seed_descr = walkDOM(seed_descr) //遍历 HTML
    x = x.getElementsByTagName("td");

    var w
    var seed_type = '0'
    for (i = 0; i < x.length; i++) {
        if (x[i].innerHTML == '行为' || x[i].innerHTML == '小货车' || x[i].innerHTML == '行為') {
            w = x[i].parentNode.parentNode;
            var y = w.insertRow(i / 2 + 1);
        }
        if (x[i].innerHTML == '副标题' || x[i].innerHTML == '副標題') {
            str_subtitle = x[i].parentNode.lastChild.textContent;
        }
        if (x[i].innerHTML == '基本信息' || x[i].innerHTML == '类型') {
            if (x[i + 1].textContent.match(/(Movies|电影)/i)) {
                seed_type = '1'
            }
            if (x[i + 1].textContent.match(/(TV|剧)/i)) {
                seed_type = '2'
            }
        }
    }

    if (New_descr.match(/http(s*):\/\/totheglory.im.*/i)) {

        str_subtitle = str_title.slice(str_title.indexOf('\['), str_title.length)
        str_title = str_title.slice(0, str_title.indexOf('\['))
        if (str_seed_descr.match(/\[IMG\]http(s*):\/\/totheglory.im\/pic\/ico_(free|half|30).gif/i)) {
            str_seed_descr = str_seed_descr.slice(0, str_seed_descr.search(/\[IMG\]http(s*):\/\/totheglory.im\/pic\/ico_(free|half|30).gif/i))
        }
    }


    var q = y.insertCell(0);
    var z = y.insertCell(1);

    q.innerHTML = "搬运种子";
    q.valign = "top"
    q.align = "right"
    //q.style.fontweight="bolder"

    z.innerHTML = "";
    z.valign = "top"
    z.align = "left"
    //z.style.fontweight="bolder"

    if (New_descr.match(/http(s*):\/\/springsunday.net\/details.php.*/i)) {
        q.style.fontweight = "900"
        q.style.border = "1px solid #D0D0D0"
        z.style.border = "1px solid #D0D0D0"
    }


    var para, Cimg

    var sitename = new Array()
    var sitelink = new Array()

    sitename[0] = "馒头"
    sitelink[0] = "https://pt.m-team.cc/upload.php"
    sitename[1] = "天空"
    sitelink[1] = "https://hdsky.me/upload.php"
    sitename[2] = "TTG"
    sitelink[2] = "https://totheglory.im/upload.php"
    sitename[3] = "我堡"
    sitelink[3] = "https://ourbits.club/upload.php"
    sitename[4] = "彩虹岛"
    sitelink[4] = "https://chdbits.co/upload.php"
    sitename[5] = "瓷器"
    sitelink[5] = "https://hdchina.org/upload.php"
    sitename[6] = "SSD"
    sitelink[6] = "https://springsunday.net/upload.php"
    sitename[7] = "家园"
    sitelink[7] = "https://hdhome.org/upload.php"
    sitename[8] = "铂金家"
    sitelink[8] = "http://www.pthome.net/upload.php"
    sitename[9] = "南洋"
    sitelink[9] = "https://nanyangpt.com/upload.php"
    sitename[10] = "北洋"
    sitelink[10] = "https://www.tjupt.org/upload.php"
    sitename[11] = "葡萄"
    sitelink[11] = "https://pt.sjtu.edu.cn/upload.php"
    sitename[12] = "幼儿园U2"
    sitelink[12] = "https://u2.dmhy.org/upload.php"
    sitename[13] = "HDCity"
    sitelink[13] = "https://hdcity.city/upload"
    sitename[14] = "高清街"
    sitelink[14] = "https://hdstreet.club/upload.php"
    sitename[15] = "萌猫"
    sitelink[15] = "http://moecat.best/upload.php"
    sitename[16] = "学校"
    sitelink[16] = "http://pt.btschool.club/upload.php"
    sitename[17] = "烧包"
    sitelink[17] = "https://ptsbao.club/upload.php"
    sitename[18] = "JoyHD"
    sitelink[18] = "https://www.joyhd.net/upload.php"
    sitename[20] = "TCCF"
    sitelink[20] = "https://et8.org/upload.php"
    sitename[21] = "1PT吧"
    sitelink[21] = "https://1ptba.com/upload.php"
    sitename[22] = "NicePT"
    sitelink[22] = "https://www.nicept.net/upload.php"
    sitename[23] = "CCFBits"
    sitelink[23] = "http://ccfbits.org/upload.php"
    sitename[24] = "Oshen"
    sitelink[24] = "http://www.oshen.win/upload.php"
    sitename[25] = "52PT"
    sitelink[25] = "https://52pt.site/upload.php"
    sitename[26] = "PT99"
    sitelink[26] = "http://pt.j99.info/upload.php"
    sitename[27] = "PTer猫站"
    sitelink[27] = "http://pterclub.com/upload.php"
    sitename[28] = "HDtime"
    sitelink[28] = "https://hdtime.org/upload.php"
    sitename[29] = "PTMSG"
    sitelink[29] = "https://pt.msg.vg/upload.php"
    sitename[30] = "HDU"
    sitelink[30] = "http://pt.upxin.net/upload.php"
    sitename[31] = "HDZone"
    sitelink[31] = "http://hdzone.me/upload.php"
    sitename[32] = "SoulVoice"
    sitelink[32] = "https://pt.soulvoice.club/upload.php"
    sitename[33] = "DiscFan"
    sitelink[33] = "https://discfan.net/upload.php"
    sitename[34] = "杜比"
    sitelink[34] = "https://www.hddolby.com/upload.php"
    sitename[35] = "HDArea"
    sitelink[35] = "https://www.hdarea.co/upload.php"
    sitename[36] = "TLFBits"
    sitelink[36] = "https://pt.eastgame.org/upload.php"
    sitename[37] = "Brobits"
    sitelink[37] = "https://brobits.cc/upload.php"
    sitename[38] = "HDBug"
    sitelink[38] = "https://hdbug.best/upload.php"
    sitename[39] = "WeGeek"
    sitelink[39] = "https://www.wegeek.org/upload.php"
    sitename[40] = "YDY"
    sitelink[40] = "https://pt.hdbd.us/upload.php"
    sitename[41] = "映客"
    sitelink[41] = "https://yingk.com/upload.php"
    sitename[42] = "百川PT"
    sitelink[42] = "https://www.hitpt.com/upload.php"
    sitename[43] = "HDR"
    sitelink[43] = "http://www.hdroute.org/upload.php"
    sitename[44] = "柠檬"
    sitelink[44] = "https://leaguehd.com/upload.php"
    sitename[45] = "海胆"
    sitelink[45] = "https://www.haidan.video/upload.php"


    /*
    if (seed_type=='2'){
      sitelink[2] = "http://bt.byr.cn/upload.php?type=401"
    }
    */

    var i
    for (i = 0; i < sitename.length; i++) {
        // if (i > 0) {
        //     z.innerHTML = z.innerHTML + ' | '
        // }
        Cimg = document.createElement("img");
        para = document.createElement("a");

        z.appendChild(para);
        para.target = "_blank"
        para.innerHTML = '' + ' ' + sitename[i];
        para.href = sitelink[i] + encodeURI('#clone_' + '#seed_type_' + seed_type + str_title + '#title_' + str_subtitle + '#subtitle_' + str_seed_descr)
        //插入样式
        para.style.cssText = "border-collapse: collapse;font-size: 9pt;color: #fff;text-align: center;float: left;margin: 2px;padding: 2px 8px;height: 17px;background: #06c;";
    }

} else { //发布页面代码

    /*
    var userlink=document.getElementsByTagName("a")
    for (i = 0; i < userlink.length; i++) {
      if (userlink[i].textContent.match(/daoshuailx/g)){
      }
    }    */

    var sitename = New_descr.match(/http(s*):\/\/.*\/(upload|offer).php/i)
    var seed_name = ''
    var small_descr = '' //副标题

    if (New_descr.match(/#seed_type_(\d)/g)) {
        seed_type = New_descr.match(/#seed_type_(\d)/g)
        New_descr = New_descr.replace(seed_type, '')

        if (New_descr.match(/http(s*):\/\/ourbits.club\/upload.php/i)) {
            sitename = 'OB'
            document.getElementById("tagGF").checked = false	//默认勾选官方发布
        }
        if (New_descr.match(/http(s*):\/\/hdhome.org\/upload.php/i)) {
            sitename = 'HDH'
        }
        if (New_descr.match(/http(s*):\/\/chdbits.co\/upload.php/i)) {
            sitename = 'CHD'
        }
        if (New_descr.match(/http(s*):\/\/tp.m-team.cc\/upload.php/i)) {
            sitename = 'M-Team'
        }
        if (New_descr.match(/http(s*):\/\/totheglory.im\/upload.php/i)) {
            sitename = 'TTG'
        }
        if (New_descr.match(/http(s*):\/\/totheglory.im\/upload.php\?team=doa/i)) {
            sitename = 'TTG DOA'
        }
        if (New_descr.match(/http(s*):\/\/pt.nwsuaf6.edu.cn\/upload.php/i)) {
            sitename = 'MT'
        }
        if (New_descr.match(/http(s*):\/\/springsunday.net\/upload.php/i)) {
            sitename = 'SSD'
        }
        if (New_descr.match(/http(s*):\/\/nanyangpt.com\/upload.php/i)) {
            sitename = 'NY'
        }
        if (New_descr.match(/http(s*):\/\/www.hyperay.org\/upload.php/i)) {
            sitename = 'HYP'
        }
        if (New_descr.match(/http(s*):\/\/www.tjupt.org\/upload.php/i)) {
            sitename = 'BYY'
        }
        if (New_descr.match(/http(s*):\/\/hdsky.me\/upload.php/i)) {
            sitename = 'HDSky'
        }
        if (New_descr.match(/http(s*):\/\/hudbt.hust.edu.cn\/upload.php/i)) {
            sitename = 'HUDPT'
        }

        if (sitename == 'NY' || sitename == 'SSD') {
            if (seed_type == "#seed_type_1") {
                document.getElementById("browsecat").options[1].selected = true
            }
            if (seed_type == "#seed_type_2") {
                document.getElementById("browsecat").options[2].selected = true
            }
        }
        if (sitename == 'HDSky') {
            document.getElementById("browsecat").options[5].selected = true
        }

        //New_descr.replace(seed_type, '')
        New_descr = New_descr.replace(/http(s*):\/\/.*\/(upload|offer).php/i, '')
        //New_descr = New_descr.replace(/#clone_/g, '')
        seed_name = New_descr.slice(New_descr.search('#clone_') + 7, New_descr.search('#title_'));
        small_descr = New_descr.slice(New_descr.search('#title_') + 7, New_descr.search('#subtitle_')) //处理副标题
        small_descr = small_descr.replace(/(\[|\])/g, "")
        if (seed_name.match(/\[(\d+)%\]/g)) {
            seed_name = seed_name.replace(/\[(\d+)%\]/g, '')
        }
        if (New_descr.search('[免费]') > 0) {
            seed_name = seed_name.slice(0, New_descr.search('[免费]') - 1)
        }
        seed_name = seed_name.replace(/^\s+|\s+$/g, '');
        allinput = document.getElementsByTagName("input")
        for (i = 0; i < allinput.length; i++) {
            //if New_descr.match(/#seed_type_(\d+)/){
            //}
            if (allinput[i].name == 'name') { //标题
                allinput[i].value = seed_name
                allinput[i].id = "seed_name"
            }
            if (allinput[i].name == 'small_descr') { //副标题
                allinput[i].id = "small_descr"
                allinput[i].value = small_descr
            }
            if (allinput[i].name == 'url' && allinput[i].type == "text") {
                if (New_descr.match(/http(s*):\/\/www.imdb.com\/title\/tt(\d+)/i)) {
                    allinput[i].value = New_descr.match(/http(s*):\/\/www.imdb.com\/title\/tt(\d+)/i)[0] + '/'
                }
            }
            if (allinput[i].name == 'imdburl') {
                if (New_descr.match(/http(s*):\/\/www.imdb.com\/title\/tt(\d+)/i)) {
                    allinput[i].value = New_descr.match(/http(s*):\/\/www.imdb.com\/title\/tt(\d+)/i)[0] + '/'
                }
            }
            if (allinput[i].name == 'imdb_c') {
                if (New_descr.match(/http(s*):\/\/www.imdb.com\/title\/tt(\d+)/i)) {
                    allinput[i].value = New_descr.match(/http(s*):\/\/www.imdb.com\/title\/tt(\d+)/i)[0] + '/'
                }
            }
            if (allinput[i].name == 'dburl') {
                if (New_descr.match(/http(s*):\/\/(\w+).douban.com\/subject\/(\d+)/i)) {
                    allinput[i].value = New_descr.match(/http(s*):\/\/(\w+).douban.com\/subject\/(\d+)/i)[0] + '/'
                }
            }
            if (allinput[i].name == 'uplver') {    //匿名发布
                allinput[i].checked = true
            }
            if (allinput[i].name == 'file') {
                allinput[i].id = 'torrent'
            }
        }
        if (sitename == 'CHD') {
            document.getElementById("bbcode").value = New_descr.slice(New_descr.search('#subtitle_') + 10, New_descr.length) //种子简介
        } else {
            if (sitename == 'TTG' || sitename == 'TTG DOA') {
                document.getElementsByTagName("textarea")[0].value = New_descr.slice(New_descr.search('#subtitle_') + 10, New_descr.length)
            } else {
                document.getElementById("descr").value = New_descr.slice(New_descr.search('#subtitle_') + 10, New_descr.length) //种子简介
            }
        }

        function analysetorrentname() {

            var chname = '' //中文名
            var seed_year = '' //年代
            var series_pack = '' //剧集信息  0 为单集剧集，1 为剧集包
            var series_info = '' //剧集季度信息
            var medium_sel = '' //媒介:
            var codec_sel = '' //视频编码
            var audiocodec_sel = '' //音频编码
            var standard_sel = '' //分辨率
            var team_sel = '' //制作组

            elementnew = document.getElementById("torrent").value;

            if (sitename != 'TTG' && sitename != 'TTG DOA') {
                chname = document.getElementById("small_descr").value.slice(0, document.getElementById("small_descr").value.indexOf(' '))
            }
            if (elementnew == '') {
                alert('请先选择种子文件')
            } else {
                elementnew = elementnew.slice(elementnew.lastIndexOf('\\') + 1, elementnew.length)
                elementnew = elementnew.replace(/\[.*\]\./i, '')
                elementnew = elementnew.replace(/\.(torrent|iso|mp4|mkv|ts)/g, '')
                if (elementnew.match(/\d{4}/i)) {
                    seed_year = elementnew.match(/\d{4}/i)
                }

                if (sitename != 'NY' && sitename != 'SSD') {
                    elementnew = elementnew.replace(/\./g, ' ')
                }

                document.getElementById("seed_name").value = elementnew
                if (sitename == 'TTG' || sitename == 'TTG DOA') {
                    document.getElementById("seed_name").value = document.getElementById("seed_name").value + '[' + small_descr + ']'
                }

                if (sitename == 'NY' && seed_type == "#seed_type_1") { // NY 电影标题
                    document.getElementById("seed_name").value = elementnew
                }
                if (sitename == 'MT' && seed_type == "#seed_type_1") { // 麦田 电影标题
                    document.getElementById("seed_name").value = '[' + seed_year + ']' + '[' + chname + ']' + '[' + elementnew + ']'
                }

                if (seed_type == "#seed_type_2") { //电视剧

                    if (elementnew.match(/E\d+\d+/ig)) { //电视剧单集
                        series_pack = '0'
                        series_info = elementnew.match(/E\d+\d+/ig)
                        series_info = series_info.toString(series_info)
                        series_info = series_info.replace(/,/g, '\-')
                        if (sitename == 'NY') {
                            document.getElementById("seed_name").value = elementnew
                        }
                        if (sitename == 'MT') {
                            document.getElementById("seed_name").value = '[' + seed_year + ']' + '[' + chname + ']' + '[' + elementnew + ']' + '[MP4][连载剧集]'
                        }
                        if (sitename == 'OB') {
                            document.getElementById("browsecat").options[4].selected = true
                        }
                        series_info = series_info.replace(/E/g, '')
                        if (sitename != 'TTG') {
                            document.getElementById("small_descr").value = document.getElementById("small_descr").value.replace(/第\d+(-\d+)?集/g, '第' + series_info + '集')
                        }
                    } else { //电视剧合集
                        if (elementnew.match(/Complete/gi)) {
                            series_pack = '1'
                            if (sitename == 'NY') {
                                document.getElementById("seed_name").value = elementnew
                            }
                            if (sitename == 'MT') {
                                document.getElementById("seed_name").value = '[' + seed_year + ']' + '[' + chname + ']' + '[' + elementnew + ']' + '[全集]'
                            }
                            if (sitename == 'OB') {
                                document.getElementById("browsecat").options[5].selected = true
                                document.getElementById("small_descr").value = document.getElementById("small_descr").value.replace(/第\d+(-\d+)?集/g, '全集')
                            }
                        }
                    }
                }

                var op

                if (elementnew.match(/(720|1080)(P|I)/i)) {
                    standard_sel = elementnew.match(/(720|1080)(P|I)/i)[0]
                }
                if (elementnew.match(/(h264|h265)/i)) {
                    codec_sel = elementnew.match(/(h264|h265)/i)[0]
                    codec_sel = codec_sel.replace(/h/i, 'H.')
                }
                if (elementnew.match(/(AAC|AC3)/i)) {
                    audiocodec_sel = elementnew.match(/(AAC|AC3)/i)[0]
                }

                if (sitename == 'OB' || sitename == 'M-Team' || sitename == 'HDH' || sitename == 'TTG' || sitename == 'TTG DOA' || sitename == 'SSD' || sitename == 'HDSky' || sitename == 'HUDPT' || sitename == 'BYY') {
                    var Eselect = document.getElementsByTagName("select")
                    for (i = 0; i < Eselect.length; i++) {
                        if (Eselect[i].name == 'medium_sel' && sitename == 'OB') { //媒介:
                            Eselect[i].options[4].selected = true
                        }
                        if (Eselect[i].name == 'medium_sel' && sitename == 'SSD') { //媒介:
                            Eselect[i].options[6].selected = true
                        }
                        if (Eselect[i].name == 'medium_sel' && sitename == 'HDSky') { //媒介:
                            Eselect[i].options[12].selected = true
                        }
                        if (Eselect[i].name == 'codec_sel' && sitename == 'HDSky') { //媒介:
                            Eselect[i].options[1].selected = true
                        }
                        if (Eselect[i].name == 'source_sel' && sitename == 'HDH') { //媒介:
                            Eselect[i].options[4].selected = true
                        }
                        if (Eselect[i].name == 'source_sel' && sitename == 'SSD') { //媒介:
                            Eselect[i].options[3].selected = true
                        }
                        if (Eselect[i].name == 'source_sel' && sitename == 'BYY') { //媒介:
                            Eselect[i].options[6].selected = true
                        }
                        if (Eselect[i].name == 'audiocodec_sel' && sitename == 'SSD') { //媒介:
                            Eselect[i].options[5].selected = true
                        }
                        if (Eselect[i].name == 'audiocodec_sel' && sitename == 'HDSky') { //媒介:
                            Eselect[i].options[12].selected = true
                        }
                        if (Eselect[i].name == 'audiocodec_sel' && sitename == 'OB') { //媒介:
                            Eselect[i].options[5].selected = true
                        }
                        if (Eselect[i].name == 'codec_sel') { //视频编码
                            for (op = 0; op < Eselect[i].length; op++) {
                                if (codec_sel != '' && Eselect[i].options[op].innerHTML.match(codec_sel)) {
                                    Eselect[i].options[op].selected = true
                                }
                            }
                            if (sitename == 'SSD') {
                                Eselect[i].options[2].selected = true
                            }
                            if (sitename == 'HYP') {
                                Eselect[i].options[1].selected = true
                            }
                        }
                        /*if (Eselect[i].name == 'audiocodec_sel') { //音频编码
                            if (sitename == 'OB' || sitename == 'HDH' || sitename == 'SSD') {
                                for (op = 0; op < Eselect[i].length; op++) {
                                    if (audiocodec_sel != '' && Eselect[i].options[op].innerHTML.match(audiocodec_sel)) {
                                        Eselect[i].options[op].selected = true
                                    }
                                }
                            }
							if (sitename == 'HYP') {
                              Eselect[i].options[2].selected = true
                            }
                        }*/
                        if (Eselect[i].name == 'standard_sel') { //分辨率
                            for (op = 0; op < Eselect[i].length; op++) {
                                if (standard_sel != '' && Eselect[i].options[op].innerHTML.match(standard_sel)) {
                                    Eselect[i].options[op].selected = true
                                }
                            }
                            if (sitename == 'HYP') {
                                Eselect[i].options[2].selected = true
                            }
                        }
                        if (Eselect[i].name == 'processing_sel' && sitename == 'OB') { //OB 地区
                            Eselect[i].options[2].selected = true
                        }
                        if (Eselect[i].name == 'team_sel' && sitename == 'OB') { //OB 制作组
                            Eselect[i].options[12].selected = true
                        }
                        if (Eselect[i].name == 'team_sel' && sitename == 'HDH') { //HDH 制作组
                            Eselect[i].options[9].selected = true
                        }
                        if (Eselect[i].name == 'team_sel' && sitename == 'HDSky') { //天空 制作组
                            Eselect[i].options[10].selected = true
                        }
                        if (Eselect[i].name == 'team_sel' && sitename == 'BYY') { //北洋园 制作组
                            Eselect[i].options[1].selected = true
                        }
                        if (Eselect[i].name == 'type' && sitename == 'TTG') { //TTG 类型
                            if (series_pack == '0') {
                                Eselect[i].options[32].selected = true   //大陆港台1080I/P单集
                            }
                            if (series_pack == '1') {
                                Eselect[i].options[38].selected = true   //华语剧包
                            }
                        }
                        if (Eselect[i].name == 'type' && sitename == 'TTG DOA') { //TTG DOA 日剧包

                            Eselect[i].options[36].selected = true
                        }
                        if (Eselect[i].name == 'anonymity' && (sitename == 'TTG' || sitename == 'TTG DOA')) { //TTG 匿名
                            Eselect[i].options[1].selected = true
                        }
                        if (Eselect[i].name == 'nodistr' && sitename == 'TTG DOA') { //TTG DOA 禁转
                            alert(i + Eselect[i].name)
                            Eselect[i].options[0].selected = true
                        }
                    }
                }
            }

        }

        var element = document.getElementById("torrent");
        if (sitename == 'TTG' || sitename == 'TTG DOA') {
            element.parentNode.innerHTML = '<input type="file" class="file" id="torrent" name="file" accept=".torrent"> <br>（<font color="red"><b>做种前请务必设置UT关闭DHT公用网络，否则您的上传量将会传给外站用！</b></font>）';
        } else {
            element.parentNode.innerHTML = '<input type="file" class="file" id="torrent" name="file" accept=".torrent">';
        }
        element = document.getElementById("torrent");
        element.onchange = analysetorrentname;
    }
}


