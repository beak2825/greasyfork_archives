// ==UserScript==
// @name         Cake's autofiller
// @namespace    bazaar
// @version      4.8.1
// @license MIT
// @description  Helps add items to your bazaar quicker by auto filling Qty and price when clicked
// @author       Pancakegh[2016971]
// @match        https://www.torn.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js
// @grant        GM_setClipboard
// @grant        GM_addElement
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/435699/Cake%27s%20autofiller.user.js
// @updateURL https://update.greasyfork.org/scripts/435699/Cake%27s%20autofiller.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

//When page is fully loaded:
//
window.onload = function() {
  console.log("Cakes autofiller loaded")

  $("<div class='ca-toggler ca-toolbar'><div class='ca-toggle-btn'>CA</div></div>").appendTo($("body"));
  getBasicInfo().then((allinfo) => {
    userinfo = allinfo;
    console.log(userinfo.status["state"])
  });
  //move ca button to first child
  var toolbar = document.querySelector('.ca-toolbar');
  var parentContainer = toolbar.parentNode;
  parentContainer.prepend(toolbar);

  var autofillerContainer = document.getElementById('c-autofiller-container');

  document.querySelectorAll('.ca-toggler').forEach(item => {
    item.addEventListener('click', function() {
    var displayStyle = window.getComputedStyle(autofillerContainer).getPropertyValue('display');
    if (displayStyle === 'none') {
      localStorage.setItem("ca_menu_toggled", 1)
      ca_menu_toggled = 1;
      autofillerContainer.style.display = 'block';
    } else {
      autofillerContainer.style.display = 'none';
      localStorage.setItem("ca_menu_toggled", 0)
      ca_menu_toggled = 0;
    }
    });
  });

  //open or close c-autofiller-container based on localstorage
    if (ca_menu_toggled === 1) {
      autofillerContainer.style.display = 'block';
    } else {
      autofillerContainer.style.display = 'none';
    }

  //disable these links while traveling
  $(document).on("click", "a", function(evt){
    console.log(userinfo.status["state"])
    if(userinfo.status["state"] === "Traveling"){
      if(this.className === "ca-disable-on-travel"){
        evt.preventDefault();
      alert("Can't do that while traveling...");
      return false;
      }
    }
  });

}


async function getBasicInfo() {
    apiCalls++;
    var today = new Date();
    today.setHours(0, 0, 0);
    const startofday = today.getTime();
    const response = await fetch(`https://api.torn.com/user/?selections=basic&key=${c_api_key}`);
    const result = await response.json();
    return result;
}

