// ==UserScript==
// @name      U20 Eligibility Script
// @namespace  https://www.facebook.com/jefree.sujit
// @version    1.0
// @description  Script to calculate the eligibilty of a U20 player
// @match      http://hitwicket.com/discussionForum/111738
// @include      http://*hitwicket.com/discussionForum/111738*
// @copyright  2015+, Jefreesujit
// @downloadURL https://update.greasyfork.org/scripts/11314/U20%20Eligibility%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/11314/U20%20Eligibility%20Script.meta.js
// ==/UserScript==


$(".thread_content").html("");

$(".thread_content").append( '<meta property="article:tag" content="apps" />'+
'<meta property="article:tag" content="games" />'+
'<meta property="article:tag" content="sports" />'+
'<meta name="keywords" content="cricket , u20 , hitwicket , u20 cup, u20 eligibilty, u20 eligibility calculator, u20 eligibility indicator, u20 eligibility script, u20 eligibility finder, u20 player, hitwicket jefreesujit, jefreesujit " />'+

"<div>Script to calculate the eligibility of a u20 player.</div><div><br></div>" +

'<div id="jefree" style="float: center;">'+

'<div style="padding-left:0em;"><b>U20  ELIGIBILITY  CALCULATOR</b></div></br></br>'+

'Years : '+
'<div style=" display: inline-block; float: center; text-align: center;">'+
                           
 '<select id="x">'+
'<option value="17">17 yrs</option>'+
'<option value="18">18 yrs</option>'+
'<option value="19">19 yrs</option>'+
'<option value="20">20 yrs</option>'+
'<option value="21">21 yrs</option>'+
'<option value="22">22 yrs</option>'+
'<option value="23">23 yrs</option>'+
'<option value="24">24 yrs</option>'+
'<option value="25">25 yrs</option>'+
'<option value="26">26 yrs</option>'+
'<option value="27">27 yrs</option>'+
'<option value="28">28 yrs</option>'+
'<option value="29">29 yrs</option>'+
'<option value="30">30 yrs</option>'+
'<option value="31">31 yrs</option>'+
'<option value="32">32 yrs</option>'+
'<option value="33">33 yrs</option>'+
'<option value="34">34 yrs</option>'+
'<option value="35">35 yrs</option>'+
'</select>'+
'</div>' +
                            

'<div style=" display: inline-block; float: center; text-align: center; padding-left:2em">'+
 'Days : '+

'<select id="y">'+
'<option value="0">0</option>'+
'<option value="1">1</option>'+
'<option value="2">2</option>'+
'<option value="3">3</option>'+
'<option value="4">4</option>'+
'<option value="5">5</option>'+
'<option value="6">6</option>'+
'<option value="7">7</option>'+
'<option value="8">8</option>'+
'<option value="9">9</option>'+
'<option value="10">10</option>'+
'<option value="11">11</option>'+
'<option value="12">12</option>'+
'<option value="13">13</option>'+
'<option value="14">14</option>'+
'<option value="15">15</option>'+
'<option value="16">16</option>'+
'<option value="17">17</option>'+
'<option value="18">18</option>'+
'<option value="19">19</option>'+
'<option value="20">20</option>'+
'<option value="21">21</option>'+
'<option value="22">22</option>'+
'<option value="23">23</option>'+
'<option value="24">24</option>'+
'<option value="25">25</option>'+
'<option value="26">26</option>'+
'<option value="27">27</option>'+
'<option value="28">28</option>'+
'<option value="29">29</option>'+
'<option value="30">30</option>'+
'<option value="31">31</option>'+
'<option value="32">32</option>'+
'<option value="33">33</option>'+
'<option value="34">34</option>'+
'<option value="35">35</option>'+
'<option value="36">36</option>'+
'<option value="37">37</option>'+
'<option value="38">38</option>'+
'<option value="39">39</option>'+
'<option value="40">40</option>'+
'<option value="41">41</option>'+
'<option value="42">42</option>'+
'<option value="43">43</option>'+
'<option value="44">44</option>'+
'<option value="45">45</option>'+
'<option value="46">46</option>'+
'<option value="47">47</option>'+
'<option value="48">48</option>'+
'<option value="49">49</option>'+
'<option value="50">50</option>'+
'<option value="51">51</option>'+
'<option value="52">52</option>'+
'<option value="53">53</option>'+
'<option value="54">54</option>'+
'<option value="55">55</option>'+
'<option value="56">56</option>'+
'<option value="57">57</option>'+
'<option value="58">58</option>'+
'<option value="59">59</option>'+
'<option value="60">60</option>'+
'<option value="61">61</option>'+
'<option value="62">62</option>'+
'<option value="63">63</option>'+
'<option value="64">64</option>'+
'<option value="65">65</option>'+
'<option value="66">66</option>'+
'<option value="67">67</option>'+
'<option value="68">68</option>'+
'<option value="69">69</option>'+
'<br>'+
'</select>'+
'<br>'+
'</div>'+

'<div style=" display: inline-block; float: center; text-align: center; padding-left:3em">'+
'<input type = "button" id = "calc" value= "Check Eligibility" />'+
'</br>'+
'</div>'+ 
                           
'<br><br><br>'+
    'He will be  '+  '<input type = "text" id = "w" size="1" readonly />'+  '  Years and  ' + '<input type = "text" id = "z" size="1" readonly />' + '  Days old at the closing of registration date.'+

'</br>'+
'<br><br>' +
'Eligibility:'+ '<input type = "text" id = "res" size="40" readonly />' + '<br><br>' );

$(document).on('click', '#calc', function(){
        calc_age();
    }
);

function calc_age()  // to find age at the registration deadline
{
var i=11;  //season count
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth(); //January is 0!
var yyyy = today.getFullYear();
var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
var firstDate = new Date(yyyy,mm,dd);
var secondDate = new Date(2015,05,25);
while (firstDate > secondDate)
{
   i=i+1;  // season count increases each season
   secondDate = change_date(secondDate); // max age date changes every season
}
var diffDays = Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay));

var a,b=69,c,d,e,t;
var n1,n2;
n1=$("#x").val();
n2=$("#y").val();
a=parseInt(n1);
b=parseInt(n2);
c=b+diffDays;
d=c/70;
e=c%70;
t=a+d;
t=parseInt(t);
$("#w").val(t);
$("#z").val(e);
eligibility(t,i);
}

/*************/
$(document).ready(function()   // to find the minimum age criteria
{
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth(); //January is 0!
var yyyy = today.getFullYear();
var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
var firstDate = new Date(yyyy,mm,dd);
var secondDate = new Date(2015,05,25);
while (firstDate > secondDate)
{
   secondDate = change_date(secondDate);
}
var diffDays = Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay));
var diffDays1 = 69-diffDays;
$("div#jefree").append("<b> The player must be atleast 19 yrs and "+diffDays1+" days or less to be eligible for the next U20 cup </b><br><br>");
}
);

/*************/

function change_date(date)  // to update the max age date
{
    var result = new Date(date);
    result.setDate(result.getDate() + 70);
    return result;
}

function eligibility(t,i) // to check eligibility
{
j=i+1;
if(t<=19)
{
 if(t<=18)
  {
   if(t==17) 
     {    
       $("#res").val("He can play in U20- "+j+", U20-"+(j+1)+", U20-"+(j+2)); }
   else {
       $("#res").val("He can play in U20- "+j+", U20-"+(j+1)); }
  }
 else
   $("#res").val("He can play in U20- "+j);
}
else
 $("#res").val("He is not eligible to participate in U20  ");
}
