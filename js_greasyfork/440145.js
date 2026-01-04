// ==UserScript==
// @name         绿谷CSS系统筛选用户
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  绿谷CSS系统搜索用户
// @author       You
// @match        http://10.11.1.103/css/page/system/root/page/system/root/page/fine/popup/userList.html*
// @match        http://10.11.1.103/css/page/system/root/page/fine/popup/userList.html*
// @match        http://10.11.1.103/css/page/system/root/page/system/root/page/fine/popup/root/page/system/root/page/fine/popup/userList.html*
// @icon         http://10.11.1.103/favicon.ico
// @ require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/440145/%E7%BB%BF%E8%B0%B7CSS%E7%B3%BB%E7%BB%9F%E7%AD%9B%E9%80%89%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/440145/%E7%BB%BF%E8%B0%B7CSS%E7%B3%BB%E7%BB%9F%E7%AD%9B%E9%80%89%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let searchbar=`
    <div id="query" class="query">
		<table>
			<tbody><tr height="16px">
				<td>
					<img class="query_img" src="root/image/query.png">
				</td>
				<td><div class="lbl_query">用户名称：</div></td>
				<td><input name="name" operator="like" class="edt_query" type="text"></td>
				<td><div class="btn_wrap"><button class="btn_query" onclick="query2();">查询</button></div></td>
				<td><div class="btn_wrap"><button class="btn_query" onclick="query2next();">下一个</button></div></td>
                <td><div class="btn_wrap tips_query" style="color:red"></div></td>
			</tr>
		</tbody></table>
	</div>

    <script>
    allData = []
    searchpos=0
    lastTimer=null
    function search2(pos){
       if(!pos){searchpos=0}
       let page=1
       let found = 0
        //搜索关键词定位页码
            let keyword = $(".edt_query").val()
            if(keyword=="") return
            for(let i in allData){
               if(pos && i <= pos) {
                   continue
               }
               let item = allData[i]
               if(typeof item.name != "string"){
                  continue
               }
               if(item.name.indexOf(keyword) !== -1){
                  page = Math.ceil((parseInt(i)+1)/10)
                  searchpos = i
                  found=1
                  //console.log(i, page)
                  break
               }
            }

            if(!found){
               tips = "没有找到"
               if(pos) tips="没有了"
               $(".tips_query").html(tips)
               if(lastTimer){clearTimeout(lastTimer )}
               lastTimer=setTimeout(function(){$(".tips_query").html("")}, 3000)
            }

            //跳转到对应的分页
            var url = "root/data/procedure/getUserList/getSetByPage?pageno="+page+"&pagesize=10&orderby=cntitle,name&" + param;
			grid.setURL(url);

            //关键词高亮
            setTimeout(function(){
               //给每个人名加上index
               let count = 0
               $("#table_body td:nth-child(3)").each(function(){
                   currIndex=(page-1) * 10 +  count
                   $(this).attr("currIndex", currIndex)
                   count++
               })
               //高亮显示关键词
               let keyobj = $("#table_body td div:contains('"+keyword+"')")
               if(keyobj.length > 0){
                   keyobj.each(function(){
                      thisobj = $(this)
                      let text = thisobj.html()
                       let arrow=""
                       let currIndex=thisobj.parent().attr("currIndex")
                       //console.log(searchpos, parseInt(currIndex), currIndex)
                       if(searchpos == parseInt(currIndex)){
                           arrow="-->"
                       }
                       text = text.replace(keyword, arrow+"<span style='color:red'>"+keyword+"</span>")
                       thisobj.html(text)
                   })
                   // let text = keyobj.html()
                   // let arrow=""
                   // let currIndex=keyobj.parent().attr("currIndex")
                   // console.log(searchpos, parseInt(currIndex), currIndex)
                   // if(searchpos == parseInt(currIndex)){
                   //     arrow="-->"
                   // }
                   // text = text.replace(keyword, arrow+"<span style='color:red'>"+keyword+"</span>")
                   // keyobj.html(text)
               }
            }, 500)
    }
    function query2(){
            //获取总条数 [ 显示1-10 / 326条 ]
            totalText = $("#grid-bar_message").text()
            totalText = totalText.split("/")[1]
            let totalNum = parseInt(totalText)

            if(allData.length === 0){
               //获取对应分页
               var allurl = "root/data/procedure/getUserList/getSetByPage?pageno=1&pagesize="+totalNum+"&orderby=cntitle,name&" + param;

               $.getJSON(allurl, function(data) {
                   //console.log(data)
                   if(data && data.entityset && data.entityset.length > 0) {
                       allData = data.entityset
                   }
                   search2()
               });
            } else {
               search2()
            }

            return false
		}
        function query2next(){
           search2(searchpos)
        }
        function clearFilter(){
           $(".edt_query").val("")
        }
    </script>
    `
    $(() => {
       $("body").prepend(searchbar)
    });
})();