// ==UserScript==
// @name        BYRBT Music Upload Page Auto Fillin
// @author      FBoo
// @description 自动填写北邮人音乐发布页面
// @include     http://bt.byr.cn/upload.php?type=402
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @icon        http://bt.byr.cn/favicon.ico
// @version     1.01
// @namespace   FBoo/BYR
// @downloadURL https://update.greasyfork.org/scripts/24996/BYRBT%20Music%20Upload%20Page%20Auto%20Fillin.user.js
// @updateURL https://update.greasyfork.org/scripts/24996/BYRBT%20Music%20Upload%20Page%20Auto%20Fillin.meta.js
// ==/UserScript==
//debugger;

(function($){
    String.prototype.format = function(){
        var args = arguments;
        return this.replace(/\{(\d+)\}/g, function(m,i){
            return args[i];
        });
    };

    document.onpaste = function(e){
        try {
            var originStr;
            var pattStr = "<span style=\"font-size:16px;\">☆&nbsp; <span style=\"color:#ff0000;\"><strong>【专辑封面】.+<span style=\"font-size:16px;\">☆&nbsp; </span><span style=\"color:#ff0000;\"><strong><span style=\"font-size:16px;\">【资源简介】";
            var exitedDescr = CKEDITOR.instances.descr.getData();
            var patt=new RegExp(pattStr);
            var resArr = patt.exec(exitedDescr.replace(/标准/g,"").replace(/\n/g,""));
            if (resArr !== null && resArr.length > 0){
                originStr = resArr[0];
            }
            var _formatstring = originStr + "</span></strong></span><br /><br /><table border=\"1\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:37.7%;\" width=\"37%\"><tbody><tr><td nowrap=\"nowrap\" style=\"width:87px;\"><strong>资源名称：</strong></td><td style=\"width:123px;\">{0}</td></tr><tr><td nowrap=\"nowrap\" style=\"width:87px;\"><strong>艺术家名：</strong></td><td style=\"width:123px;\">{1}</td></tr><tr><td nowrap=\"nowrap\" style=\"width:87px;\"><strong>资源年份：</strong></td><td style=\"width:123px;\">{2}</td></tr><tr><td nowrap=\"nowrap\" style=\"width:87px;\"><strong>大小：</strong></td><td style=\"width:123px;\">{3}</td></tr><tr><td nowrap=\"nowrap\" style=\"width:87px;\"><strong>文件数：</strong></td><td style=\"width:123px;\">{4}</td></tr><tr><td nowrap=\"nowrap\" style=\"width:87px;\"><strong>类型：</strong></td><td style=\"width:123px;\">{5}</td></tr><tr><td nowrap=\"nowrap\" style=\"width:87px;\"><strong>类别：</strong></td><td style=\"width:123px;\">{6}</td></tr><tr><td nowrap=\"nowrap\" style=\"width:87px;\"><strong>格式：</strong></td><td style=\"width:123px;\">{7}</td></tr><tr><td nowrap=\"nowrap\" style=\"width:87px;\"><strong>媒介：</strong></td><td style=\"width:123px;\">{8}</td></tr><tr><td nowrap=\"nowrap\" style=\"width:87px;\"><strong>制作组：</strong></td><td style=\"width:123px;\">{12}</td></tr><tr><td nowrap=\"nowrap\" style=\"width:87px;\"><strong>标签列表：</strong></td><td style=\"width:123px;\">{9}</td></tr></tbody></table>&nbsp;<br /><span style=\"font-size:16px;\">☆&nbsp; <span style=\"color:#ff0000;\"><strong>【专辑介绍】</strong></span></span><br />&nbsp;{10}<br /><br /><span style=\"font-size:16px;\">☆&nbsp; <span style=\"color:#ff0000;\"><strong>【曲目列表】</strong></span></span><br />{11}";
            // 获取粘贴的内容
            var copyInfo = e.clipboardData.getData('text/plain');

            //提取关键信息
            var infoList = copyInfo.split("\t");

            var content = {};
            content.language = infoList[1];
            content.fullname = infoList[2];
            content.subtitle = infoList[3];
            content.type = infoList[4];
            content.artist = infoList[5];
            content.name = infoList[6];
            content.musicstyle = infoList[7];
            content.filetype = infoList[8];
            content.filequality = infoList[9];
            content.date = infoList[10];
            content.amount = infoList[11];
            content.filecount = infoList[12];
            content.media = infoList[13];
            content.tags = infoList[14];
            content.generator = infoList[15];
            content.description = infoList[16].substring(1,infoList[16].length-1).replace(/\n/g,"<br />");
            content.tracks = infoList[17].substring(1,infoList[17].length-3).replace(/\n/g, "<br />");

            //填写表单
            //-音乐类型
            $('#music_type').val(content.type);
            //-艺术家
            $('#artist').val(content.artist);
            //-资源名称
            $('#album').val(content.name);
            //-音乐曲风
            $('#music_style').val(content.musicstyle);
            //-资源格式
            $('#music_filetype').val(content.filetype);
            //-资源质量
            $('#music_quality').val(content.filequality);
            //-资源年份
            $('#music_year').val(content.date);
            //-发行地区
            $('select[name=second_type]').val(content.language);
            $('#music_language').val(content.language);
            //-副标题
            $('input[name=small_descr]').val(content.subtitle);

            //-简介
            var newdesc = _formatstring.format(content.name, content.artist, content.date, content.amount, content.filecount, content.type, content.musicstyle, content.filequality, content.media, content.tags, content.description, content.tracks, content.generator);
            CKEDITOR.instances.descr.setData(newdesc);

        } catch (ex) {
            alert("粘贴的内容有误，请检查！");
        }
        return false;
    };
})(jQuery);