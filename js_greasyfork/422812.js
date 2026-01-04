// ==UserScript==
// @name         xk
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  HEU选课
// @author       加速
// @match        *://edusys.hrbeu.edu.cn/jsxsd/xsxk/xsxk_index.do*
// @match        *://edusys.wvpn.hrbeu.edu.cn/jsxsd/xsxk/xsxk_index.do*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/422812/xk.user.js
// @updateURL https://update.greasyfork.org/scripts/422812/xk.meta.js
// ==/UserScript==

(function() {
    var flag = false;
    var TIME = 500;
    var count = 0;
    var NUM = 100;
    var chosen = [];
    var cnt = 0;

    async function update_counter() {
        count++;
        document.getElementById("cnt").innerHTML = "已尝试次数: " + count

    }

    async function xxxk(jx0404id){
        $.ajax({
            url:"/jsxsd/xsxkkc/xxxkOper",
            data:{
                jx0404id:jx0404id
            },
            success : function(datas) {
                datas = JSON. parse(datas)
                if(datas.success) {
                    ++cnt;
                    mylog('选课成功');
                }
            }
        })
/*
        if(rev.success){
            return true;
        }else{
            console.log(rev.message)
            return false;
        }*/
    }

    async function gxxk(jx0404id){
       $.ajax({
            url:"/jsxsd/xsxkkc/ggxxkxkOper",
            data:{
                jx0404id:jx0404id,
                xkzy:"",
                trjf:""
            },
            success : function(datas) {
                datas = JSON. parse(datas)
                if(datas.success) {
                    mylog('选课成功');
                    ++cnt;
                }

            }
        })

       /* if(rev.success){
            return true
        }else{
            console.log(rev.message)
            return false
        }*/
    }

    async function mylog(message) {
        //alrt(message)
        //console.log(message)
        $('#msg').append(message)
        $('#msg').append('<br>')
    }

    function get_chosen() {
        elems = $('#xkmain').find('label')
        name_list = []
        id_list = []
        for (var i=0;i<elems.length;i++){
            ele = elems[i]
            if(!ele.children[0].checked)continue;
            //console.log(ele)
            name_list.push(ele.children[0].name)
            id_list.push(ele.children[0].value)
        }
        //return [name_list,id_list]
        chosen = [name_list,id_list]
    }

    
    async function gkd() {
        
        //console.log(TIME)

        t = chosen;
        name_list = t[0]
        id_list = t[1]
        //console.log(t)

        update_counter();
        for(var i=0;i<id_list.length;i++)
        {
            if(xxxk(id_list[i]));
            if(gxxk(id_list[i]));
        }
        if(cnt==id_list.length) {
            mylog("已抢到全部课程")
            mylog("停止抢课...")
            flag = false
            cnt = 0
        }
        if(flag) {
            setTimeout(function(){
                gkd()
            },TIME)
        }
    }

    function get_courses(){
		res = []
		rows = $("#mainFrame").contents().find("#dataView").find('tr')
		len = rows.length
		for (var i=1;i<len;i++){
			ele = rows[i]
            name = ele.children[1].textContent + " " + ele.children[3].textContent
            course_id = ele.children[ele.children.length-1].children[0].id.split('_')[1]
			res.push([
				ele.children[1].textContent,
				ele.children[ele.children.length-1].children[0].id.split('_')[1]
			])
            content = '<label><input name="' + name + '" type="checkbox" value="' + course_id + '"/>' + name + '</label>'
            //console.log(content)
            $('#xkform').append(content)
            $('#xkform').append('<br>')
            ///$('#xkmain').append('<button type="button" id="collect">Click Me!</button>')
        }
		//console.log(res)

        //return res
    }
    'use strict';
    setTimeout(function(){
        $("body").append(" <div id='xkmain' style='left: 10px;bottom: 10px;background: #1a59b7;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 300;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;'></div>");




        $('#xkmain').append('<form action="" method="get" id="xkform"> </form>')
        //$('#xkform').append('<label><input name="Fruit" type="checkbox" value="" />苹果 </label> ')

        //$alert('test')

        //$('#xkmain').append('<table border="1"><tr>test</tr><tr>test</tr></table>')
        //$('#xkmain').append('<br>')
        $('#xkmain').append('<div id="msg"></div>')

        //$('#xkmain').append('<div id="settings"></div>')

        $('#xkmain').append('<div id="settings"></div>')
        $('#settings').append('速度：')
        $('#settings').append('<input type="text" name="" id="TIME" style="width: 50" oninput="value=value.replace(/[^\\d]/g,\'\')">')
        $('#settings').append(' ms/次  ')

        //$('#settings').append('<div id="num_set"></div>')
        $('#settings').append('线程：')
        $('#settings').append('<input type="text" name="" id="NUM" style="width: 50" oninput="value=value.replace(/[^\\d]/g,\'\')">')
        $('#settings').append(' 个')


        $('#xkmain').append('<div id="cnt"></div>')
        //$('#xkmain').append('<br>')


        $('#xkmain').append('<button type="button" id="collect">获取页面内课程</button>')
        $('#collect').click(function(){
            get_courses()
        })


        $('#xkmain').append('<button type="button" id="gkd">开始抢课/终止抢课</button>')
        $('#gkd').click(function(){
            if(!flag) {
                TIME = Number($('#TIME')[0].value)
                NUM = Number($('#NUM')[0].value)
                if(NUM == 0) NUM = 1;
                console.log(NUM)
                get_chosen()
                mylog('开始抢课...')
                flag = true
                for(var i=0;i<NUM;++i)
                    setTimeout(function(){

                        gkd()
                    },1000);
            } else {
                flag = false;
                mylog('停止抢课...')
                cnt = 0
            }    
        })

        $('#xkmain').append('<button type="button" id="close">关闭</button>')
        $('#close').click(function(){
            $('#xkmain').remove()
        })
    },1000);
})();
