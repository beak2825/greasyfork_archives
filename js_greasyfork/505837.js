// ==UserScript==
// @name        BTN Bonus Point Optimization
// @namespace        mattdoofus
// @match       https://broadcasthe.net/bonus.php?action=rate
// @grant       none
// @version     1.0
// @author      mattdoofus
// @license     MIT
// @description adds better bonus rate details to the bonus rates page
// @require https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/505837/BTN%20Bonus%20Point%20Optimization.user.js
// @updateURL https://update.greasyfork.org/scripts/505837/BTN%20Bonus%20Point%20Optimization.meta.js
// ==/UserScript==
totaltorrents = parseInt($('[class="pagedisplay"]').val().split('/')[1]) * 10
$('[class="pagesize"]').append('<option value="'+totaltorrents+'">ALL</option>')
$('thead > [class="colhead"]').append('<th class="header">Rate - 1y</th>')
$('thead > [class="colhead"]').append('<th class="header">BP/Y/GB</th>')
length = $('[class="even"], [class="odd"]').length
document.querySelector('[class="pagesize"]').value = totaltorrents
document.querySelector('[class="pagesize"]').dispatchEvent(new Event('change', { bubbles: true }))
  $('[class="even"], [class="odd"]').each(function () {
    if ($(this).children().length == 9) {
      $(this).append('<td class="center"></td>')
      $(this).append('<td class="center"></td>')
    }
    sorep = $(':nth-child(2)', this).text()
    months = parseFloat($(':nth-child(4)', this).text()).toFixed(2)
    console.log("the months"+months)
    seedmultiplier = parseFloat($(':nth-child(5)', this).text().replace("x", "")).toFixed(2)
    size = parseFloat($(':nth-child(3)', this).text().replace(/,/g, "").split(' ')[0]).toFixed(2)
    console.log(size)
    bytes = $(':nth-child(3)', this).text().split(' ')[1]
    monthlypoints = parseFloat($(':nth-child(9)', this).text().replace(/,/g, "")).toFixed(2)
    if (bytes == 'GB') {
      newsize = size
      yearlypoints = 0
      nummonth = 0
      if(sorep == "Season"){
      for(var xxx = 0; xxx < 12; xxx++){
      yearlypoints = yearlypoints + ((months + nummonth) * newsize * 15 * seedmultiplier) * 30
                                     nummonth = nummonth + 1
      }
      }else{
        for(var xxx = 0; xxx < 12; xxx++){
        yearlypoints = monthlypoints * 12
        }
      }
 optival = yearlypoints / newsize
    $(':nth-child(10)', this).text(yearlypoints.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
       $(':nth-child(11)', this).text(optival.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
        opticol = parseFloat( $(':nth-child(10)', this)).toFixed(2)
      // $(':nth-child(11)', this).text(calc)
    } else if (bytes == 'MB') {
      newsize = size / 1000
      monthlypoints = parseFloat($(':nth-child(9)', this).text().replace(/,/g, "")).toFixed(2)
      yearlypoints = 0
      nummonth = 0
      if(sorep == "Season"){
      for(var xxx = 0; xxx < 12; xxx++){
      yearlypoints = yearlypoints + ((months + nummonth) * newsize * 15 * seedmultiplier) * 30
                                     nummonth = nummonth + 1
      }
      }else{
        for(var xxx = 0; xxx < 12; xxx++){
        yearlypoints = monthlypoints * 12
        }
      }
 optival = yearlypoints / newsize
    $(':nth-child(10)', this).text(yearlypoints.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
       $(':nth-child(11)', this).text(optival.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
        opticol = parseFloat( $(':nth-child(10)', this)).toFixed(2)
    } else if (bytes == 'TB') {
     newsize = size * 1000
      monthlypoints = parseFloat($(':nth-child(9)', this).text().replace(/,/g, "")).toFixed(2)
      yearlypoints = 0
      nummonth = 0
      if(sorep == "Season"){
      for(var xxx = 0; xxx < 12; xxx++){
      yearlypoints = yearlypoints + ((months + nummonth) * newsize * 15 * seedmultiplier) * 30
                                     nummonth = nummonth + 1
      }
      }else{
        for(var xxx = 0; xxx < 12; xxx++){
        yearlypoints = monthlypoints * 12
        }
      }
 optival = yearlypoints / newsize
    $(':nth-child(10)', this).text(yearlypoints.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
       $(':nth-child(11)', this).text(optival.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
        opticol = parseFloat( $(':nth-child(10)', this)).toFixed(2)
    }

      // addingcommas = (yearlypoints + monthlypoints).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      // console.log(addingcommas)
    // }else if(sorep == "Season"){
    //   for(var xxx = 0; xxx < year; xxx++)
    //   yearlypoints = Math.round((((months + (xxx + 1)) * newsize * 15) * seedmultiplier))
    // $(':nth-child(10)', this).text((yearlypoints + monthlypoints).toFixed(2))


                                          })
setTimeout(function(){
document.querySelectorAll('[class="header"]')[10].click()
})
// setInterval(function () {
//   if (length != $('[class="even"], [class="odd"]').length) {
//     length = $('[class="even"], [class="odd"]').length
//     displaycalc()
//   }
// })
$('th:nth-child(11), th:nth-child(10)').click(function(){
    var table = $(this).parents('table').eq(0)
    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
    this.asc = !this.asc
    if (!this.asc){rows = rows.reverse()}
    for (var i = 0; i < rows.length; i++){table.append(rows[i])}
})
function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
    }
}
function getCellValue(row, index){ return parseInt($(row).children('td').eq(index).text().replace(/\,/g, '')) }
// $('tr').css({'display': 'inline-block', 'background-color': '#fff', 'position': 'relative'})