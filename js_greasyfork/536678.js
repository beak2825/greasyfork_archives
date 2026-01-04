// ==UserScript==
// @name         FuckImage
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  摸鱼大法好，隐藏或缩小页面中的图片，别让老板在十万八千里外就能看到你在摸鱼！
// @author       zheng-kun@foxmail.com
// @match        *://*/*
// @grant        none
// @exclude      https://lanhuapp.com/*
// @exclude      *://localhost:*/*
// @exclude      *://*.*.*.*/*
// @exclude      *://*.*.*.*:*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536678/FuckImage.user.js
// @updateURL https://update.greasyfork.org/scripts/536678/FuckImage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let imageArr = document.getElementsByTagName('img')

    let currentWork = null // 'hide' 'show' 'mini'

    let timer = null

    let miniSizeDefault = 50

    let color = "#f4b579"

    let picture = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADXUlEQVRYR+2WXWgcVRTHf//ZUkOVWlR8qyiCtT6IWogkGEi1xVgzG7XqQxEpReuDzWykKBgQU/GDSrXJbIu0ojUPChVBurPxZYUaUVpBUChq8KFWKogiFLR+YLpzZLa7m83u7M6OCgHxwj7suefjN+eee84VS7y0xPH5bwLY0a09nL3oSlT+U8OvnOyU5X8tAxaM9WE2hGwI6F0IaofJ8Iw25b+MA2kBsGLuEGb3YDajbH5LO3o7kltDhluwcCPGENLF7b9UX5AJ74+DaAUIvDPAqsiZXL++b8HOy2B+AGMAMQjcmKqAjYPK+o8028QA5F4Ee7wGYDO5YULbDtwGrEgVtFn5nHOV7p481SiOrQEreAeQ9RDqGxye/kdBG41DtmrEn44FqFduRk50VhZ4zwNPpg4uTlFmGke9YHc02R+S629rAbBg+wro+ah+rsZriBuAdakBCNfL3fdBZGeBZ032J+X6V8cA7BgE52h14zcsvBc5b9WKMRVEyC6N+BNWzN2H2dsttmZ9yuaP1+QNVe7tBuuFzLjcyWMWeJ9BJQvpl9lppNXxhvaU3PyzLQDNyhZ4rwIPpY+eaPG+XH9jMkAhtxnZO4nu0iqIeS78eaXWv/FH5aq3s7d3x1axLIyaUvwK2YXDTYCblgEsKzcfdASoVvGHwEBMgDfl+g9UdaI+MYFxQln/egu8J4DdHaFEXsO+lwxQzI1j9lyrs4WrVgeV9mh4qlD5XxzdiWlPB4g5uf7aLgC8foyPWxw55TW6c//XNbm9N3od5eU/yn3pp7os8ErAhrYQy5ddodtfPp04jq0w+gPS5YschWdXauT1Xzql+Xw7J5oh7Yqo0rCSAYLcNNiDi72Ea+Xum2tbwDOPXsO5zJbOc+T8MXYBMPow6GBTsHG5/guNssqDROGtmG0AReO688rYam3Kf9cFwI5rwfmqydvnED5G6Azi0FedGZcmxVzY1zG5U/2JRdhQUJ/+vcEUh7T4dZSYgcq1KuT2Ihvr/gtjNecIOcwFzgENTX5f0+gOoOitw4iykGb9CsxWfmXN6q6pT2Lz0a1HO+JNJL6OjBPIZpFT4hKnpP69vyf57yoD9VqIIDIMYdxclZ3BiBpOiflySZv3f5sUsHk/FUBa593o/w+w5Bn4C1EWMDB0nCvtAAAAAElFTkSuQmCC"
    let activeShow = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADPElEQVRYR+1WSYwMYRT+Xo3l0NUzV0cSToQIMnMziK2rGhdHgoglggiiq0Zi779jiS0kiNhuLkRPlZkQ6RsThIPlMBIOLi5CuhqHrnpSS5ea7urpapeORJ0qVd977/u/t/2EDj/U4fj4T+DfU8Ay9KUgXgZgNhhziGAD9JKZ3wP0WFbyj9qpq8QKlIu5wyTRKgBzWwR4xQ4/SGcLh5MQaUmgXMz1UxcdAqM/cPgZwFNiLnVJE4Z/UtXuctAvQVoIsIuZ6uEIJbb5SDpbKI1HZFwCFVPfxMzXfX8Ysh0c7c6Kp+M5/GEO9NlsnyVQn4tjxyPRVI2mBMqmfoWYt/jBWMhKQU8iaQ1TNrR7BKwJ7A1ZKahx9rEEKoZWZMAzcMAbu5XCzXaC17AVUz/OzAPeEYiupjP5rfV+GghUTO0yM7Z7shNlUpn8w3qjiqGpDlEWDi/2/kn0RGIuphQxWI+1ivoSSPzYI8G8I60WLkcxYwhYhr4b4HM+GBfTqthV7zDohkNxijTLt2Vo6wDcDmzWy4q4U7MPCfwayk2v2jQaVPAtOSM2NJ58YD7DeR5g3sKhvb4CfAaMmX6xSgtSyokXDUqY2ikw9rnfJxJmTs6Idz4+eH6Y+k6H+YLbPnJGLIo7oWXoNwDeQMBIShFelYf5NrRnDPQCdFNW8hvj7TWX2LyoUiEBywh/LmrWu5ahfXT73Ab6ehQxEg3y3dB6u4BnAD7JipgWR6A8mFtLRHdBeCtnxKwxCiQhUB7URokwHUwrZDU/HA1iDerLQTzEjA9pVcxom0CSFISzIXKCWiDL1N64ddCs3Vxc5JDhcIotQgaupBWxrbEINZWBYiDdSBXY7b5PAM77+feKKhvXjmVDO0bAwaZF6DP804Zg7JdVcbqexN+0YcXUVzKzGfiKb8OwmiODCFWaIq/Of2lUwm1H3hEsH/fcJQJdimu/r3cP9ExKSd9cHy0HUaSlwlEM0FxZyb+OK6pW39yJWUtZ4lFcczpmGTH2yKrwJmTSp2zkrhFos4/n9pbRn3SMWcf3bQcnk6xjB46o3R/+eh2HSnTyQhKVu2NXsvqcd+xSmrT42sW1vJS267Bd/H8CHVfgN5IXuTAYMDQeAAAAAElFTkSuQmCC"
    let grayShow = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC/ElEQVRYR+1WPWgUQRT+Zi+pbS0jxCqiBJWkivv21l8SsbFUjIg/BBVRGxVMVAj4g38YiCJG7WwU40/C3e2bLgYVLYwWClrY2FmH7D2ZY/bYbPbu9tIcQqYZZua9N998728UWjxUi+/HCoD/j4Fisbg1l8ttU0qtF5ENSqkQwEcA3xYWFoq+7xeaiavMDJRKpWHHcXYD6G5wwadyufwyn88PZwHSEAAzuwAuAjCzGb9FZMZxHN3e3j49Pz9vGDBnW+zcYeU0gBEiMnPNURdAEAQHlVIPrfZUGIaXfN+fqWeQmXsB3ARgZpTL5ZF6bNQEoLUeF5HDxoiIjHqedy4LpZEMMz8HsMeuXxNRf5p+KgBmngQQKQwS0UQzl8dAXAFw3qyVUvdd1z2StLMEgNZ6TESOWaVdruu+TSoxc79SakBEPCsXiMgkEb1KygZBkFdKFS2TQ57njcVlFgFg5pMAblnhu57nnUgatNlggnLJqOXvUqm0z3GcJxbsftd1n0bKVQDM3Anguz14TEQHUl6+CcB7uz8nIqet0RsAuuz+ZiL6kKJ7DcAZs5/L5br6+vq+VnQjQa31cRG5A0ATEaW9kJkfATDAZomoEuUxf78D0ANggogGa+gbYBvjTMUZqBwCMPen5i4z/wTQISK9nufNxi8JgqBHKWVA/CKiNWkAtNZ7ReQZgDkiWreIAWbOAsC4qFNEdnieN50AsF0pNQXgBxGtbRpAFhfEakP1BTEXfDFxUCvdjFz0yFouiAfhOBEdTQkkUxtMjTBjVkRM1pgcv239b5YDaenIzJcBXKgZhBZhNQ0BnCWi60kQy0lDrfVOEXljwaanYSwbqoUoDMPVvu//SWHCpONQrEGZoL2Xln6FQmFVW1vbX2NDROoXopg/46W4m4g+pwVVoz1TMSOXZS7FMSaqzQjAKSKqVMisg5kfADhk5ZtrRtEliXb8IgzDqxnb8WjknmW345g7WvchidPdsi9Z0uct+5RmDb5m5Rp+Sps12Kz8CoCWM/APB3+VML3WjUEAAAAASUVORK5CYII="
    let activeHide = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEb0lEQVRYR+1WXWhbZRh+3i9Np+SkgijOi8IEp7DKpP6gF4qdrNXmpHMKDbrJ2ET8mdTBHJqTjW6zmnM2nJUNhlNkG1OEerGx5Jx1WGxB2SZOiroqs8KmDN2VjCbpWtN8r5yTk5icJmm6C3uzD3KR77z/z/O+70dY4EML7B/XA/jfKpBKRruDYeMLL+TzDiBtxtpB3AFgORj3Apgh4FsAoyCcC4T0Y14naTN2EOD1zBzxBlF3AKlEdAcJWgWgdQ7i/gTQQUWN99tyaVP7DMAaMKy0PxtZ/MR7mVL9OQNIJaJt5KPtYLS5ipcAnCbmEZ9oOJlFbgI5bhGEZUz0NICVrtzvAH4F0M7M34gGEQk8Gf9rXhBkrNgLzPyJrUTAYE7i7aYu/XStCmSS0Y1M1AvgNlfuRylykabO3ecr6VWtQMqKHSDml/JKrCuqEat3ZqRNbQBA93/y3K+oxua6A8iYWoKBsK0gwRuaVOPQNTgfZKbDRPy5q3tEUfV1c0KQsbT9zHjVKTtRKBCKn/AqZUwtLIm6IPlxEpj2A5FFIf3nksy/vjqTU299aneqFEaWvDPYZeyoSsK0GdsE8AdO0Rn7gmH9da9ztxu2O/eEsQrOR//JydU3r9r1R0G3zK7kFcEuY6TwrciBqcHonTM5GncNH1ZC+vrZmW99gCG/c++HGvy+jTd0vDNeinmNqm1joM/uiMsis3JpaN+0S+68uUkr1iOZ94IwooT0FZUwLw4U8IdB1XBgKjonjIHRUq1yruxZAPcDeF9R9TfKAkibmvORPSUqDSRtahdAyJCgdrunS53bUGQZY8z4LRjWl1ZKYMLSVgvGUQCXFFVv9gZwAcCSmgFY2rlZmLs8mGIEfcAZABcVVb+jUgD2PiCiAZs7Ski/xxvAHgCba0EwbWnLytheQsKMqZ1h4CGADilqfENlCItVLnZDkYTjVs+ixTIwRESPEHFvIGT0VTGSHzKu86ykZgjeY+Ofz0g8GFDfteEsOylT6yNgm33pJ7TYiZRVwP7jzH1Bw44m8xYlbNhVKZ7ZE67cSaU+tyUyVqyTmS1Xep2i6kcKmrNGcWmfM/BKUNUPlLEdOEtEvVJyJwD7Bwj6SjAnAqqe9Gb+98BbNzUGxJV8TvxaMGzsL5WpuAvSSe1TENbmBXkN4Gy5bgaGhb/x+UDHzj8rweO9sycmAwnHCtFHwVD8Za9M9WWU1PYSoaegwIzjVyannm2O9F+tx3nKjH5MoBfdJExFNZzdUncAEyfevFtIn0245a7SRclybVN416laAUxaWx+WkHrh/VCNF1U54JBmMHa7nJEDdkcw+BRAtxBwl4vjUZ8Qw3JGngeLH7KN8kafRJuAeAxg+9GyxDFOGOGcs3yKc7+uClw+uSWgZP32sAjZczsYNh7NkzD6HECb4PR6zTPKko97t141jdldUJhWDEsJ66pXcTKpPZMD30egVhBaicAAfc/MvwA0pKjxL+vhSE0Iqj2h52O4Xtk5H6X1GrpWuesBLHgF/gWivBE/HuPBTwAAAABJRU5ErkJggg=="
    let grayHide = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEN0lEQVRYR+1WXWgcVRT+zkwGE0R8EcSHgoI/0EjFP5SwbubM7hqSVmmFBm2ltEX8qVRBfRKprT70qVYqFKtIW6oI8aHSamzIZu7sKlaxEtRWqRWsIvoqSgklM/fIWWbDZDKbbPpgX3phWZh7zj3fPd93zrmEy7zoMsfHFQD/WwaiKFrv+/5HecqXDaBer9dc132QiFaJyB0AYiL6WkSmAZxm5o/zQYwxBwFsJqLRPIiuAUxNTe10HOdhAHcuIdwfRORgEAR71S4Mww+IaIOIjM/Ozo4ODQ1dyPovCcAY4wN4FYD+6/pDRE46jhN5njeRJMk/SZL0E9FKEVkHoJra/QbgZwA1AF+4rjtaLpf/WhYFYRhuJaL3UqcTSZK8Vq1WTy6WgSiKtonIDgDXqx0RfW+tHQ2C4GyRX8cMRFF0QESeVCcR2R0Ewcvd9owwDMeIaH3bXkT2BkHwQtcAjDHHAaxJHbYw86FLCH4CwGEAH6aZOOL7/qYlKYiiaL+IPJM6jfi+/1mBqtcQ0UMiEgC4mPL7Y+bmn3uet7pUKv3baDS2WmtbNFprd1UqlZ0dRWiMeR7Am2na3wqC4Ll88LQaVJS6zhQEn47jeG2tVvu97Zs9FwAzc9Tem9OAMeZmAOfSjcPMvLng5vcA+Cb9XnccZ9vg4OC5LOdE1ClrrwB4XStiZmamOjIycrGV5XaQKIq2i8g+AJFCLOK83VAAvM3MLZoywc8A6BeRwsyprTHmFIC7iegN3/dfnAegvZlPURaIMeZXABdc161pTWeDKxVJkiiIX5j5lg4XWAvgqPYSZl6RB6CH37gEgNMFnLd0EMfxNUT0FYDzzHxTEQCdByIyptph5tvzFOwREa3VjhQ0m82V5XI5q/Y5ERpjNPh9AA4x85YOGWhRkK2GOQ2Mj49f1dfXVwdQIqIdvu+rYBasfNrjOF5BRHuU/9T4XmbWQPOWMUbPUyHCdd1+vci8DKQi0X5vUs+XmFkPnlv5DpcPUlTnahNF0bAOo1ZAok2+7x9p+y5oxbk6f5qZD+TUfkozZK0dJqLh9NBQRI4z8yd5UJOTk9f29PT8rd9F5NkgCPZnbQpngTHmfQAb1dBau4GI1qW93Xie93ipVPqziJ6CtGs717auN3/H9/2n8jYdh1EYhvuIaHvbQUSO9fb2PjowMDDTZfB3ATyR2n7KzO3ZMs99MQC3OY4zJiKrUo/z1tqNlUrly8UAGGPuB7C7/X7opIuOGtCNZrN5Q5IkWq8lEdGA1xHRranTUSIySZKcFZHvXNftS4MNpv/aS1raA7Ar2/eLgC/IwMTExNWe5+k8H9G+zcwPpEp+TER0WGmtL7amrbXH8lOvk8MCAO1upWUTBMHqvGOj0XjEWnsXEenbUH8C4FsAP8VxXK9Wq5PdaGRRCjo9oZdzcLe2Sz5Kuz3oUu2uALjsGfgPCbL6MNqJu+kAAAAASUVORK5CYII="
    let zoom = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEkUlEQVRYR72Xa2gcVRTH/2c2pbUzu7YVbdV+UFFERW2qYuuzKgadu4v6wdBSrQ9s4jdfNZ3ZKGmx7h0aS1VEsVVaHwhpS9FkZxqxoFKpfjAQS1QiCkqJGGypTWYLNtk5MrvZ3dn3bqouDMzd+z/n/O655z6G0ODPtePLwLyKCLczcAmAxTPPOAD/GQVT/xTRoYXi5d8adAuqJ0w5Rit71AXC6nraQP9WzzvdG4ltO1bPpibA5ICxSVHoeQbm13NU2s/gUQasiLB217KtCpCyjR4GbWo2cLmedmsi8Vg1PxUBUsn4ISa+pYLRZwz8qDB/D2BIjVpD/hSlPVoeIrQycCuAa8rt+IAmLL0SRBmA65gHwbirVEyEDlWXO2tl5ORgz6JQ+vQbANaUTYnHm8MxqyyjRQCTTvxtYu4oNqZRmjN9p9q29fdGp8N1jLVg+rBsEMydatTaEfw/D5BKGtcx0bfBTgYmwkKe3WjgoG5iv3mOMhelq2BIE/L6igCVRk9EuqonDswGwLdxnY3rwMp7RQFLslDIgGOOMeOCgpi3a8J6drbBc3aTttlHQHuuTYR+VZf35dv+y8SAuVJRcDgQbFwTcsmZBs/4dsybFcZXAV8pTUitCMDfcEihnoDooCbk3f8GwJ+fdIXPalFOABTK+WOP7wjHrC/8dmYKJm3jLQI9WQhI2zWROOP05/y5tnkEwNV5AOCpsJCvFwCSxn4ieiAw4sc1IXdlCsk21gCUAHBRExkZJuadatR6M+vD/Ci4NxDwrirkE3kA1zE/BaMtF8ADYhEhk1nj+C6AH20ieEZKwMeqkJlBuba5DUAgo2xrwooWAGzzfQAPB1L0YljILRnjpPEciF5pFgCEVzVdPjMziC8Bvi1feISEqsvuYAZ6wdgQEOxTdflgpj4GjFVQsJaILm0YwuMkM4Zyheba5nEAi/IDJF4d1q2+QAYy8+zPUzZ9hJ9VXV7WcMAaQndw47VIK8NByZTCFy+81/o1D3DK6VrqcehoUOR56IjEah8+jQC6tikBGAHtiCZkfkUEd8LDzFhZEPIxTVjnNhKkmuav/vjylhAPFffza5qwns5nO/fiOvF1YC7at0FwNF2K2UK4jjkCxlUB+xQzrQhHEyNlANlqNf2D555gQGKKqtGE3SxEhd0VzEiEo9nqrwhwyulekWZvkIDSI7hvmqa7F+i9v9QDSSWNDiZ6CcB5RYEIzvyjx++nzh1TVQH8Dn/ZkUKfVwrEHm+GovwwBzw8T8ifcprJ5AtXtJDXmiZuA+ORSrYec2ek5DKSXwWlBidt88YQ8E2d0Z4A4TswlgFYUC8zfj8zt4ej1t6aGch1/u2YV04Be0qKqJE4NTWlEDW/C1KD8fO9Ka9TCdH64stKXY4xABdWUwUh6n4Z+U58EE57DwHkb883VHVM6CfGPk3ID1zb3AMgs51XrAkPN0Vi8uuGAIIO/KlJE1/OHhZ7HpYoCv4gBeMKtxyZp28pWiV1IPZqQrY3DVA3+SWCGhBjmpBL/3MAn6cSBIHWqyLxzv8CMAPhH0r+/WAumDdoUcu/pOAf3gHDMLo2+okAAAAASUVORK5CYII="

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function hideShowImg(action){
        for(let i = 0; i < imageArr.length; i++) {
            let imageItem = imageArr[i]
            let sizeType = imageItem.width > imageItem.height ? 'width' : 'height'
            let miniSizeInputValue = +document.getElementById("zk-mini-size-input").value
            let miniSize = miniSizeInputValue && miniSizeInputValue >= 0 ? miniSizeInputValue : miniSizeDefault
            if(action) { console.log(action)}
            switch(action) {
                case 'show':
                    //console.log('show')
                    imageItem.style.display = ''
                    imageItem.style.width = ''
                    imageItem.style.height = ''
                    break
                case 'hide':
                    //console.log('hide')
                    imageItem.style.display = 'none'
                    imageItem.style.width = ''
                    imageItem.style.height = ''
                    break
                case 'mini':
                    //console.log('mini')
                    imageItem.style.display = ''
                    imageItem[sizeType] > miniSize && (imageItem.style[sizeType] = `${miniSize}px`)
                    break
            }
        }
    }

    function hideImg() { hideShowImg('hide')}

    function showImg() { hideShowImg('show')}

    function miniImg() { hideShowImg('mini')}

    function createBtn() {
        let container = document.createElement('DIV')
        container.id = "zk-image-container"
        container.innerHTML = `
            <i class="logo-img zk-item"></i>
            <span id="zk-hide-image-btn" class="zk-image-btn zk-item" title="隐藏图片"></span>
            <span id="zk-show-image-btn" class="zk-image-btn zk-item" title="显示图片"></span>
            <input class="size-input zk-item" placeholder="50" id="zk-mini-size-input"/>
            <span id="zk-mini-image-btn" class="zk-image-btn zk-item" title="缩小图片"></span>`
        document.body.appendChild(container)
        //document.getElementById("zk-mini-size-input").value = miniSizeDefault
        //container.style.position = 'fixed'
        //container.style.right="100px"
        //container.style.top="100px"
        //container.style.zIndex=1000000000



        addGlobalStyle(`#zk-image-container { position: fixed; right: -170px; top: 100px; z-index: 1000000; background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%); height: 44px; line-height: 44px; border-radius: 22px 0 0 22px; padding: 0 22px; transition: all 300ms;}` )
        addGlobalStyle(`#zk-image-container:hover { right: 0; transition: all 300ms}`)
        addGlobalStyle(`#zk-image-container .logo-img{ background-image: url(${picture}); display: inline-block; width: 32px; height: 32px; background-size: 100% 100%; position: relative; left: -16px;}`)
        addGlobalStyle(`#zk-image-container .zk-image-btn{cursor: pointer; display: inline-block; width: 32px; height: 32px; background-size: 100% 100%; background-repeat: no-repeat;}`)
        addGlobalStyle(`#zk-image-container .size-input.zk-item { display: inline-block; height: 20px; width: 20px; border: none; outline: none; font-size: 12px; line-height: 20px; margin-top: 11px; margin-left: 4px; padding: 0; vertical-align: top; background: transparent; border-bottom: 1px solid ${color}; color:${color};}`)

        addGlobalStyle(`#zk-image-container #zk-hide-image-btn { background-image: url(${activeHide})}`)
        addGlobalStyle(`#zk-image-container #zk-show-image-btn { background-image: url(${activeShow})}`)
        addGlobalStyle(`#zk-image-container #zk-mini-image-btn { background-image: url(${zoom}); background-size: 24px 24px; background-position: center center; }`)
        addGlobalStyle(`#zk-image-container .zk-item { margin-top: 6px}`)
    }

    function bind() {
        document.getElementById("zk-hide-image-btn").addEventListener('click', ev => {
            hideImg()
            currentWork = 'hide'
        })
        document.getElementById("zk-show-image-btn").addEventListener('click', ev => {
            showImg()
            currentWork = 'show'
        })
        document.getElementById("zk-mini-image-btn").addEventListener('click', ev => {
            miniImg()
            currentWork = 'mini'
        })
    }

    function setTimeWork() {
        timer && clearInterval(timer)
        timer = setInterval(() => {
            currentWork && hideShowImg(currentWork)
            if(!document.getElementById("zk-image-container")){
                createBtn()
                bind()
            }
        }, 50)
    }


    createBtn()
    bind()
    setTimeWork()

})();