// ==UserScript==
// @name Allocine releases finder
// @namespace Allocine scripts
// @match http://www.allocine.fr/film/*
// @match https://predb.me/*#to-close
// @grant GM_xmlhttpRequest
// @grant GM_openInTab
// @grant window.close
// @connect https://predb.me
// @require https://cdn.jsdelivr.net/gh/v-garcia/oleoo@b7d9fe652ba8dec5bc3afbcbf9ffcf0e7db810d1/src/index.js
// @require https://cdn.jsdelivr.net/gh/Nycto/PicoModal/src/picoModal.js
// @version 0.0.1.20190525002937
// @description Vérifie si des releases (warez) sont disponible pour une film donné.
// @downloadURL https://update.greasyfork.org/scripts/373539/Allocine%20releases%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/373539/Allocine%20releases%20finder.meta.js
// ==/UserScript==

const base64Images = {
  available:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAADAFBMVEUAAAArKytVVVVaWllpaWlqampra2tsa2sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADpGuVOAAABAHRSTlP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AU/cHJQAAAAlwSFlzAAAN1gAADdYBkG95nAAAAAd0SU1FB+IKFgEYBCwuNrwAAAAWdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjFM78X/AAAArElEQVRIS+2TwRKDMAhEa2vq/38x3QRLEacuHDr24DtkYtg34ERvMpi+0LTsIMLeYMI0a8D4CLrx4PC+60EEadFggsxhKirEHlwIRkLYTpURNj1SgjdyguA+1qmI4NHDcwXPJYC/FbAGRnGxAEgIbS31fUZY3qWeSwjIlwT8ayXhMVYLACIoFgCnC+V3kOdYC0L5HqT3sADgAgwLgIRw8LUecAkAzxRN/loQeQHkz7ZdC70aKwAAAABJRU5ErkJggg==',
  availableLowQ:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAACMfICsqKisrKy4tKzwyJUU6J0A7LkI9L0Y/L0hAL05BKUxEMFFDKVJIMFVLMVxQMnxlMlVVVWlpaWpqamxra3ZxZ4JpM5p/PZ2CPaWJPqeKP62MPLGPPbaTPrqVP72YP62OQLCQQLaUQbiWQb6aQsKcQMCdQ8afQciiQ9arROCzR/HBSvLCSvTES/bGSvnHS/jGTPvJS/rJTPzJS/zKTP7LTf7MTfvNWP7UbfPSf/7Xc/7XdfzXe+3Wne3WngAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKtwktUAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAFnRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4xTO/F/wAAASdJREFUSEvt0dtSwjAQBmArKiiICkUBBQ+IKIKKStcz7/9UYZOUJQ22u14wcOF/0WSS/5vNTDeUSS4lob12woBFwYFc1RYoc2A3bvCwsjCDASr0BQdU1XsVC/wZPPCEACRfJQGJGSLgChlQ+D/iVzHAjT1cLXDzDzBrC/DrxVzWqIARgDC+0nsJqM2udI8DW6b/B1B/O9YLFTCZoPAIDb1SAZMJTgEe8rhSAZMF9p7uL6ImbqiAyQJXsB/cjnbFoPQCO8E5XIrBNRgwKgnBwasF0BGCHsTguUwFTCo4HM8AdKmASQObd9iEYnCD3zEVMAngRvehf6bnwLcAfBrQPhnqJRIA04+2g5bZfLHg3fSgdTSwGxbY2jwfHFA/iUx+m8DGNpcNlJoCM1tyl/dfZrgAAAAASUVORK5CYII=',
  notAvailable:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAABsaGh8bGx4cHB0dHR4eHiEfHyQbGyQbHCsZGSwaGiwbGzAcHDkcHTodHiIiIiYmJiwmJigoKCkpKSoqKisrK1wnJ3M+PlNTU1dWVldXV2pNTWBbW2lVVXlAQXBTU2ZlZWdnZmdnZ2tra3Jubn1wcIA7PII8PYo3OI85OYw9Pp0+PopBQZRBQZ1AQYBycoB0dIh/f6dCQ6hCQ6hFRrRHSLJJSbhISbtJSs1RUc5RUttWV99XWOFYWeRZWudbXOhbXOlcXOpcXe1dXvliY/1jZP5kZb6JiQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHF5DHUAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAFnRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4xTO/F/wAAAUFJREFUSEvt0NdWAjEQBmArIoqF3dgLRXDtBQuCCiob3/+JxkmyxGwwZ8YLj174XyQ5m/87yWYCdEQgDbPthADjggKibgo2n8As3ODHrbEzCAANX1AA6t6tSOCfQQNPMED+VhyQO4MFXMEDsGFvRQA35uPvAjf/APNnAY5e9GbNFjAMUM221JoDaqMt1WMA7H8LVPXIAzPLQmwKEU+u2AImDOZuk1Wc4sXumi1ggqDYkfKuIKJSTw73GGDqXmKS2dIjTsN1Giz0FZAnPT2d0yBaGuiqzs2ogAn+Q1R+y+qybQuYIBCV8qvpX0/bAiYMovknA44KtoAJgli/j05iC5gccLNr3kfnjAEuTb/zosb0mAZXXdVsw7Z6q7RFA7hAge8P7wOZnjKuBNB8UH2A/edDHBkADrJ5Rw1fADKm+dMA4AOzrcVYYi4v9QAAAABJRU5ErkJggg==',
  frenchLang:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAAYiRAQjSwgmTQ4oSg4qTQYoVQQrXwkqVAkqVggsXhIrShItTxkyUgUwawUxbQowZQszaww2bwk0cgg1dgk3eA45cgk4eQs6fAw6egw7fA08egw9fhc3YBA5bhA7ciM6VRZCeh1JfihBXSlNdm0YGG0bHHAUFX0XGHAhIHMmJnUmJXctLXkjJH4iIktecw0+gQ9Bgw5BhRFCgRBChhFEhhVHhxBCiBFFiRJGjRNIixNIjhZJihRJjhRKkRRMkyROgSlThS1Xhypaki5ckTBZiTFbizFcjTBdjzxdg05tjWN2jmp1gWJ6lWB/n2qDn36Mm3WOqZEeHoYvL4M0M5skJJI2NZ04N584OKIaG6IdHqQaG6kaHbQeIL4dIL8fIaghIq4lJaA5OaQ9PLcpKr4gIr0qK7c6Obo1NL00M49YWLhBQbhNS7JTUrJZV7BbWbRaWLZdW7FhX7doZrlhYL5sa7h1c8EdIMIeIcIfIsQcIcUfIccfIsgfIsIgI8IlJ8QgI8YgJMMmKMErLcIsLcQsLcohI8ghJMgjJcokJswhJM4kJssnKc0nKM0oKcA0NMU3NskyMso6Os0/PtElJ9EoKdAoKtUpKtUrLdYsLtgpKtksLt0tLtowMNsyMt0wMN80NOExMeI0NOA3N+QyMuU1Neg2Ns1FRdBFRNFMStJgX8Z+feZMTORPT+hNTepOTu5OToaGhoiIiI2OjZSUlJmZmZ+fn4KYr4Ocu4yht4yjvZGgsJGkuJeqvq6JiKGhoKWlpaqrqq2trbKysra2try8vIiiwYmjxIqlxYuox4uoyIyoyJyuwKy5x8iUk8+amMqzs9C7u9u5uMPDw8TExMbGxcbGxsnJycnKycrKyszMzM/Pz9HR0dLS0tPU09TU1NfX1tjY2Nvb29zc293d3eHh4eLi4uTk5Obm5ufo5+np6evr6+zt7O7t7u7u7vDv8PHw8PPy8vTz8vTz9Pb08/T09PX29fb29vf49/r29vv49/n5+fz7/P39/QAAAAAAAHimQ4QAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAFnRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4xTO/F/wAAAr1JREFUSEtj+E8iGNVADBhwDY/Ory4tKSzIyy8qO3cJLIJTw7P7t67funt/1coVkydN6M/MSM/OyS0GioM0+J4FK4GDZ/dvXrt17/GzV28+vFm7eN7MaZ0NlfGpTRP7k4GSIA2yKp5e/tv3nDmzd2eg3+6rN+48fPbq7YePX4Hgw5pF82dM7WyoiIur62mOgGrgFFJUcnB0cnVz93Bx3vX85Zv3QMXfweDTukXzZ0/rbq8uL2/ohWvg4BMRkZYxNjWzsbG1PfbmHdDw7z9+/AaBL+uXLpw9Hayhsa8lCWYDv7CouIyMgZGpBVADWD1YNRB8BWuYgqFBRERSCqjBwsLW7viHDyD1f/78BYGfG5YunDN9Sld1FVBDK5IGcXGgeiMLS1u7Ex8+fv/xG6waCBAaqhqnoWgAWWBuYWlndwLkIIjxQPBzw7KFc2ZN6arF0CAB1mAN1PD5K8KCv782LFsC0lBTVdWOQ8MpZAvgGoA2YNFgYQl00mmgBqhqICCkwdrOfshowB5K1NAAjjisMY2iAREPyGkJiwZYxCGsAGkAJu82kA2oiQ+kAZI0viIljT+Q5A3MDxUVqMkbogEU0+DEB0zdf37/AecHRI5D1QBK3ibg1Prh4zd4/vkByqIzp3U3VpSj5Gl+EVFQ8gZnoBPADATKoT9+gPL0hzUL5s7obWwoRy0EgDkOnCEsrCBZ9DOwCPj29eP71y+eLG9JSUyIioqMjomtTwuHagAWAqLgLArM09agQuDDh3evnj64efTQ/i3Berra2lqaaqrqGkGhYVANzOx8wiKSMgaGJhYWVjuePnl4+/KRA1s3b9q87fCVi0B5MLiwL0snBEiDNCgzMrFxCQgKiYnJy8t5A5Vu3Ljl4DWwMkwA0vD/f4C+AjcLCysrD6+yz/7Dt8BiOABEAwlgVAMxgNYa/v8HABkzBp0quLI/AAAAAElFTkSuQmCC',
  frenchLangSt:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAACwrKycsNSUuOygsMigvOCcwPTIqKjsqKjQ0NDw8PAYiRAQjSwgmTQ4pTAYoVQQrXwkqVggsXhIsTBwvTBwwThozVBo0WR44WgUwawUxbQowZQszaww2bwk0cgg1dgo3eA45dAo4eQs6fAw6egw7fA08egw9fhAzZhU1YBE0aBM5bBs5Yhg8bRI7ciEuQCQxQiEzSyA3ViM6VSA5WRZCehlCeB1JfihBXT1IVilNdkIqKkssLFomKF8tLW0ZGnAUFX0XGGEmJ2YnKGIqK24kJm4sLXQkJHMsLHslJn4tLUJCQkpKSkhOVFNTU1tbW0tdc2dnZ2xsbHNvbnR0dHt7ew0+gQ5BhBFDhRFFihRJjRRKkSROgSlThS1Xhypaki5ckTBaijBcjjxdg05tjWN2jmp1gWJ6lWB/n2qDn36Mm3WOqZEeHoQmJ4ItLYwjJY4uLoM0M5EqK5wkJZwrLJI2NZ04N584OKIbHKkaHbQdIb4dIKsjI60pKqA5OaQ9PLcpKromJ74gIr4mJ70rLLc6Obo1NL00M49YWIN/f7hBQbhNS7JTUrJZV7BbWbRaWLZdW7FhX7doZrlhYL5sa7h1c8EdIMUdIcIgI8IlJ8QgI8YgJMMmKMErLcIsLcQsLcohI8khJMokJswhJM4kJssnKc0nKM0oKcA0NMU3NskyMso6Os0/PtElJ9AoKdUpKtUrLdYsLtgpKtksLt0tLtoxMd0wMN80NOExMeE0NeQyMuU1Nek2Ns1FRdBFRNdHR9FMSt5OTtJgX8Z+feBHR+FOTuVNTelNTe1OToSEhIuLi5OSkpycnIKYr4Ocu4yht4yjvZGgsJGkuJeqvq6JiKKioqurq7Ozs729vYmkxIunyIuoyJyuwKy5x8iUk8+amMqzs9C7u9u5uMPDw8XFxcnKyczNzNLS0tPU09XV1dnZ2dzc293d3eHh4eXl5efo5+np6ezr7O3t7fDv8PHx8fTz8vTz9Pb08/X19ff49/r29vv49/v7+wAAAAAAAAAAAGnNTY0AAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAFnRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4xTO/F/wAAA4BJREFUSEvtlFdQE1EUhr0aicTexRYCSkQUyahYEGxRiSA4CJoN9l6xV+y9d3cVLKDYFbsD9i4J2A2IYocoSBBD0AR3Jp57k8BGYUYfHF/8XzKz+3859+z5zy1l+kP9B35H/xzIen1z65aNG9at37Tt1TvypERAm6nJ0HzIvHHtyrGjhw+tWL5s9Zq1m+E5Bka9JJZCaTMz0jUfP2lzdXrdnfhzp2L3RtDhi3ceObQAXmLAtf2w4WPuPU5Le/Jg3OhH6RkfsrBXbwDp78SfP0mA8O37d820AFUbtG7Tf8DAIUOGDh086GHOZ13eV2zGyr8bf/5MbEx0BE1HHCgCHIRCF7FcLleAUr+QPzcaWaxvdy/GnTkRE83QdOTB3fOtQF2hyEnsAgQFAPETN8hgAaCCLeDo1Fjctx9FKUJTuX62IOFi3NkTx6MZBoA9HMDJCfyFgPk4WBZgXxTDRMbaAM6kABUKAKcA+z3hUtzZ08f3McUBfQnw4ivHj4ELGIhgmGgOUK+Fq7NYLGlGeUrseqkNbK4yICgzMQjU51Z3qVS6aKq3d5eJ3B54LZzF7qi5O/Jo1Q6p2CBBklKdFOJvH7LqKurg232JDHXzRmEcoAYSiWvx5B5loelAgc4vgBwrWMB+v87vCUeSoXCa78MBmiBXsZ2E4kmgh0SkVSG/FAz4AYB8pk2LkaGJ3dAUbtOlPUTIjUIEsNeyyf5IybIhpALfy2uvDHkhqc1XqsmrXVpO2XmEhj4PEuhhwgECa4UwmAMcqQeaxwWaIp6kH1UHtfLsjZT64Gfv/QKhAgb4YeYe5vClXMCxDM8NBteSxxOo9IZggX1gNsuqAtiC2+UmQYUJ5Wimq9dSDkAmLYe5KVLxoA1wKqKSs1QYjRcQbYsbhAFIaxRMulhAAVmyAazx/mUfirKEw1dEGDgbZwvgeMsJkM+JqxGv6KnYmEiattlp+ErmphUQjTwAYEONRrzTcAmcO3kg8udLoK5QaN04sqLmOyA/Lzcn+/LuhXPnzgLNnrNj6Qwr4AA7jQHzTgOh1+XC5fQsWZ0YJpP1AHXs2Knz+KnTLUDFKg4NhY3MTSjua7OzNO9T1EkqlUqdkv4W3hO9ebrSdzL8YqBt+QqVq9Wr30Akcnd3G4GtysTkdGL7VRgwmcb2blm9Eqh6rbYj1Ska8qwEmYE/0H/gd/S3AZPpBwuc/8lcdRUxAAAAAElFTkSuQmCC',
  torrentz2:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURS5kmDFlmTJmmTRnmTRnmjZomjZpmzlqnDprnTtsnUFwoEJxoUNyoURzokV0okd1o0h2pEp4pU16pk98qFaBq1qErV2Grl6Hr2KJsGSLsmmPtHGVuHSXunWYunqcvXycvXydvoimw4imxIqoxZGtyJSvyaG40Ke907LF2LTH2bvM3cvY5c/b59rj7N3m7ubs8unu9Ozx9e3x9u3y9vP2+fX3+vf5+/j6+/v8/fz9/fz9/v7+/v7+/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALvCqC0AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAWdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjFM78X/AAAA/ElEQVRIS+2P2VbCQAyGS0GBsVVkc+8gyL4oLrXSvv9zmaRhqKeklrte9DtnMpn8+S7Gsk+kFPJQZKHROUKLwwRGuI2OsOQwQZEFVw+0hjPDxU8PXwN9z2ECI+x5RmFb4VeaUkBYUI7hgpMYQbB8vGK2ZxwRkvBNu8RHTiEMw58AH681jghBsC+vlFLOHHr/jpMY6dPY1ibQBh6NDVnCMIT2haYHMoQH/MG0Go8NstD/gmZxzmODKLTf4V41eXpAEtwNXGvFwwSCUF9BfeteE3WOCEEYYd3tsEbRI0eEIIxpkzlZeOKISAnuDdBrYd3z5+sp4T9KIQ+FE2z7F5cQX0WPmC2kAAAAAElFTkSuQmCC',
  yggTorrent:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAC47RC48Ri49STA7QjE6RjE8RjQ5RjI6SDI6TDE8SDM9TDQ5SDU5TDQ8STY/Tzg5SDg7TC5DSS9ESi5GTTFBSjVCSzZBTTVHSzVITjRCUTJIUzdKUzVKVDVNUzhHUzpGVDhNVTlPWzpRUzpUVz1UWT1WXjlZXjtcXDxaXTxdXz1WYTtbYD9fYT1kaUBNWUBVXEBaYUBeZEBgX0JiZUFjaEVjbEJvb0VpakVvakVmdEJqcUZucEVybEdzc0dwdkZ0ckhzdE1ydkt2eEh3fkh5fUp+fk15f1J/fEtygFB/hk2CeUyEfVKDfVKBhlCEhleGhlGNhlSOhFKLilKNkFaPkFWbjViTj12Ti1OXm1WXnFadklKYmlWYmVWYnFmWmVqWnFmckVqcl1ibm1yZm1eilluklFqlmF6hnFqumV2vnF63nlegolmmoF+gpF2nqVusoF2opF+tol2prGWTmGCdnGCsmmStsGSzpmO9o2K8qmS/q2iwp2i2q2a5s2W/sGW9uGW+vWq8umW9wWTFrGHAsGbPsmfNtWrFtGzDvWjJtWnMtWjLumvLvmjNuGzLv2fSsmXdtGfbuGXcuGbdvGvQs2nStWrWtW7Vt2nbtWnauGravGjcuGjdvWzdvXHbtWTgu2fFxGvJw23Lw23LxG3MwGvOyGbewWbexW7Uxm3Ry2zTz2jdwWndxW3ZwmzZxG3cwGzdxWvZyWrdyWvdzW/bym3dyWzdzmvf02ve1Wze0m3e1Wvf2m3d2W7e3XHRwXDWzHbcw3PeyXHez37dz3HX0XDW1HDd0nLd1XDe23Hd3Hfc3W3e4G7e5HDe4WbgwGfgx2jgx2jgzGrg1mng2Wrg3mzg2Gzg3X3gy3vi1Wvg4Gzg4W3g5IjexIjf0I/f3YXgwobky43gzo/k0JXjy57lzJDg3ZXl3pjl3J3j25nl4p7o5qPlzqLozqPh16Xk2aXo0Krp2Kno37Do1rjq2qTm4KXn5KTp7K/p4qnp67Dr6bHr7Lns4Lrr6Lnq7QAAAIFIZFcAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAFnRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4xTO/F/wAAA1RJREFUSEvtkmmUDFcUx82Mqnqea0hw2hqxRM4MscchjFgSa2LfmbEbxL4GiSUhEXurFunWbR3G0sWMoiuqVNkZbexD25dB7MSaxdLuq+o5xwdzjM8z/9On69Z9/9+9dd97uYLvqRwgK8ruwKv//slMz0MWVAZw5+C5c6mZ6NCh86n+2yGjBfzvP2z4DSNgrgcCAcMwzqYaBv4MLIP/gbMn/c9MqwncNpjFzxiDuf0sSDUCJzFvxiwdCPyVAdzYpuvru/SMHaXretrq2Li47s2/aDZ4b/fYHssPDPu6TpNxq7vGddmXpqddsoCXGlMlSvL+dkI3WgGKJ0DKE67AmJrA4UsFAJKAnlNPTSAFC+vaFELhS1VbZyMURYgAkRDxMaECjwUo5RI0NGkM+DeNNTiR8hVQMkntIBA0RLSfOqoMdiEEig/9uU8xAC4hBV36DQQe3Lx1RlX/3L8iP9DPd5Si2IFrqWraT0RAgI7QtK19gXIrVQ2Tu82hg3sURVXVdgSEulgWQBguybLPFsmA7T6fPD0SuFWKqijKIxO4r2xmWlsSsCitzFNo4/V4ZoSjn5DvMYwXKDfPpxxXLlrbeswnm+rNExJR4MdCFAr2/2N8NLNTKPfdokEf4QzzfPKWXda27pJDgByFlgZHW0Me4MM4gQK1IcLnxk2m3BxZTn5hAulSSGuSq+H6DGljDBuEFMbjGF0Bt5fABxHAzZbXXEU/At6QX5JGYoNGRyVpY79aVco3/IEjwpBNnWpEVW08ADvM9Uqn09OvILAz0Wtpw6cECs/EQPo1yetNnEyJEJ88y+tJOtJNgPC5UiIakxB46LD83niO0Kb4nFiP/2bmhgkVCfCdP7N1XLhobFGgJZKY33ONDb3E4/CgFn8igG2Ww7MkGktzYVhUqFGEDxfCOLwctI3pcZu79ER0OByioxdO8C1Gy6aVoXjZIB+J/mUgTo7Xg9L6zLPYcdc6h+uiKLrcLWrXjvndjOa3rV70w9K1OrpcrmktokoULBsz1u3CFfGCdQ7B4DW70ym67fYFLCuKdtHudrncopOFGLGEaLfbLzOvCQQfO/H9HXLi96AsAD9raSifiZzXQ8YMAPXk3t17b9ffj0MW1BtA1pQDZEXZEAgGXwOihQJyBvbupgAAAABJRU5ErkJggg=='
};

