// ==UserScript==
// @name        结算
// @namespace   zlh.com
// @include     https://cart.1688.com/cart.htm?&status*
// @version     1
// @grant       none
// @description 调到结算页面
// @downloadURL https://update.greasyfork.org/scripts/25109/%E7%BB%93%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/25109/%E7%BB%93%E7%AE%97.meta.js
// ==/UserScript==

//alert('来到了结算页面啦');

window.onload=function(){
 
  function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  urldecode(r[2]); return null;
  }
  var status=GetQueryString("status");
  var strname=GetQueryString("name");
	console.log(strname);
  var checkout=document.getElementById("checkout");
  //全选
  checkout.getElementsByTagName("label")[0].click();
  //选择交易方式(默认支付宝担保交易)
  var selects=document.getElementsByClassName("select-container");
  var lens=selects.length;
  //alert(lens);
  for(var p=0;p<lens;p++){
   // console.log(selects[p].getElementsByClassName("select-handler")[0]);
    var handler=selects[p].getElementsByClassName("select-handler")[0];
    var options=selects[p].getElementsByClassName("options")[0];
   // console.log(options);
    if(options){
       options.getElementsByTagName("dt")[1].click();
    }
   
  }

  //结算
  console.log(checkout);

  var form=checkout.getElementsByTagName("form")[0];
  console.log(form);
	strname=encodeURI(strname);//将获取的中文编码后发送
	//alert(strname);
  form.setAttribute("action","//order.1688.com/order/smart_make_order.htm?p=cart&status="+status+"&name="+strname);
	console.log(strname);
  var button=form.getElementsByTagName("button")[0];
 // console.log(button);
	//alert('点击跳转');
  setTimeout(function(){button.click();},20000);
	
 
}

//js解php的url编码
function urldecode(encodedString)
	{
		var output = encodedString;
		var binVal, thisString;
		var myregexp = /(%[^%]{2})/;
		function utf8to16(str)
		{
			var out, i, len, c;
			var char2, char3;

			out = "";
			len = str.length;
			i = 0;
			while(i < len)
			{
				c = str.charCodeAt(i++);
				switch(c >> 4)
				{
					case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
					out += str.charAt(i-1);
					break;
					case 12: case 13:
					char2 = str.charCodeAt(i++);
					out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
					break;
					case 14:
						char2 = str.charCodeAt(i++);
						char3 = str.charCodeAt(i++);
						out += String.fromCharCode(((c & 0x0F) << 12) |
						((char2 & 0x3F) << 6) |
						((char3 & 0x3F) << 0));
						break;
				}
			}
			return out;
		}
		while((match = myregexp.exec(output)) != null
		&& match.length > 1
		&& match[1] != '')
		{
			binVal = parseInt(match[1].substr(1),16);
			thisString = String.fromCharCode(binVal);
			output = output.replace(match[1], thisString);
		}

		//output = utf8to16(output);
		output = output.replace(/\\+/g, " ");
		output = utf8to16(output);
		return output;
	}