//#region inline JS libs
(function(e){typeof define=="function"&&define.amd?define(["jquery"],e):typeof module=="object"&&module.exports?module.exports=function(t,n){return n===undefined&&(typeof window!="undefined"?n=require("jquery"):n=require("jquery")(t)),e(n),n}:e(jQuery)})(function(e){function A(t,n,i){typeof i=="string"&&(i={className:i}),this.options=E(w,e.isPlainObject(i)?i:{}),this.loadHTML(),this.wrapper=e(h.html),this.options.clickToHide&&this.wrapper.addClass(r+"-hidable"),this.wrapper.data(r,this),this.arrow=this.wrapper.find("."+r+"-arrow"),this.container=this.wrapper.find("."+r+"-container"),this.container.append(this.userContainer),t&&t.length&&(this.elementType=t.attr("type"),this.originalElement=t,this.elem=N(t),this.elem.data(r,this),this.elem.before(this.wrapper)),this.container.hide(),this.run(n)}var t=[].indexOf||function(e){for(var t=0,n=this.length;t<n;t++)if(t in this&&this[t]===e)return t;return-1},n="notify",r=n+"js",i=n+"!blank",s={t:"top",m:"middle",b:"bottom",l:"left",c:"center",r:"right"},o=["l","c","r"],u=["t","m","b"],a=["t","b","l","r"],f={t:"b",m:null,b:"t",l:"r",c:null,r:"l"},l=function(t){var n;return n=[],e.each(t.split(/\W+/),function(e,t){var r;r=t.toLowerCase().charAt(0);if(s[r])return n.push(r)}),n},c={},h={name:"core",html:'<div class="'+r+'-wrapper">\n	<div class="'+r+'-arrow"></div>\n	<div class="'+r+'-container"></div>\n</div>',css:"."+r+"-corner {\n	position: fixed;\n	margin: 5px;\n	z-index: 1050;\n}\n\n."+r+"-corner ."+r+"-wrapper,\n."+r+"-corner ."+r+"-container {\n	position: relative;\n	display: block;\n	height: inherit;\n	width: inherit;\n	margin: 3px;\n}\n\n."+r+"-wrapper {\n	z-index: 1;\n	position: absolute;\n	display: inline-block;\n	height: 0;\n	width: 0;\n}\n\n."+r+"-container {\n	display: none;\n	z-index: 1;\n	position: absolute;\n}\n\n."+r+"-hidable {\n	cursor: pointer;\n}\n\n[data-notify-text],[data-notify-html] {\n	position: relative;\n}\n\n."+r+"-arrow {\n	position: absolute;\n	z-index: 2;\n	width: 0;\n	height: 0;\n}"},p={"border-radius":["-webkit-","-moz-"]},d=function(e){return c[e]},v=function(e){if(!e)throw"Missing Style name";c[e]&&delete c[e]},m=function(t,i){if(!t)throw"Missing Style name";if(!i)throw"Missing Style definition";if(!i.html)throw"Missing Style HTML";var s=c[t];s&&s.cssElem&&(window.console&&console.warn(n+": overwriting style '"+t+"'"),c[t].cssElem.remove()),i.name=t,c[t]=i;var o="";i.classes&&e.each(i.classes,function(t,n){return o+="."+r+"-"+i.name+"-"+t+" {\n",e.each(n,function(t,n){return p[t]&&e.each(p[t],function(e,r){return o+="	"+r+t+": "+n+";\n"}),o+="	"+t+": "+n+";\n"}),o+="}\n"}),i.css&&(o+="/* styles for "+i.name+" */\n"+i.css),o&&(i.cssElem=g(o),i.cssElem.attr("id","notify-"+i.name));var u={},a=e(i.html);y("html",a,u),y("text",a,u),i.fields=u},g=function(t){var n,r,i;r=x("style"),r.attr("type","text/css"),e("head").append(r);try{r.html(t)}catch(s){r[0].styleSheet.cssText=t}return r},y=function(t,n,r){var s;return t!=="html"&&(t="text"),s="data-notify-"+t,b(n,"["+s+"]").each(function(){var n;n=e(this).attr(s),n||(n=i),r[n]=t})},b=function(e,t){return e.is(t)?e:e.find(t)},w={clickToHide:!0,autoHide:!0,autoHideDelay:5e3,arrowShow:!0,arrowSize:5,breakNewLines:!0,elementPosition:"bottom",globalPosition:"top right",style:"bootstrap",className:"error",showAnimation:"slideDown",showDuration:400,hideAnimation:"slideUp",hideDuration:200,gap:5},E=function(t,n){var r;return r=function(){},r.prototype=t,e.extend(!0,new r,n)},S=function(t){return e.extend(w,t)},x=function(t){return e("<"+t+"></"+t+">")},T={},N=function(t){var n;return t.is("[type=radio]")&&(n=t.parents("form:first").find("[type=radio]").filter(function(n,r){return e(r).attr("name")===t.attr("name")}),t=n.first()),t},C=function(e,t,n){var r,i;if(typeof n=="string")n=parseInt(n,10);else if(typeof n!="number")return;if(isNaN(n))return;return r=s[f[t.charAt(0)]],i=t,e[r]!==undefined&&(t=s[r.charAt(0)],n=-n),e[t]===undefined?e[t]=n:e[t]+=n,null},k=function(e,t,n){if(e==="l"||e==="t")return 0;if(e==="c"||e==="m")return n/2-t/2;if(e==="r"||e==="b")return n-t;throw"Invalid alignment"},L=function(e){return L.e=L.e||x("div"),L.e.text(e).html()};A.prototype.loadHTML=function(){var t;t=this.getStyle(),this.userContainer=e(t.html),this.userFields=t.fields},A.prototype.show=function(e,t){var n,r,i,s,o;r=function(n){return function(){!e&&!n.elem&&n.destroy();if(t)return t()}}(this),o=this.container.parent().parents(":hidden").length>0,i=this.container.add(this.arrow),n=[];if(o&&e)s="show";else if(o&&!e)s="hide";else if(!o&&e)s=this.options.showAnimation,n.push(this.options.showDuration);else{if(!!o||!!e)return r();s=this.options.hideAnimation,n.push(this.options.hideDuration)}return n.push(r),i[s].apply(i,n)},A.prototype.setGlobalPosition=function(){var t=this.getPosition(),n=t[0],i=t[1],o=s[n],u=s[i],a=n+"|"+i,f=T[a];if(!f||!document.body.contains(f[0])){f=T[a]=x("div");var l={};l[o]=0,u==="middle"?l.top="45%":u==="center"?l.left="45%":l[u]=0,f.css(l).addClass(r+"-corner"),e("body").append(f)}return f.prepend(this.wrapper)},A.prototype.setElementPosition=function(){var n,r,i,l,c,h,p,d,v,m,g,y,b,w,E,S,x,T,N,L,A,O,M,_,D,P,H,B,j;H=this.getPosition(),_=H[0],O=H[1],M=H[2],g=this.elem.position(),d=this.elem.outerHeight(),y=this.elem.outerWidth(),v=this.elem.innerHeight(),m=this.elem.innerWidth(),j=this.wrapper.position(),c=this.container.height(),h=this.container.width(),T=s[_],L=f[_],A=s[L],p={},p[A]=_==="b"?d:_==="r"?y:0,C(p,"top",g.top-j.top),C(p,"left",g.left-j.left),B=["top","left"];for(w=0,S=B.length;w<S;w++)D=B[w],N=parseInt(this.elem.css("margin-"+D),10),N&&C(p,D,N);b=Math.max(0,this.options.gap-(this.options.arrowShow?i:0)),C(p,A,b);if(!this.options.arrowShow)this.arrow.hide();else{i=this.options.arrowSize,r=e.extend({},p),n=this.userContainer.css("border-color")||this.userContainer.css("border-top-color")||this.userContainer.css("background-color")||"white";for(E=0,x=a.length;E<x;E++){D=a[E],P=s[D];if(D===L)continue;l=P===T?n:"transparent",r["border-"+P]=i+"px solid "+l}C(p,s[L],i),t.call(a,O)>=0&&C(r,s[O],i*2)}t.call(u,_)>=0?(C(p,"left",k(O,h,y)),r&&C(r,"left",k(O,i,m))):t.call(o,_)>=0&&(C(p,"top",k(O,c,d)),r&&C(r,"top",k(O,i,v))),this.container.is(":visible")&&(p.display="block"),this.container.removeAttr("style").css(p);if(r)return this.arrow.removeAttr("style").css(r)},A.prototype.getPosition=function(){var e,n,r,i,s,f,c,h;h=this.options.position||(this.elem?this.options.elementPosition:this.options.globalPosition),e=l(h),e.length===0&&(e[0]="b");if(n=e[0],t.call(a,n)<0)throw"Must be one of ["+a+"]";if(e.length===1||(r=e[0],t.call(u,r)>=0)&&(i=e[1],t.call(o,i)<0)||(s=e[0],t.call(o,s)>=0)&&(f=e[1],t.call(u,f)<0))e[1]=(c=e[0],t.call(o,c)>=0)?"m":"l";return e.length===2&&(e[2]=e[1]),e},A.prototype.getStyle=function(e){var t;e||(e=this.options.style),e||(e="default"),t=c[e];if(!t)throw"Missing style: "+e;return t},A.prototype.updateClasses=function(){var t,n;return t=["base"],e.isArray(this.options.className)?t=t.concat(this.options.className):this.options.className&&t.push(this.options.className),n=this.getStyle(),t=e.map(t,function(e){return r+"-"+n.name+"-"+e}).join(" "),this.userContainer.attr("class",t)},A.prototype.run=function(t,n){var r,s,o,u,a;e.isPlainObject(n)?e.extend(this.options,n):e.type(n)==="string"&&(this.options.className=n);if(this.container&&!t){this.show(!1);return}if(!this.container&&!t)return;s={},e.isPlainObject(t)?s=t:s[i]=t;for(o in s){r=s[o],u=this.userFields[o];if(!u)continue;u==="text"&&(r=L(r),this.options.breakNewLines&&(r=r.replace(/\n/g,"<br/>"))),a=o===i?"":"="+o,b(this.userContainer,"[data-notify-"+u+a+"]").html(r)}this.updateClasses(),this.elem?this.setElementPosition():this.setGlobalPosition(),this.show(!0),this.options.autoHide&&(clearTimeout(this.autohideTimer),this.autohideTimer=setTimeout(this.show.bind(this,!1),this.options.autoHideDelay))},A.prototype.destroy=function(){this.wrapper.data(r,null),this.wrapper.remove()},e[n]=function(t,r,i){return t&&t.nodeName||t.jquery?e(t)[n](r,i):(i=r,r=t,new A(null,r,i)),t},e.fn[n]=function(t,n){return e(this).each(function(){var i=N(e(this)).data(r);i&&i.destroy();var s=new A(e(this),t,n)}),this},e.extend(e[n],{defaults:S,addStyle:m,removeStyle:v,pluginOptions:w,getStyle:d,insertCSS:g}),m("bootstrap",{html:"<div>\n<span data-notify-text></span>\n</div>",classes:{base:{"font-weight":"bold",padding:"8px 15px 8px 14px","text-shadow":"0 1px 0 rgba(255, 255, 255, 0.5)","background-color":"#fcf8e3",border:"1px solid #fbeed5","border-radius":"4px","white-space":"nowrap","padding-left":"25px","background-repeat":"no-repeat","background-position":"3px 7px"},error:{color:"#B94A48","background-color":"#F2DEDE","border-color":"#EED3D7","background-image":"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtRJREFUeNqkVc1u00AQHq+dOD+0poIQfkIjalW0SEGqRMuRnHos3DjwAH0ArlyQeANOOSMeAA5VjyBxKBQhgSpVUKKQNGloFdw4cWw2jtfMOna6JOUArDTazXi/b3dm55socPqQhFka++aHBsI8GsopRJERNFlY88FCEk9Yiwf8RhgRyaHFQpPHCDmZG5oX2ui2yilkcTT1AcDsbYC1NMAyOi7zTX2Agx7A9luAl88BauiiQ/cJaZQfIpAlngDcvZZMrl8vFPK5+XktrWlx3/ehZ5r9+t6e+WVnp1pxnNIjgBe4/6dAysQc8dsmHwPcW9C0h3fW1hans1ltwJhy0GxK7XZbUlMp5Ww2eyan6+ft/f2FAqXGK4CvQk5HueFz7D6GOZtIrK+srupdx1GRBBqNBtzc2AiMr7nPplRdKhb1q6q6zjFhrklEFOUutoQ50xcX86ZlqaZpQrfbBdu2R6/G19zX6XSgh6RX5ubyHCM8nqSID6ICrGiZjGYYxojEsiw4PDwMSL5VKsC8Yf4VRYFzMzMaxwjlJSlCyAQ9l0CW44PBADzXhe7xMdi9HtTrdYjFYkDQL0cn4Xdq2/EAE+InCnvADTf2eah4Sx9vExQjkqXT6aAERICMewd/UAp/IeYANM2joxt+q5VI+ieq2i0Wg3l6DNzHwTERPgo1ko7XBXj3vdlsT2F+UuhIhYkp7u7CarkcrFOCtR3H5JiwbAIeImjT/YQKKBtGjRFCU5IUgFRe7fF4cCNVIPMYo3VKqxwjyNAXNepuopyqnld602qVsfRpEkkz+GFL1wPj6ySXBpJtWVa5xlhpcyhBNwpZHmtX8AGgfIExo0ZpzkWVTBGiXCSEaHh62/PoR0p/vHaczxXGnj4bSo+G78lELU80h1uogBwWLf5YlsPmgDEd4M236xjm+8nm4IuE/9u+/PH2JXZfbwz4zw1WbO+SQPpXfwG/BBgAhCNZiSb/pOQAAAAASUVORK5CYII=)"},success:{color:"#468847","background-color":"#DFF0D8","border-color":"#D6E9C6","background-image":"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAutJREFUeNq0lctPE0Ecx38zu/RFS1EryqtgJFA08YCiMZIAQQ4eRG8eDGdPJiYeTIwHTfwPiAcvXIwXLwoXPaDxkWgQ6islKlJLSQWLUraPLTv7Gme32zoF9KSTfLO7v53vZ3d/M7/fIth+IO6INt2jjoA7bjHCJoAlzCRw59YwHYjBnfMPqAKWQYKjGkfCJqAF0xwZjipQtA3MxeSG87VhOOYegVrUCy7UZM9S6TLIdAamySTclZdYhFhRHloGYg7mgZv1Zzztvgud7V1tbQ2twYA34LJmF4p5dXF1KTufnE+SxeJtuCZNsLDCQU0+RyKTF27Unw101l8e6hns3u0PBalORVVVkcaEKBJDgV3+cGM4tKKmI+ohlIGnygKX00rSBfszz/n2uXv81wd6+rt1orsZCHRdr1Imk2F2Kob3hutSxW8thsd8AXNaln9D7CTfA6O+0UgkMuwVvEFFUbbAcrkcTA8+AtOk8E6KiQiDmMFSDqZItAzEVQviRkdDdaFgPp8HSZKAEAL5Qh7Sq2lIJBJwv2scUqkUnKoZgNhcDKhKg5aH+1IkcouCAdFGAQsuWZYhOjwFHQ96oagWgRoUov1T9kRBEODAwxM2QtEUl+Wp+Ln9VRo6BcMw4ErHRYjH4/B26AlQoQQTRdHWwcd9AH57+UAXddvDD37DmrBBV34WfqiXPl61g+vr6xA9zsGeM9gOdsNXkgpEtTwVvwOklXLKm6+/p5ezwk4B+j6droBs2CsGa/gNs6RIxazl4Tc25mpTgw/apPR1LYlNRFAzgsOxkyXYLIM1V8NMwyAkJSctD1eGVKiq5wWjSPdjmeTkiKvVW4f2YPHWl3GAVq6ymcyCTgovM3FzyRiDe2TaKcEKsLpJvNHjZgPNqEtyi6mZIm4SRFyLMUsONSSdkPeFtY1n0mczoY3BHTLhwPRy9/lzcziCw9ACI+yql0VLzcGAZbYSM5CCSZg1/9oc/nn7+i8N9p/8An4JMADxhH+xHfuiKwAAAABJRU5ErkJggg==)"},info:{color:"#3A87AD","background-color":"#D9EDF7","border-color":"#BCE8F1","background-image":"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QYFAhkSsdes/QAAA8dJREFUOMvVlGtMW2UYx//POaWHXg6lLaW0ypAtw1UCgbniNOLcVOLmAjHZolOYlxmTGXVZdAnRfXQm+7SoU4mXaOaiZsEpC9FkiQs6Z6bdCnNYruM6KNBw6YWewzl9z+sHImEWv+vz7XmT95f/+3/+7wP814v+efDOV3/SoX3lHAA+6ODeUFfMfjOWMADgdk+eEKz0pF7aQdMAcOKLLjrcVMVX3xdWN29/GhYP7SvnP0cWfS8caSkfHZsPE9Fgnt02JNutQ0QYHB2dDz9/pKX8QjjuO9xUxd/66HdxTeCHZ3rojQObGQBcuNjfplkD3b19Y/6MrimSaKgSMmpGU5WevmE/swa6Oy73tQHA0Rdr2Mmv/6A1n9w9suQ7097Z9lM4FlTgTDrzZTu4StXVfpiI48rVcUDM5cmEksrFnHxfpTtU/3BFQzCQF/2bYVoNbH7zmItbSoMj40JSzmMyX5qDvriA7QdrIIpA+3cdsMpu0nXI8cV0MtKXCPZev+gCEM1S2NHPvWfP/hL+7FSr3+0p5RBEyhEN5JCKYr8XnASMT0xBNyzQGQeI8fjsGD39RMPk7se2bd5ZtTyoFYXftF6y37gx7NeUtJJOTFlAHDZLDuILU3j3+H5oOrD3yWbIztugaAzgnBKJuBLpGfQrS8wO4FZgV+c1IxaLgWVU0tMLEETCos4xMzEIv9cJXQcyagIwigDGwJgOAtHAwAhisQUjy0ORGERiELgG4iakkzo4MYAxcM5hAMi1WWG1yYCJIcMUaBkVRLdGeSU2995TLWzcUAzONJ7J6FBVBYIggMzmFbvdBV44Corg8vjhzC+EJEl8U1kJtgYrhCzgc/vvTwXKSib1paRFVRVORDAJAsw5FuTaJEhWM2SHB3mOAlhkNxwuLzeJsGwqWzf5TFNdKgtY5qHp6ZFf67Y/sAVadCaVY5YACDDb3Oi4NIjLnWMw2QthCBIsVhsUTU9tvXsjeq9+X1d75/KEs4LNOfcdf/+HthMnvwxOD0wmHaXr7ZItn2wuH2SnBzbZAbPJwpPx+VQuzcm7dgRCB57a1uBzUDRL4bfnI0RE0eaXd9W89mpjqHZnUI5Hh2l2dkZZUhOqpi2qSmpOmZ64Tuu9qlz/SEXo6MEHa3wOip46F1n7633eekV8ds8Wxjn37Wl63VVa+ej5oeEZ/82ZBETJjpJ1Rbij2D3Z/1trXUvLsblCK0XfOx0SX2kMsn9dX+d+7Kf6h8o4AIykuffjT8L20LU+w4AZd5VvEPY+XpWqLV327HR7DzXuDnD8r+ovkBehJ8i+y8YAAAAASUVORK5CYII=)"},warn:{color:"#C09853","background-color":"#FCF8E3","border-color":"#FBEED5","background-image":"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABJlBMVEXr6eb/2oD/wi7/xjr/0mP/ykf/tQD/vBj/3o7/uQ//vyL/twebhgD/4pzX1K3z8e349vK6tHCilCWbiQymn0jGworr6dXQza3HxcKkn1vWvV/5uRfk4dXZ1bD18+/52YebiAmyr5S9mhCzrWq5t6ufjRH54aLs0oS+qD751XqPhAybhwXsujG3sm+Zk0PTwG6Shg+PhhObhwOPgQL4zV2nlyrf27uLfgCPhRHu7OmLgAafkyiWkD3l49ibiAfTs0C+lgCniwD4sgDJxqOilzDWowWFfAH08uebig6qpFHBvH/aw26FfQTQzsvy8OyEfz20r3jAvaKbhgG9q0nc2LbZxXanoUu/u5WSggCtp1anpJKdmFz/zlX/1nGJiYmuq5Dx7+sAAADoPUZSAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfdBgUBGhh4aah5AAAAlklEQVQY02NgoBIIE8EUcwn1FkIXM1Tj5dDUQhPU502Mi7XXQxGz5uVIjGOJUUUW81HnYEyMi2HVcUOICQZzMMYmxrEyMylJwgUt5BljWRLjmJm4pI1hYp5SQLGYxDgmLnZOVxuooClIDKgXKMbN5ggV1ACLJcaBxNgcoiGCBiZwdWxOETBDrTyEFey0jYJ4eHjMGWgEAIpRFRCUt08qAAAAAElFTkSuQmCC)"}}}),e(function(){g(h.css).attr("id","core-notify"),e(document).on("click","."+r+"-hidable",function(t){e(this).trigger("notify-hide")}),e(document).on("notify-hide","."+r+"-wrapper",function(t){var n=e(this).data(r);n&&n.show(!1)})})})
//#endregion
//
//#region global variables
const itemarray = { "Hammer": 1, "Baseball Bat": 2, "Crowbar": 3, "Knuckle Dusters": 4, "Pen Knife": 5, "Kitchen Knife": 6, "Dagger": 7, "Axe": 8, "Scimitar": 9, "Chainsaw": 10, "Samurai Sword": 11, "Glock 17": 12, "Raven MP25": 13, "Ruger 22/45": 14, "Beretta M9": 15, "USP": 16, "Beretta 92FS": 17, "Fiveseven": 18, "Magnum": 19, "Desert Eagle": 20, "Dual 92G Berettas": 21, "Sawed-Off Shotgun": 22, "Benelli M1 Tactical": 23, "MP5 Navy": 24, "P90": 25, "AK-47": 26, "M4A1 Colt Carbine": 27, "Benelli M4 Super": 28, "M16 A2 Rifle": 29, "Steyr AUG": 30, "M249 SAW": 31, "Leather Vest": 32, "Police Vest": 33, "Bulletproof Vest": 34, "Box of Chocolate Bars": 35, "Big Box of Chocolate Bars": 36, "Bag of Bon Bons": 37, "Box of Bon Bons": 38, "Box of Extra Strong Mints": 39, "Pack of Music CDs": 40, "DVD Player": 41, "MP3 Player": 42, "CD Player": 43, "Pack of Blank CDs : 100": 44, "Hard Drive": 45, "Tank Top": 46, "Trainers": 47, "Jacket": 48, "Full Body Armor": 49, "Outer Tactical Vest": 50, "Plain Silver Ring": 51, "Sapphire Ring": 52, "Gold Ring": 53, "Diamond Ring": 54, "Pearl Necklace": 55, "Silver Necklace": 56, "Gold Necklace": 57, "Plastic Watch": 58, "Stainless Steel Watch": 59, "Gold Watch": 60, "Personal Computer": 61, "Microwave": 62, "Minigun": 63, "Pack of Cuban Cigars": 64, "Television": 65, "Morphine": 66, "First Aid Kit": 67, "Small First Aid Kit": 68, "Simple Virus": 69, "Polymorphic Virus": 70, "Tunneling Virus": 71, "Armored Virus": 72, "Stealth Virus": 73, "Santa Hat '04": 74, "Christmas Cracker '04": 75, "Snow Cannon": 76, "Toyota MR2": 77, "Honda NSX": 78, "Audi TT Quattro": 79, "BMW M5": 80, "BMW Z8": 81, "Chevrolet Corvette Z06": 82, "Dodge Charger": 83, "Pontiac Firebird": 84, "Ford GT40": 85, "Hummer H3": 86, "Audi S4": 87, "Honda Integra R": 88, "Honda Accord": 89, "Honda Civic": 90, "Volkswagen Beetle": 91, "Chevrolet Cavalier": 92, "Ford Mustang": 93, "Reliant Robin": 94, "Holden SS": 95, "Coat Hanger": 96, "Bunch of Flowers": 97, "Neutrilux 2000": 98, "Springfield 1911": 99, "Egg Propelled Launcher": 100, "Bunny Suit": 101, "Chocolate Egg '05": 102, "Firewalk Virus": 103, "Game Console": 104, "Xbox": 105, "Parachute": 106, "Trench Coat": 107, "9mm Uzi": 108, "RPG Launcher": 109, "Leather Bullwhip": 110, "Ninja Claws": 111, "Test Trophy": 112, "Pet Rock": 113, "Non-Anon Doll": 114, "Poker Doll": 115, "Yoda Figurine": 116, "Trojan Horse": 117, "Evil Doll": 118, "Rubber Ducky of Doom": 119, "Teppic Bear": 120, "RockerHead Doll": 121, "Mouser Doll": 122, "Elite Action Man": 123, "Toy Reactor": 124, "Royal Doll": 125, "Blue Dragon": 126, "China Tea Set": 127, "Mufasa Toy": 128, "Dozen Roses": 129, "Skanky Doll": 130, "Lego Hurin": 131, "Mystical Sphere": 132, "10 Ton Pacifier": 133, "Horse": 134, "Uriel's Speakers": 135, "Strife Clown": 136, "Locked Teddy": 137, "Riddle's Bat": 138, "Soup Nazi Doll": 139, "Pouncer Doll": 140, "Spammer Doll": 141, "Cookie Jar": 142, "Vanity Mirror": 143, "Banana Phone": 144, "Xbox 360": 145, "Yasukuni Sword": 146, "Rusty Sword": 147, "Dance Toy": 148, "Lucky Dime": 149, "Crystal Carousel": 150, "Pixie Sticks": 151, "Ice Sculpture": 152, "Case of Whiskey": 153, "Laptop": 154, "Purple Frog Doll": 155, "Skeleton Key": 156, "Patriot Whip": 157, "Statue Of Aeolus": 158, "Bolt Cutters": 159, "Photographs": 160, "Black Unicorn": 161, "WarPaint Kit": 162, "Official Ninja Kit": 163, "Leukaemia Teddy Bear": 164, "Chocobo Flute": 165, "Annoying Man": 166, "Article on Crime": 167, "Barbie Doll": 169, "Wand of Destruction": 170, "Jack-O-Lantern '05": 171, "Gas Can": 172, "Butterfly Knife": 173, "XM8 Rifle": 174, "Taser": 175, "Chain Mail": 176, "Cobra Derringer": 177, "Flak Jacket": 178, "Birthday Cake '05": 179, "Bottle of Beer": 180, "Bottle of Champagne": 181, "Soap on a Rope": 182, "Single Red Rose": 183, "Bunch of Black Roses": 184, "Bunch of Balloons '05": 185, "Sheep Plushie": 186, "Teddy Bear Plushie": 187, "Cracked Crystal Ball": 188, "S&W Revolver": 189, "C4 Explosive": 190, "Memory Locket": 191, "Rainbow Stud Earring": 192, "Hamster Toy": 193, "Snowflake '05": 194, "Christmas Tree '05": 195, "Cannabis": 196, "Ecstasy": 197, "Ketamine": 198, "LSD": 199, "Opium": 200, "PCP": 201, "Mr Torn Crown '07": 202, "Shrooms": 203, "Speed": 204, "Vicodin": 205, "Xanax": 206, "Ms Torn Crown '07": 207, "Box of Sweet Hearts": 209, "Bag of Chocolate Kisses": 210, "Crazy Cow": 211, "Legend's Urn": 212, "Dreamcatcher": 213, "Brutus Keychain": 214, "Kitten Plushie": 215, "Single White Rose": 216, "Claymore Sword": 217, "Crossbow": 218, "Enfield SA-80": 219, "Grenade": 220, "Stick Grenade": 221, "Flash Grenade": 222, "Jackhammer": 223, "Swiss Army Knife": 224, "Mag 7": 225, "Smoke Grenade": 226, "Spear": 227, "Vektor CR-21": 228, "Claymore Mine": 229, "Flare Gun": 230, "Heckler & Koch SL8": 231, "SIG 550": 232, "BT MP9": 233, "Chain Whip": 234, "Wooden Nunchakus": 235, "Kama": 236, "Kodachi": 237, "Sai": 238, "Ninja Star": 239, "Type 98 Anti Tank": 240, "Bushmaster Carbon 15": 241, "HEG": 242, "Taurus": 243, "Blowgun": 244, "Bo Staff": 245, "Fireworks": 246, "Katana": 247, "Qsz-92": 248, "SKS Carbine": 249, "Twin Tiger Hooks": 250, "Wushu Double Axes": 251, "Ithaca 37": 252, "Lorcin 380": 253, "S&W M29": 254, "Flamethrower": 255, "Tear Gas": 256, "Throwing Knife": 257, "Jaguar Plushie": 258, "Mayan Statue": 259, "Dahlia": 260, "Wolverine Plushie": 261, "Hockey Stick": 262, "Crocus": 263, "Orchid": 264, "Pele Charm": 265, "Nessie Plushie": 266, "Heather": 267, "Red Fox Plushie": 268, "Monkey Plushie": 269, "Soccer Ball": 270, "Ceibo Flower": 271, "Edelweiss": 272, "Chamois Plushie": 273, "Panda Plushie": 274, "Jade Buddha": 275, "Peony": 276, "Cherry Blossom": 277, "Kabuki Mask": 278, "Maneki Neko": 279, "Elephant Statue": 280, "Lion Plushie": 281, "African Violet": 282, "Donator Pack": 283, "Bronze Paint Brush": 284, "Silver Paint Brush": 285, "Gold Paint Brush": 286, "Pand0ra's Box": 287, "Mr Brownstone Doll": 288, "Dual Axes": 289, "Dual Hammers": 290, "Dual Scimitars": 291, "Dual Samurai Swords": 292, "Japanese/English Dictionary": 293, "Bottle of Sake": 294, "Oriental Log": 295, "Oriental Log Translation": 296, "YouYou Yo Yo": 297, "Monkey Cuffs": 298, "Jester's Cap": 299, "Gibal's Dragonfly": 300, "Green Ornament": 301, "Purple Ornament": 302, "Blue Ornament": 303, "Purple Bell": 304, "Mistletoe": 305, "Mini Sleigh": 306, "Snowman": 307, "Christmas Gnome": 308, "Gingerbread House": 309, "Lollipop": 310, "Mardi Gras Beads": 311, "Devil Toy": 312, "Cookie Launcher": 313, "Cursed Moon Pendant": 314, "Apartment Blueprint": 315, "Semi-Detached House Blueprint": 316, "Detached House Blueprint": 317, "Beach House Blueprint": 318, "Chalet Blueprint": 319, "Villa Blueprint": 320, "Penthouse Blueprint": 321, "Mansion Blueprint": 322, "Ranch Blueprint": 323, "Palace Blueprint": 324, "Castle Blueprint": 325, "Printing Paper": 326, "Blank Tokens": 327, "Blank Credit Cards": 328, "Skateboard": 329, "Boxing Gloves": 330, "Dumbbells": 331, "Combat Vest": 332, "Liquid Body Armor": 333, "Flexible Body Armor": 334, "Stick of Dynamite": 335, "Cesium-137": 336, "Dirty Bomb": 337, "Sh0rty's Surfboard": 338, "Puzzle Piece": 339, "Hunny Pot": 340, "Seductive Stethoscope": 341, "Dollar Bill Collectible": 342, "Backstage Pass": 343, "Chemi's Magic Potion": 344, "Pack of Trojans": 345, "Pair of High Heels": 346, "Thong": 347, "Hazmat Suit": 348, "Flea Collar": 349, "Dunkin's Donut": 350, "Amazon Doll": 351, "BBQ Smoker": 352, "Bag of Cheetos": 353, "Motorbike": 354, "Citrus Squeezer": 355, "Superman Shades": 356, "Kevlar Helmet": 357, "Raw Ivory": 358, "Fine Chisel": 359, "Ivory Walking Cane": 360, "Neumune Tablet": 361, "Mr Torn Crown '08": 362, "Ms Torn Crown '08": 363, "Box of Grenades": 364, "Box of Medical Supplies": 365, "Erotic DVD": 366, "Feathery Hotel Coupon": 367, "Lawyer Business Card": 368, "Lottery Voucher": 369, "Drug Pack": 370, "Dark Doll": 371, "Empty Box": 372, "Parcel": 373, "Birthday Present": 374, "Present": 375, "Christmas Present": 376, "Birthday Wrapping Paper": 377, "Generic Wrapping Paper": 378, "Christmas Wrapping Paper": 379, "Small Explosive Device": 380, "Gold Laptop": 381, "Gold Plated AK-47": 382, "Platinum PDA": 383, "Camel Plushie": 384, "Tribulus Omanense": 385, "Sports Sneakers": 386, "Handbag": 387, "Pink Mac-10": 388, "Mr Torn Crown '09": 389, "Ms Torn Crown '09": 390, "Macana": 391, "Pepper Spray": 392, "Slingshot": 393, "Brick": 394, "Metal Nunchakus": 395, "Business Class Ticket": 396, "Flail": 397, "SIG 552": 398, "ArmaLite M-15A4": 399, "Guandao": 400, "Lead Pipe": 401, "Ice Pick": 402, "Box of Tissues": 403, "Bandana": 404, "Loaf of Bread": 405, "Afro Comb": 406, "Compass": 407, "Sextant": 408, "Yucca Plant": 409, "Fire Hydrant": 410, "Model Space Ship": 411, "Sports Shades": 412, "Mountie Hat": 413, "Proda Sunglasses": 414, "Ship in a Bottle": 415, "Paper Weight": 416, "RS232 Cable": 417, "Tailors Dummy": 418, "Small Suitcase": 419, "Medium Suitcase": 420, "Large Suitcase": 421, "Vanity Hand Mirror": 422, "Poker Chip": 423, "Rabbit Foot": 424, "Voodoo Doll": 425, "Bottle of Tequila": 426, "Sumo Doll": 427, "Casino Pass": 428, "Chopsticks": 429, "Coconut Bra": 430, "Dart Board": 431, "Crazy Straw": 432, "Sensu": 433, "Yakitori Lantern": 434, "Dozen White Roses": 435, "Snowboard": 436, "Glow Stick": 437, "Cricket Bat": 438, "Frying Pan": 439, "Pillow": 440, "Khinkeh P0rnStar Doll": 441, "Blow-Up Doll": 442, "Strawberry Milkshake": 443, "Breadfan Doll": 444, "Chaos Man": 445, "Karate Man": 446, "Burmese Flag": 447, "Bl0ndie's Dictionary": 448, "Hydroponic Grow Tent": 449, "Leopard Coin": 450, "Florin Coin": 451, "Gold Noble Coin": 452, "Ganesha Sculpture": 453, "Vairocana Buddha Sculpture": 454, "Quran Script : Ibn Masud": 455, "Quran Script : Ubay Ibn Kab": 456, "Quran Script : Ali": 457, "Shabti Sculpture": 458, "Egyptian Amulet": 459, "White Senet Pawn": 460, "Black Senet Pawn": 461, "Senet Board": 462, "Epinephrine": 463, "Melatonin": 464, "Serotonin": 465, "Snow Globe '09": 466, "Dancing Santa Claus '09": 467, "Christmas Stocking '09": 468, "Santa's Elf '09": 469, "Christmas Card '09": 470, "Admin Portrait '09": 471, "Blue Easter Egg": 472, "Green Easter Egg": 473, "Red Easter Egg": 474, "Yellow Easter Egg": 475, "White Easter Egg": 476, "Black Easter Egg": 477, "Gold Easter Egg": 478, "Metal Dog Tag": 479, "Bronze Dog Tag": 480, "Silver Dog Tag": 481, "Gold Dog Tag": 482, "MP5k": 483, "AK74U": 484, "Skorpion": 485, "TMP": 486, "Thompson": 487, "MP 40": 488, "Luger": 489, "Blunderbuss": 490, "Zombie Brain": 491, "Human Head": 492, "Medal of Honor": 493, "Citroen Saxo": 494, "Classic Mini": 495, "Fiat Punto": 496, "Nissan Micra": 497, "Peugeot 106": 498, "Renault Clio": 499, "Vauxhall Corsa": 500, "Volvo 850": 501, "Alfa Romeo 156": 502, "BMW X5": 503, "Seat Leon Cupra": 504, "Vauxhall Astra GSI": 505, "Volkswagen Golf GTI": 506, "Audi S3": 507, "Ford Focus RS": 508, "Honda S2000": 509, "Mini Cooper S": 510, "Sierra Cosworth": 511, "Lotus Exige": 512, "Mitsubishi Evo X": 513, "Porsche 911 GT3": 514, "Subaru Impreza STI": 515, "TVR Sagaris": 516, "Aston Martin One-77": 517, "Audi R8": 518, "Bugatti Veyron": 519, "Ferrari 458": 520, "Lamborghini Gallardo": 521, "Lexus LFA": 522, "Mercedes SLR": 523, "Nissan GT-R": 524, "Mr Torn Crown '10": 525, "Ms Torn Crown '10": 526, "Bag of Candy Kisses": 527, "Bag of Tootsie Rolls": 528, "Bag of Chocolate Truffles": 529, "Can of Munster": 530, "Bottle of Pumpkin Brew": 531, "Can of Red Cow": 532, "Can of Taurine Elite": 533, "Witch's Cauldron": 534, "Electronic Pumpkin": 535, "Jack O Lantern Lamp": 536, "Spooky Paper Weight": 537, "Medieval Helmet": 538, "Blood Spattered Sickle": 539, "Cauldron": 540, "Bottle of Stinky Swamp Punch": 541, "Bottle of Wicked Witch": 542, "Deputy Star": 543, "Wind Proof Lighter": 544, "Dual TMPs": 545, "Dual Bushmasters": 546, "Dual MP5s": 547, "Dual P90s": 548, "Dual Uzis": 549, "Bottle of Kandy Kane": 550, "Bottle of Minty Mayhem": 551, "Bottle of Mistletoe Madness": 552, "Can of Santa Shooters": 553, "Can of Rockstar Rudolph": 554, "Can of X-MASS": 555, "Bag of Reindeer Droppings": 556, "Advent Calendar": 557, "Santa's Snot": 558, "Polar Bear Toy": 559, "Fruitcake": 560, "Book of Carols": 561, "Sweater": 562, "Gift Card": 563, "Glasses": 564, "High-Speed Drive": 565, "Mountain Bike": 566, "Cut-Throat Razor": 567, "Slim Crowbar": 568, "Balaclava": 569, "Advanced Driving Manual": 570, "Ergonomic Keyboard": 571, "Tracking Device": 572, "Screwdriver": 573, "Fanny Pack": 574, "Tumble Dryer": 575, "Chloroform": 576, "Heavy Duty Padlock": 577, "Duct Tape": 578, "Wireless Dongle": 579, "Horse's Head": 580, "Book": 581, "Tin Foil Hat": 582, "Brown Easter Egg": 583, "Orange Easter Egg": 584, "Pink Easter Egg": 585, "Jawbreaker": 586, "Bag of Sherbet": 587, "Goodie Bag": 588, "Mr Torn Crown '11": 593, "Ms Torn Crown '11": 594, "Pile of Vomit": 595, "Rusty Dog Tag": 596, "Gold Nugget": 597, "Witch's Hat": 598, "Golden Broomstick": 599, "Devil's Pitchfork": 600, "Christmas Lights": 601, "Gingerbread Man": 602, "Golden Wreath": 603, "Pair of Ice Skates": 604, "Diamond Icicle": 605, "Santa Boots": 606, "Santa Gloves": 607, "Santa Hat": 608, "Santa Jacket": 609, "Santa Trousers": 610, "Snowball": 611, "Tavor TAR-21": 612, "Harpoon": 613, "Diamond Bladed Knife": 614, "Naval Cutlass": 615, "Trout": 616, "Banana Orchid": 617, "Stingray Plushie": 618, "Steel Drum": 619, "Nodding Turtle": 620, "Snorkel": 621, "Flippers": 622, "Speedo": 623, "Bikini": 624, "Wetsuit": 625, "Diving Gloves": 626, "Dog Poop": 627, "Stink Bombs": 628, "Toilet Paper": 629, "Mr Torn Crown '12": 630, "Ms Torn Crown '12": 631, "Petrified Humerus": 632, "Latex Gloves": 633, "Bag of Bloody Eyeballs": 634, "Straitjacket": 635, "Cinnamon Ornament": 636, "Christmas Express": 637, "Bottle of Christmas Cocktail": 638, "Golden Candy Cane": 639, "Kevlar Gloves": 640, "WWII Helmet": 641, "Motorcycle Helmet": 642, "Construction Helmet": 643, "Welding Helmet": 644, "Safety Boots": 645, "Hiking Boots": 646, "Leather Helmet": 647, "Leather Pants": 648, "Leather Boots": 649, "Leather Gloves": 650, "Combat Helmet": 651, "Combat Pants": 652, "Combat Boots": 653, "Combat Gloves": 654, "Riot Helmet": 655, "Riot Body": 656, "Riot Pants": 657, "Riot Boots": 658, "Riot Gloves": 659, "Dune Helmet": 660, "Dune Vest": 661, "Dune Pants": 662, "Dune Boots": 663, "Dune Gloves": 664, "Assault Helmet": 665, "Assault Body": 666, "Assault Pants": 667, "Assault Boots": 668, "Assault Gloves": 669, "Delta Gas Mask": 670, "Delta Body": 671, "Delta Pants": 672, "Delta Boots": 673, "Delta Gloves": 674, "Marauder Face Mask": 675, "Marauder Body": 676, "Marauder Pants": 677, "Marauder Boots": 678, "Marauder Gloves": 679, "EOD Helmet": 680, "EOD Apron": 681, "EOD Pants": 682, "EOD Boots": 683, "EOD Gloves": 684, "Torn Bible": 685, "Friendly Bot Guide": 686, "Egotistical Bear": 687, "Brewery Key": 688, "Signed Jersey": 689, "Mafia Kit": 690, "Octopus Toy": 691, "Bear Skin Rug": 692, "Tractor Toy": 693, "Mr Torn Crown '13": 694, "Ms Torn Crown '13": 695, "Piece of Cake": 696, "Rotten Eggs": 697, "Peg Leg": 698, "Antidote": 699, "Christmas Angel": 700, "Eggnog": 701, "Sprig of Holly": 702, "Festive Socks": 703, "Respo Hoodie": 704, "Staff Haxx Button": 705, "Birthday Cake '14": 706, "Lump of Coal": 707, "Gold Ribbon": 708, "Silver Ribbon": 709, "Bronze Ribbon": 710, "Coin : Factions": 711, "Coin : Casino": 712, "Coin : Education": 713, "Coin : Hospital": 714, "Coin : Jail": 715, "Coin : Travel Agency": 716, "Coin : Companies": 717, "Coin : Stock Exchange": 718, "Coin : Church": 719, "Coin : Auction House": 720, "Coin : Race Track": 721, "Coin : Museum": 722, "Coin : Drugs": 723, "Coin : Dump": 724, "Coin : Estate Agents": 725, "Scrooge's Top Hat": 726, "Scrooge's Topcoat": 727, "Scrooge's Trousers": 728, "Scrooge's Boots": 729, "Scrooge's Gloves": 730, "Empty Blood Bag": 731, "Blood Bag : A+": 732, "Blood Bag : A-": 733, "Blood Bag : B+": 734, "Blood Bag : B-": 735, "Blood Bag : AB+": 736, "Blood Bag : AB-": 737, "Blood Bag : O+": 738, "Blood Bag : O-": 739, "Mr Torn Crown": 740, "Ms Torn Crown": 741, "Molotov Cocktail": 742, "Christmas Sweater '15": 743, "Book : Brawn Over Brains": 744, "Book : Time Is In The Mind": 745, "Book : Keeping Your Face Handsome": 746, "Book : A Job For Your Hands": 747, "Book : Working 9 Til 5": 748, "Book : Making Friends,Enemies,And Cakes": 749, "Book : High School For Adults": 750, "Book : Milk Yourself Sober": 751, "Book : Fight Like An Asshole": 752, "Book : Mind Over Matter": 753, "Book : No Shame No Pain": 754, "Book : Run Like The Wind": 755, "Book : Weaseling Out Of Trouble": 756, "Book : Get Hard Or Go Home": 757, "Book : Gym Grunting - Shouting To Success": 758, "Book : Self Defense In The Workplace": 759, "Book : Speed 3 - The Rejected Script": 760, "Book : Limbo Lovers 101": 761, "Book : The Hamburglar's Guide To Crime": 762, "Book : What Are Old Folk Good For Anyway?": 763, "Book : Medical Degree Schmedical Degree": 764, "Book : No More Soap On A Rope": 765, "Book : Mailing Yourself Abroad": 766, "Book : Smuggling For Beginners": 767, "Book : Stealthy Stealing of Underwear": 768, "Book : Shawshank Sure Ain't For Me!": 769, "Book : Ignorance Is Bliss": 770, "Book : Winking To Win": 771, "Book : Finders Keepers": 772, "Book : Hot Turkey": 773, "Book : Higher Daddy,Higher!": 774, "Book : The Real Dutch Courage": 775, "Book : Because I'm Happy - The Pharrell Story": 776, "Book : No More Sick Days": 777, "Book : Duke - My Story": 778, "Book : Self Control Is For Losers": 779, "Book : Going Back For More": 780, "Book : Get Drunk And Lose Dignity": 781, "Book : Fuelling Your Way To Failure": 782, "Book : Yes Please Diabetes": 783, "Book : Ugly Energy": 784, "Book : Memories And Mammaries": 785, "Book : Brown-nosing The Boss": 786, "Book : Running Away From Trouble": 787, "Certificate of Awesome": 788, "Certificate of Lame": 789, "Plastic Sword": 790, "Mediocre T-Shirt": 791, "Penelope": 792, "Cake Frosting": 793, "Lock Picking Kit": 794, "Special Fruitcake": 795, "Felovax": 796, "Zylkene": 797, "Duke's Safe": 798, "Duke's Selfies": 799, "Duke's Poetry": 800, "Duke's Dog's Ashes": 801, "Duke's Will": 802, "Duke's Gimp Mask": 803, "Duke's Herpes Medication": 804, "Duke's Hammer": 805, "Old Lady Mask": 806, "Exotic Gentleman Mask": 807, "Ginger Kid Mask": 808, "Young Lady Mask": 809, "Moustache Man Mask": 810, "Scarred Man Mask": 811, "Psycho Clown Mask": 812, "Nun Mask": 813, "Tyrosine": 814, "Keg of Beer": 815, "Glass of Beer": 816, "Six Pack of Alcohol": 817, "Six Pack of Energy Drink": 818, "Rosary Beads": 819, "Piggy Bank": 820, "Empty Vial": 821, "Vial of Blood": 822, "Vial of Urine": 823, "Vial of Saliva": 824, "Questionnaire": 825, "Agreement": 826, "Perceptron : Calibrator": 827, "Donald Trump Mask '16": 828, "Yellow Snowman '16": 829, "Nock Gun": 830, "Beretta Pico": 831, "Riding Crop": 832, "Sand": 833, "Sweatpants": 834, "String Vest": 835, "Black Oxfords": 836, "Rheinmetall MG 3": 837, "Homemade Pocket Shotgun": 838, "Madball": 839, "Nail Bomb": 840, "Classic Fedora": 841, "Pinstripe Suit Trousers": 842, "Duster": 843, "Tranquilizer Gun": 844, "Bolt Gun": 845, "Scalpel": 846, "Nerve Gas": 847, "Kevlar Lab Coat": 848, "Loupes": 849, "Sledgehammer": 850, "Wifebeater": 851, "Metal Detector": 852, "Graveyard Key": 853, "Questionnaire : Completed": 854, "Agreement : Signed": 855, "Spray Can : Black": 856, "Spray Can : Red": 857, "Spray Can : Pink": 858, "Spray Can : Purple": 859, "Spray Can : Blue": 860, "Spray Can : Green": 861, "Spray Can : Yellow": 862, "Spray Can : Orange": 863, "Salt Shaker": 864, "Poison Mistletoe": 865, "Santa's List '17": 866, "Soapbox": 867, "Turkey Baster": 868, "Elon Musk Mask '17": 869, "Love Juice": 870, "Bug Swatter": 871, "Nothing": 872, "Bottle of Green Stout": 873, "Prototype": 874, "Rotten Apple": 875, "Festering Chicken": 876, "Mouldy Pizza": 877, "Smelly Cheese": 878, "Sour Milk": 879, "Stale Bread": 880, "Spoiled Fish": 881, "Insurance Policy": 882, "Bank Statement": 883, "Car Battery": 884, "Scrap Metal": 885, "Torn City Times": 886, "Magazine": 887, "Umbrella": 888, "Travel Mug": 889, "Headphones": 890, "Undefined": 891, "Mix CD": 892, "Lost and Found Office Key": 893, "Cosmetics Case": 894, "Phone Card": 895, "Subway Pass": 896, "Bottle Cap": 897, "Silver Coin": 898, "Silver Bead": 899, "Lucky Quarter": 900, "Daffodil": 901, "Bunch of Carnations": 902, "White Lily": 903, "Funeral Wreath": 904, "Car Keys": 905, "Handkerchief": 906, "Candle": 907, "Paper Bag": 908, "Tin Can": 909, "Betting Slip": 910, "Fidget Spinner": 911, "Majestic Moose": 912, "Lego Wonder Woman": 913, "CR7 Doll": 914, "Stretch Armstrong Doll": 915, "Beef Femur": 916, "Snake's Fang": 917, "Icey Igloo": 918, "Federal Jail Key": 919, "Halloween Basket : Spooky": 920, "Michael Myers Mask '18": 921, "Toast Jesus '18": 922, "Cheesus '18": 923, "Bottle of Christmas Spirit": 924, "Scammer in the Slammer '18": 925, "Gronch Mask '18": 926, "Baseball Cap": 927, "Bermudas": 928, "Blouse": 929, "Boob Tube": 930, "Bush Hat": 931, "Camisole": 932, "Capri Pants": 933, "Cardigan": 934, "Cork Hat": 935, "Crop Top": 936, "Fisherman Hat": 937, "Gym Shorts": 938, "Halterneck": 939, "Raincoat": 940, "Pantyhose": 941, "Pencil Skirt": 942, "Peplum Top": 943, "Polo Shirt": 944, "Poncho": 945, "Puffer Vest": 946, "Mackintosh": 947, "Shorts": 948, "Skirt": 949, "Travel Socks": 950, "Turtleneck": 951, "Yoga Pants": 952, "Bronze Racing Trophy": 953, "Silver Racing Trophy": 954, "Gold Racing Trophy": 955, "Pack of Blank CDs : 250": 956, "Pack of Blank CDs : 50": 957, "Chest Harness": 958, "Choker": 959, "Fishnet Stockings": 960, "Knee-high Boots": 961, "Lingerie": 962, "Mankini": 963, "Mini Skirt": 964, "Nipple Tassels": 965, "Bowler Hat": 966, "Fitted Shirt": 967, "Bow Tie": 968, "Neck Tie": 969, "Waistcoat": 970, "Blazer": 971, "Suit Trousers": 972, "Derby Shoes": 973, "Smoking Jacket": 974, "Monocle": 975, "Bronze Microphone": 976, "Silver Microphone": 977, "Gold Microphone": 978, "Paint Mask": 979, "Ladder": 980, "Wire Cutters": 981, "Ripped Jeans": 982, "Bandit Mask": 983, "Bottle of Moonshine": 984, "Can of Goose Juice": 985, "Can of Damp Valley": 986, "Can of Crocozade": 987, "Fur Coat": 988, "Fur Scarf": 989, "Fur Hat": 990, "Platform Shoes": 991, "Silver Flats": 992, "Crystal Bracelet": 993, "Cocktail Ring": 994, "Sun Hat": 995, "Square Sunglasses": 996, "Statement Necklace": 997, "Floral Dress": 998, "Shrug": 1001, "Eye Patch": 1002, "Halloween Basket : Creepy": 1003, "Halloween Basket : Freaky": 1004, "Halloween Basket : Frightful": 1005, "Halloween Basket : Haunting": 1006, "Halloween Basket : Shocking": 1007, "Halloween Basket : Terrifying": 1008, "Halloween Basket : Horrifying": 1009, "Halloween Basket : Petrifying": 1010, "Halloween Basket : Nightmarish": 1011, "Blood Bag : Irradiated": 1012, "Jigsaw Mask '19": 1013, "Reading Glasses": 1014, "Chinos": 1015, "Collared Shawl": 1016, "Pleated Skirt": 1017, "Flip Flops": 1018, "Bingo Visor": 1019, "Cover-ups": 1020, "Sandals": 1021, "Golf Socks": 1022, "Flat Cap": 1023, "Slippers": 1024, "Bathrobe": 1025, "Party Hat '19": 1026, "Badge : 15th Anniversary": 1027, "Birthday Cupcake": 1028, "Strippogram Voucher": 1029, "Dong : Thomas": 1030, "Dong : Greg": 1031, "Dong : Effy": 1032, "Dong : Holly": 1033, "Dong : Jeremy": 1034, "Anniversary Present": 1035, "Greta Mask '19": 1036, "Anatoly Mask '19": 1037, "Santa Beard": 1038, "Bag of Humbugs": 1039, "Christmas Cracker": 1040, "Special Snowflake": 1041, "Concussion Grenade": 1042, "Paper Crown : Green": 1043, "Paper Crown : Yellow": 1044, "Paper Crown : Red": 1045, "Paper Crown : Blue": 1046, "Denim Shirt": 1047, "Denim Vest": 1048, "Denim Jacket": 1049, "Denim Jeans": 1050, "Denim Shoes": 1051, "Denim Cap": 1052, "Bread Knife": 1053, "Semtex": 1054, "Poison Umbrella": 1055, "Millwall Brick": 1056, "Gentleman Cache": 1057, "Gold Chain": 1058, "Snapback Hat": 1059, "Saggy Pants": 1060, "Oversized Shirt": 1061, "Basketball Shirt": 1062, "Parachute Pants": 1063, "Tube Dress": 1064, "Gold Sneakers": 1065, "Shutter Shades": 1066, "Silver Hoodie": 1067, "Bucket Hat": 1068, "Puffer Jacket": 1069, "Durag": 1070, "Onesie": 1071, "Baseball Jacket": 1072, "Braces": 1073, "Panama Hat": 1074, "Pipe": 1075, "Shoulder Sweater": 1076, "Sports Jacket": 1077, "Old Wallet": 1078, "Cardholder": 1079, "Billfold": 1080, "Coin Purse": 1081, "Zip Wallet": 1082, "Clutch": 1083, "Credit Card": 1084, "Lipstick": 1085, "License": 1086, "Tampon": 1087, "Receipt": 1088, "Family Photo": 1089, "Lint": 1090, "Handcuffs": 1091, "Lubricant": 1092, "Hit Contract": 1093, "Syringe": 1094, "Spoon": 1095, "Cell Phone": 1096, "Assless Chaps": 1097, "Opera Gloves": 1098, "Booty Shorts": 1099, "Collar": 1100, "Ball Gag": 1101, "Blindfold": 1102, "Maid Uniform": 1103, "Maid Hat": 1104, "Ball Gown": 1105, "Fascinator Hat": 1106, "Wedding Dress": 1107, "Wedding Veil": 1108, "Head Scarf": 1109, "Nightgown": 1110, "Pullover": 1111, "Elegant Cache": 1112, "Naughty Cache": 1113, "Elderly Cache": 1114, "Denim Cache": 1115, "Wannabe Cache": 1116, "Cutesy Cache": 1117, "Armor Cache": 1118, "Melee Cache": 1119, "Small Arms Cache": 1120, "Medium Arms Cache": 1121, "Heavy Arms Cache": 1122, "Spy Camera": 1123, "Cloning Device": 1124, "Card Skimmer": 1125, "Tutu": 1126, "Knee Socks": 1127, "Kitty Shoes": 1128, "Cat Ears": 1129, "Bunny Ears": 1130, "Puppy Ears": 1131, "Heart Sunglasses": 1132, "Hair Bow": 1133, "Lolita Dress": 1134, "Unicorn Horn": 1135, "Check Skirt": 1136, "Polka Dot Dress": 1137, "Ballet Shoes": 1138, "Dungarees": 1139, "Tights": 1140, "Pennywise Mask '20": 1141, "Tiger King Mask '20": 1142, "Medical Mask": 1143, "Chin Diaper": 1144, "Tighty Whities": 1145, "Tangerine": 1146, "Helmet of Justice": 1147, "Broken Bauble": 1148, "Purple Easter Egg": 1149, "Ski Mask": 1150, "Bunny Nose": 1151, "SMAW Launcher": 1152, "China Lake": 1153, "Milkor MGL": 1154, "PKM": 1155, "Negev NG-5": 1156, "Stoner 96": 1157, "Meat Hook": 1158, "Cleaver": 1159, "Arca Fortunae": 1176, "Sandworm Mask '21": 1177 };
const shadowDOM = document.head;
var userinfo;
let itemstocheck = "a";
var version = "4.7";
var radios = "";
var marketorbazaar = "";
var pricefactor = "1";
var moneyonhand;
var ca_url = window.location.href;
var ca_menu_toggled = 0;
var current_stock_price;
var your_money;
var max_buy_amount;
var hash = $(location).attr('hash');
var sidebarContent;
var newchecker;
var imagesource;
var itemid;
var c_api_key;
var profitablefound = false;
var xmlhttp;
var fetchedItemData;
var marketprice;
var apiCalls = 0;
var totalData = new Object();
var apicallsinminute = 0;
var lastCheckInSeconds = 0;
var showprofitableonly = "false";
var lastapicalltimestamp;
var checklocked = false;
var stopsearch = false;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const joker = "data:image/png;base64,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";
//#endregion