const carriageReturn = '\n';

function limitPromiseDuration(prom, duration = 15000) {
  return Promise.race([
    prom,
    new Promise((_, rej) => setTimeout(() => rej(`Promise has timed out (${duration} ms)`), duration))
  ]);
}

function isOnPreDb() {
  return window.location.href.startsWith('https://predb.me/');
}

function appendMultipleChildren(element, childrensToAppend, prepend = false) {
  const fnName = prepend ? 'prepend' : 'append';
  for (let toInsert of childrensToAppend) {
    if (prepend) {
      element.insertBefore(toInsert, element.firstChild);
    } else {
      element.appendChild(toInsert);
    }
  }
}

function closePreDbWhenDdosChallengeIsOk() {
  const closeWindowIfOk = () => {
    const title = document.querySelector('title').textContent;
    if (title.includes('PreDB.me')) {
      window.close();
    }
  };

  closeWindowIfOk();
  // Just by security if window if DOM is updated by JS
  setInterval(closeWindowIfOk, 250);
}

function arrayToString(arr) {
  return arr.reduce((prev, currentLine) => prev + carriageReturn + currentLine, '');
}

function createImage(imgName, altName, title) {
  const img = new Image(32, 32);
  img.src = base64Images[imgName];
  img.alt = altName;
  img.title = title;
  img.style = 'margin:5px 5px 0px 5px;';
  return img;
}

