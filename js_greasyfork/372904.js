// ==UserScript==
// @name     TLS RDV
// @description Prendre rdv TLS auto
// @author SamiracleApps
// @version  1
// @include  https://fr.tlscontact.com/dz/ORN/myapp.php*
// @grant GM.xmlHttpRequest

// ==/UserScript==

var i,x,j,pureText,realI,realJ;
x=0;
window.setTimeout(function(){ if(x==0){location.reload();} }, 50*1000);

var yourKey="7f8a1755e7a05fe97798e0982d3d4287==";

function e(){if(0!=document.getElementsByClassName("dispo").length){var t=String(document.getElementsByClassName("dispo")[0].onclick),e=(t=(t=(t=String(t)).substring(t.indexOf("?")+1)).substring(0,t.indexOf('"'))).split("&"),i=document.createElement("div");i.setAttribute("id","control_window_2"),i.setAttribute("class","modal_container"),i.setAttribute("style","margin: 0px; position: absolute; z-index: 9999; top: 1935px; left: 491px;");var n=document.createElement("table");n.setAttribute("class","modal"),i.appendChild(n);var a=document.createElement("tr");n.appendChild(a);var d=document.createElement("td");a.appendChild(d);var r,s=document.createElement("form");s.setAttribute("method","post"),s.setAttribute("name","ajax_confirm_action"),s.setAttribute("id","ajax_confirm_action"),s.setAttribute("onsubmit",'ajaxPostForm(this, "multiconfirm", true); return false;'),s.setAttribute("action","https://fr.tlscontact.com/dz/ORN/action.php"),d.appendChild(s),(r=document.createElement("input")).setAttribute("name","f_id"),r.setAttribute("type","hidden"),r.setAttribute("id","f_id"),r.setAttribute("value",""),s.appendChild(r),(r=document.createElement("input")).setAttribute("type","submit"),r.setAttribute("id","ajaxConfirmCall_submit"),r.setAttribute("value","Confirmer"),s.appendChild(r),(r=document.createElement("input")).setAttribute("name","as_u_id"),r.setAttribute("id","as_u_id"),r.setAttribute("type","hidden"),r.setAttribute("value",""),s.appendChild(r),(r=document.createElement("input")).setAttribute("name","_sid"),r.setAttribute("type","hidden"),r.setAttribute("id","_sid"),r.setAttribute("value",secret_id),s.appendChild(r),e.forEach(function(t){var e=t.split("="),i=document.createElement("input");i.setAttribute("name",e[0]),i.setAttribute("type","hidden"),i.setAttribute("id",e[0]),i.setAttribute("value",e[1].replace("+"," ").replace("%3A",":")),s.appendChild(i)}),document.getElementsByTagName("body")[0].appendChild(i),console.log(i)}}e();//Starts here
setInterval (function (){
if(document.getElementById("ajaxConfirmCall_submit")!=null)
{//My work is done here
document.getElementById("ajaxConfirmCall_submit").click();
}

},3000000000000000000000);