//#region localStorage

if (localStorage.getItem("itemstocheck") !== null) {
    itemstocheck = JSON.parse(localStorage.getItem("itemstocheck"));
} else {
    localStorage.setItem("itemstocheck", JSON.stringify([]));
  itemstocheck = localStorage.getItem("itemstocheck");
}

if (localStorage.getItem("ca_menu_toggled")) {
    ca_menu_toggled = JSON.parse(localStorage.getItem("ca_menu_toggled"));
} else {
  ca_menu_toggled = 0;
}

if (localStorage.getItem("tornApi") !== null) {
    c_api_key = localStorage.getItem("tornApi");
} else {
    c_api_key = undefined;
}

if (localStorage.getItem("pricefactor") !== undefined) {
    pricefactor = localStorage.getItem("pricefactor");
} else {
    pricefactor = 1;
}
$(document).on('change', '#c-pricefactor', function () {
    pricefactor = $(this).val();
    localStorage.setItem("pricefactor", pricefactor);
    console.log(localStorage.getItem("pricefactor"))
});


if (localStorage.getItem("marketorbazaar") !== null) {
    marketorbazaar = localStorage.getItem("marketorbazaar");
} else {
    marketorbazaar = "market";
    localStorage.setItem("marketorbazaar", marketorbazaar);
}



