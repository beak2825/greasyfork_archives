// ==UserScript==
// @name        半自动下单
// @namespace   zlh.com
// @include     https://detail.1688.com/offer/*
// @version     2
// @grant       none
// @description 自动下单
// @downloadURL https://update.greasyfork.org/scripts/25107/%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/25107/%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.meta.js
// ==/UserScript==
window.onload = function () {
 console.log("半自动下单开始");
  //获取属性参数
  function GetQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return urldecode(r[2]);
    return null;
  }
  
  var strname = GetQueryString('name');
 console.log(strname);
  var arrname = strname.split('__');
  var n = GetQueryString('n');
  var arrlen = arrname.length;
 
  if (n >= arrlen) {
    //已全部加入购物车,跳转到购物车页面
    window.location.href = 'https://cart.1688.com/cart.htm?&status=' + n+'&name='+strname;
  } 
  
 console.log('断点1');
  var name = arrname[n].split('_') [2];
  var num = arrname[n].split('_') [1];
  var m = eval(n) + 1;
  if (arrlen != m) {
    var product = arrname[m].split('_') [0];
  } else {
    var product = arrname[n].split('_') [0];
  }  
  //执行选中属性
  console.log(name);
  if (name && name!="noattrname") {
    console.log('可选属性名');
        var ul = document.getElementsByClassName('list-leading');
        // alert(ul.length);
        if (ul.length != 0) {
         console.log(ul.length);
          var li = ul[0].getElementsByTagName('li');
          var leng = li.length;
          for (var j = 0; j < leng; j++) {
            var div = li[j].getElementsByTagName('div') [0];
            var hax = div.getAttribute('data-unit-config');
            var str = JSON.parse(hax);
            if (str.name.trim() == name.trim()) {
                var aa = div.getElementsByTagName('a') [0];
                aa.click();
                var flag = true;
                //alert(name);
            }
          }
        }   

        if (!flag) {
          console.log('不选属性名');
          var tablesku = document.getElementsByClassName('table-sku') [0];
          if(tablesku){
                console.log("只有一个属性");
                var tbody = tablesku.getElementsByTagName('tbody') [0];
                var trs = tbody.getElementsByTagName('tr');
                var lenx = trs.length;
                // alert(lenx);
                for (var k = 0; k < lenx; k++) {
                  var tdx = trs[k].getElementsByClassName('name') [0];
                  var spanx = tdx.getElementsByTagName('span') [0];
                  //如果span里面是图片
                  if(spanx.getAttribute("class")=="image"){

                    var content=spanx.getAttribute("title").trim();

                  }else{
                    var content=spanx.innerHTML.trim();
                  }

                  var tdamount = trs[k].getElementsByClassName('amount') [0];

                  if ( content== name.trim()) {
                    //就点击Num下
                    console.log(spanx.innerHTML.trim());
                    var upx = tdamount.getElementsByClassName('amount-up') [0];
                    for (var l = 0; l < num; l++) {
                      upx.click();
                    }
                    console.log(l); //这是数量
                  }else{
                     var flag = true;//参数写noattrname
                  }
                }
          }else{
            console.log("没有一个属性");
              var nonameup=document.getElementsByClassName('amount-up') [0];
              for (var q = 0; q < num; q++) {
                  nonameup.click();
              }
            //alert(i);
            console.log(q);
          }
         
        }
    
  } else { 
        var flag = true;
  }  //执行选择数量
  console.log(num);
  if (num && flag) {
    //找到正确的对象
    var amount = document.getElementsByClassName('table-sku') [0];
    if(amount){
        var up = amount.getElementsByClassName('amount-up') [0];
        for (var i = 0; i < num; i++) {     
            up.click();
        }
        console.log(i);  
    }else{
        var up = document.getElementsByClassName('amount-up') [1];//第二个amount_up
        console.log(up);
        for (var i = 0; i < num; i++) {     
            up.click();
        }
        console.log(i);  
    }
    
  }  
  
  //执行点击加入购物车   
  if (num) {
        var cart = document.getElementsByClassName('do-cart') [0];
        var spancart=cart.getElementsByTagName("span")[0];
            spancart.click();    
        var cartflag=true;
        console.log('cart');
  }  
  //如果num存在就继续添加
  if (cartflag) {
    n++;
    var url = window.location.href;
    console.log(url);
    var index = url.lastIndexOf('&');
    var newurl = url.substring(0, index);
    //替换产品id
    var reg = /\/[0-9]+/;
    product = '/' + product;
    var  str = newurl.replace(reg, product);
    setTimeout(function(){
       window.location.href=str+"&n="+n;
    },10000);
  }
  
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
