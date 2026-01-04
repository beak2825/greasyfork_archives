// ==UserScript==
// @name         actiontab atteck
// @description  atteck actiontab
// @icon         https://img1.baidu.com/it/u=1412332306,99938487&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500
// @license	     MIT
// @version      0.0.1
// @author       node_modules
// @run-at       document-end
// @include      http*://*
// @namespace    a.b.c.d
// @downloadURL https://update.greasyfork.org/scripts/480133/actiontab%20atteck.user.js
// @updateURL https://update.greasyfork.org/scripts/480133/actiontab%20atteck.meta.js
// ==/UserScript==

let list = [
'https://actiontab.cn/assets/peitu4-3.png',
'https://actiontab.cn/assets/peitu4-2.png',
]
let count = 0
function loop(){
    let idx = count%2
    fetch(list[idx]).then(res=>{
	   if(res.status==200) {
            count++
            if(count%100==0){
                console.log(`第${count}次攻击`);
	            document.querySelector('.header').innerHTML = `第${count}次攻击`;
            }
 	        loop()
        } else {
            setTimeout(loop,60*1000)
        }
	})
}
loop()