if (localStorage.getItem("fetchedItemData") !== null) {
    fetchedItemData = JSON.parse(localStorage.getItem("fetchedItemData"));
}


if (localStorage.getItem("mintotalprofit") !== null) {
    mintotalprofit = parseInt(localStorage.getItem("mintotalprofit"));
} else {
    mintotalprofit = 10;
    localStorage.setItem("mintotalprofit", mintotalprofit);
}
$(document).on('change', '#mintotalprofit', function () {
    mintotalprofit = $(this).val();
    localStorage.setItem("mintotalprofit", mintotalprofit);
});


if (localStorage.getItem("apicallsinminute") !== null) {
    apicallsinminute = parseInt(localStorage.getItem("apicallsinminute"));
} else {
    apicallsinminute = 0;
    localStorage.setItem("apicallsinminute", apicallsinminute);
}



if (localStorage.getItem("checkCooldown") !== null) {
    checkCooldown = localStorage.getItem("checkCooldown");
} else {
    checkCooldown = 60;
    localStorage.setItem("checkCooldown", checkCooldown);
}
if (localStorage.getItem("showprofitableonly") !== null) {
    showprofitableonly = localStorage.getItem("showprofitableonly");
} else {
    showprofitableonly = "false";
    localStorage.setItem("showprofitableonly", showprofitableonly);
}
$(document).on('change', '#showprofitableonly', function () {
    showprofitableonly = $(this).is(':checked').toString();
    localStorage.setItem("showprofitableonly", showprofitableonly);
});
if (localStorage.getItem("lastapicalltimestamp") !== null) {
    lastapicalltimestamp = parseInt(localStorage.getItem("lastapicalltimestamp"));
} else {
    lastapicalltimestamp = new Date().getTime();
    localStorage.setItem("lastapicalltimestamp", lastapicalltimestamp);
}
//#endregion


