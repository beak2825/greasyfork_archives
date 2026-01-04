// ==UserScript==
// @name         南昌航空大学 自动评教
// @namespace    http://tampermonkey.net/
// @license      MPL
// @version      1.0
// @description  南昌航空大学教务系统自动评教
// @author       RayJin
// @include      http://jwc-publish.jwc.nchu.edu.cn/jsxsd/xspj/xspj_list.do*
// @include      http://jwc-publish.jwc.nchu.edu.cn/jsxsd/xspj/xspj_edit.do*
// @grant        unsafeWindow
// @grant        window
// @reqire       http://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.3.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/437347/%E5%8D%97%E6%98%8C%E8%88%AA%E7%A9%BA%E5%A4%A7%E5%AD%A6%20%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/437347/%E5%8D%97%E6%98%8C%E8%88%AA%E7%A9%BA%E5%A4%A7%E5%AD%A6%20%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

/**************************************
* author:RayJin
* Date:2021/12/20
***************************************/

(function()
 {
    var markPosition=1
    var flag1=0;
    var href=document.location.href;
    if(href.search('jwc-publish.jwc.nchu.edu.cn/jsxsd/xspj/xspj_list.do')!=-1)
    {
        //Is main web
        Hook();
    }
    else
    {
        Hook2();
        AutoMark();
    }

    /*********************************************************************************************
    * Desdescription：Overwrite JsMod function.Let other browsers can open the comment window.
    * author:RayJin
    * Date:2021/12/20
    **********************************************************************************************/
    function Hook()
    {
        unsafeWindow.JsMod = function (htmlurl, tmpWidth, tmpHeight)
        {
            var newwin = window.open(htmlurl, window, "dialogWidth:" + tmpWidth + "px;status:no;dialogHeight:" + tmpHeight + "px")
            if (newwin == "refresh" || newwin == "ok")
            {
                window.location.reload();
            }
        }
    }

    /*********************************************************************************************
    * Desdescription：Overwrite saveData function.Allow all options to be the same.
    * author:RayJin
    * Date:2021/12/20
    **********************************************************************************************/
    function Hook2()
    {
        unsafeWindow.saveData = function(obj, status)
        {
            var i,j;
            var pj06xhs = document.getElementsByName("pj06xh");
            var flag = true;
            for (i = 0; i < pj06xhs.length; i++)
            {
                if(jQuery("input[name='pj0601id_"+ pj06xhs[i].value+"']:checked").length == 0)
                {
                    flag = false;
                    break;
                }
            }
            if (!flag)
            {
                alert("评价的每项指标都必须选择!");
                return false;
            }
            flag = false;
            var minZb = 0;//取到最小指标数
            for (i = 0; i < pj06xhs.length; i++)
            {
                var pj0601s = document.getElementsByName("pj0601id_"+ pj06xhs[i].value);
                minZb = pj0601s.length;
                break;
            }
            for(j = 0; j < minZb; j++)
            {
                var _ind = 0;
                for (i = 0; i < pj06xhs.length; i++)
                {
                    var pj0601s1 = document.getElementsByName("pj0601id_"+ pj06xhs[i].value);
                    if (j < pj0601s1.length && pj0601s1[j].checked)
                    {
                        _ind++;
                    }
                }
                if (_ind == pj06xhs.length)
                {
                    flag = true;
                    break;
                }
            }

            /**	if(flag){
			alert("请不要选相同一项！");
			return false;
		}**/

            var jynr=document.getElementById("jynr").value
            var a=jynr.replace(/^(\s|\u00A0)+/,'');
            if(a=="")
            {
                alert("请填写意见或建议栏！");
                return false;
            }
            if (status == "1")
            {
                document.getElementById("issubmit").value = "1";
            }
            else
            {
                document.getElementById("issubmit").value = "0";
            }
            if(status == "1" && !confirm("您是否确认提交当前评价,提交后不能修改！"))
            {
            }
            else
            {
                obj.disabled = true;
                document.getElementById("Form1").submit();
            }
        }
    }

    /*********************************************************************************************
    * Desdescription：Automatically complete evaluations.
    * author:RayJin
    * Date:2021/12/20
    **********************************************************************************************/
    function AutoMark()
    {
        var markPosition=0;
        var tr=$("#table1 tr");
        tr.each(function(index)
                {
            if(index!=0)
            {
                var radio_A=$(this).find("td:eq(1) input:eq(0)");
                radio_A.attr('checked','checked');
            }
        });
        $('textarea').val('老师的课讲得十分好，干货十足');
    }
})();