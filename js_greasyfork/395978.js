// ==UserScript==
// @name         ao-helper
// @description  arthur online helper
// @version      1.0.9
// @author       yuze
// @namespace    yuze
// @match        https://system.arthuronline.co.uk/*
// @connect      arthuronline.co.uk
// @connect      ea-api.yuze.now.sh
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/395978/ao-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/395978/ao-helper.meta.js
// ==/UserScript==

/* eslint-env jquery */ 
/* globals moment, GM */

let id;
let icons = {}
let storage = {}
let targets = {}

let local = false
let letter_endpoint

init()
function init() {
    $(window).on('load focus mousedown', checkLocation)
    $(window).on('load', loadActions)
    $(window).on('mousedown', mousedownActions)
    $(window).on('hashchange', checkTab)

    appendCSS()
    loadIcons()

    id = $('.text-logo span').text().toLowerCase()

    if (local) {
        letter_endpoint = 'https://localhost:3000/api/gen-letter'
        console.log('using localhost endpoint')
    } else {
        letter_endpoint = 'https://ea-api.yuze.now.sh/api/gen-letter'
    }

    targets = {
        addTransaction: {
            btn: '.box-header .actions ul > :nth-child(3)',
            date: 'input#TransactionDate',
            desc: 'input#TransactionDescription',
            amount: 'input#TransactionAmount',
        },
        documents: {
            checkboxes: 'table.attachments input[type="checkbox"]'
        }
    }
}

function loadActions() {
    //quickAccess()
    quickNotes()
}

function mousedownActions(e) {
    if ( event.which == 2 || event.which == 3  ) return;

    copyOnClick(e)
    addTransactionBtn(e)
}

async function wait(ms) {
    return new Promise(resolve => {
        setTimeout( () => { resolve() }, ms);
    });
}

async function waitForExistance(elem, resolve) {

    if ( $(elem).length ) {
        resolve()
    }

    let interval;
    if ( !$(elem).length ) {
        interval = setInterval( () => checkExistance(), 256)
    }
    function checkExistance() {
        if ( $(elem).length ) {
            clearInterval(interval)
            resolve()
        }
    }
}

async function waitForIframeExistance(iframe, elem, resolve) {
    if ( $(iframe).contents().find(elem).length ) {
        resolve()
    }
    let interval;
    if ( !$(iframe).contents().find(elem).length ) {
        interval = setInterval( () => checkExistance(), 128)
    }
    function checkExistance() {
        if ( $(iframe).contents().find(elem).length ) {
            clearInterval(interval)
            resolve()
        }
    }
}

async function checkLocation() {
    $(window).trigger('hashchange')
    await wait(256)
    if( /tenancies\/view\/\d{6}/.test(window.location.href) ) {
        viewTenancies()
    }
    if( /\/\w+\/(page|filter|index)/.test(window.location.href) ) {
        viewSearch()
    }
}

async function checkTab() {
    await wait(64)
    if( !location.hash.includes('tab-transactions') ) {
        tabTransactions(true)
    }
    if( !location.hash.includes('tab-recurrings') ) {
        tabRecurrings(true)
    }   
    if( !location.hash.includes('tab-attachments') ) {
        tabAttachments(true)
    }   

    if( location.hash.includes('tab-transactions') ) {
        tabTransactions(false)
    }
    if( location.hash.includes('tab-recurrings') ) {
        tabRecurrings(false)
    }
    if( location.hash.includes('tab-attachments') ) {
        tabAttachments(false)
    }
    
}

function viewTenancies() {
    new Promise( function(resolve) {
        waitForExistance('.identifier', resolve)
    }).then( () => {
        appendTenantToolbox()
        appendReadableDateRange()
    } )
}

function viewSearch() {
    $('#_q').off('paste', querySeperator)
    $('#_q').on('paste', querySeperator)
}

function appendTenantToolbox() {

    if ( $('#tenantToolbox').length ) return;

    const option = {
        bfc: `  <div class="option" id="tenantToolbox_bfc">
                    <div class="icon red">${icons.percent}</div><span class="red">Breaking Fee Calculator</span>
                </div>`,
        letter: `<div class="option" id="tenantToolbox_letter">
                    <div class="icon red">${icons.letter}</div><span class="red">Overdue Rent Letter</span>
                </div>`
    }

    const html = `  <div id="tenantToolbox" class="element-container">
                        <div class="element-header">
                            <div class="title">${id[0].toUpperCase() + id.slice(1)} tools</div>
                            <div style="height: 4px"></div>
                            ${option.bfc}
                            ${option.letter}
                        </div>
                    </div>`

    $('.left-side-detail').append(html)

    $('#tenantToolbox').on('click', tenantToolboxActions)
}

function tenantToolboxActions(e) { 
    if( e.target.id == 'tenantToolbox' ) return;
    if( e.target.closest('.option').id == 'tenantToolbox_bfc') {
        prepareModal('bfc')
        return;
    }
    if( e.target.id == 'tenantToolbox' ) return;
    if( e.target.closest('.option').id == 'tenantToolbox_letter') {
        genLetter()
        return;
    }
}

