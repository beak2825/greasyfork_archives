// ==UserScript==
// @name         Swagger优化主题
// @version      0.0.2
// @description  Swagger显示优化，Swagger优化主题
// @author       wilderliu
// @match        *://*/swagger-ui/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABZCAYAAADIBoEnAAAXdElEQVR42uyXeZAcVR3HP+9195w7O8fuziZhN5tskpVgMIhaXlEUFShAQMIhBVSAAkQogppUuKHKkgIDQgRRKoAcIhZHIRDuG7mRQCpEkpAsZLPZZHd2d+6rp7vfc52K4LCFICQBgc/MVE//M+/75vv7vt+vhdaaz/j4IPmMbcJnhnxC+cyQbcQnwxDtRXAKR+DmF0H2IiidDqWToXgCOj8fN3c2qtrDpwiTHY8ANABCBTHLv7MrKjGwxWW4qHBcRdhvMCFq0h7TSFMYEPglnxIkOxjtFI6nlroHMk+tGxi581e3ZKP7Lx5mn8VDHLYkxRGXj3Dwb1LsfdEgcy/LcOU9qeMGUiOPQfp+7YxehVYJPsGIHTL2agXoKIgCKntZtVadf/k9ea59vESu5OIPWvgDIaTlQwgBSuPWStjlGhW3RjLq45g9Ipy8V7gSbkruAeaa+m/tCLSSoH1aEBGaElABEoACkatfhYQ6/w9HlvYk7sgfsPRcENV8WUVOujrNwysrNDeFaOtowQjGMUwfGkH9rUFpj5BTJVrKUM6nWHxXlidWVf1LjlPPzugIPQUte7IjcEevQHoHCyl9CJ0HSkAS8KHFLXj+JZjR1QB8rBOiakGk3hncqalU7sZnesvh1f0uT691WNFnE/ELzHALVlM7hhUAIahrQYOW1BEgJCi7SiXbTz6TZkKLyQ0nT9ywa3fLIpRchbRWsy3RXlirWpcQogkpLLdauGzNpspXVvRV2TCqKNbUmHaLzhjMmmyxS2fgpUAofiZaF1FaIn2rEDL/8TLEze+OUb5m84j7xSsfLHH38hJDGRdPacI+k6BP4CkXpTyQBqY/hC/cihluw5AG75QkBGg0dm4j+dQQHW1+bvt5jI5k/LfI5p+xDdFu6WtCp5/zkNz1YoXrHy+zcpNDteaCFm8VixYeQUswrd3HAV9p4qg5QVpiGnTiGxih5z5iQzR41XZ07VtIMQlZPfSh5ZU5Z96cZkPKJR416UxGx65RAgE/Qgocx6NULjOazZEeLeB4LmYoTCjaOXaNUdelBGxFCxAC7Ewf6aEhfrBbmBvntz+PMpciw8uQ1ggfFLewN9rrRkgP0/32lpHSkWfclOWBFVV8JoQiEYxAM5YZAGGA1rheBa9axC7mKdUcupM+zjggxkHfjC3Fs5ZjhG9FyOxHZIgTgeEXPJuZxbLHAyttzvhLHuUppnYlmDG1g7Dfh+eB0ryFlNTvc8UyfRu3sGVoFCEgmOjEap6I9mhEgMajPLSWXK7I749PcvA3LFDxr2GEXuCDolP3ItS+2vboHfI48doMr260SfyrgBKTMPwRAMS/T1So60SDcis4hSHy2RFsV3PKXhHO+VGsKP2tM8HctMPGXu0UDsVJLYP0Q70Dw48uvr3Yc+DFI3z9/BSnXpfFrimQgky2yrr1A/QPZnA9jRCglK6b4zjgudAcDjF7l2nMmjkNKU1Ko/3Y+RRCgkA3BFEIA390JyxDjE1pBVxbgpRN/2OfAK/4TRh50rbTy8bS/OVfXJNl31+PcsAlw7w+4BALGgjtooppauVRtHIB0Gw1RYHWIKwg/pYpRCf2EA36uPz+HOfemgng5R7UTubi7Z8QrSOgDHT2nFK5tuDye3Nc81iBwRy0NQumTQjSnvBjSlEfaftSZbakHaQBE1qbmNE1kWRLHE/B20vr+seyJKl0nhWr1uEpj6a2GchgHBSNCEU5tY5SscTtp7Xx1VnJ74P/0fcwwQLtB5rQqoAsz3tmZfrKC+4qsrzXRgGRgElT0FfX4SqFbdvUajVA4AtEsJqT+MIJ0HJ8n5PgOhWqw+vJFKqcf0iMU/aLP4KO/QBhGCC87WOIW56Lzt2WyuH9dOmo+eCrJaa2Wxy7Z+tYc4szJRnENEwANJrhnM0L63L8+ek0T6wsYAlNz5Qk06d3YWiJ0jRgWbBpcIQVq9djWWFC7TPrqUE3bt4ubCa1aSOLfphg4SFde4H/Yf4bteE/It0DMKUBunrVA8XoBXdkglpLOpIROtpbaW5uwrJ8CEChqTk1csUiQ0NphkcyKAW+SAJ/rBNp+GG8KahaifzgWtCaOxYm7dlTzRxeaAFW9KbtlJDyIYVi5rajrkjzyKoKB36pmcXzuuhoDfK2QgHwjnuPB14e5bxbtrBhS5WezgSzPt+NFAZK0YBpwso1vQwMpAi2TMEfnQgKNFsR4DlFhvtWs/fsENfN71yEDl+KMLy3dbpJVG0qQviQQqpa5tI3Br3d1w96PLu+zPVPlrEk7DQhRs+0yTQFrHpqXQc0IAAhQEpAwGguz/p1m0jnChihAKHWHoQZRCgNiIa+WC0MMry5n32/GOS6UxKgwwswo5duH0Oo7H/WjW8uW3JfkblfjbL0lC6CvgDvD4/NaZufXPUGz68ps/PUOF+YOQPVcHyBIaFUqfD88n+gpJ/whJkIYTY0d+VVSfe/xhc6LZYtiCF88e9jND36th/F7widfdxVBne/WOFPzxZ5qdclV3BBCMIBAWjq3/0W7YkQkya10pqII7XGUzT80aYBrvJ47fWNjBVKfSIMt/WgDQuhBY24FIZW41Vq3LEoyW7Tmi9FRBds26auvSjkLnylN7fwhr9V2LXTx8XzJm81Q/O+0JJJibGKPnU6u3WHWLdxlP7+AQyTBjwFTeEgra1RnFoZr1YYp1QIgZQSxwWlTFCOf2u3jSonf7Yw7ZM2DGuOviLDsVdleGq1zW6T/Sw4qJ0rTujisuO6Of+wiRw5J05HAt7clOa5v7/OK6+urReDZYiGfbmeRmIwa+cpdExMUCvlqWQ3gmA80sQfbqFsOzy4okI9udt+ylJxdGn+zU9m98gWHU7Yq40JiQDUEbwvhACgNRLgknkdREMmazYMUixVkZJxtCRiCDTKLjN+BQEaBBqN2Nq061Frk0bxvDV9pcMPXTLCsuVF9tw1xJ2LpnHXWT2cf3gX876b5MdzEpy0TweXHDuN+86dydXzu5k9PUxvf4bnXlnD0GgGyxQN6ymtQcPMz3UTj0epFkbqU5h4p3YNZqAZy2/xYm8VlCe3vSFCRIoFEXxqrU1X0mL/L7cCgg/K7KkxjvteG8MFh77NQ4jGgkQrCIf8GFKiatV3l7X1BWgApLCHs9ROXJpmzYDHafu2csvC6czZJYGUFjCekN/Hfru38dfTezh97iQKVYeXVq5nMJXGMgHxH6YogWkYTO/eqZ5QuzCMVt54XUYQ0/IxlHYplMlsh4SI6oaUW+sbsZk9JcSEuI8Py1F7JJmcsNiSSmM7LkI0FBmWadY3rZTHu7U6LRqO1Vbwui68MzfWL5yxyS/KBUdPxmcavDcan2mx8MAOlhwzGUfBy6/1kskXMSQNKA/a4jHaElGcah7PLoBk3POSKSWFmqZoY20HQ3R6uOAWSramsz5RCT4sO7X8s707jbGrPA84/n/ec87dZu7sHo9tPOOYARvCEjaxhRDsEhoWoZQ0aRIalpBNbUUDqSht4UNJRGhLRYqIUrW0KlRpAmVRRFpCVKEQ1w6pBQLHxgvYscf22LPdudvce8857/vUvrIscCB4PHfsmcn8pEezfZnRX+977r3nzD1pLjutlXwhYrxYxHi8g1EBASRGlPcmAPTiRje9/tbgi0+unWg6s9fn3t9fCvhH+WdKfRTDpy5dyL2f6qFQdWzcuhNrHSIc5gAR6FnQidOYsFpEOIIBjMGpYlW7piEIZiIWowrpBA1z4alZIgvlUgUjHBtFQQM8yTy7vuKPlGI5eJzoakmhTI6ggOGLVy7huvPa2T1cYvfeITyPd3AOWlqa6s9bXFgCpxxJDw2oTkMQiQQi6oQGqb9yGxihUglRpkDAVmHdlpCFbR6rz2k9xt9UDn+8/bpuWlLCzgNBosiCcJgqJAOfxIEhjlAsiAL6ziSq0/paltBgmYTBGMU5x5SKGGG07PjVcMyy7hTLu1JMjXB2XyurzmhlaLxCrlDkyEORGIPn+zgFVQUEkNl1Tv1IiqDo1HMLFCdiyrWYrmafwPeZOmHV2R1Ya8nl8rwr5Qiz7CKHaVlyAoBzKupU8A0Nc0ZfiqZ0guJE+H67z9wIMjWKCBgfMLSIwQigNE5HJqA5AdUwwv3mIvNBMEI1jNmytyb58eqfT9RICwCNy+L5gjGCU0GPakXP9KtOpoMCqiRMzMCYcv3fDZFJSqYp8ADFCA2jytGG+G0KIr/+lfEJmrpxNiK2lmJoKYUhokJjKUfptyWIUGdA3rEbeaTae1EB9NDYCqM7N6IoM4EgiBFE5kgQrY9CHFIdH8AYD+MFiATgGUR88HyM8RHPgBoEAGFmUKiTuRLEYMQQxjXCsd0IoHgAiHGIORTDePUJjEHVzLAcBq2O3kKs38NvXzdrgoiAEUBAFHCQTiS44OyVRFFMGFmiOCI8+HkYUY1C4sjWfxbHB+bg1+JAhJlDQB0SlYahvTBrVogBrHOEsQUMYkCM4CO0JzOIgECdKjgFPTTOKrFanHOUSmXWvboDZQbRGJPq/j5+x8ZZESR2jmqsDOzLs3/slySCgJQv+EGCRFJIJ4L69xKJgCDwCXxzYAJ8E+B5cmAMKePje+CJQp0yw8isOYYsyBquPr+TQsVSmKhRrESUK5ZqoUwttoRWcQ5EwBjB8yHwPJK+TxAYEgmflB+QSgaIUCcizFYnPMipSw5eo3sKAJFVKqGjWLHkJ2JypRrD+ZixkmWkGDFasOQmLCOFkPFyTH7CUS5XGA/LhLESO6UWQrHqmK18TjgDhwSeEKQ9Wg7Mko4EkOHdnye7eoByzVKq2nqYXClmvByxZ9SSTVtmqxn9sPe9t19DwufAeLQ3wdJO5ozZ/eLiHDQfpEHmg8xR80EaZD7IHDUfpEHmg8xR80EaZD7IHDUfpEHmg8xR80EaZD7IHDUfpEHmg8xRhhOsWKmyY3+pfnawGoagFpi9Z/xm/QmqjbuqfO6hN2nL+rQkDW3NPh1ZQ2c2RVfWp7M5oKs1OPDRo+3AtGYM2aRPJuWR8A0gvCtVmIXn1icTREGURhOPWgiFslCoWLYPOeI4IrZ51AnGE0QUT5SkD+mkTzplyKZ92tIe7VlTj9bZGtDd4tOSSbKs2+O85a3MRpMIUvy8EC8UBFAaSdWxeEErp6/oo1oLiaO4PsVqhTd3DGKMj0llia0ljC2VapWRcoy1NWwME5EQhQ5E8Ixl1ZlNPHPXXA8S5lKEeVQEVGgUARRFcQSeIMkkkkriGUhXU7y5fQ9qEiQ7lpFUUAUVB1GN3P7N9HfBvdcTlqqJVzYNujP+4QVtTniz4FKBKR/UEwv/GRiSadq5UHAKzoG1EFvQ2B2OhQV1gIKoAeOBNSR8x+UrtHztZb2/e8MlqbUeAsy+Y8fkg1BZCKSUE0H5dYdSqeBCAYxoJLP+5hv+0fcY+gPQFuqEE00VUMUTRVQF6jObF8dRr5CZeX2mU5yDTAJMtvsOyORQDZjl/Bn7v13vx1aJY8vSDoVUdgP4gM7U9SGNXyHgH+/NyhlBAMGgwmEiEFbzOBXOX2YAuphhVLU+IKjqSOODmGCLIhxP6hyqwBExXBxSK+ToaTWsXqFgKTETqeKp4Il4jQ+SWPycERkGwakw3UQgDGNi68AEINRHRQnH91KYiLjhfMuiBTHEqswkAqIW5yxNaaUpRWY6jiGJbALfGEO+EtMoir7rYwYjUCiUsE4xyTQICBDm9pLPjXD6Eo8//lj6ZfzMs/jJHZwQ8p4H1yiuUYtilnQKzSniaQii0tOi0paG7YMVFIdgGhDEAuad2xLUV8bgcA7PD0ik27BRjVp+gMJYjq6sx8M3Kh3tTWsIer9FnQIIynEjAoqCKgqIvm1brYxhw5gPnyIQqGv8luVMtrfTS/f3KBsHKry1r0IjlKox7oh3bPMD2Ds0Qq5QJAh8ouIohb2bGRnKsaIHHv+SctZSh4YycETd6vF8ou6sq48YMCIcilFfHVF+jM6sx7VnAREt0xBEoyCj9ooVhn3jlh/+3yigTNW2PRGxUzKZJACBD7limW3b9xA7Q75sGR3aR2sy5M6r/BefubPrjrP727/q4uSzwCBvI0aNGLD2+BzjoigijmJ8P4mIDwKKI8ztpFCK+cylossXEmss+6djyyoQ2vIN55nMP72U4LEXc3z6w50saW/i2ChgWfNGjkTCo6OlBd+DodEir216i/Gy48J+YeVCx3l9Vj9yeus93Yv6vgkZAEzgvgtOeJvWpNCUgNFSRBQ7At9j6gwgqCoc8WbPY/kSYRiRbm5CfZAoppLbSX4sz3n9wtd+J3iN5LLfE2cTjV8h4oVK83+s7Ate/uzFsGUw5oH/3DuFs3vCuq0l1m4p09PZjOd7bNg2wLpXtrIvF3Hr5SZ6+vbsU/ff3PXJT67uP617Uf/9kOEwMSC+cpjQ0STjSzuVncNVdo1VaQSnMaqKZwQR6gSwTtk9OAy+h5duISrnKe7fwujwGKf1evqd29JvNGeSm1CTI2jZ0vgV4iVL0rridqLhm+5YvePCNZuFx36aY/mi3fzptYsBA5PYwGtxyN8+swdrIYxC1qzfzFgp4qRWj3uvV265PPEEmZU3ctQUk4xPvnC54aUtljW/LHDyqiYURRCO1Xg5plJTMk0eIoIDggB2DuwnXygRJJJUx3ZTmqjgFK4/1+Mbn9B89+L+1ZAcBAR0Gs+pS/rnXQsX3f3QTU2/WNTqcd+TIzzw9CDWuaN4nyoFwDnL3Y8P8NKmEhiPWjViWVvMXR/3Bv7rz4Lnb7lqwd/g9/wlk6EKkvnXa87ycq0pww/WjFKLImSKrzC/sadGoWbJNqfwDfUY+0bH2bx9D5XYUK44fK2xeqXw+K3CP36p6fHu7sX34bwI6hTkONxhJ97x92tfG/7alx/z2DFsufr8Jv7iE4v50Afa3nuVoOzYV+aeH+zimZcnuKBPufs6Q2+H+cmyJR0PpbMdayBVgIBJUwvVoYB4+H8/8117wXOvOR7+Qjc3X3ESHHMWxxcefpMfvTLOqotW0NnRWl8ZG7ftphLCV64QLj0F+ruc613gbxI/eIpE34P4zUWONP1BJs7Ary3c+uauf7nzyVrvixugtdnwsbNbuebcFs7qy9DVksQIlKqO7fsneP7VIk/+fJS9Q5aPnq65R25KrFm2tPnf8RY/BRnLlCjYEEzxoy9v2P3CDQ9HQXPK56mvn8wH+1o4Fmu3jPG5B7fSnMlwct8i9uzPsWt/nmRgDm6r5duu6b0NUoM4m8P5W/Caa4icwNvmqYPqlh/WKtEV3/+Fyz36M+1+fVeYtBG0Zn1amzx8MZQqMaNlSxgr/d1SuenyzLe/8vGeR5rSbbvBo6FsdRG1zZseel7b7nlaOeskj3+7fTn9i7KTPHbU+PSD29iwq0LK9yhVLcaDi5ZTvOta/8cXf7D9Mfze58AoU9DYIAAuTiKaRbyRSnHornUbdn3rp9sMm/YpY0VwVmhOw7Iu5aJ+9lz1oe7PdnUvfQkM08JW2slv2ozvdX/9Sct3/sdy+pIED950Epef0Q54gALynmcXxvI1vvrodl54tcoHeuCklpjTesy+q89tfvSSM7seDRItOyBBozX+PoZR7grifX+EZxRr4jh0oaq0+YEivjr89Dfx+tYznVwtpaVd9wq1C62NVn3jOcO3fxKTDODGj7TyxSsXcuriDOBxpMhafvzqGA88vZf120OuPsfXR/4w86OeVrOWTOejSPsQCO9jht7p80SrjlxM+a21JHyeWS/c/9/C6wMxPVmfi1ZmOK8/wwcWJGlKBuQnQrbuqfGzN4qsf6uKMfD5Syx/fUP6iWzXypshqPC+5oO834OOBYS5K1Vok6TJjAwNffmJda7/6VccG/ZAseoQwBiDdYqIsqD54KMmj1svi8dWn9P5JyQWfw9SHJ35IJNT3PxXSPG+alV4Y1B0614YyIurxdY1J4zf1yFy5lLL8gVmvTT33Iy/ZCOTMh9kcuJyGhcvxdCNJxFCBFoBiUHTIAmchrjEr/DTBSZtPsicNP//ITPM/wNU4MQFn2QN1gAAAABJRU5ErkJggg==
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1211834
// @downloadURL https://update.greasyfork.org/scripts/479910/Swagger%E4%BC%98%E5%8C%96%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/479910/Swagger%E4%BC%98%E5%8C%96%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('开始')
    // 优化样式
    let style = document.createElement('style')
    style.innerText = `
     :root {
       --swagger-left-panel-width:250px;
     }
     html {
      color-theme: dark;
     }
     #swagger-ui > .swagger-ui{
       width:calc(100% - var(--swagger-left-panel-width));
       margin-left: var(--swagger-left-panel-width);
     }
     #swagger-ui .swagger-ui .wrapper{
       // max-width:1000px;
     }
     .left-panel {
       width:var(--swagger-left-panel-width);
       height:100vh;
       position:fixed;
       overflow: auto;
       top:0;
       left:0;
       background: #1b1b1b;
       color:#f9f9f9;
       padding: 20px 0;
     }
     .left-panel .item a{
       display: inline-block;
       padding: 12px 15px;
       cursor:pointer;
       width: 100%;
       font-size: 16px;
       border-bottom: 1px solid #222;
       transition: all .3s;
       font-family:'微软雅黑';
     }
     .left-panel .item a:hover{
        // color: #49cc90;
        background-color: rgba(73,204,144,.6);
     }
      .left-panel .item a.active{
        color: #fff;
        background-color: #49cc90;
      }
    `
    document.head.append(style)

    //
    let leftPanel = document.createElement('div')
    leftPanel.className = 'left-panel'
    leftPanel.innerText = "liuwei"

    let swagger = document.querySelector('#swagger-ui')
    // 延迟重置主题
    setTimeout(()=>{
        let leftPanelHtml = []
        swagger.appendChild(leftPanel)
        let tags = document.querySelectorAll('.opblock-tag')
        tags.forEach((item)=>{
            leftPanelHtml.push(`
              <div class="item"><a data-id="${item.getAttribute('id')}">${item.getAttribute('data-tag')}</a></div>
            `)
        })
        leftPanel.innerHTML = leftPanelHtml.join('')
        leftPanel.addEventListener('click',(e)=>{
            let item = e.target
            let id = item.getAttribute('data-id')
            if(id){
                tags = document.querySelectorAll('.opblock-tag')
                tags.forEach((tag)=>{
                    let isOpen = tag.getAttribute('data-is-open')
                    if(isOpen === 'true'){
                        console.log(isOpen)
                       tag.click()
                    }
                })

                let target = document.querySelector(`#${id}`)
                target.click()
                target.scrollIntoView({behavior:'smooth'})

                document.querySelectorAll('.left-panel .item a').forEach(val=>{
                    val.classList.remove('active')
                })
                document.querySelector(`.left-panel .item a[data-id="${id}"]`).classList.add('active')
            }
        })
    },1000)
})();