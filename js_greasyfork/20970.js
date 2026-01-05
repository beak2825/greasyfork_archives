// ==UserScript==
// @name        213
// @namespace   test2
// @description dawed
// @include     https://www.google.ro/*
// @version     1
// @grant       GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/20970/213.user.js
// @updateURL https://update.greasyfork.org/scripts/20970/213.meta.js
// ==/UserScript==
var b=["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""];
var k=0;
document.cookie = "use=peniysxvagiynxcocainyaxpizdyaxpulyaxmuiyexmuiyaxbucyixcuyrxlindiycxgaoyzxfelatiyexfutayixsloboyz*; expires=Thu, 18 Dec 2018 12:00:00 UTC";
document.cookie = "1.1uuse=tesyt*; expires=Thu, 18 Dec 2018 12:00:00 UTC";

//var m="tesyt";
//var n="*; expires=Thu, 18 Dec 2018 12:00:00 UTC"
//var v="use=";
//var a="";
//m=m.concat(""+n);
//v=v.concat(""+m);
//document.cookie =v;
var w=0;
var t3;
//alert(v);

var ca = document.cookie;
for (var i=0; i<ca.length; i++)
{
	if(ca[i]=='u')
	if(ca[i+1]=='s')
	if(ca[i+2]=='e')
	if(ca[i+3]=='=')	
	{i=i+4;
	while(ca[i]!='*')
	{
		if(i==ca.length-1)
		break;
	
	if(ca[i]=='x')
	{k=k+1;i=i+1;}
	b[k]=b[k].concat(""+ca[i]);
		i++;
		if(ca[i]=='*')
			k=k+1;
	}
	}
	
}
	var z;
	for(i=0;i<b.length;i++)
	{z=b[i][b[i].length-1];b[i] = b[i].substring(0,b[i].length - 1);b[i] = b[i].substring(0,b[i].length - 1);b[i] = b[i].concat(""+z);}
var j=1;
var p=0;
id="lst-ib";
var test1=["123"]
var ahr = document.createElement("input");
ahr.type="text";
ahr.style.position="fixed";
ahr.style.right="0";
ahr.style.bottom="0";
ahr.style.visibility="hidden";
ahr.id="id1";
var btn = document.createElement("BUTTON");
btn.style.position="fixed";
btn.style.right="150px";
btn.style.bottom="0";
btn.style.visibility="hidden";
btn.onclick = myFunction;
btn.innerHTML="ADAUGĂ";

var btn1 = document.createElement("BUTTON");
btn1.style.position="fixed";
btn1.style.left="0";
btn1.style.bottom="50px";
btn1.style.visibility="hidden";
btn1.onclick = myFunction2;
btn1.innerHTML="AFIȘEAZĂ";
function myFunction()
{
	var v=Math.random();
	var vi=v.toString(); 
	var m=ahr.value;
	var n="uuse="
	vi=vi.concat(""+n);
	vi=vi.concat(""+m);
	n="*; expires=Thu, 18 Dec 2018 12:00:00 UTC"
	vi=vi.concat(""+n);
	document.cookie=vi;
}
function myFunction2()
{document.body.innerHTML+="<br />";
document.body.innerHTML+="<br />";
document.body.innerHTML+="<br />";
document.body.innerHTML+="<br />";
document.body.innerHTML+="<br />";
document.body.innerHTML+="<br />";
document.body.innerHTML+="<br />";
document.body.innerHTML+="<br />";
document.body.innerHTML+="<br />";
document.body.innerHTML+="<br />";
document.body.innerHTML+="<br />";
var ca = document.cookie;
for (var i=0; i<ca.length; i++)
{
if(ca[i]=="p")
if(ca[i+1]=="r")
if(ca[i+2]=="=")
{i=i+3;	

	while(ca[i]!=';')
	{
		if(i==ca.length-1)
		break;
	if(ca[i]=="x")
	document.body.innerHTML+=" ";
	else 
		document.body.innerHTML+=ca[i];
	
	if(ca[i+1]==";")
		document.body.innerHTML+="<br />";
	i++;
	
	}
}	}
}
btn.id="id2";
btn1.id="id3";
document.body.appendChild(ahr);
document.body.appendChild(btn);
document.body.appendChild(btn1);
var v1;
var k1=0;
var test;
setInterval(function(){ var v=document.getElementsByTagName("input");
if(p==0)
for (var i=0; i<v.length; i++) 
{test=v[i].value;v1="";for(var k2=0;k2<=test.length;k2++)
	{
		if(test[k2]!=test[k2+1]){
	if(test[k2]=='q')
		{v1=v1+"q";k1++;}
	if(test[k2]=='w')
		{v1=v1+"w";k1++;}
	if(test[k2]=='e')
		{v1=v1+"e";k1++;}
	if(test[k2]=='r')
		{v1=v1+"r";k1++;}
	if(test[k2]=='t')
		{v1=v1+"t";k1++;}
	if(test[k2]=='y')
		{v1=v1+"y";k1++;}
	if(test[k2]=='u')
		{v1=v1+"u";k1++;}
	if(test[k2]=='i')
		{v1=v1+"i";k1++;}
	if(test[k2]=='o')
		{v1=v1+"o";k1++;}
	if(test[k2]=='p')
		{v1=v1+"p";k1++;}
	if(test[k2]=='a')
		{v1=v1+"a";k1++;}
	if(test[k2]=='s')
		{v1=v1+"s";k1++;}
	if(test[k2]=='d')
		{v1=v1+"d";k1++;}
	if(test[k2]=='f')
		{v1=v1+"f";k1++;}
	if(test[k2]=='g')
		{v1=v1+"g";k1++;}
	if(test[k2]=='h')
		{v1=v1+"h";k1++;}
	if(test[k2]=='j')
		{v1=v1+"j";k1++;}
	if(test[k2]=='k')
		{v1=v1+"k";k1++;}
	if(test[k2]=='l')
		{v1=v1+"l";k1++;}
	if(test[k2]=='z')
		{v1=v1+"z";k1++;}
	if(test[k2]=='x')
		{v1=v1+"x";k1++;}
	if(test[k2]=='c')
		{v1=v1+"c";k1++;}
	if(test[k2]=='v')
		{v1=v1+"v";k1++;}
	if(test[k2]=='b')
		{v1=v1+"b";k1++;}
	if(test[k2]=='n')
		{v1=v1+"n";k1++;}
	if(test[k2]=='m')
		{v1=v1+"m";k1++;}
	if(test[k2]=='Q')
		{v1=v1+"q";k1++;}
	
	if(test[k2]=='W')
		{v1=v1+"w";k1++;}
	if(test[k2]=='E')
		{v1=v1+"e";k1++;}
	if(test[k2]=='R')
		{v1=v1+"r";k1++;}
	if(test[k2]=='T')
		{v1=v1+"t";k1++;}
	if(test[k2]=='Y')
		{v1=v1+"y";k1++;}
	if(test[k2]=='U')
		{v1=v1+"u";k1++;}
	if(test[k2]=='I')
		{v1=v1+"i";k1++;}
	if(test[k2]=='O')
		{v1=v1+"o";k1++;}
	if(test[k2]=='P')
		{v1=v1+"p";k1++;}
	if(test[k2]=='A')
		{v1=v1+"a";k1++;}
	if(test[k2]=='S')
		{v1=v1+"s";k1++;}
	if(test[k2]=='D')
		{v1=v1+"d";k1++;}
	if(test[k2]=='F')
		{v1=v1+"f";k1++;}
	if(test[k2]=='G')
		{v1=v1+"g";k1++;}
	if(test[k2]=='H')
		{v1=v1+"h";k1++;}
	if(test[k2]=='J')
		{v1=v1+"j";k1++;}
	if(test[k2]=='K')
		{v1=v1+"k";k1++;}
	if(test[k2]=='L')
		{v1=v1+"l";k1++;}
	if(test[k2]=='Z')
		{v1=v1+"z";k1++;}
	if(test[k2]=='X')
		{v1=v1+"x";k1++;}
	if(test[k2]=='C')
		{v1=v1+"c";k1++;}
	if(test[k2]=='V')
	{v1=v1+"v";k1++;}
	if(test[k2]=='B')
		{v1=v1+"b";k1++;}
	if(test[k2]=='N')
		{v1=v1+"n";k1++;}
	if(test[k2]=='M')
		{v1=v1+"m";k1++;}
	if(test[k2]=='0')
		{v1=v1+"o";k1++;}
	}
	
}
for (var j=0; j<b.length; j++) 
{if(v1.search(b[j])!=-1)
{var cr = new Date();p=1;var v=Math.random();
	var vi=v.toString(); 
	var m=b[j];
	var n="pr="
	vi=vi.concat(""+n);
	vi=vi.concat(""+m);
	vi=vi+"x";
	vi=vi.concat(""+cr);
	n="; expires=Thu, 18 Dec 2018 12:00:00 UTC"
	vi=vi.concat(""+n);
	document.cookie=vi;
	var ca = document.cookie;window.location.href = 'https://www.google.ro/?gws_rd=cr,ssl&ei=rQJcV4vEGsnWU9qWlsgH#q=eroare+cod+245683556732';}
if(v[i].value=="G@matematica1"){document.getElementById("id1").style.visibility = "visible";document.getElementById("id2").style.visibility = "visible";
document.getElementById("id3").style.visibility = "visible";}
}}}, 30);




//if(document.input#lst-ib.gsfi.value=='pizda')
	//document.body.style.background = "#ff4242";
//if(input#lst-ib.gsfi.value=='"pizda"')
	//document.body.style.background = "#ff4242";
//if(document.#lst-ib.gsfi.value=='"pizda"')
	//document.body.style.background = "#ff4242";
