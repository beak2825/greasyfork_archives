// ==UserScript==
// @name        浮动的字
// @namespace     http://blog.csdn.net/
// @version      1.4
// @description  网页小特效
// @author       莹莹
// @match       https://*/*
 // @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/420644/%E6%B5%AE%E5%8A%A8%E7%9A%84%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/420644/%E6%B5%AE%E5%8A%A8%E7%9A%84%E5%AD%97.meta.js
// ==/UserScript==

(function() {
        let mytext = ['富强','民主','和谐','文明','民主','爱国','奉献','无私','公正']

        let mydiv = document.createElement('div')

        let mytimer

        document.addEventListener('click',(e) => { 

            clearInterval(mytimer)

            let opacity = 1

            let top = e.clientY

            let left = e.clientX

            let _top = top
            
            mydiv.innerText = mytext[Math.floor( Math.random() * mytext.length)]
         
            mydiv.style.position = "fixed"
            
            mydiv.style.top = top - 15 + 'px'
            
            mydiv.style.left = left - 15 + 'px'
            
            mydiv.style.width = "50px"
            
            mydiv.style.textAlign = "center"
            
            mydiv.style.letterSpacing = 3 + 'px'
            
            mydiv.style.fontSize = 18 + 'px'
            
            mydiv.style.cursor = "default"
            
            mydiv.style.color = getColor()
            
            mydiv.style.opacity = opacity
            
            mydiv.style.zIndex = 100000000000
            
            mydiv.style.fontFamily = "FZShuTi"

            document.body.appendChild(mydiv)

            mytimer = setInterval(() => {

                if(opacity > 0) {
                    mydiv.style.opacity = opacity -= 0.005
                }

                if (_top - top > 100) {
                    document.body.removeChild(mydiv)
                    clearInterval(mytimer)
                } 
                
                mydiv.style.top = (top--) - 15 + 'px'
            },5)
        })

        function getColor() {

            let colorarr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f']

            let color = "#"

            for (let i = 0; i < 6; i++) {
                color += colorarr[Math.floor(Math.random() * colorarr.length)]
            }

            return color
        }

})(document);