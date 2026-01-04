// ==UserScript==
// @name                臺中市政府警察局-交通違規檢舉
// @version             0.0.3
// @description         快速輸入資料
// @author              Hayao-Gai
// @namespace           https://github.com/HayaoGai
// @icon                https://suggest.police.taichung.gov.tw/tcpolice.ico
// @match               https://suggest.police.taichung.gov.tw/traffic/*
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/475343/%E8%87%BA%E4%B8%AD%E5%B8%82%E6%94%BF%E5%BA%9C%E8%AD%A6%E5%AF%9F%E5%B1%80-%E4%BA%A4%E9%80%9A%E9%81%95%E8%A6%8F%E6%AA%A2%E8%88%89.user.js
// @updateURL https://update.greasyfork.org/scripts/475343/%E8%87%BA%E4%B8%AD%E5%B8%82%E6%94%BF%E5%BA%9C%E8%AD%A6%E5%AF%9F%E5%B1%80-%E4%BA%A4%E9%80%9A%E9%81%95%E8%A6%8F%E6%AA%A2%E8%88%89.meta.js
// ==/UserScript==

(function() {
    'use strict'

    const textStyle = `
.my-button-1 {
    display: block;
    background: linear-gradient(to bottom, rgba(125,126,125,1) 0%,rgba(14,14,14,1) 100%);
    color: white;
    margin: 10px auto 0px;
    padding: 3px 10px;
    border: none;
    border-radius: 4px;
}
.my-button-2 {
    display: block;
    margin: 10px 10px 0px 0px;
}`

    function main () {

        if ( !!document.querySelector( "#OK" ) ) {

            document.querySelector( "#OK" ).click()
            document.querySelector( "#nextstep" ).firstChild.click()
            return

        }

        css()
        personalData()
        violation()

    }

    function css () {

        const style = document.createElement( "style" )
        style.type = "text/css"
        style.innerHTML = textStyle
        document.querySelector( "head" ).appendChild( style )

    }

    function personalData () {
        const element = document.createElement( "input" )
        element.classList.add( "my-button-1" )
        element.type = "button"
        element.value = "自動填寫個資"
        element.addEventListener( "click", () => {
            const keyins = document.querySelectorAll( ".keyin" )
            keyins[ 0 ].firstChild.value = "鄭駿凱"
            keyins[ 4 ].firstChild.value = "Q123913915"
            keyins[ 5 ].firstChild.value = "台中市西屯區西安街277巷13弄18號"
            keyins[ 6 ].firstChild.value = "0919924180"
            keyins[ 7 ].firstChild.value = "ano80764@gmail.com"
        } )
        const parent = document.querySelector( ".sorttitle" )
        parent.appendChild( element )
    }

    function createViolationButton ( parent, value, index ) {

        const element = document.createElement( "input" )
        element.classList.add( "my-button-2" )
        element.type = "button"
        element.value = value
        element.addEventListener( "click", () => {

            const select = parent.parentElement.querySelector( "select" )
            select.selectedIndex = index
            const detail = document.querySelector( "#detailcontent" )
            detail.innerText = value.split( " " )[ 0 ]

        } )
        parent.appendChild( element )

    }

    /** 違規事項 */
    function violation () {

        const labels = [...document.querySelectorAll( "label" )]
        const title = labels.find( label => label.innerText === "違規事項" )
        const root = title.closest( "li" )
        const note = root.querySelector( ".note" )

        while ( !!note.firstChild ) {

            note.removeChild( note.firstChild )

        }

        createViolationButton( note, "使用行動電話 31-1-2", 5 )
        createViolationButton( note, "轉彎未打方向燈 42", 20 )
        createViolationButton( note, "變換車道未打方向燈 42", 20 )
        createViolationButton( note, "不停讓行人 44-2", 26 )
        createViolationButton( note, "逆向行駛 45-1-3", 29 )
        createViolationButton( note, "跨越雙白線 48-1-2", 43 )
        createViolationButton( note, "跨越雙黃線 48-1-2", 43 )
        createViolationButton( note, "直行車，佔用左右轉專用車道 48-1-7", 46 )
        createViolationButton( note, "闖紅燈 53-1", 54 )
        createViolationButton( note, "紅燈右轉 53-2", 55 )
        createViolationButton( note, "於公車停靠區臨停 55-1-2", 62 )
        createViolationButton( note, "黃網臨停 60-2-3", 68 )
        createViolationButton( note, "行駛槽化線 60-2-3", 68 )
        createViolationButton( note, "停等紅燈時超越停止線 60-2-3", 68 )

        // const select = root.querySelector( "select" )
        // const detail = document.querySelector("#detailcontent")

    }

    main()

})()