//#region functions

function notification(msg){
  $("#ca-notification").fadeIn("slow").append(msg);
  $(".dismiss").click(function(){
         $("#ca-notification").fadeOut("slow");
  });
}

function loadjscssfile(filename, callback) {
    var fileref = document.createElement('script')
    fileref.setAttribute("type", "text/javascript")
    fileref.setAttribute("src", filename)
    if (fileref.readyState) {
        fileref.onreadystatechange = function() { /*IE*/
            if (fileref.readyState == "loaded" || fileref.readyState == "complete") {
                fileref.onreadystatechange = null;
                callback();
            }
        }
    } else {
        fileref.onload = function() {  /*Other browsers*/
            callback();
        }
    }

    // Try to find the head, otherwise default to the documentElement
    if (typeof fileref != "undefined")
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(fileref)
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
function isToday(thedate){
    var today = new Date().setHours(0, 0, 0, 0);
    var thatDay = new Date(thedate).setHours(0, 0, 0, 0);

    if(today === thatDay){
        return true;
    }else{
        return false;
    }
}
async function getdailyNetworth() {
    apiCalls++;
    var today = new Date();
    today.setHours(0, 0, 0);
    const startofday = today.getTime();
    const response = await fetch(`https://api.torn.com/user/?selections=money&from=`+startofday+`&key=${c_api_key}`);
    const result = await response.json();
    return result;
}
async function getTodaysLogs() {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const startOfDayTimestamp = startOfDay.getTime() / 1000;
    console.log(startOfDayTimestamp);

    const endOfDay = new Date();
    endOfDay.setUTCHours(24, 0, 0, 0);
    const endOfDayTimestamp = endOfDay.getTime() / 1000;
    console.log(endOfDayTimestamp);
    var fromTime = startOfDayTimestamp;
    var toTime = startOfDayTimestamp + (60 * 60 * 60 * 8);
    var logarray = {}
    var allLogs = []

    for(var i = 0;i < 24; i += 8){
        apiCalls++;
        const logs = await fetch(`https://api.torn.com/user/?selections=log&from=${fromTime + (60 * 60 * 60 * i)}&to=${toTime+ (60 * 60 * 60 * i)}&key=${c_api_key}`);
        logarray = await logs.json();
        for(var logindex in logarray.log)
        {
            allLogs.push(logarray.log[logindex])
        }
    }
    //console.log(allLogs);
    return allLogs;
}
async function getcurrentNetworth() {
    apiCalls++;
    const response = await fetch(`https://api.torn.com/user/?selections=networth&key=${c_api_key}`);
    const result = await response.json();
    return result;
}


function addHours(numOfHours, time) {
    var result = time + (numOfHours * 60 * 60);

    return result;
}
function httpGet(theUrl) {
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            return xmlhttp.responseText;
        }
    };
    xmlhttp.open("GET", theUrl, false);
    xmlhttp.send();
}

function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function getItemIdByName(name) {
    for (var item in itemarray)
        if (item === name)
            return itemarray[item];
}

function addButton() {

}

function buyStockFast() {
    if ($('#ca-tool-content').length > 0) {
        const button = `<button class="ca-btn" id="ca-qb-stock" style="color: var(--default-blue-color); cursor: pointer; margin-right: 0;">Buy SYM stocks max.</button>`;

        $('#ca-tool-content').append(button);
        $('#ca-qb-stock').on('click', async () => {
            await getAction({
                type: 'post',
                action: 'https://api.torn.com/torn/16?selections=stocks&key=' + c_api_key,
                success: (str) => {
                    try {
                        current_stock_price = String(str.stocks[16].current_price + 2);
                        current_stock_price = current_stock_price.split(/\./)[0];
                        your_money = $("#user-money").data("money");

                        your_money = parseInt(your_money);

                        your_money = parseInt(your_money);
                        current_stock_price = parseInt(current_stock_price);
                        max_buy_amount = Math.round(your_money / current_stock_price);
                        max_buy_amount = max_buy_amount;
                    } catch (e) {
                    }

                }
            });
            await getAction({
                type: 'post',
                action: 'page.php?sid=StockMarket&step=buyShares',
                data: {
                    stockId: 16,
                    amount: max_buy_amount
                },
                success: (str) => {
                    try {
                        if (str.success) {
                            $('.ca-result').html(`Successfully bought ` + max_buy_amount + ` Symbiotic shares.`);
                        }
                        //window.location.replace("https://www.torn.com/index.php");
                    } catch (e) {
                    }

                }
            });
        });
        if (ca_url.indexOf("stocks") >= 0) {
            $("#ca-qb-stock").show();
        } else {
            $("#ca-qb-stock").hide();
        }
    }
}

function sellStockShares() {

    if ($('#ca-tool-content').length > 0) {
        const button = `<button class="ca-btn" id="ca-sellStockShares" style="color: var(--default-blue-color); cursor: pointer; margin-right: 0;">Quicksell 100 SYM Shares</button>`;
        $('#ca-tool-content').append(button);
        $('#ca-sellStockShares').on('click', async () => {
            await getAction({
                type: 'post',
                action: 'page.php',
                data: {
                    step: 'sellShares',
                    sid: 'StockMarket',
                    stockId: 16,
                    amount: 100
                },
                success: (str) => {
                    try {
                        if (str.success) {
                            $('.ca-result').html(`Successfully sold 100 SYM shares.`);
                        }
                    } catch (e) {
                    }
                }
            });
        });
    }
    if (ca_url.indexOf("stocks") >= 0) {
        $("#ca-sellStockShares").show();
    } else {
        $("#ca-sellStockShares").hide();
    }
}

