// ==UserScript==
// @name           Travian Link T4 Viet Nam
// @author         tuan
// @description    Fast link for webgame travian t4 Viet Nam
// @version        1.6
// @grant          none
// @include        *.travian.*
// @exclude 	   *.travian.*/login.php
// @exclude        *.travian.*/logout.php
// @exclude 	   *.travian.*/chat.php
// @exclude 	   *.forum.travian.*
// @exclude 	   *.travian.*/index.php
// @exclude 	   *.travian.*/manual.php
// @namespace https://greasyfork.org/users/19912
// @downloadURL https://update.greasyfork.org/scripts/13767/Travian%20Link%20T4%20Viet%20Nam.user.js
// @updateURL https://update.greasyfork.org/scripts/13767/Travian%20Link%20T4%20Viet%20Nam.meta.js
// ==/UserScript==
// Thanks frankydp :https://greasyfork.org/vi/scripts/14774-travian-reports-noscroll

select = document.createElement("SELECT")
select.setAttribute("style", "cursor:pointer;position:fixed;bottom:0px;right:0px;color:rgb(153,192,26);z-index:99999")
select.setAttribute("onChange", "window.location.href=this.value")
document.body.appendChild(select)

option = document.createElement("option")
option.setAttribute("value", "#")
text = document.createTextNode("Chọn nhanh")
option.appendChild(text)
select.appendChild(option)

option1 = document.createElement("option")
option1.setAttribute("value", "/build.php?gid=16&tt=1")
text1 = document.createTextNode("Binh trường")
option1.appendChild(text1)
select.appendChild(option1)

option2 = document.createElement("option")
option2.setAttribute("value", "/build.php?gid=16&tt=2")
text2 = document.createTextNode("Gửi lính")
option2.appendChild(text2)
select.appendChild(option2)

option3 = document.createElement("option")
option3.setAttribute("value", "/build.php?gid=17&t=0")
text3 = document.createTextNode("Quản lý chợ")
option3.appendChild(text3)
select.appendChild(option3)

option4 = document.createElement("option")
option4.setAttribute("value", "/build.php?gid=17&t=5")
text4 = document.createTextNode("Gửi tài nguyên")
option4.appendChild(text4)
select.appendChild(option4)

option5 = document.createElement("option")
option5.setAttribute("value", "/build.php?gid=19")
text5 = document.createTextNode("Trại lính")
option5.appendChild(text5)
select.appendChild(option5)

option6 = document.createElement("option")
option6.setAttribute("value", "/build.php?gid=20")
text6 = document.createTextNode("Chuồng ngựa")
option6.appendChild(text6)
select.appendChild(option6)

option7 = document.createElement("option")
option7.setAttribute("value", "/build.php?gid=21")
text7 = document.createTextNode("Xưởng")
option7.appendChild(text7)
select.appendChild(option7)

option8 = document.createElement("option")
option8.setAttribute("value", "/build.php?gid=10")
text8 = document.createTextNode("Nhà kho")
option8.appendChild(text8)
select.appendChild(option8)

option9 = document.createElement("option")
option9.setAttribute("value", "/build.php?gid=11")
text9 = document.createTextNode("Kho lúa")
option9.appendChild(text9)
select.appendChild(option9)

option10 = document.createElement("option")
option10.setAttribute("value", "/build.php?gid=13")
text10 = document.createTextNode("Lò rèn")
option10.appendChild(text10)
select.appendChild(option10)

option11 = document.createElement("option")
option11.setAttribute("value", "/allianz.php?s=1&action=members")
text11 = document.createTextNode("Thành viên")
option11.appendChild(text11)
select.appendChild(option11)

if (location.pathname == "/berichte.php") {
    document.getElementById("markAll").appendChild(document.getElementById("mark_as_read"))
    document.getElementById("markAll").appendChild(document.getElementById("del"))
    document.getElementById("markAll").appendChild(document.getElementById("archive"))
}
if (location.pathname == "/nachrichten.php") {
    document.getElementById("markAll").appendChild(document.getElementById("bulkread"))
    document.getElementById("markAll").appendChild(document.getElementById("delmsg"))
    document.getElementById("markAll").appendChild(document.getElementById("archive"))
}