// ==UserScript==
// @name         Tvoj pomocnik k vacsiemu satniku od Tvojho (nie az tak) tajneho ctitela
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ♥
// @author       Tvoj (nie az tak) tajny ctitel :P
// @include      https://*.the-west.*/game.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488275/Tvoj%20pomocnik%20k%20vacsiemu%20satniku%20od%20Tvojho%20%28nie%20az%20tak%29%20tajneho%20ctitela.user.js
// @updateURL https://update.greasyfork.org/scripts/488275/Tvoj%20pomocnik%20k%20vacsiemu%20satniku%20od%20Tvojho%20%28nie%20az%20tak%29%20tajneho%20ctitela.meta.js
// ==/UserScript==

(function() {
    async function sleep(milliseconds) {
        await new Promise(r => setTimeout(r, milliseconds))
    }
    
    let isRunning
    let link
    
    async function removeConfirmationPopup() {
        isRunning = true
        while ( isRunning ) {
            $('.tw2gui_dialog_framefix').remove()
            await sleep(1000)
        }
    }

    Helper = {
        swapIcon
    }

    function swapIcon() {
        if ( isRunning ) {
            isRunning = false
        } else {
            removeConfirmationPopup()
        }
        const playIcon = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAA+VBMVEUREhT///8QERMODxEPEBINDhBXWFkYGRsrLC4WFxn6+vrz8/MTFBa2trfExMXR0dEbHB78/f0gISMmJyl8fX5FRkiCg4Tt7e37+/uOj5AxMjT4+Pjn5+e8vb3a29suLzEfICKlpqbS09NKS0xvcHGqqqtVVld/gIHl5eW/wMGYmZrGx8efn6A8PT4pKis3ODldXl/p6enc3d0jJCbX2NhISUqHiIlnaGmsra05OjuKiovKy8tQUVKbnJ329vbw8PBaW11yc3SVlZbg4OA0NTZkZWU+P0CFhoaxsbJ5envV1dUgIiO6urtNTk9rbG3j4+NBQkOvr7CztLTW4rTTAAABNElEQVR4nF2S53aDMAyFZdkpUDYEyF7NHs1q0t107/3+D1MCdoDqj4/12RpXAiIsMPXOj/FVEHfgp+l7rqVIzvT4V02TSs+lFAEAWU7qGgkxDxgDYUjdsc1Ja0IhbcwaxmT+kQUhcvSIPGEcJQkI9LsSkiM5cqFbZ5iw25AU47e5vdaNswtLvQDUC8qJbQ+6CmfYGMCiLv7sE6I2H3k6rQgjBxNCSH8tx+W1oWplCCHv8tbBHsBoZMjViadEfz6BFx0TezSTeA1r2KxEbQWyeFlS3ralA+kJMh/e73qlkz6Q82V0ZaWVlujD/FCDQpty9VOSlmpbRWun/7VGZRzPp3qYRajly3ymeommZKZSXt3tgXkt5RjPhtNmObU76vNMVgBRe/OKd9mtIuXXzlnevzQC4fgDVFAWr4egK8QAAAAASUVORK5CYII='
        const stopIcon = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAAAAADhgtq/AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAlwSFlzAAASdAAAEnQB3mYfeAAAAAd0SU1FB+gCGRESAXMF8TgAAAFcSURBVCjPY/gKBt+/P9o5oTS3fMr+Zz++Q4QYQMS379c7nBREhYWExZQ9J9//AZf59mG+uZCgsAgICAuKOKz7/A0i8+1VtZSgCAIIKvR++AaS+fa+QlRYBBkISfV+Bsl8nymJKgE0UmHdj68M3y8aCoE4CAAy0PH+d4ZvtSA7RDNmzYCAmVFgE6b8YLhlAdIivv7vTwj4Ox3EF/R+zrBSGqREfO1PiP++/pwKNlzlAEO1MDYZEbHpDHFCWGWEqxlCsMsIFTDE4NBTyVCOw57JDEuksLpNaQ/DNROs/nF9wvClFBwGpWtXQ8DaVJDxwr0/GH6c0gYpEhWDAXBEWN36DoyfPjGMsJZZ/B0UP6+zhVGlhMXqP34Dxen3p9liQigRV/vmGyQdfH/dpyMIkxMSMpn34Rs87Xw7XWYqJSwkJCQiY9145fs3eKr6+vXH1+vLquLDk+rX3PkGTW8AdUAd5En/MSYAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjQtMDItMjVUMTc6MTc6NDkrMDA6MDBYENZsAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI0LTAyLTI1VDE3OjE3OjQ5KzAwOjAwKU1u0AAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNC0wMi0yNVQxNzoxODowMSswMDowMDj2VB8AAAAASUVORK5CYII='
        const menuImage = isRunning ? stopIcon : playIcon
        link .css('background-image', 'url(' + menuImage + ')')
    }
    
    function createMenuIcon() {
        const menuImage = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAA+VBMVEUREhT///8QERMODxEPEBINDhBXWFkYGRsrLC4WFxn6+vrz8/MTFBa2trfExMXR0dEbHB78/f0gISMmJyl8fX5FRkiCg4Tt7e37+/uOj5AxMjT4+Pjn5+e8vb3a29suLzEfICKlpqbS09NKS0xvcHGqqqtVVld/gIHl5eW/wMGYmZrGx8efn6A8PT4pKis3ODldXl/p6enc3d0jJCbX2NhISUqHiIlnaGmsra05OjuKiovKy8tQUVKbnJ329vbw8PBaW11yc3SVlZbg4OA0NTZkZWU+P0CFhoaxsbJ5envV1dUgIiO6urtNTk9rbG3j4+NBQkOvr7CztLTW4rTTAAABNElEQVR4nF2S53aDMAyFZdkpUDYEyF7NHs1q0t107/3+D1MCdoDqj4/12RpXAiIsMPXOj/FVEHfgp+l7rqVIzvT4V02TSs+lFAEAWU7qGgkxDxgDYUjdsc1Ja0IhbcwaxmT+kQUhcvSIPGEcJQkI9LsSkiM5cqFbZ5iw25AU47e5vdaNswtLvQDUC8qJbQ+6CmfYGMCiLv7sE6I2H3k6rQgjBxNCSH8tx+W1oWplCCHv8tbBHsBoZMjViadEfz6BFx0TezSTeA1r2KxEbQWyeFlS3ralA+kJMh/e73qlkz6Q82V0ZaWVlujD/FCDQpty9VOSlmpbRWun/7VGZRzPp3qYRajly3ymeommZKZSXt3tgXkt5RjPhtNmObU76vNMVgBRe/OKd9mtIuXXzlnevzQC4fgDVFAWr4egK8QAAAAASUVORK5CYII='
        const div = $('<div class="ui_menucontainer" />')
        link = $('<div id="menu" class="menulink" onclick=Helper.swapIcon() title="Tvoj pomocník, Lady Moja :P" />').css('background-image', 'url(' + menuImage + ')')
        $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'))
    }
    
    
    

    createMenuIcon()
})()