if (pricefactor !== undefined && c_api_key !== undefined) {
    sidebarContent = `
<span id="ca-pricefactor">
        <span style="padding:5px 0px;" class="ca-subtitle">Price factor</span>
        <input class='ca-inputtext' id='c-pricefactor' type='number' step="0.01" value='` + pricefactor + `'/>
      </span>
        <a id='calctrade' class='ca-btn'>Calc. Trade val.</a>
      <span id="ca-tool-content" style="display: block;padding: 10px 0px;" class="ca-selector">

            <span class="ca-disable-on-travel ca-btn checkMarketPrices"><span>Check market</span></span>
            <a href="https://www.torn.com/bazaar.php#/manage" class="ca-disable-on-travel ca-btn"><span>? bazaar</span></a>
            <a href="https://www.torn.com/bazaar.php#/add" class="ca-disable-on-travel ca-btn"><span>+ bazaar</span></a>
            <a href="https://www.torn.com/imarket.php" class="ca-disable-on-travel ca-btn">Item market</a>
            <a href="https://www.torn.com/page.php?sid=stocks" class="ca-disable-on-travel ca-btn">Stocks</a>
            <a href="https://www.torn.com/travelagency.php" class="ca-disable-on-travel ca-btn">Travel</a>
             <a href="https://www.torn.com/item.php" class="ca-disable-on-travel ca-btn"><span>Items</span></a>
             <a href="https://www.torn.com/crimes.php#/step=main" class="ca-disable-on-travel ca-btn"><span>Crimes</span></a>
            <span class="ca-disable-on-travel ca-btn openedititemwindow">Config</span>

            <span id="checkMarketPricesContainer">

</span>
      <div style="display:none;" id="pagespecific">

       <span class='ca-result'></span>

       </div>`;

}
    $(document).on("click", "#showprofits", function () {



        getTodaysLogs().then((allLogs) => {
            var bazaarProfits = 0;
            var bazaarCosts = 0;
            for(var i = 0; i < allLogs.length;i++){
             if(allLogs[i].title === "Bazaar sell"){
                 bazaarProfits += allLogs[i].data.total_cost;
             }
             if(allLogs[i].title === "Bazaar buy"){
                 bazaarCosts += allLogs[i].data.total_cost;
             }
            }
            refreshItemwindow(false,`$${addCommas(bazaarProfits - bazaarCosts)}`);
        });
    });

    //#endregion

    //#region async functions
    async function getMarketListings(itemId) {
        apiCalls++;
        var returnCosts = 0;
        const result = await fetch("https://www.torn.com/imarket.php", {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0",
                "Accept": "*/*",
                "Accept-Language": "nl,en-US;q=0.7,en;q=0.3",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin"
            },
            "referrer": "https://www.torn.com/imarket.php",
            "body": "p=shop&step=shop&type=&searchname="+itemId,
            "method": "POST",
            "mode": "cors"
        }).then((response) => response.text())
    .then((text) => {
        let parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        var links = doc.getElementsByClassName("cost");

        var i = 0;
        var skip = true;
        for(var linkelement in links){
            if(links[linkelement].innerText != undefined)
                if(!skip){
                returnCosts = links[linkelement].innerText.replace("\nPrice:\n$","").replace(",","").replace(" ","");
                break;
                }
            skip =false;
        }
        });
