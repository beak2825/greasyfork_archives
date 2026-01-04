// ==UserScript==
// @name         CText Copylink
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  加强中哲书体验
// @author       Basic 低手
// @match        https://ctext.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ctext.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469833/CText%20Copylink.user.js
// @updateURL https://update.greasyfork.org/scripts/469833/CText%20Copylink.meta.js
// ==/UserScript==

'use strict';

document.body.style.fontFamily=",Plangothic P1, Plangothic P2";

var sss=document.getElementById("menubar")
sss.innerHTML+='<button onclick=\'navigator.clipboard.writeText("["+document.title.slice(0,document.title.indexOf(" "))+"]("+window.location.href+")");\'>复制网址</button>'
sss.innerHTML+='笔画数<input id="myStrokes" />组<input id="myGroup" />IDS<input id="myComp" />部首<select id="myRadical"><option value="1">一</option> <option value="2">丨</option> <option value="3">丶</option> <option value="4">丿</option> <option value="5">乙</option> <option value="6">亅</option><option value="7">二</option> <option value="8">亠</option> <option value="9">人</option> <option value="10">儿</option> <option value="11">入</option> <option value="12">八</option> <option value="13">冂</option> <option value="14">冖</option> <option value="15">冫</option> <option value="16">几</option> <option value="17">凵</option> <option value="18">刀</option> <option value="19">力</option> <option value="20">勹</option> <option value="21">匕</option> <option value="22">匚</option> <option value="23">匸</option> <option value="24">十</option> <option value="25">卜</option> <option value="26">卩</option> <option value="27">厂</option> <option value="28">厶</option> <option value="29">又</option><option value="30">口</option> <option value="31">囗</option> <option value="32">土</option> <option value="33">士</option> <option value="34">夂</option> <option value="35">夊</option> <option value="36">夕</option> <option value="37">大</option> <option value="38">女</option> <option value="39">子</option> <option value="40">宀</option> <option value="41">寸</option> <option value="42">小</option> <option value="43">尢</option> <option value="44">尸</option> <option value="45">屮</option> <option value="46">山</option> <option value="47">巛</option> <option value="48">工</option> <option value="49">己</option> <option value="50">巾</option> <option value="51">干</option> <option value="52">幺</option> <option value="53">广</option> <option value="54">廴</option> <option value="55">廾</option> <option value="56">弋</option> <option value="57">弓</option> <option value="58">彐</option> <option value="59">彡</option> <option value="60">彳</option><option value="61">心</option> <option value="62">戈</option> <option value="63">戶</option> <option value="64">手</option> <option value="65">支</option> <option value="66">攴</option> <option value="67">文</option> <option value="68">斗</option> <option value="69">斤</option> <option value="70">方</option> <option value="71">无</option> <option value="72">日</option> <option value="73">曰</option> <option value="74">月</option> <option value="75">木</option> <option value="76">欠</option> <option value="77">止</option> <option value="78">歹</option> <option value="79">殳</option> <option value="80">毋</option> <option value="81">比</option> <option value="82">毛</option> <option value="83">氏</option> <option value="84">气</option> <option value="85">水</option> <option value="86">火</option> <option value="87">爪</option> <option value="88">父</option> <option value="89">爻</option> <option value="90">爿</option> <option value="91">片</option> <option value="92">牙</option> <option value="93">牛</option> <option value="94">犬</option> <option value="95">玄</option> <option value="96">玉</option> <option value="97">瓜</option> <option value="98">瓦</option> <option value="99">甘</option> <option value="100">生</option> <option value="101">用</option> <option value="102">田</option> <option value="103">疋</option> <option value="104">疒</option> <option value="105">癶</option> <option value="106">白</option> <option value="107">皮</option> <option value="108">皿</option> <option value="109">目</option> <option value="110">矛</option> <option value="111">矢</option> <option value="112">石</option> <option value="113">示</option> <option value="114">禸</option> <option value="115">禾</option> <option value="116">穴</option> <option value="117">立</option> <option value="118">竹</option> <option value="119">米</option> <option value="120">糸</option> <option value="121">缶</option> <option value="122">网</option> <option value="123">羊</option> <option value="124">羽</option> <option value="125">老</option> <option value="126">而</option> <option value="127">耒</option> <option value="128">耳</option> <option value="129">聿</option> <option value="130">肉</option> <option value="131">臣</option> <option value="132">自</option> <option value="133">至</option> <option value="134">臼</option> <option value="135">舌</option> <option value="136">舛</option> <option value="137">舟</option> <option value="138">艮</option> <option value="139">色</option> <option value="140">艸</option> <option value="141">虍</option> <option value="142">虫</option> <option value="143">血</option> <option value="144">行</option> <option value="145">衣</option> <option value="146">襾</option> <option value="147">見</option> <option value="148">角</option> <option value="149">言</option> <option value="150">谷</option> <option value="151">豆</option> <option value="152">豕</option> <option value="153">豸</option> <option value="154">貝</option> <option value="155">赤</option> <option value="156">走</option> <option value="157">足</option> <option value="158">身</option> <option value="159">車</option> <option value="160">辛</option> <option value="161">辰</option> <option value="162">辵</option> <option value="163">邑</option> <option value="164">酉</option> <option value="165">釆</option> <option value="166">里</option> <option value="167">金</option> <option value="168">長</option> <option value="169">門</option> <option value="170">阜</option> <option value="171">隶</option> <option value="172">隹</option> <option value="173">雨</option> <option value="174">靑</option> <option value="175">非</option> <option value="176">面</option> <option value="177">革</option> <option value="178">韋</option> <option value="179">韭</option> <option value="180">音</option> <option value="181">頁</option> <option value="182">風</option> <option value="183">飛</option> <option value="184">食</option> <option value="185">首</option> <option value="186">香</option> <option value="187">馬</option> <option value="188">骨</option> <option value="189">高</option> <option value="190">髟</option> <option value="191">鬥</option> <option value="192">鬯</option> <option value="193">鬲</option> <option value="194">鬼</option> <option value="195">魚</option> <option value="196">鳥</option> <option value="197">鹵</option> <option value="198">鹿</option> <option value="199">麥</option> <option value="200">麻</option> <option value="201">黃</option> <option value="202">黍</option> <option value="203">黑</option> <option value="204">黹</option> <option value="205">黽</option> <option value="206">鼎</option> <option value="207">鼓</option> <option value="208">鼠</option> <option value="209">鼻</option> <option value="210">齊</option> <option value="211">齒</option> <option value="212">龍</option> <option value="213">龜</option> <option value="214">龠</option> </select>';
var btnCreateCode1=document.createElement("button");
btnCreateCode1.innerText="生成字符代码";
btnCreateCode1.onclick=function (){
    var file=document.getElementsByName("file")[0].value;
    var page=document.getElementsByName("page")[0].value;
    var s=window.location.href;
    if(s.indexOf("#")>0){
        s=s.split("#")[1];
        var ss=s.slice(4,s.length-1).split(",");
        ss[2]=Math.round(eval(ss[2]+"+"+ss[0])).toString();
        ss[3]=Math.round(eval(ss[3]+"+"+ss[1])).toString();
        var t="<character quality=\"5\" location=\""+[file, page, ss.join(",")].join(":")+"\" strokes=\""+document.getElementById("myStrokes").value+"\" group=\""+document.getElementById("myGroup").value+"\" comp=\""+document.getElementById("myComp").value+"\" radical=\""+document.getElementById("myRadical").value+"\"/>";
        navigator.clipboard.writeText(t);
    }
}
sss.appendChild(btnCreateCode1);
var btnOpenImage=document.createElement("button");
btnOpenImage.innerText="打开图片";
btnOpenImage.onclick=function (){
    var s=window.location.href;
    var t=document.getElementById("previmg").src;
    if(s.indexOf("#")>0){
        s=s.split("#")[1];
        var ss=s.slice(4,s.length-1).split(",");
        ss[2]=Math.round(eval(ss[2]+"+"+ss[0])).toString();
        ss[3]=Math.round(eval(ss[3]+"+"+ss[1])).toString();
        t+="?exact=1&x1="+parseInt(ss[0]).toString()+"&y1="+parseInt(ss[1]).toString()+"&x2="+ss[2]+"&y2="+ss[3];
    }
    window.open(t);
}
 sss.appendChild(btnOpenImage);
var btnCreateCode=document.createElement("button");
btnCreateCode.innerText="生成图片代码";
btnCreateCode.onclick=function (){
    var file=document.getElementsByName("file")[0].value;
    var page=document.getElementsByName("page")[0].value;
    var s=window.location.href;
    if(s.indexOf("#")>0){
        s=s.split("#")[1];
        var ss=s.slice(4,s.length-1).split(",");
        ss[1]=Math.round(ss[1]).toString();
        ss[0]=Math.round(ss[0]).toString();
        ss[2]=Math.round(eval(ss[2]+"+"+ss[0])).toString();
        ss[3]=Math.round(eval(ss[3]+"+"+ss[1])).toString();
        var t="<picture quality=\"5\" location=\""+[file, page, ss.join(",")].join(":")+"\"/>";
        navigator.clipboard.writeText(t);
    }
}
sss.appendChild(btnCreateCode);
var aCTextChar=document.createElement("a");
aCTextChar.href=window.location.href+"&chartype=ctext";
aCTextChar.innerText="[CText字符]";
sss.appendChild(aCTextChar);