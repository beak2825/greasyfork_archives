// ==UserScript==
// @name           Back to Top figuccio
// @author         figuccio
// @namespace      https://greasyfork.org/users/237458
// @description    Aggiungi pulsante per tornare all'inizio di ogni pagina.
// @version        3.1
// @match          *://*/*
// @grant          GM_addStyle
// @run-at         document-start
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @noframes
// @icon           https://www.google.com/s2/favicons?domain=greasyfork.org
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/381479/Back%20to%20Top%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/381479/Back%20to%20Top%20figuccio.meta.js
// ==/UserScript==
 var $ = window.jQuery;
 $(document).ready(function() {
 $('body').append('<img class="toPageTop" title="Sali in alto" style="position:fixed;z-index:999999999999;bottom:40px;right:20px;cursor:pointer;border-radius:100%;width:70px;height:70px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABINJREFUeF7tmkFy2koQhv9W7PeWT3CBQFXE9vmdIPYJQk4QvIxYBJ8gzglMFihL804QcgKTE8TZIleZdwFQlrFd6lejWCmFCNQjzWBTwI6anp7ub3p6emZE2PIfbbn/2AHYRcCWE9gtgS0PgF0SXNsScM+uXezfPXee4AAxN5iokY0+Yp7CoWnMGOP73tfopBmtIzqtAnA/XDcQ374goENEBzoOMfMlA0M4+5+i182pTl8dWSsA3A/hoRPzKxB1dIxZKss8jIH3Ubd1aURfRolRACrMnT9uz4w5vuitAnGzf2JyeRgD4AZXbWI+J4Jrepay+pgRMdFx5D8bmRjHCIB6EJ4B6JkwSENHf+Z7JxryuaKVAdQHk3NrIV/kHfNw1m0dF4mtaq8E4EGdT72qCKE0gEfh/E8I9H7WfVZqCZYC4A4mHYfovErome4bg16WSYzaAFRxQ/HdF9vZXhdQsjvc7DV1t0htALUg/EhAW9fAdcgzMJr73kudsbQAJBUe40IyADP+A8FMCctoEOGpZNyYcBS99sYSWSWjBaAWhBcEHBYpZ/DXud/Sqv2LdNaCySWB/i6SY2A8972jIrm0XQzAHUwOHKIvUsUA+iCYOdFxUl2Ks3xMe03pAUoMoD646oP4jQaAhxNl+bYoBlALJteEX8/wVT2MgaSUdQBVShv7MXg691tNiUIRALX1OXx3LVEolYmZj6Nua6jkbdQV0mUgA2C48Mk6nwIzDSFvjLzJEQGoD8JTEN5KZ3eVXGqYSqpZOXXZYRQC492s650W2SwCUAvCMQHPi5QVtWedJ9AFO0iKForxkcFHJiEw49O86xUWbGsDsOi8KqVV0ZIkQcZFUsoahMDA57nvFdYsawGQ57xyPAtA/TcJ4dEAWOZ8HgCTEB4HgPuCRCU8teYXT5CLEZDmkGwklC3AHgWA5G6fnD4x9/OOz8sA/IwEoh5x3NN9U0j6m8wBZWehcFfIJMEiWe12k9ugG4Q90+Xqshyg7eiSDqrMjnyvX6RPtAuUOAkWjZu0r1oCIgUrhGLmfyQvSSIAapxaEEYE/FXVsGx/WwDUZcy86/3y+LrMbjGAejAZAvRqEwDAxnHYxjKwFQHS8E/KcJ0ZlV5LSXXaACDd/lIbtQAYPa0lezUnl6YmL1qsXoreJ0MjJ0NplOjI6c6+9hJQHWzkAh0nV8lKb4GyOrSWQNrR5AWJMeeFhc/ieKUAJEthEI6I8MKUA9X08L8zv1Xqc5zSANTnMPTn7VjyWFHNudW91SMMf98/1H0TLLULLJry0BCqOl8qCeZDuBuZuDPUiRR158c3e52yM28kArIGrzUxCo+6EqClc0Ce8uTmhzC0lRfUPs/MPckpT+K8kSWwBESHQKfSJ+0iY9XpjsGn6UtSkbxOu9EI+C0/BFdtB3GbQW3dozQD3wg8iuGMynz6IoVgFUDWiB+fz+IQxA2+f2RNE6cK7R/hyFMwTWMHY52PHKTO5smtDUAVI2323QGwSXcTdO8iYBNmyaaNuwiwSXcTdO8iYBNmyaaNWx8B/wMj7yxftxxt6gAAAABJRU5ErkJggg==";/>');

        $(".toPageTop").hide(0);
        $(window).scroll(function(){
            if($(window).scrollTop() >= 500){
                $(".toPageTop").fadeIn(4000);
            }else{
                $(".toPageTop").stop(true,true).fadeOut(2000);
            }
        });
        $(".toPageTop").click(function(){
            $("html,body").animate({
                scrollTop:0
            },3000);
        });

    });
