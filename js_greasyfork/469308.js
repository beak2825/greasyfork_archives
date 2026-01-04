// ==UserScript==
// @name         WHU Gpa Calc
// @license      GPLV3
// @namespace    https://github.com/liaosunny123/WHUGpaCalc
// @version      1.0.0
// @description  WHU Gpa Calculator which will remove unrelated courses and calculate your gpa automatically.
// @author       EpicMo
// @match        https://jwgl.whu.edu.cn/cjcx/cjcx_cxDgXscj.html?gnmkdm=N305005*
// @require      https://code.jquery.com/jquery-3.6.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/469308/WHU%20Gpa%20Calc.user.js
// @updateURL https://update.greasyfork.org/scripts/469308/WHU%20Gpa%20Calc.meta.js
// ==/UserScript==

(async function() {
    //void conflict with the default JQ of the page
    window.jQuery361 = $.noConflict(true)
    
    //get the archivement element group
    var classArrs = []
    var gpa = 0.0
    function gpaCalc(classArrs){
        var sum = 0.0
        var sumStandardScore = 0.0
        classArrs.forEach(sp => {
            if(sp.type == '通识教育选修'){
                return;
            }
            sum += parseFloat(sp.score) * parseFloat(sp.standardScore)
            sumStandardScore += parseFloat(sp.standardScore)
        })
        return sum / sumStandardScore
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    var arrs = $('#tabGrid').children().children('.ui-row-ltr')
    //await sleep(5000)

    async function getScore(){
        var count = 0
        while(count <= 21){
            if(arrs.length == 0){
                await sleep(500)
                arrs = $('#tabGrid').children().children('.ui-row-ltr')
                count++
            }else{
                arrs = $('#tabGrid').children().children('.ui-row-ltr')
                break
            }
        }

        if(count == 21){
            return 4.0
        }else{
            $.each(arrs, function(index, value){
                var cell = $(value).children()
                var classArr = {
                    classNo: $(cell[3]).text(),
                    className: $(cell[4]).text(),
                    standardScore: $(cell[6]).text(),
                    score: $(cell[9]).text(),
                    type: $(cell[5]).text()
                }
                Object.assign(classArrs, {[index]: classArr})
            })
            return gpaCalc(classArrs)
        }
    }
    
    gpa = (await getScore())

    console.log('GPA Calc: ' + gpa)

    var span = $('<span>有效绩点：' + gpa.toFixed(2) +' </span>')
    $('.col-sm-2').children().before(span)

    document.getElementById('search_go').addEventListener('click', async function(){
        console.log('GPA Calc: ' + (await getScore()))
        $('.col-sm-2').children().eq(0).text('有效绩点：' + (await getScore()).toFixed(2) + ' ')
    })
})()