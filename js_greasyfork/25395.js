// ==UserScript==
// @name        pwnyFilters
// @namespace   pwnyFilters
// @include     http://*
// @include     https://*
// @version     1.7
// @description:en Add css3 filters to any page. Style and keep settings. https://github.com/webdev23/ponyFilters
// @grant       none
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEkAAABFCAIAAACJ01zwAAAACXBIWXMAAAsTAAALEwEAmpwYAAALIUlEQVRo3u1bf0gb5xt/5vUmhwQJdSGEEkRwmas0CzInwQXnAqsLUoLNuEkroRRhSMi6UQpuSAldkUkmTjJXcF2XShY6gmSZDTVMxmiLawshtdG6VCmyFpGskl6z7Lye9/3jgWu+SYyXGK398n3+Cnfv3Xuf98fzfJ7P8+YlQRDgf9TKds+nPHny5Isvvsh56+uvv/77778LfqOwa8xkMpWXl2dfn5ubIwiir6+v0BfuFmz9/f041nNzc+nXeZ5vaGioqKioqqp6IbHduHGDIAiaptva2gYGBtJvnT59GgC8Xm827BcAG8MwNTU1crk8Ho+7XC6apsVb09PTAKBWq3mer6iocLvdBb35+fsSu92+uLjocDju3Lmzd+9elmXx+urq6gcffEAQxKVLl8rKyiiKunr16ovkJ3/66afz589rtdp///3322+/vXfvnlKpxFtHjx5dWlr68ssv33rrLQBIpVIvkp+MxWKVlZUAMDU1JZPJjh8/rtPpAEAmk1VUVABAbW1t+uIcGhp6Mdbk7Ozsu+++m0gk7Hb7/Pw8wzCLi4sPHjzw+/2PHz9eXl622+2xWOzgwYN37969ePEiAFRXV+/qeeN5PhgMms1m7L2trU0QBIvFAgByuTwWi6U39vv9CoUCAMrLywHgr7/+2nV+kmGYiYmJs2fPms1miqIAoLGxsb+/X6lUxuNxQRCMRiMABINBQRA4jltZWRGfTSaTPp/vzJkzRcS3PdtBnX777be7d+9GIpGlpaVwOMwwDN4iSbKjo6O7u/udd965fPlyS0vL3r170csPDAwcPHgQXYjX662pqdHr9ZWVlevr6ysrK5OTkxjiCrKSYfvzzz8vXrw4MTFx+/ZtnufxIkEQ9fX1dXV1b775pk6ne/vtt/fsedbj66+/jj++++478eLRo0fv379/8+bNxcVFANi/f//q6qrFYnn//fefg5+MRqMtLS0iGIPBYLPZvF5vOBzmeT6jsUg74vF4+trL3pYsy3IcJwhCV1eXXC7PftW27zev14sbXa1WO51O3D85LZFI9PT0GAyGQrtwuVwA0N/fv6PYAoEAAFAUNTAwsNG4chwXDAZtNltFRUVLS8ujR48K7YXjuOrqaoqiMrzoNmJbWFiQyWS1tbUbdRkMBk0mE0mSAKBSqUZGRjZ6VSqVGhoastlsHo9neXk5u8HExAQANDQ04CrddmxGo7GpqSnnIpyfn29ubsYduG/fvsHBQZZl86xVjUYDAAaDgaIov9+fs9nJkycBwGKxSIdXJDaPx6NSqXIuMJ/Ph4xJrVa7XK5NPyUUCimVylAotGmnhw4dAoDW1tY8I7VVbAzDqFQqh8ORfWt4eBiny2azSfyCRCIhcRPyPG+z2QDg3Llz24KN47j29naCILI3hhhee3t7C32tw+GgKEqj0USj0fwtBwcHe3p6So8tGo0iVT906FA2qceleOTIkUKB+Xw+g8FQV1eHDiN/4/Hx8RJj4ziur6+PIAh0eoFAIKMBhm+NRpNMJgvF1t7e7vf7BwcHSZIkSXJmZiZPY7vdXkps0WhUq9UiVQ+FQmazOWMvXblyBUlJJBIpYgPLZDKSJAmC6Ozs7OvrGx8fz9OYpmmJ2PLlb+vr65cvXz58+PCBAwcikYher49EIkajUaVSvfzyy+ktUVc8derUgQMHiuCiT58+5TgOJS2GYcrKSpRVZvuiW7dunTt3jqZp3D84XS6XS2zz8OHDjGiGiWMqlSouojQ2NgKA2+2ORCIUReVfk9LnDURmQNO0VqtFciiaQqE4ffp0fh/d19eHMlvRNMDpdOI2VigUTU1N+RsXjE1MscSJomna5/NtFHnHxsbm5+fxt06n02q1W+TcQ0NDHR0dJ06cyJMciNjee++9ArBxHDc6Ojo2NhYIBKSk7mazGZlEPB4HgAsXLuyYKoHhW4rTkuQnl5eXMyJ1XV3d77//jqGJoqiCKOwWbW5uDnlPabD19vZOTEyk+xuCIDAMnDp1KjuOb7fRNC2XyzcdUEne1uv1pm/ImzdvvvrqqxgGZmdnX3nllR3W/z777LPV1dUffvhhq7rynTt3FhcXnzx5Il75448/6uvr8ffU1JSYzuyY1dfXt7W1DQ0NbRXb5OQkAKTP2+Tk5NOnTwHgn3/+SSaTcrl856Xbjz/+eGZm5pdfftmSFtTe3o6BVRQMSZJEtRCpFjqVnbd9+/blD4Zlm4qNOG8ymQyv/PjjjxzHxePxx48fJxIJZO7PRXXv6uqanp7+6quvipy3M2fOYDORBzU2NloslqqqqkAgcOHCBQAoVF1jGMZisWx93lZWVnBNdXZ2MgxTWAxgWVahUNA0TRAEAsB6Sjgctlqtvb29o6OjRSicLMuSJJlHGirIBgcHseJz//79ArA5nU6dTnfy5EmRUrW2tra3t6PIodFo3G53ceptQ0NDeXl5OBwuCbzx8XEA0Ol0UrGxLKtSqfx+P03TmEqjkCYuzpqamq6uLqz6FaGlImsdHR0tQjDOtmPHjgGASHE3weZ0OnG66urqRkZGGIaprq4+fvx4uvqNn3j16lXpH3H9+nWCILRa7dmzZ/FxpVJptVq7u7s7OzsvXbpUHLaenh4AyND/cmNLJpMKhcLn8yWTSYIglpaWjhw5guX29DYY2Twej/SPqK2tFZluIBBQqVQZvs3pdEp5z6effkoQhFhdKACbw+HQaDSCILjd7sbGxpGRkZwZGuZd6ZOZ38LhMJZm0le+2+3u6uqyWCwOhwOL3QaDYXp6etN8T6FQiOsZsS0tLW2Cjef5qqoqTLRbW1v3798PAMeOHcvZjclkslqtErHhOswzFo8ePeru7sYJbG5u9ng8OdNirJKnC2o0TSsUis19id/vl8lkqVRqYWEBu9Hr9UXrBenW2toKAJtuqunpaYPBIJYjOzs7s7Wj9NI+x3EymSz9YEpm3i0m6lar9aOPPhIE4fPPPwcArVabp/Ik3Xiex7pHhtyykcVisd7eXlylGadmzp8/r1arRa6HWyY7YD7DJs6pRqO5cuWKIAh6vd5oNBZRVcppU1NT6ccqJNrDhw9VKlVtbe1GoWJhYQHxZwSAZ9iSyaTovkiSLEnMyTCMGUWwrbGxMbEGEI1GUfJIJBLj4+MdHR0oB+cUs5/tN4VC4XQ6WZYt4kSAxGQZAKQ7nnRJGzOP5eVlnuetVisedsCajsvlqqysHB4ezpcHWCwWn8+3fbQd8/T0Wr7U4wZ79nzyySfxePzw4cNra2vff//9gwcPQqFQKpX69ddf19bWEonE7OxsvjwgEokgD855QLNUrM9kMhXxLMdxer0eAFpaWmKxGMuyc3NzLpcLCy8bUdP/igHNzc1NTU0AsKlIWNz3oehf6PEeMaNBJBlWXV29UXIMGbwBt+Y26Y245bq7u4t7nGXZ4eFhs9lsMplMJhNN06Ojo3kqmJBdHywvL1er1VJG98aNGwV9nMfjwcEuVXZTsD65srISDAZzZrLZeWHGEdxNBx5d3NY19pLV3/LMG0VRGQxVSlkDAHJ67V2ETRAEpVLZ0dFREPNC8q1SqbaDIZQSm91uB4D8KUmGhUIhnLqCEr/ngA3VIaPRWNBTGGmKi3U7h01MpTc9O5FuKCKRJLmtBaASVJY//PBDAPjmm28KeoQgCI7jUNjdvf81wsPHbrd7fX1dOkV87bXX8E8AuxrbG2+8oVQqGYb5+eefpT+FuoD04Xhu/xETD1NLf2RmZia9zLB7seFh4mvXrklsv7a2hkUvXJnbZKU5i63T6Uwmk/QzLzMzM9h+W7G9JPz/P5kvov0H3GIOHVfhpQQAAAAASUVORK5CYII=
// @description Load the pwnyBar settings in any page. https://github.com/webdev23/ponyFilters
// @downloadURL https://update.greasyfork.org/scripts/25395/pwnyFilters.user.js
// @updateURL https://update.greasyfork.org/scripts/25395/pwnyFilters.meta.js
// ==/UserScript==
function gtCk(name){
	var re = new RegExp(name + "=([^;]+)"),
      value = re.exec(document.cookie);
return (value != null) ? unescape(value[1]) : null;
}
document.addEventListener("DOMContentLoaded", function(event) {
	console.log("ponyFilters loaded!\n")
	document.documentElement.style.cssText += gtCk('ponykits')
	document.documentElement.style.cssText += gtCk('ponyFilters')
	document.body.style.cssText += "color:" + gtCk('color_A')
 	document.body.style.cssText += "background-color:" + gtCk('color_B')
	for (var k=0;k<txt.length;k++){
		if (txt.color != "") {
			txt[k].style.color = document.getElementById('pwnClrA').value
	}}
})