async function genLetter() {

    let savedLoc = window.location.href;
    
    let property = function() {
        let arr = $('.identifier-detail .sub-title a:nth-of-type(1)').text().split(',')
        arr.splice(1, 1)
        return arr.join(',')
    }()

    let ref = $('.identifier-detail .title').text().match(/TE\d{4,5}/)[0]
    let total = $('.financial-transaction .overdue .number').text()

    let arrears;
    let dueDate;

    getArrears()
    function getArrears() {
        $('.nav.nav-tabs [href^="#tab-transactions"]')[0].click()

        new Promise( function(resolve) {
            waitForExistance('.transactions tbody', resolve)
        }).then(() => {

            // arrears data
            $('#genOverdueBtn')[0].click()
            arrears =  $('#genOverdueText')[0].value.split('\n\n')[0]
            $('#genOverdueText').css('display', 'none')

            // extract due date
            dueDate = arrears.split('\n')

            for (let i = 0; i <= dueDate.length; i++) {
                
                if ( !dueDate[i] && i === 0 ) {
                    break;
                } else if ( i == dueDate.length - 1 ) {

                    try {
                        dueDate = dueDate[0].match(/\((\d.+)-/)[1].trim()
                        break;
                    } catch(err) {
                        dueDate = dueDate[0].match(/\((\d.+)\)/)[1].trim()
                        break;
                    }
                    
                } else if ( dueDate[i].includes('Outstanding') ) {
                    dueDate = dueDate[i].match(/\((.+)-/)[1].trim()
                    break;
                }

            }
            getNames()
        })
    }

    let names = []
    let namesFirst = []
    let fullName;
    let firstName;

    function getNames() {
        $('.nav.nav-tabs [href^="#tab-summary"]')[0].click()

        new Promise( function(resolve) {
            waitForExistance('.title .name h3', resolve)
        }).then(() => {
            for(let i = 0; i < $('.title .name h3').length; i++) {
                names.push( $('.title .name h3')[i].textContent )
            }

            for (let i = 0; i < names.length; i++) {    
                fullName = names.join(', ')
            }
        
            for (let i = 0; i < names.length; i++) {
                namesFirst.push( names[i].split(' ')[0] )
            }

            if( names.length > 2) {
                firstName = namesFirst.join(', ').replace(/(,)(?!.+\1)/, ' and')
            } else {
                firstName = namesFirst.join(' and ')
            }
            returnToSavedLocation()
            sendRequest()
        })
    }

    function sendRequest() {

        GM.xmlHttpRequest({
            method: "POST",
            url: letter_endpoint,
            data: `for=${id}&name=${names[0]}&full_name=${fullName}&first_name=${firstName}&property=${property}&ref=${ref}&arrears=${arrears}&due_date=${dueDate}&total=${total}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(res) {
                console.log(res.response)
                window.open(`${letter_endpoint}/${names[0]}/${property}/`)
            }
        })

    }

    function returnToSavedLocation() {
        if( /tenancies\/view\/\d{6}\/ident:Datatable.{5}$/.test(savedLoc) ){
            setTimeout( async () => {
                $(`.nav.nav-tabs [href^="#tab-summary"]`)[0].click()
                await wait(512)
                checkLocation()
            }, 1)
        } else if ( /tenancies\/view\/\d{6}\/ident:Datatable.{5}#tab-.+-/.test(savedLoc) ) {
            let match = savedLoc.match(/tab-.+(?=-)/)[0]
            setTimeout( async () => {
                $(`.nav.nav-tabs [href^="#${match}"]`)[0].click()
                await wait(512)
                checkLocation()
            }, 1)
        }
    }
}

async function prepareModal(mode) {

    let template = {}

    if ( mode == 'bfc') {
        prepareDataBfc('bfc')
    }

    async function prepareDataBfc(mode) {
        let data = {}

        data.today = currentDate()
        data.endOfTenancy = storage.tenancyEndDate
        data.monthly = ''

        if ( $('.summary-data-container div:nth-child(2) p').length ) {
            data.monthly = $('.summary-data-container div:nth-child(2) p').text().trim().replace(' monthly', '')
            makeTemplateBfc(data, mode)
        } else {
            $('.nav.nav-tabs [href^="#tab-summary"]')[0].click()
            new Promise( function(resolve) {
                waitForExistance('.summary-data-container div:nth-child(2) p', resolve)
            }).then( () => {
                data.monthly = $('.summary-data-container div:nth-child(2) p').text().trim().replace(' monthly', '')
                makeTemplateBfc(data, mode)
            } )
        }
    }

    function makeTemplateBfc(data, mode) {    

        template.postLaunchActions = true
        template.title = 'Breaking Fee Calculator'
        template.close = 'Understood'
        template.color = 'red'
        template.body = `One month's rent is&ensp;<input class="monthly red" type="text" value="£0.00" style="width: 7.5ch"><br>
                    <hr>
                    <input class="from red" type="date" value="2020-01-01" style="width: 12.25ch">&ensp;to&ensp;<input class="to red" type="date" value="2020-01-01" style="width: 12.25ch">&ensp;is <b><span class="days">0</span> days</b><br>
                    That's <span class="daysBetweenReadable"><b>0 months, 0 weeks</b> and <b>0 days</b></span>
                    <hr>
                    Weekly rent is <b>£<span class="weekly curr">0.00</span></b> which is <b>£<span class="daily curr">0.00</span></b> per day<br>
                    <b class="start">£<span class="daily curr">0.00</span></b> multiplied by <b><span class="days">0</span> days</b> is <b>£<span class="dailyByDays curr">0.00</span></b>
                    <hr>
                    <input type="text" value="0%" style="width: 2.75ch" class="percent red"">&ensp;of <b>£<span class="dailyByDays curr">0.00</span></b> is <b>£<span class="percentOfRemaining curr">0.00</span></b>`
        template.footer = `<span style="color: #d64a65">Total to be paid: <b class="totalStyle">£<span class="total">0.00</span></b></span>`
        
        createModal(template, data, mode)
    }
}

function createModal(template, data, mode) {

    if ( $('#fModal').length ) return;

    let { title, body, footer, close, color, postLaunchActions } = template;

    const html = `  <div id="fModal" class="${color}">
                        <div class="header ${color}">${title}</div>
                        <div class="body">${body}</div>
                        <div class="footer">
                            <div class="left">${footer}</div>
                            <div class="right"><div class="btn ${color}" id="fModalClose">${close}</div></div>
                        </div>
                    </div>`

    $('body').append(html)
    $('#fModal').hide().fadeIn(314)

    //CLOSE
    $('#fModalClose').on('click', removeModal)

    //MOVE
    $('#fModal .header').on('mousedown', moveModal)

    function moveModal(e) {
        let x = e.clientX - ( $('#fModal .header')[0].getBoundingClientRect().left + ( $('#fModal .header')[0].getBoundingClientRect().width / 2 ) )
        let y = e.clientY - $('#fModal .header')[0].getBoundingClientRect().top

        $('body').on('mousemove', beginDrag)
        function beginDrag(e) {
            $('#fModal').css('left', e.clientX - x + "px")
            $('#fModal').css('top', + e.clientY - y + "px")
        } 

        $('#fModal .header').on('mouseup', endDrag)
        function endDrag(){
            $('body').off('mousemove', beginDrag)
        }
    }

    if ( postLaunchActions ) {
        modalPostLaunch(data, mode)
    }
}

function modalPostLaunch(data, mode) {
    if ( mode == 'bfc') {
        postLaunchBfc(data)
    }

    function postLaunchBfc(data) {

        let { monthly, today, endOfTenancy } = data;

        initialise()
        function initialise() {
            $('#fModal .monthly')[0].value = monthly
            $('#fModal .from')[0].value = today
            $('#fModal .to')[0].value = endOfTenancy
            $('#fModal .percent')[0].value = 7

            console.log(endOfTenancy)
        }
        
        calc()
        function calc() {

            let monthly = $('#fModal .monthly')[0].value
            let percent = $('#fModal .percent')[0].value

            clearFormatting()
            function clearFormatting() {
                // monthly
                if ( $('#fModal .monthly')[0].value.includes('£') ) {
                    monthly = $('#fModal .monthly')[0].value.slice(1)
                }
                if ( monthly.includes(',') ) {
                    monthly = monthly.replace(',', '')
                }
                // percent
                if ( $('#fModal .percent')[0].value.includes('%') ) {
                    percent = $('#fModal .percent')[0].value.replace('%', '')
                }
            }

            let daysBetweenArray = differenceBetweenDates($('#fModal .from')[0].value, $('#fModal .to')[0].value)
            for(let i = 0; i < $('#fModal .days').length; i++ ) {
                if ( $('#fModal .days')[i].innerHTML == 'NaN' ) {
                    $('#fModal .days')[i].innerHTML = '0'
                    continue;
                }
                $('#fModal .days')[i].innerHTML = daysBetweenArray[0]
            }
            $('#fModal .daysBetweenReadable')[0].innerHTML = daysBetweenArray[1]

            $('#fModal .weekly')[0].innerHTML = function() {

                let weekly = String( (parseFloat(monthly) * 12 / 52).toFixed(3) ).slice(0, -1) ;

                if( weekly.match(/\.\d(\d)/)[1] == '9' ) {
                    weekly = +weekly + 0.01
                } else if ( weekly.match(/\.\d(\d)/)[1] == '1' ) {
                    weekly = +weekly - 0.01 
                } else {
                    weekly = +weekly
                }

                return String( weekly.toFixed(3) ).slice(0,-1)
            }() 

            for(let i = 0; i < $('#fModal .daily').length; i++ ) {
                $('#fModal .daily')[i].innerHTML = +String( +$('#fModal .weekly')[0].innerHTML / 7 ).match(/\d+(\.\d{2})?/)[0]
            }


            for(let i = 0; i <  $('#fModal .dailyByDays').length; i++ ) {
                $('#fModal .dailyByDays')[i].innerHTML = +String(+$('#fModal .daily')[0].innerHTML * +$('#fModal .days')[0].innerHTML).match(/\d+(\.\d{2})?/)[0]
            }

            $('#fModal .percentOfRemaining')[0].innerHTML = +String(+$('#fModal .dailyByDays')[0].innerHTML * ( percent / 100 ) ).match(/\d+(\.\d{2})?/)[0]

            let total = String(+monthly +  +$('#fModal .percentOfRemaining')[0].innerHTML)
            if ( !total.includes('.') ) {
                total = String(+monthly +  +$('#fModal .percentOfRemaining')[0].innerHTML) + '.00'
            }
            if ( total.match(/\.\d{1}(?!\d)/) ) {
                total = String(+monthly +  +$('#fModal .percentOfRemaining')[0].innerHTML) + '0'
            }
            total = total.match(/[0-9]+[.,]\d{2}/)[0]
            $('#fModal .total')[0].innerHTML = total.replace(/(\d{1})(\d{3}.\d{1,2})/, '$1,$2')
        }

        format()
        function format() {
            // currentcy input
            if ( !$('#fModal .monthly')[0].value.includes('£') ) {
                $('#fModal .monthly')[0].value = '£' + $('#fModal .monthly')[0].value
            }
            if ( !$('#fModal .monthly')[0].value.includes('.') ) {
                $('#fModal .monthly')[0].value = $('#fModal .monthly')[0].value + '.00'
            }
            if ( $('#fModal .monthly')[0].value.match(/(£\d{1})(\d{3}.\d{1,2})/) ) {
                $('#fModal .monthly')[0].value = $('#fModal .monthly')[0].value.replace(/(£\d{1})(\d{3}.\d{1,2})/, '$1,$2')
            }
            if( $(`#fModal .monthly`)[0].value.match(/\.\d{1}(?!\d)/g)  ){
                $(`#fModal .monthly`)[0].value = $(`#fModal .monthly`)[0].value + 0
            }   
            // query currencies
            for (let i = 0; i < $('#fModal .curr').length; i++) {
                if ( !$(`#fModal .curr`)[i].innerHTML.includes('.') ) {
                    $(`#fModal .curr`)[i].innerHTML = $(`#fModal .curr`)[i].innerHTML + '.00'
                }
                if ( $(`#fModal .curr`)[i].innerHTML.match(/(\d{1})(\d{3}.\d{1,2})/) ) {
                    $(`#fModal .curr`)[i].innerHTML = $(`#fModal .curr`)[i].innerHTML.replace(/(\d{1})(\d{3}.\d{1,2})/, '$1,$2')
                }
                if( $(`#fModal .curr`)[i].innerHTML.match(/\.\d{1}(?!\d)/g)  ){
                    $(`#fModal .curr`)[i].innerHTML = $(`#fModal .curr`)[i].innerHTML + 0
                }   
            }
            // percent
            if ( !$('#fModal .percent')[0].value.includes('%') ) {
                $('#fModal .percent')[0].value = $('#fModal .percent')[0].value + '%'
            }
        }

        resize()
        function resize() {
            // currency
            if ( $('#fModal .monthly')[0].value.includes(',') ) {
                $('#fModal .monthly').css('width',  $('#fModal .monthly')[0].value.length - 0.25 + 'ch')
            } else {
                $('#fModal .monthly').css('width',  $('#fModal .monthly')[0].value.length + 'ch')
            }
            // percent
            if ( $('#fModal .percent')[0].value.includes('.') ) {
                $('#fModal .percent').css('width',  $('#fModal .percent')[0].value.length + 0.25 + 'ch')
            } else {
                $('#fModal .percent').css('width',  $('#fModal .percent')[0].value.length + 0.75 + 'ch')
            }
        }

        listeners()
        function listeners() {
            $('#fModal .monthly, #fModal .from, #fModal .to').on('input', function() {
                calc()
                resize()
            })
            $('#fModal .percent').on('input', function() {
                calc()
                resize()
            })
            $('#fModal .monthly, #fModal .percent, #fModal .from, #fModal .to').on('change', function() {
                calc()
                format()
                resize()
            })
            $('#fModal .monthly, #fModal .percent').on('focus click', function(e) {
                e.target.select()
            })
            let timer;
            $('#fModal .monthly, #fModal .percent').on('keyup', function(e) {
                clearInterval(timer)
                timer = setTimeout( () => {
                            e.target.blur()
                        }, 1218)
            })
        }
    }

}

function removeModal() {
    $('#fModal').fadeOut(314, function () {
        $('#fModal').remove()
    })
}

function tabTransactions(remove) {
    if (remove) {
        $('#genOverdueBtn').remove()
        $('#genOverdueContainer').remove()
        $('.genCopyIcon').remove()
        return;
    }

    overdueGenReport()
    function overdueGenReport() {
        appendOverdueBtn()
        function appendOverdueBtn() {
            if ( $('#genOverdueBtn').length ) return;
    
            const html = `<button id="genOverdueBtn" class="btn btnPad btnSpecial">Generate Overdue Report</button>`
            $('body').append(html)
            $('#genOverdueBtn').on('click', appendOverdueDisplay)
        }
    
        function appendOverdueDisplay() {
            $('#genOverdueBtn').off('click', appendOverdueDisplay)
            const html = `<textarea id="genOverdueText" class="input textarea textareaSpecial"></textarea>${icons.copy}`
            $('body').append(html)
            $('#genOverdueText').hide().fadeIn(618)
            $('.genCopyIcon').hide().fadeIn(618)
    
            $('#genOverdueText').on('focusout', removeOverdueReport)
            $('#genOverdueText').focus()
    
            $('.genCopyIcon').on('mousedown', copyOverdueReport)
    
            getOverdueData()
        }
    
        function getOverdueData() {
    
            let overdueArray = [];
    
            // OLD FUCKED UP AO-HELPER LOGIC START
            let getTransactionLength = $('.transactions tbody').children().length
            for (let i = 0; i < getTransactionLength; i++) {
                if ( $('.transactions tbody').children().eq(i).children().eq(1).text().includes('Overdue') ) {
    
                    let getOutstanding = $('.transactions tbody').children().eq(i).children().eq(9).text().trim()
                    let getDesc = $('.transactions tbody').children().eq(i).children().eq(3).text().split('Tenancy:')[0].trim()
                    let getDate = $('.transactions tbody').children().eq(i).children().eq(1).text().split('Due')[0]
    
                    if ( getDesc.includes('Default tenancy rent charge transaction type') ) {
                        getDesc = 'Outstanding Rent'
                        getDate = $('.transactions tbody').children().eq(i).children().eq(3).text().split('Tenancy:')[0].trim().match(/\d{1,2}.{2} \w{3,4} \d{4} - \d{1,2}.{2} \w{3,4} \d{4}/)
                    } else {
                        getDesc = $('.transactions tbody').children().eq(i).children().eq(3).text().split('Tenancy:')[0].trim()
                        }
                    overdueArray.push([getOutstanding, getDesc, getDate])
                }
            }
            overdueArray.forEach( (i) => appendToGenReportTextbox(`${i[0]} — ${i[1]} (${i[2]})`, false) )
            let formattedOverdueValues = []
            for (let i = 0; i < overdueArray.length; i++) {
                formattedOverdueValues[i] = +overdueArray[i][0].replace(',', '').slice(1)
            }
            let sum = '£' + String(formattedOverdueValues.reduce( (a, b) => a + b, 0))
            appendToGenReportTextbox('Total to be paid: ' + `${sum.replace(/£(\d{1,4}$)/, '£$1.00').replace(/£(\d{1})(\d{3})/, '£$1,$2')}`, true)
            // OLD FUCKED UP AO-HELPER LOGIC START
    
            resizeOverdueReport()
        }
    
        function appendToGenReportTextbox(data, end) {
            if (!end) {
                $('#genOverdueText').val( $('#genOverdueText').val() + data + '\n' );
            } else {
                $('#genOverdueText').val( $('#genOverdueText').val() + '\n' + data );
            }
        }
    
        function resizeOverdueReport() {
            $('#genOverdueText').width(  $('#genOverdueText').prop('scrollWidth') + "px" )
            $('#genOverdueText').height( $('#genOverdueText').prop('scrollHeight') - 10 + "px" )
            $('.genCopyIcon').css('left', $('#genOverdueText')[0].getBoundingClientRect().right - 52 + "px")
    
        }
    
        function copyOverdueReport() {
            copyToClipboard($('#genOverdueText').val())
            copyToast('report')
        }
        
        function removeOverdueReport() {
            $('#genOverdueText').fadeOut(314, function() {
                $('#genOverdueText').remove()
                $('#genOverdueBtn').on('click', appendOverdueDisplay)
            })
            $('.genCopyIcon').fadeOut(314, function() {
                $('.genCopyIcon').remove()
            })
        }
    }
}

function tabRecurrings(remove) {

    if (remove) {
        $('#genNextMonthBtn').remove()
        return;
    }

    // genNextMonth()
    function genNextMonth() {
        
        appendGenNextMonthBtn()
        function appendGenNextMonthBtn() {
            const html = `<button id="genNextMonthBtn" class="btn btnPad">Generate Next Month Invoice?</button>`
            
            new Promise( function(resolve) {
                waitForExistance('.recurrings .box-header .actions', resolve)
            }).then( () => {
                if ( $('#genNextMonthBtn').length ) return;
                $('.recurrings .box-header .actions').prepend(html)
                $('#genNextMonthBtn').on('click', automation)
            } )
        }

        async function automation() {
            disableAccess('<b style="font-size: 1.5em;">Please wait 📅</b><br>Generating next month\'s invoice...')
            
            $('.recurrings .datatable-subactions ul > li:nth-child(3) a').click()
        
            new Promise( function(resolve) {
                waitForIframeExistance('#dialog iframe', 'input#RecurringDaysInAdvance', resolve)
            }).then( () => {
                let input = $('#dialog iframe').contents().find('input#RecurringDaysInAdvance')
                input.val(31)
                $('#dialog iframe').contents().find('input.submit-btn')[0].click()
            })
        
            await wait(2500)

            new Promise ( function(resolve) {
                $('.recurrings .datatable-subactions ul > li:nth-child(3) a').click()
                waitForIframeExistance('#dialog iframe', 'input#RecurringDaysInAdvance', resolve)
            }).then( () => {
                let input = $('#dialog iframe').contents().find('input#RecurringDaysInAdvance')
                input.val(7)
                $('#dialog iframe').contents().find('input.submit-btn')[0].click()
                disableAccess('', true)
            })            
        }


    }
}

function tabAttachments(remove) {
    if (remove) {
        return;
    }
}

function appendReadableDateRange() {
    if ( $('.readableDateRange').length ) return;

    let getDates = $('.identifier-detail .sub-title')[0].innerHTML.match(/(\d{1,2} \w{3,4} \d{4}) - (\d{1,2} \w{3,4} \d{4})/)

    let from = dateFormat( getDates[1].split(' ') )
    let to = dateFormat( getDates[2].split(' ') )

    storage.tenancyStartDate = from
    storage.tenancyEndDate = to

    function dateFormat(date) {
        let month = new Date(1900 + date[1] + 1).getMonth() + 1
        return date[2] + '-' + String(month).padStart(2, '0') + '-' + String(date[0]).padStart(2, '0')
    }
    
    let readable = differenceBetweenDates(from, to)[1]
                    .replace(/&ensp;/g, '')
                    .replace(/<b>/g, '')
                    .replace(/<\/b>/g, '')
                    .replace(/\s\s+/g, ' ')
                    .replace(/ and 0 days/g, '')
                    .replace(/, 0 weeks/g, '')
                    .trim()    
    
    let readableWrapped = `<span style="color: #8ba2af" class="readableDateRange">&ensp;▶&ensp;${readable}</span>`
    
    $('.identifier-detail .sub-title')[0].innerHTML = $('.identifier-detail .sub-title')[0].innerHTML
                                                        .replace(/(\d{1,2} \w{3,4} \d{4} - \d{1,2} \w{3,4} \d{4})/, '$1' + readableWrapped)
}

function currentTime(){
    let time = new Date();
    return time.toLocaleString('en-GB', { hour: 'numeric', minute: 'numeric', hour12: true });
}

function currentDate() {
    let date = new Date

    let dateYear = date.getFullYear()
    let dateMonth = String(date.getMonth() + 1).padStart(2, '0')
    let dateDate = String(date.getDate()).padStart(2, '0')

    let today = `${dateYear}-${dateMonth}-${dateDate}`

    return today
}

function currentDateLegacy(){
    let date = new Date();
    let dateString = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    return dateString;
}

function differenceBetweenDates(from, to) {
    let a = moment(from, 'YYYY-MM-DD');
    let b = moment(to, 'YYYY-MM-DD');

    let diffDays = b.diff(a, 'days') + 1;

    let diff = moment.duration(b.diff(a))
    diff.add(1, 'days')

    let years = diff.years()
    let months = diff.months()
    let weeks = diff.weeks()
    let days = diff.days()%7

    let diffFull = `<b> ${years == 1 ? years + ' year,&ensp;' : years > 1 ? years + ' years,&ensp;' : ''}
                    ${months == 1 ? months + ' month,&ensp;' : months > 1 ? months + ' months,&ensp;' : ''}
                    ${isNaN(weeks) ? '0 weeks' : weeks == 1 ? weeks + ' week' : weeks + ' weeks'}</b> and <b>
                    ${isNaN(days) ? '0 days' : days == 1 ? days + ' day' : days + ' days'}</b>`

    return [diffDays, diffFull];
}

function querySeperator() {
    setTimeout( () => delay(), 128)
    function delay() {
        let commaDelimited = $('#_q').val().trim().split(' ').join(', ')
        $('#_q').val( commaDelimited )
    }
}

function copyOnClick(e) {

    tenant()
    function tenant() {
        if ( $(e.target).closest('.identifier-detail').length ) {

            if ( e.ctrlKey && e.altKey ) {
                landingDetailFull()
                return;
            }

            landingDetail()
        }
        if ( $(e.target).closest('.financial-transaction').length ) {
            landingBalance()
        }
        if ( $(e.target).closest('.summary-group-container').length ) {
            landingSummary()
        }
        if ( $(e.target).closest('.notes tbody').length ) {
            landingNotes()
        }
        if ( $(e.target).closest('.transactions tbody').length ) {
            statement()
        }
        if ( $(e.target).closest('.attachments tbody').length ) {
            documents()
        }
    }

    tenantSearch()
    function tenantSearch() {
        if ( $(e.target).closest('.datatable-index-filters .tenancies tbody').length ) {
            tenantSearchTable()
        }
    }

    // further test
    function landingDetail() {

        if ( $(e.target).attr('class') == 'title' ) {
            copyToClipboard($(e.target).text().match(/TE\d{4,5}/)[0])
            copyToast('tenancy reference')
        }
        if ( $(e.target).attr('class') == 'name' ){
            let clone = $(e.target).clone()
            clone.find('.label').remove()
            copyToClipboard(clone.text().replace(/\+.+/, '').trim())
            copyToast('full name')
        }
        if ( $(e.target).closest('.sub-title').length ) {
            copyToClipboard($('.sub-title a')[0].innerHTML.split(',')[0].replace(' Room', ', Room'))
            copyToast('property + room')
        }
    }
    function landingDetailFull() {

        let clone = $('.identifier-detail .name').clone()
        clone.find('.label').remove()
        let getName = clone.text().replace(/\+.+/, '').trim()
        let getDate = $('.identifier-detail').children().eq(2).contents()[2].wholeText
        let getMonthly = $('.content-main .summary-data-container').children().eq(1).children().eq(1).text().trim()

        copyToClipboard(getName + "\n" + getDate + "\n" + getMonthly + "\n\n")
        copyToast('full information')
    }
    function landingBalance() {
        if ( $(e.target).attr('class').includes('number') ) {
            copyToClipboard($(e.target).text())
            copyToast('balance')
        }
    }
    function landingSummary() {
        if ( $(e.target).closest('.name').length ) {
            copyToClipboard($(e.target).text())
            copyToast('full name')
        }
        if ( $(e.target).closest('.detail > div:nth-child(2) div').length ) {
            copyToClipboard($(e.target).text())
            copyToast('phone')
        }
        if ( $(e.target).closest('.summary-group-container .detail > div:nth-child(3) div').length ) {
            copyToClipboard($(e.target).text())
            copyToast('email')
        }
    }
    function landingNotes() {
        if ( $(e.target).closest('.note').length ) {
            copyToClipboard($(e.target).text())
            copyToast('note')
        }
    }
    function statement() {
        if ( $(e.target).closest('.ref').length ) {
            copyToClipboard($(e.target).text())
            copyToast('ref')
        }
        if ( $(e.target).closest('.date').length ) {
            copyToClipboard($(e.target).text().split('Due')[0]  )
            copyToast('date')
        }
        if ( $(e.target).closest('.description').length ) {
            copyToClipboard($(e.target).closest('.description').text().replace(/ {3}.+/, '').trim() )
            copyToast('description')
        }
        if ( $(e.target).closest('.charge-made').length ) {
            copyToClipboard($(e.target).text().trim())
            copyToast('charge made')
        }
        if ( $(e.target).closest('.payments-received').length ) {
            copyToClipboard($(e.target).text().trim())
            copyToast('received')
        }
        if ( $(e.target).closest('.outstanding').length ) {
            copyToClipboard($(e.target).text().trim())
            copyToast('outstanding')
        }
    }
    function documents() {
        if ( $(e.target).closest('.name').length ) {
            let header = $(e.target).closest('.name').find('a').text()
            let body = $(e.target).closest('.name').find('.unimportant')[0].innerHTML.replace(/<br>/g, '\n')
            let compile = body ? header + '\n' + body : header;

            let headerLowerCase = header.toLowerCase()

            if ( headerLowerCase.includes('top') || headerLowerCase.includes('receipt') || headerLowerCase.includes('key') ) {

                let bodyArr = []

                for ( let i = 0; i < $(targets.documents.checkboxes).length - 1; i++ ) {

                    // if anything is checked , return
                    if ( $(targets.documents.checkboxes)[i].checked  ) {

                        // as something is checked, we want to loop over checked and push its data
                        for ( let i = 0; i < $(targets.documents.checkboxes).length; i++ ) {
                            if ( $(targets.documents.checkboxes)[i].checked  ) {
                                bodyArr.push( $($(targets.documents.checkboxes)[i].closest('tr')).find('.unimportant')[0].innerHTML.replace(/<br>/g, '\n') )
                            }
                        }

                        compile = header + '\n' + bodyArr.join('\n')

                        copyToClipboard( noteFormat_topup(compile) )
                        copyToast('multiple utility notes')
                        return;
                    }
                }
                copyToClipboard( noteFormat_topup(compile) )
                copyToast('utility note')
            } else {
                copyToClipboard(compile)
                copyToast('note')
            }   
        }
    }
    function tenantSearchTable() {
        if ( $(e.target).closest('.name').length ) {
            copyToClipboard($(e.target).text())
            copyToast(`ref`)
        }
        if ( $(e.target).closest('.tenant').length ) {
            copyToClipboard($(e.target).closest('.tenant').text().replace(/ {2}.+/, '').split('+')[0].trim())
            copyToast('name')
        }
        if ( $(e.target).closest('.unit-address').length ) {
            copyToClipboard($(e.target).text())
            copyToast('unit-address')
        }
    }


}

function noteFormat_topup( content ) {

    console.log(content)

    let split = content.split('\n')
    let header = split[0] + ' ― '
    let body = split.slice(1).join('; ')

    console.log( (header + body + ';').replace(/ ;/g, '') )

    return (header + body + ';').replace(/ ;/g, '') 
}

function copyToClipboard(text) {
    let temp = $("<textarea>");
    $('body').append(temp);
    temp.val(text).select();
    document.execCommand("copy");
    temp.remove();
}

function copyToast(text) {

    if ( $('.copyToast').length > 4 ) return;

    let x = event.pageX
    let y = event.pageY

	$(window).on('mouseup', calcMousePos)

	function calcMousePos(newMousePos) {

		if (Math.abs(x - newMousePos.pageX) > 1 || Math.abs(y - newMousePos.pageY) > 1) return;

        let elem = document.createElement('div')
        elem.innerHTML = icons.clipboard + ' ' + text
        elem.className = "copyToast"
        elem.style.backgroundColor = $('#main_nav').css('background-color')
        elem.style.left = event.pageX + "px"
        elem.style.top = event.pageY - 25 + "px"
        
        $('body').append(elem);
    
        $(elem).delay(618).animate({
            'opacity': 0,
            'top': event.pageY - 55 + "px",
        }, 618, function() {
            $(elem).remove()
        })

		$(window).off('mouseup', calcMousePos)
	}
}

function disableAccess(desc, remove) {

    if ( remove ) {
        removeDisableAccess()
        return;
    }
    if ( $('#disableAccess').length ) return;

    $('body').append(`  <div id="disableAccess">
                            <div id="disableDesc">${desc}</div>
                        </div>`)

    $('#disableAccess').hide().fadeIn(618)

    setTimeout( () => {
        if ( $('#disableAccess').length ) {
            $('#disableDesc').append('<br><div class="btn" style="transform: scale(1.75,1.75); margin-top: 48px" id="disableExit">This is taking too long! Get me out of here. 😠</div>')
            $('#disableExit').hide().fadeIn(1024)
            $('#disableExit').on('click', function() {
                removeDisableAccess()
            })
        }
    }, 5500)

    $('#disableClickCover').on('mousedown keydown', disableAccess)
    function disableAccess(e){
        e.preventDefault()
        return;
    }

    function removeDisableAccess() {
        $('#disableAccess').off('mousedown keydown scroll', disableAccess)
        $('#disableAccess').fadeOut(314, function() {
            $('#disableAccess').remove()
        })
    }

}

function quickAccess() {

    let html = `<div class="qaOption report" id="qaReport">
                    <div style="position: fixed; left: 27px">${icons.letter}</div>
                    Overdue Report</div>`

    $('#main_nav').append(html)

    $('.qaOption').on('click', qaActions)

    function qaActions(e) {
        if (e.target.id == 'qaReport'){
            qaGenOverdueReport()
        }
    }

    function qaGenOverdueReport() {
        disableAccess('<b style="font-size: 1.5em;">Please wait 📋</b><br>Generating overdue report...')

        let iframe = document.createElement('iframe')
        iframe.id = 'targetIframe'
        iframe.src = 'https://system.arthuronline.co.uk/flintonsprop/reports/edit/11441/'

        $('body').append(iframe)

        let interval;
        if ( !$(iframe).contents().find("body").length ) {
            interval = setInterval( () => findBody(), 25)
        }
        function findBody() {
            if ( $(iframe).contents().find("body").length ) {
                clearInterval(interval)
                iframeContents()
            }
        }

        setTimeout( () => iframeContents(), 3000)

        function iframeContents() {
            let contents = $(iframe).contents()
            contents.find('.daterangepicker .ranges ul li:nth-child(3)').click()
            contents.find('#runOutput')[0].selectedIndex = 4;
            contents.find('.save-and-run .btn').click()
            setTimeout( () => iframe.remove(), 5000 )
            disableAccess('', true)
        }
    }
}

function quickNotes() {
    let html = `<div id="quickNotes">
                    <div id="qnPhone" class="btnCirc">${icons.phone}</div>
                    <div id="qnVoicemail" class="btnCirc">${icons.vm}</div>
                    <div id="qnEmail" class="btnCirc">${icons.email}</div>
                    <div id="qnReceipt" class="btnCirc">${icons.receipt}</div>
                </div>`

    $('#content-wrapper').append(html)

    $('#quickNotes').on('mousedown', quickNoteActions)
    function quickNoteActions(e) {


        if ( e.target.closest('div').id == 'qnPhone') {
            copyToClipboard(`PHONED tenant at ${currentTime()} on ${currentDateLegacy()} regarding `)
        }
        if ( e.target.closest('div').id == 'qnVoicemail') {
            copyToClipboard(`Left VOICEMAIL at ${currentTime()} on ${currentDateLegacy()} regarding `)
        }
        if ( e.target.closest('div').id == 'qnEmail') {
            copyToClipboard(`EMAILED tenant at ${currentTime()} on ${currentDateLegacy()} regarding `)
        }
        if ( e.target.closest('div').id == 'qnReceipt') {
            let tenantPayDay = String(storage.tenancyStartDate.match(/\d{4}-\d{1,2}-(\d{1,2})/)[1]).padStart(2, '0')
            copyToClipboard(`Top-up receipts approved to be deducted from rent due ${tenantPayDay}/`)
        }
    }
}

function addTransactionBtn(e) {
    if ( e.target.closest( targets.addTransaction.btn ) ) {
        topupProcessing()
    }

    function topupProcessing() {
        let desc;
        let date;
        let amount;

        new Promise( function(resolve) {
            waitForIframeExistance('#dialog iframe', targets.addTransaction.amount , resolve)
        }).then( () => {
            //$('#dialog iframe').contents().find( targets.addTransaction.desc ).on('change', descChange)
            $('#dialog iframe').contents().find( targets.addTransaction.desc ).on('paste', function() {
                setTimeout( () => descChange(), 32)
            })

            desc = $('#dialog iframe').contents().find( targets.addTransaction.desc )
            date = $('#dialog iframe').contents().find( targets.addTransaction.date )
            amount = $('#dialog iframe').contents().find( targets.addTransaction.amount )
        } )

        function descChange() {
            let current = currentDate().split('-')
            let dayAndMonth = desc.val().match(/(?<=deduct).*?(\d{1,2})[/.-](\d{1,2})/)
            let day = dayAndMonth[1]
            let month = dayAndMonth[2]
            let year = current[0]
            if ( +current[1] == 12 && +month == 1 ) {
                year++
            }
            date.val(`${year}-${month}-${day}`)

            parseDesc()
        }
        function parseDesc() {

            let topUps = desc.val().split(' ― ')[1].split(';')
                topUps.splice(topUps.length - 1, 1)
            let arr = []

            for(let i = 0; i < topUps.length; i++) {
                console.log(topUps[i])

                if (topUps[i].includes('dup')) {
                    continue;
                } else if (topUps[i].includes('app') && topUps[i].includes('rej')) {

                    let match
                    try {
                        match = topUps[i].match(/(?<=app\w+) £?((\d+)(\.?(\d+))?)/)[1]
                    } catch(err) {
                        match = topUps[i].match(/((\d+)(\.?(\d+))?)(?= app)/)[1]
                    }
                    arr.push( +match )

                } else if (topUps[i].includes('rej')) {
                    continue;
                } else {
                    arr.push( +topUps[i].match(/£((\d*)\.?(\d*))/)[1] )
                }
            }

            // populate value field
            if ( arr.length == 1) {
                amount.val( -arr[0] )
            } else {
                amount.val( -arr.reduce( (prev, curr) => prev + curr ) )
            }            
        }
    }
}

function loadIcons() {
    icons.percent = `<img style="filter: invert(100%); height: 20px; width: 20px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAA9klEQVRIie2UOw6CQBRFj53f1sRVuAoLURtWopWfljXgWlyCn87EPRjssLFCi7lGVJCBUFB4EkLezHDfm5l3gT9VZQTsgaveTsq6BuAWEb8nPElJfM15eRIc9NEcaAELxbuPdRMgAm5AP0+CUIJtxR3FYWxNDwg0PssjDubM78BSSVa876AGbDS2UZyLAWbrn3cw1PxM8UU7KYSjiq/ANibex5x5hLmDUqkDR0z1ftniAGuJn4Bm2eJJLWlrxky6wBlT/VRjY+zN+JO0lrQ1YybPlgx4b0kbM2byqyWzzGiFR3pLOnyff8TLL9a4mF9yEmlm/FMxHpirXwLh4+GPAAAAAElFTkSuQmCC">`,
    icons.clipboard = `<img style=" width: 14px; height: 14px; margin-top: -2px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsSAAALEgHS3X78AAAAgUlEQVRIie2VQQqAIBBFn9ExovtE9+ji0z2mTYJKaE1Zi/wgunDmyf8wOlWlprqq3RPADKyAGtehXGCRAMONx7oSQHMXrXo1g1TWTASYfJOcRXcyEWAsAayZRHWfZtAADfAXQB+cH52iXp9atO675WeTM4AlgFyR7LVAPE2rqHoGG9+QR9qv/pARAAAAAElFTkSuQmCC">`,
    icons.copy = `<img class="genCopyIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAWBJREFUaIHtmKFOA0EQhv/ZrihJBRKBRFTUInB9BUjqEVUXDCEhQaArCgpNcr6iBolENEFgKnmAPsCFJg13g2pCZo+EvfRuuDCf29nkbr7M7k1uAMP431BZcJQkvXzdnRQFhkQ0aDKheXpfmtNPeBkYJUlv87H36oA+RT1KBycD+bo7cUBfI5kqBAJFgaFGIlUJjpA887FnsmmCCrQNE9AmuAO/ock+wcxLcrTw7G5n6XQl96MrsO0TzHTRRJMjogEY4w3yt7Px9aHcjxbQ6hMOdIDP/CGMR6LZJxjhu6PvQNN94vT8ir8t9+V+679CJqCNCWhjAtqYgDYmoI0JaGMC2piANiagTfBP/NdnoZLWV8AEtImfCzHemXC0XYu5Ta0wI5Ox+AoQXnaSTTUWMhAt0IG7KcDBlLhumJGRp0sZjxaYpdNVx/tjMJ7KSrprmJEx45k8ncwf75Z1v88w2sYX2olePMs5UyEAAAAASUVORK5CYII=">`,
    icons.letter = `<img style="width: 17px; height: 17px;margin-top: -1px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAQAAAD8x0bcAAAAcElEQVR4AZ3KoRGAMBBE0YNuSBO0gsEhY2FSC5XQAS5DJ6hkITHczawA/rdPPoQOQT1wdODpBOAZ0m3whnEkgskwiu4wIltm0Y6+vgIW8f6gXG/UuczQouaIbVGqt+pUZmhWc8S2KIIVLXIIZCfvuwD++D9vDI3s3wAAAABJRU5ErkJggg==">`,
    icons.phone = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAABA0lEQVR4Ae3UMSgFUBTH4SNPYWGhTDLJbBPCoIyCwV7CYLAYhDJaTRY2MSiSwURZpNjLCqO32PQx6d0yvHfv+r6z/+os/2hqhBW7f7elM/KYkzqIPDalHiKPVamXyGNJqhp5jCA1GDn0SLEceXxIHUYex1LrkceiWjfaIo8OXwCutEU+Z4ArlShhEjAQpTyC6yhlHDAbpRyBd31RRrd38Kwjyhj1DS6ilDXAmfaoocWOfRMqUS/bgCe9NZkTQNWdW7dO63jfHuDVQvzS6kQK1hob33vDzv1nN+phxqdEA6GUfpcFoZQZTwWhlDHHPrNDKRXTDrypNR/5dBkyZcmG1WhqwA+OqfZX7C8frQAAAABJRU5ErkJggg==">`,
    icons.vm = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAABh0lEQVR4Ae3TM6CWURgA4DfbXLKnzKk127Ybs+227DlrryXXFsZsm0/+6r/hYonPuxz7xG/pv/8UMsR+Fz1x3HL14/tCQ8sd99hF+wxRIFLp75ZU25WKNJSyXaob+sYXFvieq6rGV1Rz1fcsiI8MAFzQS/YI5a31BpyTLF1B58Aba5WPkF0vFwADIkJZD8EauSOhsZtgcVKyFNzUOBLyWA0eKhtmg6OyRQotwXP54h35PAetIoVsDoPZ4SToEd9wFrSJd7QFZ7/Tqjs4Fe6Ast9pshKMjneMBau+06oMuBOeg/zfabIQjI93TASLvtMqH3gRLoK632myM7mRMAjs+k6rOuBi2Pb9uRT1FFSLd9QATxWNNCwC20JH8EitSGELOJjkj4LNkUJNj0CniHAA3DNM9vhAFXsBzZIuzQF7VYwP5DDSPZLplHYZcNYsM2zwAnDRDEm4BHhhgxlmOQu4kvxKFZ2RVWdUTL3E8S7JrEvGyxtpyaaRQaabkYGYZpCGssV///3l3gLdS5QBUjZf7QAAAABJRU5ErkJggg==">`,
    icons.email = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAAA00lEQVR4Ae3QAQbCUBzH8X8FpBOkMwQdIoi6SZ0ghlSgblIIO0RhZ8hjAyEB1Tf+FP/ZHnvAsg/Y4/lu+0mdNYhIqSolomUzK0JtbcgR6mZDLwAmFYKOCaogJEKPnT77PdnTFSkPKYYk+CQMRZWGONHXU4c5D4rcWdDWO31O5SF7MSYvLnqRDb0LP32K4+vKzP66P2TG/I2fP+MPWY6xKEaMRDHGoSqE1FE3UQw4oPyhMjq+HTcopC6cUeEhqwn9bSglVGpDa0JtxGJJRlUZkTRq7ANaQCOJt++IMQAAAABJRU5ErkJggg==">`,
    icons.receipt = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAAAgklEQVR4Ae2RAQaAQBBF9x6hPVrRETrAANCpooMUAUQ3eLEGaJkJonb/4I+HBz8UEHqa1IKkjswO0t1FwkaDADASWcFBJCeCEw2HtkWyoscpWCT2uUTBkXdFiH11tbpaXa2u9hXRiUY/m2RFK5FJd2vZwSY5UUdMPSGpWxYHGcL/cwGEQwsHbI/lEwAAAABJRU5ErkJggg==">`
}

function appendCSS() {

    const colors = {
        red: '#d64a65',
        blue: '#1facf0',
        green: '#8BC34A',
    }

    const copyToast = `.copyToast{
                            position: absolute;
                            color: white;
                            font-family: 'Open Sans', sans-serif;
                            text-transform: uppercase;
                            font-size: 0.75rem;
                            font-weight: 600;
                            padding: 4px 9px;
                            border-radius: 12px;
                            transform: translate(-50%, -50%);
                            z-index: 9999;
                            pointer-events: none;
                        }`

    const tenantHeaderTweaks = `.left-side-detail > :nth-child(3){
                                    margin-right: -40px;
                                }
                                .left-side-detail{
                                    width: calc(50% + 200px) !important;
                                }`

    const tenantToolbox = ` #tenantToolbox {
                                width: 240px;
                            }
                            #tenantToolbox .option{
                                display: flex;
                                cursor: pointer;
                                user-select: none;
                                margin-bottom: 7px;
                                transition: 314ms;
                            }
                            #tenantToolbox .option:hover{
                                filter: brightness(125%);
                            }
                            #tenantToolbox .option:active{
                                filter: brightness(70%) contrast(250%);
                                transition: 32ms;
                            }
                            #tenantToolbox .icon{
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                width: 22px;
                                height: 22px;
                                border-radius: 4px;
                                margin-right: 10px;
                                background: dimgray;
                            }
                            #tenantToolbox span{
                                padding-top: 1px;
                                font-weight: 600;
                                font-size: 15px;
                                color: dimgray;
                            }

                            #tenantToolbox .icon.red{
                                background: #DA3C5A;
                            }
                            #tenantToolbox span.red{
                                color: #DA3C5A;
                            }`

    const tenantSummaryTweaks = `* {
                                    outline: 0px dashed rgba(0, 0, 256, 0.1);
                                }
                                
                                .retailspace-horizontal .header {
                                    display: none;
                                }
                                .summary-wrapper hr:nth-child(2) {
                                    display: none;
                                }
                                .summary-group-container .detail.detail div:first-child,
                                .summary-group-container .detail.detail div:nth-child(4),
                                .summary-group-container .detail.detail div:nth-child(5) {
                                    display: none;
                                }
                                .summary-group-container .detail div:nth-child(2) div {
                                    font-size: 2.3rem !important;
                                    letter-spacing: 0.1618rem;
                                    padding: 18px 0 16px 0;
                                    margin-left: -2px;
                                }
                                .summary-group-container .detail div:nth-child(3) div {
                                    font-size: 1.2rem !important;
                                    padding: 12px 0 0 0;
                                }
                                .summary-group-container .status-container div {
                                    display: none;
                                }`

    const tenantReadabilityTweaks = `.numeric {
                                        font-size: 1.218em;
                                        font-weight: 600;
                                    }`

    const statementReport = `.btnSpecial {
                                position: fixed;
                                z-index: 1001;
                                left: 240px;
                                bottom: 18px;
                                outline: 0;
                            }
                            .btnPad{
                                padding: 11px;
                            }
                            .textareaSpecial {
                                position: fixed;
                                font-family: 'Open Sans', sans-serif;
                                box-sizing: border-box;
                                font-size: 16px;
                                line-height: 2em;
                                bottom: 62px;
                                z-index: 1000;
                                left: 240px;
                                resize: none;
                                padding: 6px 10px;
                                color: #516073;
                                background: #f5f7fa;
                                white-space: nowrap;
                            }
                            .textareaSpecial:focus {
                                outline: 0;
                                box-shadow: -40px 70px 175px rgba(0,0,0,0.15), 0 8px 12px rgba(0,0,0,0.14) !important;
                                border: 1px solid #8ba2af;
                            }
                            .textareaSpecial::selection{
                                background: #8ba2af;
                                color: white;
                            }
                            .genCopyIcon {
                                position: fixed;
                                bottom: 78px;
                                z-index: 1001;
                                filter: brightness(170%);
                            }
                            .genCopyIcon:hover {
                                filter: hue-rotate(350deg) brightness(140%) contrast(300%);
                            }
                            .genCopyIcon:active {
                                filter: none;
                            }`

    const modal = ` #fModal{
                        font-family: 'Open Sans', sans-serif;
                        transform: translate(-50%, 0%);
                        position: fixed;
                        top: 15%;
                        left: 50%;
                        z-index: 2001;
                        width: 460px;
                    }
                    #fModal .header{
                        display: flex;
                        align-items: center;
                        background: dimgray;
                        height: 68px;
                        font-size: 20px;
                        font-weight: 400;
                        color: white;
                        padding-left: 24px;
                        border-radius: 6px 6px 0 0;
                        cursor: grab;
                        user-select: none;
                        box-shadow: 0 8px 24px rgba(0,0,0,0.05), 0 8px 4px rgba(0,0,0,0.1618);
                    }
                    #fModal .header:active{
                        cursor: grabbing;
                    }
                    #fModal .body{
                        border-bottom: 1px solid #ECECEC;
                        padding: 14px 24px;
                        font-size: 16px;
                        background: #fff;
                        line-height: 2.75rem;
                        letter-spacing: 0.314px;
                        box-shadow: 0 8px 24px rgba(0,0,0,0.05), 0 8px 4px rgba(0,0,0,0.1618);
                    }
                    #fModal .body hr{
                        margin: 16px -24px 10px -24px;
                        border: 0.5px solid #ececec;
                    }
                    #fModal .footer{
                        display: flex;
                        justify-content: space-between;
                        padding: 12px 24px;
                        height: 52px;
                        background: #fff;
                        border-radius: 0 0 6px 6px;
                        box-shadow: 0 8px 24px rgba(0,0,0,0.05), 0 4px 4px rgba(0,0,0,0.1618);
                    }
                    #fModal .left{
                        align-self: center;
                        font-size: 16px;
                        margin-top: -4px;
                    }
                    #fModal .right{
                        align-self: center;
                    }
                    #fModal .btn{
                        background: dimgray;
                        user-select: none;
                        border-radius: 3px;
                        padding: 11px 15px;
                        margin-left: 12px;
                    }
                    #fModal .btn:hover{
                        filter: brightness(115%);
                    }
                    #fModal .btn:active{
                        filter: brightness(80%) contrast(150%);
                        transition: 64ms;
                    }
                    #fModal b{
                        cursor: default;
                        letter-spacing: 0.618px;
                        border-bottom: 1px dashed gainsboro;
                        padding: 0 4px 4px 4px;
                    }
                    #fModal b.start{
                        padding: 0 4px 4px 0;
                    }`

    const modalInputs = `#fModal input::-webkit-inner-spin-button,
                        #fModal input::-webkit-outer-spin-button{
                            -webkit-appearance: none; 
                            margin: 0; 
                        }
                        #fModal input::-webkit-calendar-picker-indicator{
                            opacity: 0.75;
                            padding: 6px 0 6px 6px;
                            margin-left: -12px;
                        }
                        #fModal input::-webkit-clear-button{
                            display: none;
                        }
                        #fModal input[type="date"]::-webkit-calendar-picker-indicator {
                            width: 10px;
                            height: 10px;
                        }
                        #fModal input{
                            position: relative;
                            top: 6px;
                            font-size: inherit;
                            font-family: inherit;
                            font-weight: 700;
                            border: 0;
                            outline: 0;
                            border-radius: 0;
                            box-shadow: none;
                            border-bottom: 1px solid gray;
                            transition: 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);
                            letter-spacing: 0.618px;
                            padding: 0 2px 4px 2px;
                            cursor: pointer;
                        }
                        #fModal input:hover{
                            top: 8px;
                            padding-bottom: 8px;
                        }
                        #fModal input:focus{
                            top: 8px;
                            color: dimgray;
                            border-bottom: 2px solid dimgray;
                            padding: 0 8px 7px 8px;
                        }
                        #fModal .percent{
                            margin-top: -1px;
                            padding-top: -1px;

                        }`

    const modalColorVariation = `   #fModal .header.red{
                                        background: ${colors.red};
                                    }
                                    #fModal .header.blue{
                                        background: ${colors.blue};
                                    }
                                    #fModal .header.green{
                                        background: ${colors.green};
                                    }
                                    #fModal .btn.red{
                                        background: ${colors.red};
                                    }
                                    #fModal .btn.blue{
                                        background: ${colors.blue};
                                    }
                                    #fModal .btn.green{
                                        background: ${colors.green};
                                    }
                                    #fModal.red *::selection{
                                        background: ${colors.red} !important;
                                        color: white;
                                    }
                                    #fModal.blue *::selection{
                                        background: ${colors.blue} !important;
                                        color: white;
                                    }
                                    #fModal.green *::selection{
                                        background: ${colors.green} !important;
                                        color: white;
                                    }
                                    #fModal input.red:focus{
                                        color: ${colors.red};
                                        border-bottom: 2px solid #d64a65;
                                    }
                                    #fModal input.blue:focus{
                                        color: ${colors.blue};
                                        border-bottom: 2px solid #d64a65;
                                    }
                                    #fModal input.green:focus{
                                        color: ${colors.green};
                                        border-bottom: 2px solid #d64a65;
                                    }
                                    #fModal .totalStyle{
                                        padding-bottom: 6px;
                                        border-bottom: 1px solid #d64a65;
                                    }`     
                                    
    const disableAccess = `#disableAccess {
                                display: flex;
                                position: fixed;
                                top: 0;
                                left: 0;
                                align-items: center;
                                justify-content: center;
                                color: lightgray;
                                background: rgba(0,6,12,0.65);
                                height: 100vh;
                                width: 100vw;
                                z-index: 9999;
                                cursor: wait;
                                user-select: none;
                                backdrop-filter: blur(4px);
                            }
                            #disableDesc {
                                transition: 314ms;
                                font-family: 'Open Sans', sans-serif;
                                font-size: 3.5em;
                                line-height: 1.5em;
                                text-align: center; 
                                margin-top: -128px;
                            }`

    const quickAccess = `.qaOption.report{
                            box-sizing: border-box;
                            position: absolute;
                            font-size: inherit;
                            transition: color 314ms;
                            background: #0693d7;
                            padding-left: 68px;
                            padding-bottom: 18px;
                            padding-top: 12px;
                            bottom: 0;
                            width: 220px;
                            cursor: pointer;
                        }
                        .qaOption:hover{
                            color: white;
                                padding-left: 63px;
                            border-left: 5px solid #ffffff;
                        }
                        .qaOption.report:active{
                            font-weight: bold;
                        }
                        nav div ul li a[title="Settings"]{
                            padding-bottom: 34px;
                        }
                        #targetIframe{
                            position: fixed;
                            left: 0;
                            top: 0;
                            height: 200px;
                            width: 200px;
                        }`

    const quickNotes = `#quickNotes {
                            pointer-events: none;
                            z-index: 9999;
                            display: flex;
                            position: fixed;
                            bottom: 0px;
                            right: 76px;
                            padding: 1.2rem;
                        }
                        .btnCirc {
                            pointer-events: visible;
                            background: #2392EC;
                            color: white;
                            border-radius: 100%;
                            margin-left: 0.75rem;
                            transition: 128ms;
                            height: 45px;
                            width: 45px;
                            box-shadow: 0px 0px 18px 0px rgba(0, 0, 0, 0.15);
                            cursor: pointer;
                        }
                        .btnCirc:hover {
                            filter: brightness(120%);
                            transform: scale(1.055, 1.055);
                        }
                        .btnCirc:active {
                            transition: 64ms;
                            filter: brightness(85%) saturate(75%) contrast(150%);
                            transform: scale(0.75, 0.75);
                        }
                        .btnCirc img{
                            pointer-events: visible;
                            padding: 8px;
                            -webkit-user-drag: none;
                            transition: 314ms;
                            width: 28px;
                            height: 28px;
                        }
                        .btnCirc img:hover{
                            transform: scale(1.1, 1.1);
                        }`

    const style = ` <style>
                        ${copyToast}
                        ${tenantHeaderTweaks}
                        ${tenantToolbox}
                        ${tenantSummaryTweaks}
                        ${tenantReadabilityTweaks}
                        ${statementReport}
                        ${modal}
                        ${modalInputs}
                        ${modalColorVariation}
                        ${disableAccess}
                        /* ${quickAccess} */
                        ${quickNotes}
                    </style>`

    $('head').append(style)
}