function normalizeStr(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function createImageLink(imgName, linkName, link) {
  const linkElem = document.createElement('a');
  const img = createImage(imgName, imgName, linkName);
  linkElem.title = linkName;
  linkElem.href = link;
  linkElem.target = '_blank';
  linkElem.appendChild(img);
  return linkElem;
}

function getYggLinkElem(searchTerm) {
  return createImageLink(
    'yggTorrent',
    `Search '${searchTerm}' on yggTorrent`,
    `https://www2.yggtorrent.ch/engine/search?category=2145&sub_category=all&name=${encodeURIComponent(
      searchTerm
    )}&do=search`
  );
}

function getTorrentz2LinkElem(searchTerm) {
  return createImageLink(
    'torrentz2',
    `Search '${searchTerm}' on torrentz2`,
    `https://torrentz2.eu/search?f=${encodeURIComponent(normalizeStr(searchTerm))}`
  );
}

function getMovieTitleFromDetail() {
  return getOriginalTitleFromDetail() || getFrenchTitleFromDetail();
}

function getFrenchTitleFromDetail() {
  const frenchTitleElem = document.querySelector('.titlebar-title-lg');
  const frenchTitle = frenchTitleElem.innerHTML.trim();
  return frenchTitle;
}

function getOriginalTitleFromDetail() {
  const objOriginalTitle = getMovieDetails().find(({ title }) => title === 'Titre original');

  return objOriginalTitle ? objOriginalTitle.value : null;
}

function getMovieDetails() {
  const detailElems = Array.from(document.querySelectorAll('#synopsis-details .ovw-synopsis-info .item'));

  return detailElems.length
    ? detailElems.map(el => ({
        title: el.querySelector('.what').innerText.trim(),
        value: el.querySelector('.that').innerText.trim()
      }))
    : [];
}

function quoteString(string) {
  return `"${string}"`;
}

function log(string, type = 'log') {
  console[type](`allocine_release_finder: ${string}`);
}

function getTitleFromMovieItem(movieItemElem) {
  return movieItemElem.querySelector('.meta-title a').innerText.trim();
}

function getMovieIdFromMovieItem(movieItemElem) {
  const linkElem = movieItemElem.querySelector('.meta-title a');
  const allocineLink = linkElem.getAttribute('href');
  const [fst, snd, allocineId] = allocineLink.match(/(_cfilm=)(\d+)/);
  return Number(allocineId);
}

async function executeScriptOnMovieDetail() {
  log('Start script for movie detail');

  const currentMovieTitle = getMovieTitleFromDetail();

  const infosIconsElem = getScriptButtonsElem(currentMovieTitle);

  document.querySelector('.meta-body').appendChild(infosIconsElem);
}

function executeScriptOnMoviesList() {
  log('Start script for movie detail');

  const movieElems = Array.from(document.querySelectorAll('ol li.mdl, ul li.mdl')).filter(x =>
    x.querySelector('[data-entity-id]')
  );

  if (!movieElems.length) {
    log('No movies found in this movie list');
    return;
  }

  movieElems.forEach(executeScriptOnMovieItem);
}

async function executeScriptOnMovieItem(targetElement) {
  const movieTitleFr = getTitleFromMovieItem(targetElement);
  const movieId = getMovieIdFromMovieItem(targetElement);

  const movieOriginalTitle = await getMovieOriginalTitle(movieTitleFr, movieId);

  const scriptButtonsElem = getScriptButtonsElem(movieOriginalTitle);

  targetElement.querySelector('.meta').appendChild(scriptButtonsElem);

  if (movieTitleFr !== movieOriginalTitle) {
    log(`'${movieTitleFr}' original title is '${movieOriginalTitle}'`);
  }
}

async function getAutoCompleteResults(term) {
  // No need to use GM_xmlhttpRequest for query here as it's a same origin query
  const response = await fetch(`http://essearch.allocine.net/fr/autocomplete?q=${encodeURIComponent(term)}`);

  if (response.status !== 200) {
    throw `Bad response status why searching '${term}' in autocomplete`;
  }

  const jsonResponse = await response.json();
  return jsonResponse;
}

async function getMovieAutoCompleteInfo(term, movieId) {
  const autoCompleRes = await getAutoCompleteResults(term);

  const movieInfo = autoCompleRes.find(({ id }) => id === movieId);

  return movieInfo;
}

async function getMovieOriginalTitle(term, movieId) {
  const { title2: originalTitle } = (await getMovieAutoCompleteInfo(term, movieId)) || {};
  return originalTitle;
}

function getScriptButtonsElem(title) {
  const iconsCtnElem = document.createElement('span');

  appendMultipleChildren(iconsCtnElem, getDownloadButtonElems(title));

  getDownloadInfoElems(title)
    .then(els => {
      appendMultipleChildren(iconsCtnElem, els, true);
    })
    .catch(err => {
      console.error(err);
    });

  return iconsCtnElem;
}

async function searchForReleases(title) {
  const releasesResponse = await limitPromiseDuration(preDbSearch(quoteString(title)));
  log(`${releasesResponse.length} releases found on preDb for '${title}'`);

  const parsedReleases = orderReleaseByInterest(
    addCustomPropertiesToReleases(parseReleasesWithOleoo(releasesResponse))
  );

  return parsedReleases;
}

function preDbSearch(term, triesLeft = 3) {
  const baseUrl = `https://predb.me/?cats=movies&search=${encodeURIComponent(normalizeStr(term))}`;

  if (triesLeft < 1) {
    const err = `Max preDb tries exceeded for '${term}'`;
    log(err);
    return Promise.reject(err);
  }

  return new Promise((resolve, reject) => {
    const redoSearch = () => preDbSearch(term, --triesLeft).then(resolve, reject);
    log(`Looking for movie '${term}' on predb.me (${triesLeft} tries left)`);

    GM_xmlhttpRequest({
      method: 'GET',
      url: `${baseUrl}&rss=1`,
      headers: { Accept: 'text/html' },
      onerror: () => {
        const redoIn = 1500;
        log(`OnError callback thrown for '${term}', redoing in ${redoIn}ms`, 'warn');
        window.setTimeout(redoSearch, redoIn);
      },
      onload: response => {
        const { status, responseText, responseXML } = response;
        if (status === 503 && responseText.indexOf('DDoS protection by Cloudflare') > -1) {
          log('Trying to bypass Ddos protect by cloud fare');

          const openedTab = GM_openInTab(`${baseUrl}#to-close`, { active: false, insert: true });
          // One the tab is closed, the Cloud Fare challenge has been done
          openedTab.onclose = redoSearch;
          return;
        }
        if (status === 503 && responseText.indexOf('Service Temporarily Unavailable') > -1) {
          const redoIn = 1500;
          log(`Too much preDb query, redoing in ${redoIn}ms`, 'warn');
          window.setTimeout(redoSearch, redoIn);
          return;
        }

        // Check status code
        if (status !== 200) {
          reject(`Unexpected status ${status} for an preDb.me search`, 'error');
          return;
        }

        log(`Success for movie '${term}' on predb.me (${triesLeft} tries left)`);

        // Try to parse response
        try {
          var xmlResponse = new DOMParser().parseFromString(responseText, 'text/xml');
        } catch (ex) {
          reject('Unable to parse result');
        }

        // Convert to object
        const releaseItemsElems = Array.from(xmlResponse.querySelectorAll('item') || []);
        const releaseItems = releaseItemsElems.map(el => el.querySelector('title').innerHTML);

        resolve(releaseItems);
      }
    });
  });
}

function orderReleaseByInterest(releases) {
  const getReleaseScore = ({ isSourceOk, hasFrenchVersion }) => isSourceOk + hasFrenchVersion;
  return releases.slice(0).sort((r1, r2) => getReleaseScore(r2) - getReleaseScore(r1));
}

function addCustomPropertiesToReleases(releases) {
  return releases.map(rel => ({
    ...rel,
    hasFrenchVersion: hasFrenchVersion(rel),
    isSourceOk: isSourceOk(rel)
  }));
}

function parseReleasesWithOleoo(releases) {
  return releases.map(x => window.oleoo.parse(x));
}

function isSourceOk({ source }) {
  // We consider that screener is not good enough, but it depends
  return ['DVDRip', 'BDRip', 'HDRip', 'WEB-DL', 'DVD-R', 'BLURAY', 'PDTV', 'SDTV', 'HDTV'].includes(source);
}

function getBestFrenchTranslation(releases) {
  return releases.reduce((acc, { language }) => {
    const isFrench = ['FRENCH', 'MULTI', 'TRUEFRENCH'].includes(language);
    const isSubFr = language === 'VOSTFR';

    if (isFrench) {
      return 'VFR';
    }
    if (isSubFr) {
      return 'VOSTFR';
    }

    return acc;
  }, 'OTHER');
}

function hasFrenchVersion({ language }) {
  return ['FRENCH', 'MULTI', 'VOSTFR', 'TRUEFRENCH'].includes(language);
}

function getNotAvailableImgElem() {
  const text = 'No releases found for this movie';
  return createImage('notAvailable', text, text);
}

function getFrenchLangElem() {
  return createImage('frenchLang', 'French lang available', 'French version (or MULTI) available for this movie');
}

function getFrenchStLangElem() {
  return createImage(
    'frenchLangSt',
    'Fr subtitles available',
    'Release with french subtitles available for this movies'
  );
}

function getReleaseImgElem(releases) {
  const firstRelease = releases[0];
  const pictureToChoose = firstRelease.isSourceOk ? 'available' : 'availableLowQ';
  const imgAlt = firstRelease.isSourceOk ? 'Releases found' : 'Low quality releases found';
  const concatNames = arrayToString(releases.slice(0, 20).map(x => x.original));
  const title = firstRelease.isSourceOk
    ? `${releases.length} releases has been found ${carriageReturn}`
    : `${releases.length} releases has been found ${carriageReturn}/!\\ But source qualities are poor${carriageReturn}`;

  const onReleaseImageClick = evt => {
    evt.preventDefault();
    evt.stopPropagation();
    showReleaseInfoModal(releases);
  };

  const btnLink = document.createElement('a');
  btnLink.setAttribute('href', 'release-modal');
  btnLink.addEventListener('click', onReleaseImageClick);

  const releasesInfoImg = createImage(pictureToChoose, imgAlt, title + concatNames);
  releasesInfoImg.addEventListener('click', onReleaseImageClick);
  btnLink.appendChild(releasesInfoImg);
  return btnLink;
}

function getReleaseListItemModal(release) {
  const { original } = release;
  const liElem = document.createElement('li');

  const iconsLang = getLanguageImageElem([release]);

  if (iconsLang) {
    //iconsLang.setAttribute('style', 'height:1em;width:1em;margin:0;');
    liElem.appendChild(iconsLang);
  } else {
    liElem.style.paddingLeft = '42px';
  }

  const downloadButtons = getDownloadButtonElems(original);

  appendMultipleChildren(liElem, downloadButtons);

  const releaseName = document.createElement('span');
  releaseName.setAttribute('style', 'display:inline-block;height:2em;padding-left:.25em;max-width:calc(100% - 85px);');
  releaseName.innerText = original;
  liElem.appendChild(releaseName);

  return liElem;
}

function showReleaseInfoModal(releases, btn) {
  const [{ title: movieTitle }] = releases;
  const modalContentElem = document.createElement('div');

  const modalTitleElem = document.createElement('h1');
  modalTitleElem.innerText = `${releases.length} releases found for '${movieTitle}'`;
  modalTitleElem.setAttribute('style', 'margin-bottom:1em;');
  modalContentElem.appendChild(modalTitleElem);

  const modalListElem = document.createElement('ul');

  appendMultipleChildren(modalListElem, releases.map(getReleaseListItemModal));

  modalContentElem.appendChild(modalListElem);

  picoModal({
    content: modalContentElem
  })
    .afterClose(function(modal) {
      modal.destroy();
    })
    .show();
}

function isShowingMovieList() {
  return Boolean(document.querySelector('ol li.mdl, ul li.mdl'));
}

function isShowingMovieDetail() {
  return /^http(s)?:\/\/www.allocine.fr\/film\/fichefilm*/.test(window.location.href);
}

function getLanguageImageElem(releases) {
  const bestFrTranslation = getBestFrenchTranslation(releases);

  if (bestFrTranslation === 'VFR') {
    return getFrenchLangElem();
  }

  if (bestFrTranslation === 'VOSTFR') {
    return getFrenchStLangElem();
  }

  return null;
}

function getDownloadButtonElems(title) {
  return [getYggLinkElem(title), getTorrentz2LinkElem(title)];
}

async function getDownloadInfoElems(title) {
  try {
    var releases = await searchForReleases(title);
  } catch (ex) {
    throw ex;
    log(`PreDbSearch failled for '${title}', only torrents links will be displayed`);
    return [];
  }

  if (!releases.length) {
    return [getNotAvailableImgElem()];
  }

  const iconReleases = getReleaseImgElem(releases);
  const iconsLang = getLanguageImageElem(releases);

  return iconsLang ? [iconsLang, iconReleases] : [iconReleases];
}

if (isOnPreDb()) {
  closePreDbWhenDdosChallengeIsOk();
} else {
  if (isShowingMovieDetail()) {
    executeScriptOnMovieDetail();
  } else if (isShowingMovieList()) {
    executeScriptOnMoviesList();
  } else {
    log('Script cannot be applied on this page');
  }
}