var bzs = document.body.getElementsByTagName("img");
for (var i = 0; i < bzs.length;) {
	var wi = bzs[i].width; var he = bzs[i].height;
	bzs[i].setAttribute("onmouseup", "window.open(this.src,'this.src','width="+wi+",height="+he+",resizable=1')"), i++;}

document.addEventListener('keydown', (event) => {
	
  const keyName = event.key;
  if (keyName === 'Control') {return}
  if (event.ctrlKey) { var yop =  event.key;console.log(yop)
    if (yop ==","){
			document.documentElement.style.cssText='filter:none;-webkit-filter:none';
			writeCookie();
      window.location.reload(true)}
		if (yop ==";"){
			var hold = document.documentElement.style.cssText,
			    target = document.getElementsByTagName('script')[0],
					inj = document.createElement('script');
			inj.src= 'https://ponyhacks.com/open/cdn/pwnyfilter.js';
			target.appendChild(inj);
			document.documentElement.style.cssText = hold}
		if (yop =="!"){
			writeCookie()}
		if (yop =="1"){
			document.documentElement.style.cssText = 'filter: sepia(7%) invert(7%) saturate(7%) brightness(1) grayscale(27%) hue-rotate(0deg);\
-webkit-filter: sepia(7%) invert(7%) saturate(7%) brightness(1) grayscale(27%) hue-rotate(0deg)'}
		if (yop =="2"){
			document.documentElement.style.cssText = 'filter: sepia(41%) invert(11%) saturate(17%) brightness(1) grayscale(17%) hue-rotate(20deg);\
-webkit-filter: sepia(41%) invert(11%) saturate(17%) brightness(1) grayscale(17%) hue-rotate(20deg)'}
  }
 }, false);

document.addEventListener("DOMContentLoaded", function(event) {
	document.getElementById('pwnClrA').value = document.body.style.color
	document.getElementById('pwnClrB').value = document.body.style.backgroundColor
	document.body.setAttribute("onscroll","document.getElementById('pwnClrA').value = document.body.style.color")

})
