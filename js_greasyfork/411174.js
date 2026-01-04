// ==UserScript==
// @name             SDD da bozza per Odoo
// @namespace        https://andrealazzarotto.com/
// @version          1.1.1
// @description      Genera SDD a partire dalle fatture in bozza
// @author           Andrea Lazzarotto
// @match            https://odoo.g2b.it/web*
// @match            https://odoo2.g2b.it/web*
// @match            https://dbs.it/web*
// @grant            none
// @require          https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.6/handlebars.min.js
// @downloadURL https://update.greasyfork.org/scripts/411174/SDD%20da%20bozza%20per%20Odoo.user.js
// @updateURL https://update.greasyfork.org/scripts/411174/SDD%20da%20bozza%20per%20Odoo.meta.js
// ==/UserScript==


// https://stackoverflow.com/a/18197341
function download(text, filename, mimetype) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:' + mimetype + ';charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function post(where, data) {
    return $.ajax(where, {
        type: 'post',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
    });
}

function fill(invoice) {
    return $.when(post('/web/dataset/search_read', {
        "jsonrpc": "2.0",
        "method": "call",
        "params": {
            "model": "account.banking.mandate",
            "domain": [
                [ "partner_id", "=", invoice.partner_id[0] ],
                [ "state", "=", "valid" ]
            ],
            "fields": [
                "id",
                "company_id",
                "partner_id",
                "format",
                "unique_mandate_reference",
                "scheme",
                "type",
                "recurrent_sequence_type",
                "signature_date",
                "last_debit_date",
                "state",
                "partner_bank_id"
            ],
            "limit": 2,
            "sort": ""
        }
    })).then((data) => {
        invoice.mandate = data.result.records[0] || null;
        if (invoice.mandate) {
            invoice.mandate.iban = invoice.mandate.partner_bank_id[1].replace(/\s+/g, '');
        }
        invoice.fixed_amount = invoice.amount_total.toFixed(2);
        invoice.partner_name = invoice.partner_id[1];
        return invoice;
    });
}

function xml(invoices, date) {
    const creation = (new Date()).toISOString();
    const identifier = "SDD" + creation;
    const transactions = invoices.length;
    var amount = 0.00;
    invoices.forEach((e) => {
        amount += e.amount_total;
    });

    const context = {
        creation: creation,
        identifier: identifier,
        transactions: transactions,
        amount: amount.toFixed(2),
        invoices: invoices,
        expiration: date,
    };

    const source_template = `<?xml version='1.0' encoding='UTF-8'?>
<CBIBdySDDReq xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns="urn:CBI:xsd:CBIBdySDDReq.00.01.00" xsi:schemaLocation="urn:CBI:xsd:CBIBdySDDReq.00.01.00 CBIBdySDDReq.00.01.00.xsd">
    <PhyMsgInf>
        <PhyMsgTpCd>INC-SDDB-01</PhyMsgTpCd>
        <NbOfLogMsg>1</NbOfLogMsg>
    </PhyMsgInf>
    <CBIEnvelSDDReqLogMsg>
        <CBISDDReqLogMsg>
            <GrpHdr xmlns="urn:CBI:xsd:CBISDDReqLogMsg.00.01.00">
                <MsgId>{{ identifier }}</MsgId>
                <CreDtTm>{{ creation }}</CreDtTm>
                <NbOfTxs>{{ transactions }}</NbOfTxs>
                <CtrlSum>{{ amount }}</CtrlSum>
                <InitgPty>
                    <Nm>Gruppo 2B srls</Nm>
                    <Id>
                        <OrgId>
                            <Othr>
                                <Id>SIABSLQ2</Id>
                                <Issr>CBI</Issr>
                            </Othr>
                        </OrgId>
                    </Id>
                </InitgPty>
            </GrpHdr>
            <PmtInf xmlns="urn:CBI:xsd:CBISDDReqLogMsg.00.01.00">
                <PmtInfId>{{ identifier }}_1</PmtInfId>
                <PmtMtd>DD</PmtMtd>
                <BtchBookg>false</BtchBookg>
                <PmtTpInf>
                    <SvcLvl>
                        <Cd>SEPA</Cd>
                    </SvcLvl>
                    <LclInstrm>
                        <Cd>B2B</Cd>
                    </LclInstrm>
                    <SeqTp>RCUR</SeqTp>
                </PmtTpInf>
                <ReqdColltnDt>{{ expiration }}</ReqdColltnDt>
                <Cdtr>
                    <Nm>Gruppo 2B srls</Nm>
                    <PstlAdr>
                        <Ctry>IT</Ctry>
                        <AdrLine>Via Quarta Armata 15</AdrLine>
                    </PstlAdr>
                </Cdtr>
                <CdtrAcct>
                    <Id>
                        <IBAN>IT20Q0200860700000105318843</IBAN>
                    </Id>
                </CdtrAcct>
                <CdtrAgt>
                    <FinInstnId>
                        <ClrSysMmbId>
                            <MmbId>02008</MmbId>
                        </ClrSysMmbId>
                    </FinInstnId>
                </CdtrAgt>
                <ChrgBr>SLEV</ChrgBr>
                <CdtrSchmeId>
                    <Id>
                        <PrvtId>
                            <Othr>
                                <Id>IT04ZZZ0000003863480244</Id>
                                <SchmeNm>
                                    <Prtry>SEPA</Prtry>
                                </SchmeNm>
                            </Othr>
                        </PrvtId>
                    </Id>
                </CdtrSchmeId>
                {{#each invoices}}
                <DrctDbtTxInf>
                    <PmtId>
                        <InstrId>L{{ @index }}</InstrId>
                        <EndToEndId>L{{ @index }}</EndToEndId>
                    </PmtId>
                    <InstdAmt Ccy="EUR">{{ fixed_amount }}</InstdAmt>
                    <DrctDbtTx>
                        <MndtRltdInf>
                            <MndtId>{{ mandate.unique_mandate_reference }}</MndtId>
                            <DtOfSgntr>{{ mandate.signature_date }}</DtOfSgntr>
                        </MndtRltdInf>
                    </DrctDbtTx>
                    <Dbtr>
                        <Nm>{{ partner_name }}</Nm>
                    </Dbtr>
                    <DbtrAcct>
                        <Id>
                            <IBAN>{{ mandate.iban }}</IBAN>
                        </Id>
                    </DbtrAcct>
                    <Purp>
                        <Cd>GDSV</Cd>
                    </Purp>
                    <RmtInf>
                        <Ustrd>Inv{{ id }}</Ustrd>
                    </RmtInf>
                </DrctDbtTxInf>
                {{/each}}
            </PmtInf>
        </CBISDDReqLogMsg>
    </CBIEnvelSDDReqLogMsg>
</CBIBdySDDReq>`;
    const template = Handlebars.compile(source_template);
    const xml = template(context);

    download(xml, identifier + ".xml", "application/xml");
}

