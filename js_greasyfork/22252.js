// ==UserScript==
// @name         Workflowy dentistas compute
// @namespace    http://alhur.es/
// @version      0.16
// @description  Compute many things.
// @author       fiatjaf
// @match        https://workflowy.com/*
// @require      https://greasyfork.org/scripts/22247-workflowy-selector-parser/code/Workflowy%20selector%20parser.js?version=141751
// @require      https://greasyfork.org/scripts/22313-workflowy-computable-values/code/Workflowy%20computable%20values.js?version=143441
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/22252/Workflowy%20dentistas%20compute.user.js
// @updateURL https://update.greasyfork.org/scripts/22252/Workflowy%20dentistas%20compute.meta.js
// ==/UserScript==

(function() {
    'use strict'

    if (location.pathname !== '/s/GPEC8RCSsR') {
        return
    }

    waitFor('.mainTreeRoot', () => {
        console.log('starting')
        start()
    })

    registerScript({
        id: 'count',
        selector: "'pacientes'",
        script: function (a) { return a.length },
        color: '#31adaf'
    })

    registerScript({
        id: 'sum',
        selector: '/(pagamentos|despesas|orçamentos)/',
        script: function (children) {
            var sum = 0.0
            children.forEach(c => {
                sum += parseMoney(c.name)
            })
            return 'total: R$ ' + sum.toFixed(2).replace('.', ',')
        },
        color: '#866b63'
    })

    registerScript({
        id: 'lastmarcelo',
        selector: "'despesas'",
        script: function (children, node) {
            if (children.length === 0) return ''
            const lastday = parseDay(children[0].name)
            const lastdaystr = lastday.join('~')
            var sum = 0.0

            children
            .filter(c => parseDay(c.name).join('~') == lastdaystr)
            .filter(c => isMarceloPag(c.name))
            .forEach(c => {
                sum += parseMoney(c.name)
            })
            return 'marcelo: R$ ' + sum.toFixed(2).replace('.', ',')
        },
        color: '#da9079'
    })

    registerScript({
        id: 'lastcartao',
        selector: "'pagamentos'",
        script: function (children, node) {
            if (children.length === 0) return ''
            const lastday = parseDay(children[0].name)
            const lastdaystr = lastday.join('~')
            var sum = 0.0

            children
            .filter(c => parseDay(c.name).join('~') == lastdaystr)
            .filter(c => isCartaoCheque(c.name))
            .forEach(c => {
                sum += parseMoney(c.name)
            })
            return 'cartão/cheque: R$ ' + sum.toFixed(2).replace('.', ',')
        },
        color: '#da9079'
    })

    registerScript({
        id: 'last',
        selector: '/(pagamentos|despesas)/',
        script: function (children, node) {
            if (children.length === 0) return ''
            const lastday = parseDay(children[0].name)
            const lastdaystr = lastday.join('~')
            var sum = 0.0

            children
            .filter(c => parseDay(c.name).join('~') == lastdaystr)
            .forEach(c => {
                sum += parseMoney(c.name)
            })
            return 'dia ' + lastday[2] + ': R$ ' + sum.toFixed(2).replace('.', ',')
        },
        color: '#d6613b'
    })

    registerScript({
        id: 'caixa',
        selector: '/\\d\\d\\d\\d/ > *',
        script: function (children) {
            var despesas = 0.0
            var despesasmarcelo = 0.0
            var despesasday = ''
            var pagamentos = 0.0
            var pagamentoscartao = 0.0
            var pagamentosday = ''
            children.forEach(c => {
                if (!c['script-last']) return
                switch (c.name) {
                    case 'despesas':
                        despesas += parseMoney(c['script-last'])
                        despesasmarcelo += parseMoney(c['script-lastmarcelo'])
                        despesasday = c['script-last'].slice(0, c['script-last'].search(':'))
                        break
                    case 'pagamentos':
                        pagamentos += parseMoney(c['script-last'])
                        pagamentoscartao += parseMoney(c['script-lastcartao'])
                        pagamentosday = c['script-last'].slice(0, c['script-last'].search(':'))
                        break
                }
            })

            var sum
            var day
            despesas = despesas - despesasmarcelo
            pagamentos = pagamentos - pagamentoscartao
            if (despesasday > pagamentosday) {
                day = despesasday
                sum = -despesas
            } else if (pagamentosday > despesasday) {
                day = pagamentosday
                sum = pagamentos
            } else if (despesasday && pagamentosday) {
                day = despesasday
                sum = pagamentos - despesas
            } else {
                return ''
            }

            return 'caixa ' + day + ': R$ ' + sum.toFixed(2).replace('.', ',')
        },
        color: '#0fce77'
    })

    const DRE = /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/
    function parseDay (name) {
        var day
        name.replace(DRE, (_, d, m, y) => {
            day = [parseInt(y), parseInt(m), parseInt(d)]
        })
        return day
    }

    const MRE = /R\$ *([\d\.]+),(\d\d)/
    function parseMoney (str = '') {
        let m = str.match(MRE)
        if (m) {
            return parseFloat(m[1].replace('.', '') + '.' + m[2])
        }
        return 0
    }

    function isMarceloPag (str) {
        return str.search('Marcelo pag') !== -1 ||
            str.search('Marcelo Pag') !== -1 ||
            str.search('#marcelo') !== -1
    }

    function isCartaoCheque (str) {
        return str.search('#cartão') !== -1 || str.search('#cheque') !== -1
    }

})();