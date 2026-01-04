// ==UserScript==
// @name FatturaElettronica Styling
// @description Reader for the Italian Electronic Invoice (Fattura Elettronica) xml files
// @namespace 3v1n0.net
// @version 0.6
// @include /^[A-z0-9]+:\/\/.*\/(IT([0-9]{11}|[0-9A-z]{11,16})|[A-Z]{2}[0-9A-z]{2,28})_[0-9A-z]{5}(_(RC|NS|MC|MT|EC|SE|NE|DT|AT)__?[0-9]{3})?\.xml(\.p7m)?$/
// @include /^[A-z0-9]+:\/\/.*\/Canonical Invoice.*\.xml$/
// @inject-into auto
//
// @grant GM_getResourceText
// @resource sdi_ordinaria https://www.fatturapa.gov.it/export/documenti/fatturapa/v1.2/fatturaordinaria_v1.2.xsl
// @resource aruba_ordinaria https://webmail.pec.it/fatturapa/xsl/aruba/fatturapa_vFPR12.xsl?_v_=1.3
// @resource asso_software_ordinaria http://dev.3v1n0.net/scripts/unzip-remote-xsl.php?file=http://www.assosoftware.it/allegati/assoinvoice/FoglioStileAssoSoftware.zip
// @resource ricevuta_RC https://www.agenziaentrate.gov.it/portale/documents/20143/288192/RC_v1.1_RC_v1.1.xsl
// @resource ricevuta_NS https://www.agenziaentrate.gov.it/portale/documents/20143/288192/ST+Fatturazione+elettronica+-+ITHVQWPH73P42H501Y+00022+NS_001_ITHVQWPH73P42H501Y_00022_NS_001.xml
// @resource ricevuta_MC https://www.agenziaentrate.gov.it/portale/documents/20143/288192/ST+Fatturazione+elettronica+-+ITHVQWPH73P42H501Y+00022+MC_001_ITHVQWPH73P42H501Y_00022_MC_001.xml
// @resource ricevuta_MT https://www.agenziaentrate.gov.it/portale/documents/20143/288192/ST+Fatturazione+elettronica+-+ITHVQWPH73P42H501Y_00022_MT_001_ITHVQWPH73P42H501Y_00022_MT_001.xml
// @resource ricevuta_EC https://raw.githubusercontent.com/link-it/govfat/master/web/commons/src/main/resources/xsl/EC_v1.0.xsl
// @resource ricevuta_SE https://raw.githubusercontent.com/link-it/govfat/master/web/commons/src/main/resources/xsl/SE_v1.0.xsl
// @resource ricevuta_NE https://raw.githubusercontent.com/link-it/govfat/master/web/commons/src/main/resources/xsl/NE_v1.0.xsl
// @resource ricevuta_DT https://raw.githubusercontent.com/link-it/govfat/master/web/commons/src/main/resources/xsl/DT_v1.0.xsl
// @resource ricevuta_AT https://raw.githubusercontent.com/link-it/govfat/master/web/commons/src/main/resources/xsl/AT_v1.1.xsl
// @downloadURL https://update.greasyfork.org/scripts/391429/FatturaElettronica%20Styling.user.js
// @updateURL https://update.greasyfork.org/scripts/391429/FatturaElettronica%20Styling.meta.js
// ==/UserScript==

// Tests at https://www.agenziaentrate.gov.it/wps/content/Nsilib/Nsi/Schede/Comunicazioni/Fatture+e+corrispettivi/Fatture+e+corrispettivi+ST/ST+invio+di+fatturazione+elettronica/?page=schedecomunicazioni
//          https://www.fatturapa.gov.it/export/fatturazione/it/a-3.htm
//          https://www.fatturapa.gov.it/export/fatturazione/it/normativa/f-3.htm

let xslStyle = 'aruba'; // Valid values: aruba, asso_software, sdi

function getXslSource(xslType) {
    let text = GM_getResourceText(xslType);
    if (text.charCodeAt(0) === 0xFEFF)
        return text.substr(1);
    return text;
}

let xmlSource = document;
let webkitViewer = document.getElementById('webkit-xml-viewer-source-xml');

if (webkitViewer) {
    xmlSource = new DOMParser().parseFromString(webkitViewer.innerHTML, 'text/xml');
    xslStyle = 'sdi';
}

let xslType = `${xslStyle}_ordinaria`;

let matchSubType = document.location.toString().match(/_(RC|NS|MC|MT|EC|SE|NE|DT|AT)__?[0-9]{3}?\.xml/);
if (matchSubType)
    xslType = `ricevuta_${matchSubType[1]}`

const xslSource = getXslSource(xslType);

if (!xslSource || !xslSource.length)
    throw new Error('Invalid XSL URI provided')

if (!matchSubType) {
    let fattura = xmlSource.getElementsByTagNameNS(
        'http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2',
        'FatturaElettronica');

    if (!fattura.length)
        throw new Error('FatturaElettronica tag is missing from XML');
}

let xsl = new DOMParser().parseFromString(xslSource, 'text/xml');
let parseError = xsl.getElementsByTagName('parsererror');
if (parseError.length > 0)
    throw new Error(`Can't parse the XSL file: ${parseError[0].innerText}`);

try {
    let xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsl);

    if (webkitViewer) {
        var nodeDocType = document.implementation.createDocumentType(
            'html',
            '-//W3C//DTD XHTML 1.0 Transitional//EN',
            'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtdd'
        );
        document.insertBefore(nodeDocType, document.childNodes[0]);
    }

    let newContent = xsltProcessor.transformToDocument(xmlSource);
    document.replaceChild(
        document.importNode(newContent.documentElement, true),
        document.documentElement);
/**/
} catch (e) {
    throw new Error(`Impmossible to import stylesheet: ${e}`);
}