function generate(invoices, selected, date) {
    selected = selected.map((e) => parseInt(e));
    var filtered = invoices.filter((e) => selected.includes(e.id));

    Promise.all(filtered.map(fill)).then((values) => {
        xml(values, date);
    });
}

function showcase(invoices) {
    $('#showcase').remove();
    var showcase = $(`
    <div id="showcase">
        <h4>Selezionare le fatture e la data</h4>
        <p><select id="invoices" multiple></select></p>
        <p>Data SDD: <input id="sdd_date" type="date"></input></p>
        <p><button id="generate">Genera</button> <button id="cancel">Annulla</button></p>
    </div>
    `);
    invoices.forEach((element) => {
        showcase.find('select').append(`<option value="${element.id}">${element.date_invoice} - ${element.partner_id[1] || ""} - €${element.amount_total}</option>`);
    });

    showcase.find('select').css({
        'height': '20rem',
        'width': '60vw',
    });
    showcase.find('#generate').click(() => {
        generate(invoices, showcase.find('select').val(), showcase.find('#sdd_date').val());
    });
    showcase.find('#cancel').click(() => {
        $('#showcase').remove();
    });
    showcase.css({
        'z-index': '9999',
        'padding': '2rem',
        'background': 'white',
        'border': '1px solid grey',
        'position': 'absolute',
        'top': '50%',
        'left': '50%',
        'transform': 'translate(-50%, -50%)',
    }).appendTo('body');
}

function activate() {
    post('/web/dataset/search_read', {
        "jsonrpc": "2.0",
        "method": "call",
        "params": {
            "model": "account.invoice",
            "domain": [
                ["type", "=", "out_invoice"],
                ["state", "=", "draft"],
                ["mandate_required", "=", true],
            ],
            "fields": [
                "number", "partner_id", "date_invoice",
                "date_due", "amount_untaxed", "amount_tax",
                "amount_sp", "amount_total", "amount_net_pay"
            ],
            "limit": 150
        }
    }).done((data) => {
        var invoices = data.result.records;
        showcase(invoices);
    });
}

(function () {
    'use strict';

    var button = $('<button>Genera SDD da bozze</button>');
    button.css({
        'position': 'absolute',
        'bottom': '2rem',
        'right': '2rem',
        'background': 'white',
        'border': '1px solid grey',
        'border-radius': '1rem',
        'font-size': '1.5rem'
    });
    button.click(activate);
    $('body').append(button);
})();