return returnCosts;
    }

    async function getAllBazaarData (data) {
  let generatedResponse = {}
  var delayindex = 1;
  var counterindex = 1;
  for(let elem of data) {
    if(stopsearch){
        stopsearch = false;
        break;
    }
    try {
      // here candidate data is inserted into
      await delay(600);
      let insertResponse = await getBazaarListingByItemId(elem)

      let bazaarLink = await getAction({
                type: 'POST',
                action: 'imarket.php',
                data: {
                    step: 'getShopList1',
                  itemID: elem
                },
                success: (data) => {

                    try {
                        var thelink;
                        var lines = data.split('\n');
                        for (var line in lines) {

                            if (lines[line].indexOf("bazaar.php?userId") != -1) {
                                thelink = lines[line];
                                break;
                            }
                        }
                      console.log(thelink)
                        var linkarray = thelink.split(/\"/);
                        linkarray[3] = linkarray[3]; // + "&tt_itemid=" + elem
                        thelink = linkarray[0] + linkarray[1] + linkarray[2] + linkarray[3] + linkarray[4];
                        const linkparser = new DOMParser();
                        const parsedlink = linkparser.parseFromString(thelink, "text/html");
                        var link = parsedlink.querySelector("a");
                        link.setAttribute('target', '_blank');
                        thelink = parsedlink.body.innerHTML.replace("<\/a>", " ")
                        insertResponse.bazaar['thelink'] = [thelink];
                        const parser = new DOMParser();
                        const shoplistpage = parser.parseFromString(data, "text/html");
                        var amountonmarket = 0;
                        var lowestMarketPrice = 0;
                        if(shoplistpage.getElementsByClassName("buy-link")[0] != undefined){
                            lowestMarketPrice = shoplistpage.getElementsByClassName("buy-link")[0].getAttribute('data-price');
                            for(var i = 0;i < shoplistpage.getElementsByClassName("buy-link").length; i++){
                                if(shoplistpage.getElementsByClassName("buy-link")[i].getAttribute('data-price') == lowestMarketPrice){
                                    amountonmarket++;
                                }
                            }
                        }
                        insertResponse.bazaar['lowestmarketprice'] = [lowestMarketPrice];
                        insertResponse.bazaar['amountonmarket'] = [amountonmarket];
                        $("#checkCounter").html(counterindex);
                        counterindex++
                        return thelink;
                    } catch (e) {
                         console.error("An error occurred:", e);
                    }
                }
            });
      // and response need to be added into final response array
        generatedResponse[elem] = insertResponse.bazaar;
        const profiteach = fetchedItemData[elem].marketprice - generatedResponse[elem][0].cost;
        const totalcost = generatedResponse[elem][0].quantity * generatedResponse[elem][0].cost;
        const profit = Math.floor((profiteach * generatedResponse[elem][0].quantity) * pricefactor);

        const marketprofiteach = fetchedItemData[elem].marketprice - generatedResponse[elem].lowestmarketprice;
        const markettotalcost = generatedResponse[elem].amountonmarket * generatedResponse[elem][0].cost;
        const marketprofit = Math.floor((marketprofiteach * generatedResponse[elem].amountonmarket) * pricefactor);
        const nicemoneyonhand = $("#user-money").html();
        const one = nicemoneyonhand.replace("$","");
        const two = one.replace(",","")
        const three = two.replace(",","")
        const moneyonhand = three.replace(",","")
        console.log(moneyonhand);
        var lines="";
        var bazaarlines = generatedResponse[elem]['thelink']+`
                    <span style="display:block;width:100%;margin:5px;background:#e6dce6;color:black;padding:2px;border-radius:10px;">
                    <b>Bazaar</b><br>(x`+generatedResponse[elem][0].quantity+`)<br>
                        <span style="font-weight:700;">Cost each:<br>$`+addCommas(generatedResponse[elem][0].cost)+`</span><br>
                        <span style="${(moneyonhand < totalcost ? `color:red;` : `color:green;` )}font-weight:700;">TOT COST:<br>$`+addCommas(totalcost)+`</span>
                        <br>
                        <span style="color:`+(profit <= 0 ? "red" : "green" )+`;font-weight:700;">TOT Profit<br> $`+addCommas(profit)+`</span>
                        <br>
                    </span>
                    </a>`;

        var marketlines = `<a style="text-decoration:none;" href="https://www.torn.com/imarket.php#/p=shop&step=shop&type=&searchname=${fetchedItemData[elem].name}" target="_blank">
                    <span style="display:block;width:100%;margin:5px;background:#e6cab9;color:black;padding:2px;border-radius:5px;">
                        <b>Market</b><br><br>
                        <span><b>Cost each:</b><br>$`+addCommas(generatedResponse[elem].lowestmarketprice)+`</span><br>
                        <br>
                        <span style="color:`+(marketprofit <= 0 ? "red" : "green" )+`;"><b>TOT Profit each:</b><br> $`+addCommas(marketprofiteach)+`</span>
                        <br>
                    </span>
                    </a>`;
        //(x`+generatedResponse[elem].amountonmarket+`)



                lines += `
                    <span style="text-align:center;position:relative;text-decoration:none;" class="itemline-`+elem+`"'>
                    <img src="https://www.torn.com/images/items/`+elem+`/large.png"><br>
                    <br><span style="color:#afafaf;">Value: $`+addCommas(fetchedItemData[elem].marketprice)+`</span>
                    <br><span style="text-decoration:none;">`;

               lines += bazaarlines;
            if(generatedResponse[elem].amountonmarket > 0){
               lines += marketlines;
            }
               lines += `</span></span>`;


      $(".inneritemwindowcontainer").append(lines);
      delayindex++;
    } catch (error) {
      console.log('error'+ error);
    }
  }
  return generatedResponse // return without waiting for process of
}

async function getAllCheckData (data) {
  let generatedResponse = {};
  for(let elem of data) {
    try {
      // here candidate data is inserted into
      console.log("refreshing item")
      let insertResponse = await refreshItemData(elem)
      // and response need to be added into final response array
      generatedResponse[elem] = insertResponse;
      //console.log(insertResponse)
    } catch (error) {
      console.log('error'+ error);
    }
  }
  return generatedResponse // return without waiting for process of

}
    async function getAllItemData(itemId) {
        apiCalls++;
         const fetchItemdata = await fetch("https://api.torn.com/torn/" + itemId + "?selections=items&key=" + c_api_key);
        const jsonItemData = await fetchItemdata.json();
        return jsonItemData;
    }

    async function getMoneyOnHand() {
        apiCalls++;
        const response = await fetch("https://api.torn.com/user/?selections=money&key=" + c_api_key);
        const moneydata = await response.json();
        return moneydata;
    }


    async function getBazaarListingByItemId(itemId) {
        apiCalls++;
        const response = await fetch("https://api.torn.com/market/" + itemId + "?selections=bazaar&key=" + c_api_key);
        const bazaarListings = await response.json();
        return bazaarListings;
    }


    async function getMarketListingByItemId(itemId) {
        apiCalls++;
        const response = await fetch("https://api.torn.com/market/" + itemId + "?selections=itemmarket&key=" + c_api_key);
        const marketListings = await response.json();
        return marketListings;
    }

    //#endregion

    //#region run with interval
     setInterval(function () {
         if(typeof lastapicalltimestamp === 'string')
             lastapicalltimestamp = parseInt(lastapicalltimestamp);
         if(checklocked){
             $(".checkMarketPrices").addClass("disabletouch");
         }else{
             $(".checkMarketPrices").removeClass("disabletouch");
         }


         var diff = new Date().getTime() - lastapicalltimestamp;
         var secondsDiff = diff / 1000;
         var difference = Math.round(secondsDiff);
         //console.log(apicallsinminute + "/100 - " + (60 - difference) + "s cooldown")

        if(apicallsinminute >= 100 && difference <= 60){
            checklocked = true;
            $(".checkMarketPrices").html("(Cooldown "+ 60 - difference +"s)");
            localStorage.checkCooldown = checkCooldown;
            //console.log("cooldown active please wait " + checkCooldown + " seconds.");
          if(60 - difference <= 0){
              if(checklocked){
                  $(".checkMarketPrices").html("Check Marketprices");
                  apicallsinminute = 0;
                  checklocked = false
                  localStorage.apicallsinminute = apicallsinminute;
              }
          }
        }
         if((60 - difference) <= 0){
             apicallsinminute = 0;
             localStorage.apicallsinminute = apicallsinminute;
             lastapicalltimestamp = new Date().getTime();
             localStorage.lastapicalltimestamp = lastapicalltimestamp;
         }
    }, 1000);


    setInterval(function () {
        if ($(".ca-result").html() === "") {
            $("#pagespecific").hide();
        } else {
            $("#pagespecific").show();
        }
    }, 300);
    //#endregion

    //#region Init scripts


    $(body).append(`<div id="ca-notification" style="display: none;">
  <span class="dismiss"><a title="dismiss this notification">x</a></span>
</div>`);


    const stylesheet = GM_getResourceText("stylesheet");
    GM_addStyle(stylesheet)



    if (c_api_key != undefined) {
        addButton();
        buyStockFast();
        sellStockShares();
    }
    //#endregion

    //#region interactions



$(document).on("click", "#stopsearch", function(){
    stopsearch = true;
    $("#itemloader").remove();
})

$(document).on("click", "#telljoke", function(){
  getJokes().then((joke) => {
      refreshItemwindow(false,joke);
    })
})

$(document).on("click", ".closeitemwindow", function () {
    stopsearch = true;
    $(".itemwindowcontainer").remove();
});

    //on api key input
    $(document).on("change", "#c_api_key", function () {
        var keyinput = $(this).val();
        $.getJSON("https://api.torn.com/user/?selections=&key=" + keyinput, function (data) {
            if (data.hasOwnProperty('error')) {
                $(".ca-result").html("<b style='color:red;'>Incorrect API Key.</b>");
                c_api_key = undefined;
            } else {
                localStorage.setItem("tornApi", keyinput);
                c_api_key = keyinput;
                location.reload();
            }
        });
    });

    $(document).on("change", "#marketorbazaar", function () {
        var string = $(this).val().toString();
        localStorage.setItem("marketorbazaar", string);
    });

    $("div.amount").children("input.clear-all").focus(function () {
        var quantityText = $(this).parent().parent().parent().prev().children(".name-wrap").children(".t-hide").text();
        if (quantityText === '') {
            quantityText = 1;
        } else {
            if (quantityText.indexOf(' x') == -1) {
                quantityText = quantityText.replace(/\s/g, '');
                quantityText = quantityText.replace("x", "");
            } else {
                $(this).val("1");
            }
        }
        GM_setClipboard(quantityText, "text");
        $(".ca-result").html('max amount set:<br>' + quantityText);
    });

    //Get total value in current trade window
    $(document).on("click", "#calctrade", function () {
        var checkpricer = 0;
        var itemprice = 0;
        $('.right').find('*').each(function () {
            if ($(this).hasClass("tt-item-value")) {

                itemprice = $(this).text().replace("$", "");
                itemprice = itemprice.replace(/,/g, '');
                itemprice = itemprice.replace(/\s/g, '');
                itemprice = itemprice * pricefactor;
                checkpricer = checkpricer + itemprice;
            }
        });
        ////console.log(checkpricer)
        checkpricer = Math.ceil(checkpricer);
        checkpricer = addCommas(checkpricer);

        GM_setClipboard(checkpricer, "text");
        $(".ca-result").html('Your trade price copied:<br>$' + checkpricer);
    });

    //#endregion

    //#region Edit item window and info popup functionality

    function refreshItemwindow(edititems = true, content = null) {
      if (document.getElementsByClassName('itemwindowcontainer').length > 0){
        $(".itemwindowcontainer").remove();
      }
      if (edititems) {
        $(body).append(`
          <div class='itemwindowcontainer'>
          <div class='inneritemwindowcontainer'>
          <button class='closeitemwindow itemwindow-btn'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="#fff" d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM175 208.1L222.1 255.1L175 303C165.7 312.4 165.7 327.6 175 336.1C184.4 346.3 199.6 346.3 208.1 336.1L255.1 289.9L303 336.1C312.4 346.3 327.6 346.3 336.1 336.1C346.3 327.6 346.3 312.4 336.1 303L289.9 255.1L336.1 208.1C346.3 199.6 346.3 184.4 336.1 175C327.6 165.7 312.4 165.7 303 175L255.1 222.1L208.1 175C199.6 165.7 184.4 165.7 175 175C165.7 184.4 165.7 199.6 175 208.1V208.1z"/></svg>
          </button>
          <b style="width:100%;">Add or remove items to search.</b>
          <span style='display:block;width:100%;'><button id="clearitemstocheck" class="ca-btn">Clear items to check</button></span>
          <span style='display:block;width:100%;'>
          Search item ID(case sensitive):<br>
          <input style="color:black;border:1px solid black; line-height:1em;margin-bottom:1em;" id="searchbar" placeholder="search..."/><br><span id="searchbarresult"></span>
          </span>
          </div>
          </div>`);
          let i = 0;
        while (i < itemstocheck.length) {
          for (var k in itemarray) {
            if (itemarray[k] == itemstocheck[i]) {
                if (fetchedItemData[itemstocheck[i]] !== undefined && fetchedItemData[itemstocheck[i]].marketprice !== null) {
                  $(".inneritemwindowcontainer").append("<span style='background:#efefef;sdisplay:inline-block;width:120px;height:120px;display: flex;flex-direction: column;justify-content: space-around;align-items: center;' class='itemcontainer'><b><p>" + k + "</p></b><br>(MP)$"+addCommas(fetchedItemData[itemstocheck[i]].marketprice)+"<br><img style='width:80px;height:auto;' src='/images/items/" + itemstocheck[i] + "/large.png?v=" + (Math.floor(Math.random() * 999999999)) + "'/><br><span style='cursor:pointer;' data-itemid='" + itemstocheck[i] + "' class='removeitemfromcheck'>Remove</span></span>");
                }else{
                  getAllCheckData(itemstocheck).then(function(){
                    refreshItemData(itemstocheck[i]).then(itemData => {
                      console.log(itemData)
                      apiCalls++;
                      fetchedItemData[itemstocheck[i]] = {
                          "marketprice": itemData.items[itemstocheck[i]].market_value,
                          "timestamp": new Date().setHours(0,0,0,0),
                          "name":  itemData.items[itemstocheck[i]].name
                      };
                      localStorage.fetchedItemData = JSON.stringify(fetchedItemData);
                      $(".inneritemwindowcontainer").append("<span style='background:#efefef;sdisplay:inline-block;width:120px;height:120px;display: flex;flex-direction: column;justify-content: space-around;align-items: center;' class='itemcontainer'><b><p>" + k + "</p></b><br>(MP)$"+addCommas(fetchedItemData[itemId]["marketprice"])+"<br><img style='width:80px;height:auto;' src='/images/items/" + itemstocheck[i] + "/large.png?v=" + (Math.floor(Math.random() * 999999999)) + "'/><br><span style='cursor:pointer;' data-itemid='" + itemstocheck[i] + "' class='removeitemfromcheck'>Remove</span></span>");
                    })
                  })
                }
            }
          }
          i++;
        }
        $("#searchbar").focus();
        } else {
          $(body).append(`
          <div class='itemwindowcontainer'>
            <button class='closeitemwindow itemwindow-btn'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="#fff" d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM175 208.1L222.1 255.1L175 303C165.7 312.4 165.7 327.6 175 336.1C184.4 346.3 199.6 346.3 208.1 336.1L255.1 289.9L303 336.1C312.4 346.3 327.6 346.3 336.1 336.1C346.3 327.6 346.3 312.4 336.1 303L289.9 255.1L336.1 208.1C346.3 199.6 346.3 184.4 336.1 175C327.6 165.7 312.4 165.7 303 175L255.1 222.1L208.1 175C199.6 165.7 184.4 165.7 175 175C165.7 184.4 165.7 199.6 175 208.1V208.1z"/></svg>
            </button>
          <div class='inneritemwindowcontainer'>
          `+ content + `
          </div>
          </div>`);
        }
        $(".itemwindowcontainer").insertBefore(".responsive-sidebar-container");
    }




async function getBazaarListing(ITEMID){
    apiCalls++;
    const itemId = ITEMID;
    const response = await fetch("https://api.torn.com/market/" + itemId + "?selections=bazaar&key=" + c_api_key);
    const bazaarListings = await response.json();
    return bazaarListings;
}

async function refreshItemData(ITEMID,checksingle = false){
    const itemId = ITEMID;
    var msg;
    let thismarketprice;
        if(fetchedItemData != undefined){
            //console.log(fetchedItemData[itemId])
            if(fetchedItemData[itemId] != undefined){
                //console.log("ID exists in localStorage")
                if(isToday(fetchedItemData[itemId]["timestamp"])){
                    //console.log("ID was updated today")
                    thismarketprice = fetchedItemData[itemId]["marketprice"];
                }else{
                    getAllItemData(itemId).then(itemData => {
                        apiCalls++;
                        fetchedItemData[itemId] = {
                            "marketprice": itemData.items[itemId].market_value,
                            "timestamp": new Date().setHours(0,0,0,0),
                            "name":  itemData.items[itemId].name
                        };
                        localStorage.fetchedItemData = JSON.stringify(fetchedItemData);
                        thismarketprice = fetchedItemData[itemId]["marketprice"];
                    })
                }
            }else{

                getAllItemData(itemId).then(itemData => {
                    apiCalls++;
                    fetchedItemData[itemId] = {
                        "marketprice": itemData.items[itemId].market_value,
                        "timestamp": new Date().setHours(0,0,0,0),
                        "name":  itemData.items[itemId].name
                    };
                    localStorage.fetchedItemData = JSON.stringify(fetchedItemData);
                    thismarketprice = fetchedItemData[itemId]["marketprice"];
                })
            }
        }else{
            getAllItemData(itemId).then(itemData => {
                apiCalls++;
                fetchedItemData = {
                    [itemId]: {
                        "marketprice": itemData.items[itemId].market_value,
                        "timestamp": new Date().setHours(0,0,0,0),
                        "name":  itemData.items[itemId].name
                    }
                }

                localStorage.fetchedItemData = JSON.stringify(fetchedItemData);
                thismarketprice = fetchedItemData[itemId]["marketprice"];
            })
        }

        return fetchedItemData[itemId];
}
//working
$(document).on("click", ".checkMarketPrices", function () {
  var pageContent = document.documentElement.innerHTML;

// Define the line of text to search for
var searchLine = "This area is unavailable while you're traveling.";

// Check if the line exists in the page content
if (pageContent.includes(searchLine)) {
  alert("Unavailable while traveling");
    return;
}
  if (document.title.includes('Traveling')) {
    alert("Unavailable while traveling");
    return;
  }
  refreshItemwindow(false, "<span id='itemloader' style='width:100%;text-align:center;'>Scanning market...(<span id='checkCounter'>0</span>/"+itemstocheck.length+")<span id='stopsearch' style='height:32px;cursor:pointer;background:red;color:white;width:100%;text-align:center;padding:5px;margin:5px;border-radius:5px;'>Stop searching</span></span>");
    if(!checklocked){
    apiCalls = 0;
  var content;
  var countindex = 0;
  var interval = 200;
  var loadcount = 1;
  var loadlength = itemstocheck.length;
  var thismarketprice;
  var allCheckData = [];
   getAllCheckData(itemstocheck).then((theItemInfo) => {
    allCheckData.iteminfo = theItemInfo;
      //console.log(theItemInfo)
    getAllBazaarData(itemstocheck).then((theBazaarInfo) => {
      allCheckData.bazaars = theBazaarInfo;
    }).then(function(){
    }).then(function(data){
      $("#itemloader").remove();
      if($(".inneritemwindowcontainer").html() === ""){
        $(".inneritemwindowcontainer").html("No profitable items found");
      }
        apicallsinminute += apiCalls;
        localStorage.apicallsinminute = apicallsinminute
        apiCalls = 0;
    })
  })
    }
});


    //click on itemname to get prices
    $(document).on("click", "span.searchname, span.name", function () {
      const idToAdd = itemarray[$(this).html()];
      const itemName = $(this).html();

        if(itemstocheck.includes(String(idToAdd))){
          $.notify(itemName+" is already on your checklist.", "error");
        }else{
           $.notify(itemName+" added to checklist.", "success");
          itemstocheck.push(String(idToAdd));
          localStorage.setItem("itemstocheck", JSON.stringify(itemstocheck));
            getAllCheckData([idToAdd]).then(function(){
          })
        }
    });

    //remove item from market items to check
    $(document).on("click", ".removeitemFromcheck, .openedititemwindow", function () {
      getAllCheckData(itemstocheck).then(function(){
         refreshItemwindow();
      });
    });


    $(document).on("click", ".removeitemfromcheck", function () {
        const value = $(this).attr("data-itemid");
        const result = itemstocheck.filter(function (x) {
            return x !== value;
        });
        itemstocheck = result;
        localStorage.setItem("itemstocheck", JSON.stringify(itemstocheck));
        refreshItemwindow();
    });
    $(document).on("click", "#clearitemstocheck", (function (e) {
            itemstocheck = [];
            localStorage.setItem("itemstocheck", JSON.stringify(itemstocheck));
            alert("All items cleared from checklist.");
            refreshItemwindow();

    }));

    // $(document).on("keyup", "#searchbar", (function (e) {
    //   console.log(itemstocheck)
    //     if ($("#searchbar").is(":focus") && (e.keyCode == 13)) {
    //         itemstocheck.push(String($("#addId").html()));
    //         localStorage.setItem("itemstocheck", JSON.stringify(itemstocheck));
    //       console.log(itemstocheck)
    //         getAllCheckData(itemstocheck).then(function(){
    //          refreshItemwindow();
    //       });
    //     }
    // }));

    $(document).on("click", "#addId", function () {
      console.log(itemstocheck);
        itemstocheck.push(String($(this).html()));
        localStorage.setItem("itemstocheck", JSON.stringify(itemstocheck));
      console.log(itemstocheck);
         getAllCheckData(itemstocheck).then(function(){
           refreshItemwindow();
         })

    });

    $(document).on("keyup", "#searchbar", function () {
        var searchinput = $(this).val();
      $("#searchbarresult").html("");
        searchinput = cap(searchinput);
        for (var key in itemarray) {
            if (key.indexOf(searchinput) != -1) {
                $("#searchbarresult").append("<b>" + key + "<b><br>ID - <span id='addId' style='cursor:pointer;color:blue;' title='Add to price checker'>" + itemarray[key] + "</span><br>(Click to add or press enter)<br><br>");
            }
        }
    });

    //#endregion
    //#region styles
    var style = `
    .ca-toggler-close{
    background: #6c757d;
    color: white!important;
    padding: 5px;
    position: absolute;
    right: -30px;
    top: -30px;
    border-radius: 30px;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    font-weight: 900;
    cursor: pointer;
    }
    .accordion {
      max-width: 600px;
      margin: 0 auto;
    }

    .accordion-item {
      border-bottom: 1px solid #ccc;
    }

    .accordion-item:last-child {
      border-bottom: none;
    }

    .accordion-header {

      background-color: #f5f5f5;
      padding: 10px;
      cursor: pointer;
    }

    .accordion-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
    }

    .accordion-header.active {
      background-color: #ddd;
    }

    .accordion-header::after {
      content: '+';
      float: right;
      transition: transform 0.3s ease-in-out;
    }

    .accordion-header.active::after {
      content: '-';
      transform: rotate(180deg);
    }
    .ca-toolbar {
    float: right;
    margin: 0 1px;
    margin-bottom:50px;
}
.ca-toggle-btn {
    left: 5px;
    bottom:0px;
    display: block;
    vertical-align: middle;
    filter: drop-shadow(0px 0px 1px rgba(17, 17, 17, 0.6784313725));
    position: fixed;
    height: 34px;
    max-width: 132px;
    width: 36px;
    margin: 5px 0 0;
    background: linear-gradient(180deg, #6d757d 0%, #fdab64 100%);
    cursor: pointer;
    border-radius: 5px 5px 0 0;
    border-bottom: var(--chat-horizontal-divider);
    box-shadow: var(--chat-horizontal-divider-box-shadow);
    text-align: center;
    line-height: 34px;
    z-index: 999999999999999999999999999999999999999999999999999999999999999999999999999999;
}
.itemmarketicon {
    mask-position: -77px -42px;
    -webkit-mask-position: -77px -42px;
}

.travelicon {
    mask-position: -10px -7px;
    -webkit-mask-position: -10px -7px;
}

.stocksicon {
    mask-position: -44px -111px;
    -webkit-mask-position: -44px -111px;
}

.svgicon {
    width: 16px;
    height: 16px;
    display: inline-block;
    transform: scale(0.8);
    background-color: white;
    -webkit-mask-image: url("https://www.torn.com/images/v2/city/location_icons_34x34px.svg");
    mask-image: url("https://www.torn.com/images/v2/city/location_icons_34x34px.svg");
}

.view-link {
    text-decoration: none;
    color: black;
}
.window-btn-holder{
position: absolute;
bottom: -48px;
right: 50%;
height: 32px;
padding: 10px;
z-index: 99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999;
transform: translate(50%,0%);
}
.itemwindowcontainer {
display: block;
    position: fixed;
    top: 50vh;
    left: 50vw;
    width: 95vw;
    height: 50vh;
    z-index: 9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999;
    box-sizing: border-box;
    transform: translate(-50%,-50%);
}

.inneritemwindowcontainer {
    display: flex;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
    background: #fff;
    z-index: 9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999;
    flex-wrap: wrap;
    row-gap: 10px;
    column-gap: 20px;
    justify-content: flex-start;
    padding: 50px;
    box-sizing: border-box;
    box-shadow: 0px 0px 20px black;
}


.material-symbols-outlined {
    font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' -25, 'opsz' 48
}

.ca-author {
    text-decoration: none;
    color: #2b4a5a;
    font-size: 0.8em;
}

.wrapper.ca-selector {
    margin: 10% auto;
    width: 100%;
}

.ca-selector.wrap-collabsible {
    margin-bottom: 1.2rem 0;
}

input.ca-selector[type='checkbox'] {
    display: none;
}

.ca-selector.lbl-toggle {
    margin-top: 5px;
    display: block;
    font-weight: bold;
    font-family: monospace;
    font-size: 1em;
    text-transform: uppercase;
    text-align: center;
    padding: 5px;
    color: #ffffff;
    background: #ffa526;
    cursor: pointer;
    border-radius: 7px;
    transition: all 0.25s ease-out;
}

    .ca-selector.lbl-toggle:hover {
        color: #7C5A0B;
    }

    .ca-selector.lbl-toggle::before {
        content: ' ';
        display: inline-block;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 5px solid currentColor;
        vertical-align: middle;
        margin-right: .7rem;
        transform: translateY(-2px);
        transition: transform .2s ease-out;
    }

.ca-selector.toggle:checked + .ca-selector.lbl-toggle::before {
    transform: rotate(90deg) translateX(-3px);
}

.ca-selector.collapsible-content {
    background: #3e6274;
    max-height: 0px;
    overflow: hidden;
    transition: max-height .25s ease-in-out;
}

.ca-selector.toggle:checked + .ca-selector.lbl-toggle + .ca-selector.collapsible-content {
    max-height: 100vh;
}

.ca-selector.toggle:checked + .ca-selector.lbl-toggle {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

.ca-result {
        display: block;
    overflow: auto;
    background: #ced4da;
    padding: 5px;
    margin: 10px 0px;
    color: #000 !important;
    border: 1px solid #2a4a5a;
    max-width: 164px;
    word-break: break-word;
}


    /* width */
    .ca-result::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    .ca-result::-webkit-scrollbar-track {
        background: #325262;
    }

    /* Handle */
    .ca-result::-webkit-scrollbar-thumb {
        background: #274656;
    }

        /* Handle on hover */
        .ca-result::-webkit-scrollbar-thumb:hover {
            background: #555;
        }

.ca-title {
    display: block;
    font-family: 'fjalla one';
    font-size: 1.2em;
    margin-bottom: 5px;
    color: #343a40;
}

.ca-subtitle {
    display: block;
    font-family: 'fjalla one';
    font-size: 1.2em;
    color: 343a40;
}

.ca-inputtext {
    background: #afafaf;
    border-radius: 2px;
    padding: 5px;
    border: 1px solid #adb5bd;
}

#ca-inner > span {
    display: block;
    color: #000;
    margin: 5px 0px;
}
.ca-btn.icon-only {
  display: inline-block;
  width: 25px;
  height: 25px;
  text-align: center;
  line-height: 32px;
}
.itemwindow-btn svg {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}

.itemwindow-btn {
cursor: pointer;
    height: 40px;
    width: 40px;
    display: block;
    position: absolute;
    background: #6c757d;
    border-radius: 5px;
    top: 0px;
    right: 0px;
}
.itemwindow-btn:hover {
    background:#464c52;
}
.ca-btn {
    display: block;
    background: #6c757d;
    padding: 10px 5px;
    cursor: pointer;
    color: white !important;
    border-radius: 5px;
    text-decoration: none;
    font-size: 1.1em;
    margin-bottom: 5px;
}

    .ca-btn:hover {
        background: #343a40;
        color: white;
    }

.c-toggler {
position: fixed;
text-align: center;
line-height: 75px;
left: -26px;
top: 50vh;
width: 64px;
height: 32px;
transform: translate(50%,-50%);
cursor: pointer;
z-index: 999999999;
background-position: 50px;
}

#c-autofiller-container {
    position: fixed;
    bottom: 40px;
    background: #f8f9fa;
    padding: 20px;
    z-index: 999999999;
    display:none;
}
.disabletouch{
    pointer-events:none;
    touch-action: none;
    background:#afafaf!important;
}
.icon-btn {
    font-size: 1em;
    margin-right: 5px;
}

#radios label {
    color: #343a40;
}
/* loading.io */
.lds-roller {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
}

    .lds-roller div {
        animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        transform-origin: 40px 40px;
    }

        .lds-roller div:after {
            content: " ";
            display: block;
            position: absolute;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #fff;
            margin: -4px 0 0 -4px;
        }

        .lds-roller div:nth-child(1) {
            animation-delay: -0.036s;
        }

            .lds-roller div:nth-child(1):after {
                top: 63px;
                left: 63px;
            }

        .lds-roller div:nth-child(2) {
            animation-delay: -0.072s;
        }

            .lds-roller div:nth-child(2):after {
                top: 68px;
                left: 56px;
            }

        .lds-roller div:nth-child(3) {
            animation-delay: -0.108s;
        }

            .lds-roller div:nth-child(3):after {
                top: 71px;
                left: 48px;
            }

        .lds-roller div:nth-child(4) {
            animation-delay: -0.144s;
        }

            .lds-roller div:nth-child(4):after {
                top: 72px;
                left: 40px;
            }

        .lds-roller div:nth-child(5) {
            animation-delay: -0.18s;
        }

            .lds-roller div:nth-child(5):after {
                top: 71px;
                left: 32px;
            }

        .lds-roller div:nth-child(6) {
            animation-delay: -0.216s;
        }

            .lds-roller div:nth-child(6):after {
                top: 68px;
                left: 24px;
            }

        .lds-roller div:nth-child(7) {
            animation-delay: -0.252s;
        }

            .lds-roller div:nth-child(7):after {
                top: 63px;
                left: 17px;
            }

        .lds-roller div:nth-child(8) {
            animation-delay: -0.288s;
        }

            .lds-roller div:nth-child(8):after {
                top: 56px;
                left: 12px;
            }

@keyframes lds-roller {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
#ca-notification {
    position:fixed;
    top:0px;
    width:100%;
    z-index:9999999999999999999999999999999999999999999999999999999999999999999999999;
    text-align:center;
    font-weight:normal;
    font-size:14px;
    font-weight:bold;
    color:white;
    background-color:#FF7800;
    padding:5px;
}
#ca-notification span.dismiss {
    border:2px solid #FFF;
    padding:0 5px;
    cursor:pointer;
    float:right;
    margin-right:10px;
}
#ca-notification a {
    color:white;
    text-decoration:none;
    font-weight:bold
}
`;
    GM_addStyle(style);

    //#endregion

    //#region observer for auto item pricing

    const torn_api = async (itemId) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.torn.com/torn/${itemId}?selections=items&key=${c_api_key}`,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: (response) => {
                    try {
                        const resjson = JSON.parse(response.responseText)
                        resolve(resjson)
                    } catch (err) {
                        alert(err)
                        reject(err)
                    }
                },
                onerror: (err) => {
                    alert(err)
                    reject(err)
                }
            })
        })
    }
$(function(){

   $("body").append(`
  <div id='c-autofiller-container'>
  <div id='ca-inner' style='position:relative;'>
    <span class="ca-toggler ca-toggler-close">x</span>
    <div style="padding:5px 0px;color: #6c757d;" id="ca-pluginname">
      <div style="padding:10px 0px;font-weight:900;font-size:1.2em;">Cake's autofiller</div>
      <a class="ca-author" href="https://www.torn.com/profiles.php?XID=2016971">Author ></a>
      </div>
    </div>
    <div class="accordion">
      <div class="accordion-item">
        <div class="accordion-header"><b>API KEY</b></div>
        <div style="background:#efefef;" class="accordion-content">
          <p style="padding:5px;"><span id="ca-api">
            <span style="margin:5px 0px;" class="ca-subtitle"><a style="text-decoration:underline;color:black;" href="https://www.torn.com/preferences.php#tab=api">API settings ></a></span>
            <input style="margin:5px 0px;" class='ca-inputtext' id='c_api_key' type='text' value='` + (c_api_key != undefined ? c_api_key : "Fill in your api key") + `'/>
          </span>
          </p>
        </div>
    </div>
</div>
`+ (c_api_key != undefined ? sidebarContent : "") + `
  </div>
  </div>`);

      if (c_api_key != undefined) {
        if (ca_url.indexOf("trade") >= 0) {
            $("#calctrade").show();
        }
        if (ca_url.indexOf("trade") === -1) {
            $("#calctrade").hide();
        }
		   $('#buyBeerBtn').on('click', async () => {
            $('#buyBeerResult').text('');
            await getAction({
                type: 'post',
                action: 'shops.php',
                data: {
                    step: 'buyShopItem',
                    ID: 180,
                    amount: 100
                },
                success: (str) => {
                    try {
                        const msg = JSON.parse(str);
                        $('.ca-result').html(msg.text).css('color', msg.success ? 'green' : 'red');
                    } catch (e) {
                    }
                }
            });
        });

        // check if user is abroad
        var pageContent = document.documentElement.innerHTML;

        // Define the line of text to search for
        var searchLine = "Travel Home";

        // Check if the line exists in the page content
        if (pageContent.includes(searchLine)) {
        const button = `<button class="ca-btn" id="ca-travel-home" style="color: var(--default-blue-color); cursor: pointer; margin-right: 0;">Travel home</button>`;

        $('#ca-tool-content').append(button);
        $('#ca-travel-home').on('click', async () => {
        await getAction({
          type: 'post',
          action: 'travelagency.php',
          data: {
            step: 'backHomeAction'
          },
          success: (str) => {
            location.reload();
          }
        });
        });
        }
        if ($('#ca-tool-content').length > 0 && $('#buyBeerBtn').length < 1) {
        const button = `<button class="ca-btn" id="buyBeerBtn" style="color: var(--default-blue-color); cursor: pointer; margin-right: 0;">Gimme beers!</button>`;

        $('#ca-tool-content').append(button);
        $('#buyBeerBtn').on('click', async () => {
            $('#buyBeerResult').text('');
            await getAction({
                type: 'post',
                action: 'shops.php',
                data: {
                    step: 'buyShopItem',
                    ID: 180,
                    amount: 100
                },
                success: (str) => {
                    try {
                        const msg = JSON.parse(str);
                        $('.ca-result').html(msg.text).css('color', msg.success ? 'green' : 'red');
                    } catch (e) {
                    }
                }
            });
        });
    }
    if (ca_url.indexOf("bitsnbobs") >= 0) {
        $("#buyBeerBtn").show();
    } else {
        $("#buyBeerBtn").hide();
    }
    }

const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        header.classList.toggle('active');
        const content = header.nextElementSibling;
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
});



    var event = new Event('keyup')
    var APIERROR = false

    async function lmp(itemID) {

        if (APIERROR === true) { alert("api ERROR"); return 'API key error' }


        const prices = await torn_api(itemID)

        if (prices.error) { APIERROR = true; return 'API key error' }
        for (const market in prices) {
            marketprice = prices.items[itemID].market_value;
        }
        return marketprice;
    }

    $(document).on("click", ".input-money", function(){

                    const input = this;
                 if (input) {
                      if(this.nextSibling.className === "input-money"){
                        var hiddenInput = this.nextSibling;

                        let pricetext = this.parentElement.parentElement.parentElement.querySelector("[class*='rrp']").textContent;
                        var price = parseInt(pricetext.replace(/\D/g,''));
                        console.log(price)
                        hack(this, Math.round(price * pricefactor));
                        hack(hiddenInput, Math.round(price * pricefactor));
                      }else{
                      const itemID = input.parentElement?.parentElement.parentElement.parentElement.parentElement.querySelector('img').src.split('items/')[1].replace("/large.png", "");
                      console.log(this.parentElement.parentElement.previousSibling.firstChild.type)
                      if(this.parentElement.parentElement.previousSibling.firstChild.type === "checkbox"){

                        let checkbox = this.parentElement.parentElement.previousSibling.firstChild;
                        var pricetext = this.parentElement.parentElement.parentElement.parentElement.querySelector(".info-main-wrap :nth-child(1)").textContent;
                        var price = parseInt(pricetext.replace(/\D/g,''));
                        hack(this, Math.round(price * pricefactor));
                        hackcheck(checkbox);

                      }else if(this.parentElement.parentElement.previousSibling.firstChild.type === "text"){
                        if(this.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".info-wrap :nth-child(3)")){
                          var pricetext = this.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".info-wrap :nth-child(3)").textContent;
                        }else{
                          var pricetext = this.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".info-wrap").textContent;
                        }


                        let amountinput = this.parentElement.parentElement.previousSibling.firstChild;

                        var price = parseInt(pricetext.replace(/\D/g,''));


                        let itemAmount = this.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".t-hide").textContent;
                        var theItemAmount = parseInt(itemAmount.replace(/\D/g,''));

                        let amount = this.parentElement.parentElement.parentElement.querySelector('.clear-all');
                        hackamount(amountinput, theItemAmount);
                        hack(this, Math.round(price * pricefactor));
                      }
                    }
                  }
    })

    function hackamount(inp, amt) {
        const input = inp;
        input.value = amt;
        let event = new Event('input', { bubbles: true });
        event.simulated = true;
        let tracker = input._valueTracker;
        if (tracker) {
            tracker.setValue(1);
        }
        input.dispatchEvent(event);
    }

function hackcheck(inp) {
        const input = inp;
        input.checked = true;
        let event = new Event('input', { bubbles: true });
        event.simulated = true;
        let tracker = input._valueTracker;
        if (tracker) {
            tracker.setValue(1);
        }
        input.dispatchEvent(event);
    }

    function hack(inp, price) {
        const input = inp;
        input.value = Math.round(price * 1) / 1;
        let event = new Event('input', { bubbles: true });
        event.simulated = true;
        let tracker = input._valueTracker;
        if (tracker) {
            tracker.setValue(1);
        }
        input.dispatchEvent(event);
    }

//#endregion