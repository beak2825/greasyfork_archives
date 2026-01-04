// ==UserScript==
// @version 2.4.26574.13712
// @author  Write
// @description bruh
// @name    OphirofoxScript
// @grant   GM.getValue
// @grant   GM.setValue
// @grant   GM.deleteValue
// @include https://nouveau.europresse.com/*
// @include https://nouveau-europresse-com.essec.idm.oclc.org/*
// @include https://nouveau-europresse-com.ezproxy.univ-catholille.fr/*
// @include https://nouveau-europresse-com.ezproxy.upf.pf/*
// @include https://nouveau-eureka-cc.res.banq.qc.ca/*
// @include https://nouveau-europresse-com.budistant.univ-nantes.fr/*
// @include https://nouveau-europresse-com.proxy.rubens.ens.fr/*
// @include https://nouveau-europresse-com.rp1.ensam.eu/*
// @include https://nouveau-europresse-com.ezproxy.universite-paris-saclay.fr/*
// @include https://nouveau-europresse-com.ezpaarse.univ-paris1.fr/*
// @include https://nouveau-europresse-com.accesdistant.bu.univ-paris8.fr/*
// @include https://nouveau-europresse-com.docelec.insa-lyon.fr/*
// @include https://nouveau-europresse-com.rproxy.insa-rennes.fr/*
// @include https://nouveau-europresse-com.bnf.idm.oclc.org/*
// @include https://nouveau-europresse-com.docelec.univ-lyon1.fr/*
// @include https://nouveau-europresse-com.ezpum.scdi-montpellier.fr/*
// @include https://nouveau-europresse-com.ezpupv.scdi-montpellier.fr/*
// @include https://nouveau-europresse-com.sid2nomade-2.grenet.fr/*
// @include https://nouveau-europresse-com.ezproxy.u-bordeaux-montaigne.fr/*
// @include https://nouveau-europresse-com.docelec.u-bordeaux.fr/*
// @include https://nouveau-europresse-com.proxy.sciencespobordeaux.fr/*
// @include https://nouveau-europresse-com.proxy.unice.fr/*
// @include https://nouveau-europresse-com.acces.bibliotheque-diderot.fr/*
// @include https://nouveau-europresse-com.scd-proxy.uha.fr/*
// @include https://nouveau-europresse-com.ezproxy.ensta-bretagne.fr/*
// @include https://nouveau-europresse-com.ezproxy.u-paris.fr/*
// @include https://nouveau-europresse-com.faraway.parisnanterre.fr/*
// @include https://nouveau-europresse-com.scd1.univ-fcomte.fr/*
// @include https://nouveau-europresse-com.rproxy.univ-pau.fr/*
// @include https://nouveau-europresse-com.ezproxy.univ-artois.fr/*
// @include https://nouveau-europresse-com.doc-elec.univ-lemans.fr/*
// @include https://nouveau-europresse-com.lama.univ-amu.fr/*
// @include https://nouveau-europresse-com.portail.psl.eu/*
// @include https://nouveau-europresse-com.passerelle.univ-rennes1.fr/*
// @include https://nouveau-europresse-com.ressources-electroniques.univ-lille.fr/*
// @include https://nouveau-europresse-com.scpo.idm.oclc.org/*
// @include https://nouveau-europresse-com.ressources.univ-poitiers.fr/*
// @include https://nouveau-europresse-com.bibelec.univ-lyon2.fr/*
// @include https://nouveau-europresse-com.gorgone.univ-toulouse.fr/*
// @include https://nouveau-europresse-com.ezscd.univ-lyon3.fr/*
// @include https://nouveau-europresse-com.ezproxy.u-pec.fr/*
// @include https://nouveau-europresse-com.univ-smb.idm.oclc.org/*
// @include https://nouveau-europresse-com.ezproxy.univ-paris13.fr/*
// @include https://nouveau-europresse-com.ezproxy.campus-condorcet.fr/*
// @include https://nouveau-europresse-com.mediaproxy.imtbs-tsp.eu/*
// @include https://nouveau-europresse-com.buadistant.univ-angers.fr/*
// @include https://nouveau-europresse-com.accesdistant.sorbonne-universite.fr/*
// @include https://nouveau-europresse-com.docelec-u-paris2.idm.oclc.org/*
// @include https://nouveau-europresse-com.esc-clermont.idm.oclc.org/*
// @include https://nouveau-europresse-com.acces-distant.bnu.fr/*
// @include https://nouveau-europresse-com.bu-services.univ-antilles.fr/*
// @include https://nouveau-europresse-com.proxybib-pp.cnam.fr/*
// @include https://nouveau-europresse-com.srvext.uco.fr/*
// @include https://nouveau-europresse-com.urca.idm.oclc.org/*
// @include https://nouveau-europresse-com.merlin.u-picardie.fr/*
// @include https://nouveau-europresse-com.ezproxy.univ-littoral.fr/*
// @include https://nouveau-europresse-com.bases-doc.univ-lorraine.fr/*
// @include https://nouveau-europresse-com.ezproxy.utbm.fr/*
// @include https://nouveau-europresse-com.distant.bu.univ-rennes2.fr/*
// @include https://nouveau-europresse-com.ezproxy.hec.fr/*
// @include https://nouveau-europresse-com.proxy-bu1.u-bourgogne.fr/*
// @include https://nouveau-europresse-com.ezproxy.normandie-univ.fr/*
// @include https://nouveau-europresse-com.bibdocs.u-cergy.fr/*
// @include https://nouveau-europresse-com.ezproxy.univ-tln.fr/*
// @include https://nouveau-europresse-com.ezproxy.univ-paris3.fr/*
// @include https://nouveau-europresse-com.proxy.scd.univ-tours.fr/*
// @include https://nouveau-europresse-com.federation.unimes.fr/*
// @include https://nouveau-europresse-com.ezp.lib.cam.ac.uk/*
// @include https://nouveau-europresse-com.extranet.enpc.fr/*
// @include https://nouveau-europresse-com.scd-proxy.univ-brest.fr/*
// @include https://nouveau-europresse-com-s.docadis.univ-tlse3.fr/*
// @include https://nouveau-europresse-com.ezproxy.univ-orleans.fr/*
// @include https://europresse.ezproxy.univ-ubs.fr/*
// @include https://nouveau.europresse.com.elgebar.univ-reunion.fr/*
// @include https://nouveau-europresse-com.ezproxy.uca.fr/*
// @include https://nouveau-europresse-com.ressources.sciencespo-lyon.fr/*
// @include https://nouveau-europresse-com.proxy.univ-nc.nc/*
// @include https://nouveau-europresse-com.buproxy2.univ-avignon.fr/*
// @include https://nouveau-europresse-com.proxy.utt.fr/*
// @include https://nouveau-europresse-com.proxy.bnl.lu/*
// @include https://nouveau-europresse-com.revproxy.escpeurope.eu/*
// @include https://nouveau-europresse-com.univ-eiffel.idm.oclc.org/*
// @include https://nouveau-europresse-com.ezproxy.unilim.fr/*
// @include https://nouveau-europresse-com.ezproxy.uphf.fr/*
// @include https://nouveau-europresse-com.rennes-sb.idm.oclc.org/*
// @include https://nouveau-europresse-com.hub.tbs-education.fr/*
// @include https://nouveau-europresse-com.ezproxy.univ-perp.fr/*
// @include https://nouveau-europresse-com.ezproxy.vetagro-sup.fr/*
// @include https://nouveau-europresse-com.ezproxy.utc.fr/*
// @include https://nouveau-europresse-com.ezproxy.ulb.ac.be/*
// @include https://nouveau-europresse-com.gutenberg.univ-lr.fr/*
// @include https://nouveau-europresse-com.bpi.idm.oclc.org/*
// @include https://nouveau-europresse-com.eztest.biblio.univ-evry.fr/*
// @include https://nouveau-europresse-com.ezproxy.uclouvain.be/*
// @include https://nouveau-europresse-com.iepnomade-2.grenet.fr/*
// @include https://nouveau-europresse-com.eu1.proxy.openathens.net/*
// @include https://www.lemonde.fr/*
// @include https://www.liberation.fr/*
// @include https://next.liberation.fr/*
// @include https://www.lefigaro.fr/*
// @include https://leparticulier.lefigaro.fr/*
// @include https://www.monde-diplomatique.fr/*
// @include https://www.courrierdesmaires.fr/*
// @include https://www.la-croix.com/*
// @include https://www.telerama.fr/kiosque/telerama
// @include https://www.courrierinternational.com/*
// @include https://www.lamontagne.fr/*
// @include https://www.humanite.fr/*
// @include https://www.lepoint.fr/*
// @include https://www.lesoir.be/*
// @include https://www.lesechos.fr/*
// @include https://www.letemps.ch/*
// @include https://www.lalibre.be/*
// @include https://www.lavoixdunord.fr/*
// @include https://www.mediapart.fr/*
// @include https://www-mediapart-fr.bnf.idm.oclc.org/*
// @include https://www.ouest-france.fr/*
// @include https://www.sudouest.fr/*
// @include https://www.laprovence.com/*
// @include https://www.ladepeche.fr/*
// @include https://www.leparisien.fr/*
// @include https://www.lexpress.fr/*
// @include https://www.nouvelobs.com/*
// @include https://www.estrepublicain.fr/*
// @include https://www.latribune.fr/*
// @include https://www.lopinion.fr/*
// @include https://www.nicematin.com/*
// @include https://www.corsematin.com/*
// @include https://www.lorientlejour.com/*
// @include https://www.lavenir.net/*
// @include https://www.dhnet.be/*
// @include https://www.sudinfo.be/*
// @include https://www.letelegramme.fr/*
// @include https://www.lsa-conso.fr/*
// @include https://www.leprogres.fr/*
// @include https://www.levif.be/*
// @include https://trends.levif.be/*
// @include https://www.knack.be/*
// @include https://www.demorgen.be/*
// @include https://www.standaard.be/*
// @include https://www.ft.com/*
// @include https://www.gva.be/*
// @include https://www.nieuwsblad.be/*
// @include https://www.hln.be/*
// @include https://www.challenges.fr/*
// @include https://www.arretsurimages.net/*
// @include https://www.pressreader.com/*
// @include https://www.usinenouvelle.com/*
// @include https://elpais.com/*
//
// @run-at      document-start
//
// @namespace https://greasyfork.org/users/1454103
// @downloadURL https://update.greasyfork.org/scripts/531863/OphirofoxScript.user.js
// @updateURL https://update.greasyfork.org/scripts/531863/OphirofoxScript.meta.js
// ==/UserScript==
(function() {
    'use strict';

    /* ----------------
     *   CONFIG
     * ----------------
     * */

    // Changer la variable par le nom de votre université. Voir la liste ci-dessous dans ophirofox_config_list.
    const universityName = "BNF"

    /* ----------------
     *   HELPERS
     * ----------------
     * */

    const current = window.location.href;
    const hostname = window.location.hostname;

    function match(str, rule) {
        var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
    }

    function pasteStyle(str) {
        var node = document.createElement('style');
        node.type = 'text/css';
        node.appendChild(document.createTextNode(str.replace(/;/g, ' !important;')));
        if (document.head !== null) {
            document.head.appendChild(node);
        } else {
            document.documentElement.appendChild(node);
        }
    }

    const onElemAvailable = async selector => {
        while (document.querySelector(selector) === null) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        return document.querySelector(selector);
    };

    /* ----------------
     *   CODE
     * ----------------
     * */

    const ophirofox_config_list = [{
        "name": "Pas d'intermédiaire",
        "AUTH_URL": "https://nouveau.europresse.com/Login"
    }, {
        "name": "Aix-Marseille Université",
        "AUTH_URL": "https://lama.univ-amu.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U031032T_1"
    }, {
        "name": "Bibliotheque nationale du Luxembourg",
        "AUTH_URL": "http://proxy.bnl.lu/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U030612T_1"
    }, {
        "name": "Bibliothèque et Archives nationales du Québec (BAnQ)",
        "AUTH_URL": "http://res.banq.qc.ca/login?url=https://nouveau.eureka.cc/access/ip/default.aspx?un=bnat1"
    }, {
        "name": "Bibliotheque nationale et universitaire de Strasbourg",
        "AUTH_URL": "https://acces-distant.bnu.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=bnus"
    }, {
        "name": "Bibliotheque municipale de Lyon",
        "AUTH_URL": "https://connect.bm-lyon.fr/get/login?&access_list=LVAw&url=aHR0cHM6Ly9ub3V2ZWF1LmV1cm9wcmVzc2UuY29tL2FjY2Vzcy9odHRwcmVmL2RlZmF1bHQuYXNweD91bj1CTUxZT05BVV8x"
    }, {
        "name": "BNF",
        "AUTH_URL": "https://bnf.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=D000067U_1",
        "AUTH_URL_ARRETSURIMAGES": "www-arretsurimages-net.bnf.idm.oclc.org",
        "AUTH_URL_MEDIAPART": "www-mediapart-fr.bnf.idm.oclc.org",
        "AUTH_URL_PRESSREADER": "www-pressreader-com.bnf.idm.oclc.org"
    }, {
        "name": "Bibliothèque Publique d'Information (BPI)",
        "AUTH_URL": "https://bpi.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=pompi"
    }, {
        "name": "Centrale Lyon",
        "AUTH_URL": "https://ec-lyon.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=LYONT_7"
    }, {
        "name": "CY Cergy Paris Université",
        "AUTH_URL": "https://bibdocs.u-cergy.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U031547T_1"
    }, {
        "name": "École Centrale de Lyon (ECL)",
        "AUTH_URL": "https://ec-lyon.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=LYONT_7"
    }, {
        "name": "École normale supérieure de Lyon (ENS Lyon)",
        "AUTH_URL": "https://acces.bibliotheque-diderot.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=ENSLYONT_1"
    }, {
        "name": "École normale supérieure de Paris (ENS ULM)",
        "AUTH_URL": "https://proxy.rubens.ens.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=PSLT_1"
    }, {
        "name": "Conservatoire national des arts et métiers",
        "AUTH_URL": "https://proxybib-pp.cnam.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CNAM"
    }, {
        "name": "ENSAM",
        "AUTH_URL": "https://rp1.ensam.eu/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=AML"
    }, {
        "name": "ENSTA Bretagne",
        "AUTH_URL": "https://nouveau.europresse.com/access/ip/default.aspx?un=ENSTAT_1"
    }, {
        "name": "ENSTA Paris",
        "AUTH_URL": "https://nouveau.europresse.com/access/ip/default.aspx?un=U033137T_9"
    }, {
        "name": "ENSAE Paris/ENSAI",
        "AUTH_URL": "https://nouveau.europresse.com/access/ip/default.aspx?un=U033137T_1"
    }, {
        "name": "ESC Clermont Business School",
        "AUTH_URL": "https://esc-clermont.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=ESCT_1"
    }, {
        "name": "ESCP Business School",
        "AUTH_URL": "https://login.revproxy.escpeurope.eu/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=escpT_1"
    }, {
        "name": "ESSEC",
        "AUTH_URL": "https://essec.idm.oclc.org/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=ESSECT_1"
    }, {
        "name": "Humathèque Campus Condorcet",
        "AUTH_URL": "https://ezproxy.campus-condorcet.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=EPCS"
    }, {
        "name": "HEC Paris",
        "AUTH_URL": "http://login.ezproxy.hec.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=josasT_1"
    }, {
        "name": "INSA Lyon",
        "AUTH_URL": "https://docelec.insa-lyon.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=INSAT_3"
    }, {
        "name": "École des Ponts ParisTech",
        "AUTH_URL": "https://extranet.enpc.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=umiv"
    }, {
        "name": "INSA Rennes",
        "AUTH_URL": "http://rproxy.insa-rennes.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=INSAT_1"
    }, {
        "name": "La Rochelle Université",
        "AUTH_URL": "https://gutenberg.univ-lr.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=ROCHELLET_1"
    }, {
        "name": "Le Mans Université",
        "AUTH_URL": "https://login.doc-elec.univ-lemans.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U031524T_1"
    }, {
        "name": "Lycée Albert de Mun à Nogent-sur-Marne",
        "AUTH_URL": "https://nouveau.europresse.com/Login/Esidoc?sso_id=0940880W"
    }, {
        "name": "Lycée Clemenceau à Nantes",
        "AUTH_URL": "https://nouveau.europresse.com/Login/Esidoc?sso_id=0440021J"
    }, {
        "name": "Lycée International de l'Est Parisien",
        "AUTH_URL": "https://nouveau.europresse.com/Login/Esidoc?sso_id=0932638M"
    }, {
        "name": "Lycée la Martinière Diderot",
        "AUTH_URL": "https://idp-auth.gar.education.fr/domaineGar?idENT=QzAw&idEtab=MDY5MDAzN1I=&idRessource=ark%3A%2F57800%2Feuropresse-cision"
    }, {
        "name": "Médiathèque de Télécom SudParis & Institut Mines-Télécom Business School",
        "AUTH_URL": "http://mediaproxy.imtbs-tsp.eu/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U033137T_8"
    }, {
        "name": "Rennes School of Business",
        "AUTH_URL": "https://rennes-sb.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=RENNES2T_2"
    }, {
        "name": "Sciences Po Lyon",
        "AUTH_URL": "http://ressources.sciencespo-lyon.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=LYONT_5"
    }, {
        "name": "Sciences Po Paris",
        "AUTH_URL": "https://catalogue-bibliotheque.sciencespo.fr/view/action/uresolver.do?operation=resolveService&package_service_id=20109524480005808&institutionId=5808&customerId=5800&VE=true",
        "PROXY_URL": "https://nouveau-europresse-com.scpo.idm.oclc.org/*"
    }, {
        "name": "Télécom Paris",
        "AUTH_URL": "https://nouveau.europresse.com/access/ip/default.aspx?un=U033137T_1"
    }, {
        "name": "Université Catholique de Lille",
        "AUTH_URL": "https://login.ezproxy.univ-catholille.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=Vauban2T_1"
    }, {
        "name": "Université Claude Bernard Lyon 1",
        "AUTH_URL": "http://docelec.univ-lyon1.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U033081T_1"
    }, {
        "name": "Université d'Angers",
        "AUTH_URL": "https://buadistant.univ-angers.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=BUANGERST_1"
    }, {
        "name": "Université des Antilles",
        "AUTH_URL": "http://bu-services.univ-antilles.fr:5000/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=ANTILLEST_1"
    }, {
        "name": "Université d'Artois",
        "AUTH_URL": "http://ezproxy.univ-artois.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=littoralT_1"
    }, {
        "name": "Université d'Avignon",
        "AUTH_URL": "https://buproxy2.univ-avignon.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=AvignonT_1"
    }, {
        "name": "Université de Bordeaux",
        "AUTH_URL": "https://docelec.u-bordeaux.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UNIVBORDEAUXT_1"
    }, {
        "name": "Université Bordeaux Montaigne",
        "AUTH_URL": "https://ezproxy.u-bordeaux-montaigne.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UNIVMONTAIGNET_1"
    }, {
        "name": "Sciences Po Bordeaux",
        "AUTH_URL": "http://proxy.sciencespobordeaux.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=SCIENCESPOT_1"
    }, {
        "name": "Université de Bourgogne",
        "AUTH_URL": "http://proxy-scd.u-bourgogne.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U032591T_1"
    }, {
        "name": "Université de Bretagne Occidentale",
        "AUTH_URL": "http://scd-proxy.univ-brest.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=OCCIDENTALET_1"
    }, {
        "name": "Université Bretagne Sud",
        "AUTH_URL": "http://ezproxy.univ-ubs.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=BRETAGNESUDT_1"
    }, {
        "name": "Université Catholique de l'Ouest",
        "AUTH_URL": "https://srvext.uco.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UCOT_1"
    }, {
        "name": "Université de Caen Normandie",
        "AUTH_URL": "http://ezproxy.normandie-univ.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U031221T_3"
    }, {
        "name": "Université Clermont Auvergne",
        "AUTH_URL": "https://ezproxy.uca.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=FERRANDU_1"
    }, {
        "name": "Université Côte d'Azur",
        "AUTH_URL": "http://proxy.unice.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U032557T_1"
    }, {
        "name": "Université d'Évry Val d'Essonne",
        "AUTH_URL": "https://ezproxy.universite-paris-saclay.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=U031535T_8"
    }, {
        "name": "Université de Franche-Comté",
        "AUTH_URL": "http://scd1.univ-fcomte.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=FCOMTET_1"
    }, {
        "name": "Université Grenoble-Alpes",
        "AUTH_URL": "https://sid2nomade-2.grenet.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=grenobleT_1"
    }, {
        "name": "Université Gustave Eiffel",
        "AUTH_URL": "https://univ-eiffel.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=D000030T_5"
    }, {
        "name": "Université Le Havre Normandie",
        "AUTH_URL": "http://ezproxy.normandie-univ.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U031221T_6"
    }, {
        "name": "Université de Haute-Alsace",
        "AUTH_URL": "https://scd-proxy.uha.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=ALSACET_1"
    }, {
        "name": "Université Jean Monnet Saint-Étienne",
        "AUTH_URL": "https://nouveau.europresse.com/access/ip/default.aspx?un=MONNETT_1"
    }, {
        "name": "Université Jean Moulin Lyon 3",
        "AUTH_URL": "http://ezscd.univ-lyon3.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=MOULINT_1"
    }, {
        "name": "Université de la Nouvelle-Calédonie",
        "AUTH_URL": "https://proxy.univ-nc.nc/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CaledonieT_1"
    }, {
        "name": "Université de La Réunion",
        "AUTH_URL": "https://elgebar.univ-reunion.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=BUREUNIONT_1"
    }, {
        "name": "Université de Liège",
        "AUTH_URL": "https://nouveau.europresse.com/access/ip/default.aspx?un=U031558T_1"
    }, {
        "name": "Université Libre de Bruxelles",
        "AUTH_URL": "http://nouveau.europresse.com.ezproxy.ulb.ac.be/access/ip/default.aspx?un=LIBRET_1"
    }, {
        "name": "Université de Lille",
        "AUTH_URL": "https://ressources-electroniques.univ-lille.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=TourcoingT_1"
    }, {
        "name": "Université de Limoges",
        "AUTH_URL": "https://ezproxy.unilim.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U031697T_1"
    }, {
        "name": "Université du Littoral Côte d'Opale (UCLO)",
        "AUTH_URL": "http://ezproxy.univ-littoral.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=dunkerqueT_1"
    }, {
        "name": "Université de Lorraine",
        "AUTH_URL": "https://login.bases-doc.univ-lorraine.fr/login?qurl=http://nouveau.europresse.com/access/ip/default.aspx?un=NANCY2"
    }, {
        "name": "Université Lumière Lyon 2",
        "AUTH_URL": "http://bibelec.univ-lyon2.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=LYONT_3"
    }, {
        "name": "Université de Montpellier",
        "AUTH_URL": "https://login.ezpum.scdi-montpellier.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=MontpellierT_1"
    }, {
        "name": "Université de Nantes",
        "AUTH_URL": "https://budistant.univ-nantes.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=NANTEST_1"
    }, {
        "name": "Université de Nîmes",
        "AUTH_URL": "https://federation.unimes.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=NimesT_1"
    }, {
        "name": "Université d'Orléans",
        "AUTH_URL": "https://ezproxy.univ-orleans.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=OrleansT_1"
    }, {
        "name": "Université Paris 1 Panthéon-Sorbonne",
        "AUTH_URL": "https://ezpaarse.univ-paris1.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=SORBONNET_1"
    }, {
        "name": "Université Paris 2 Panthéon Assas",
        "AUTH_URL": "https://docelec-u-paris2.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=ASSAST_1"
    }, {
        "name": "Université Paris 8",
        "AUTH_URL": "https://accesdistant.bu.univ-paris8.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=paris8"
    }, {
        "name": "Université Paris Cité",
        "AUTH_URL": "https://ezproxy.u-paris.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UNIVPARIS"
    }, {
        "name": "Université Paris-Est Créteil",
        "AUTH_URL": "https://ezproxy.u-pec.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=D000030T_4"
    }, {
        "name": "Université Paris Nanterre",
        "AUTH_URL": "http://faraway.parisnanterre.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=Paris10T_1"
    }, {
        "name": "Université Paris-Saclay",
        "AUTH_URL": "https://ezproxy.universite-paris-saclay.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=U031535T_9"
    }, {
        "name": "Université Paris-Saclay (etu)",
        "AUTH_URL": "https://eztest.biblio.univ-evry.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U031535T_9"
    }, {
        "name": "Université Paul-Valéry Montpellier 3",
        "AUTH_URL": "https://login.ezpupv.scdi-montpellier.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=MontpellierT_1"
    }, {
        "name": "Université de Perpignan",
        "AUTH_URL": "https://ezproxy.univ-perp.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=U031536T_1"
    }, {
        "name": "Université de Picardie Jules Verne",
        "AUTH_URL": "https://merlin.u-picardie.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=BUPICARDIET_2"
    }, {
        "name": "Université PSL",
        "AUTH_URL": "https://portail.psl.eu/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=PSLT_1"
    }, {
        "name": "Université de Pau et des Pays de l'Adour",
        "AUTH_URL": "https://rproxy.univ-pau.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=uppaT_2"
    }, {
        "name": "Université de Poitiers",
        "AUTH_URL": "http://ressources.univ-poitiers.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U032521T_1"
    }, {
        "name": "Université de la Polynésie Française",
        "AUTH_URL": "http://nouveau.europresse.com.ezproxy.upf.pf/access/ip/default.aspx?un=tahitiT_1"
    }, {
        "name": "Université Polytechnique Hauts-de-France",
        "AUTH_URL": "http://ezproxy.uphf.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=valenciennesT_1"
    }, {
        "name": "Université de Reims Champagne-Ardenne",
        "AUTH_URL": "https://urca.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=ArdenneT_1"
    }, {
        "name": "Université de Rennes",
        "AUTH_URL": "https://passerelle.univ-rennes1.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=RENNES1AT_1"
    }, {
        "name": "Université Rennes 2",
        "AUTH_URL": "https://distant.bu.univ-rennes2.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=RENNES22T_1"
    }, {
        "name": "Université de Rouen Normandie",
        "AUTH_URL": "http://ezproxy.normandie-univ.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U031221T_4"
    }, {
        "name": "Université Sorbonne Nouvelle Paris 3",
        "AUTH_URL": "http://ezproxy.univ-paris3.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=pantheonT_1"
    }, {
        "name": "Université Sorbonne Université",
        "AUTH_URL": "https://accesdistant.sorbonne-universite.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UPMCT_1"
    }, {
        "name": "Université Sorbonne Paris Nord - Paris 13",
        "AUTH_URL": "https://login.ezproxy.univ-paris13.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=paris13"
    }, {
        "name": "Université Savoie Mont Blanc",
        "AUTH_URL": "https://univ-smb.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=savoieT_1"
    }, {
        "name": "Université de Technologie de Belfort-Montbéliard",
        "AUTH_URL": "https://ezproxy.utbm.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UTBMT_2"
    }, {
        "name": "Université de Technologie de Compiègne",
        "AUTH_URL": "https://ezproxy.utc.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=BUCOMPIEGNET_2"
    }, {
        "name": "Université de Technologie de Troyes",
        "AUTH_URL": "http://proxy.utt.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=BUTROYEST_2"
    }, {
        "name": "Université Toulouse 1 Capitole",
        "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_1"
    }, {
        "name": "Institut National Universitaire Champollion",
        "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_2"
    }, {
        "name": "Institut national des sciences appliquées de Toulouse",
        "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_3"
    }, {
        "name": "Ecole nationale de l'aviation civile",
        "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_4"
    }, {
        "name": "Université Toulouse Jean Jaurès",
        "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_5"
    }, {
        "name": "Université de Toulouse",
        "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_6"
    }, {
        "name": "Institut national polytechnique de Toulouse",
        "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_7"
    }, {
        "name": "Institut supérieur de l'aéronautique et de l'espace",
        "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_8"
    }, {
        "name": "Ecole des mines d'Albi-Carmaux",
        "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_9"
    }, {
        "name": "Service Interétablissements de Coopération Documentaire",
        "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_13"
    }, {
        "name": "Ecole nationale supérieure d'architecture de Toulouse",
        "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_14"
    }, {
        "name": "Université de Toulon",
        "AUTH_URL": "http://ezproxy.univ-tln.fr:2048/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=ToulonT_1"
    }, {
        "name": "Université de Tours",
        "AUTH_URL": "https://proxy.scd.univ-tours.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=butours"
    }, {
        "name": "Université de Versailles St-Quentin-en-Yvelines",
        "AUTH_URL": "https://ezproxy.universite-paris-saclay.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=U031535T_1"
    }, {
        "name": "University of Cambridge",
        "AUTH_URL": "https://ezp.lib.cam.ac.uk/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U031883T_1"
    }, {
        "name": "TBS Education",
        "AUTH_URL": "http://hub.tbs-education.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_11ip"
    }, {
        "name": "Toulouse Métropole - MaBM",
        "AUTH_URL": "https://mabm.toulouse-metropole.fr/Portal/ASSARedirect.ashx?url=https://nouveau.europresse.com/access/httpref/default.aspx?un=bmtoulouseAU_1"
    }, {
        "name": "Métropole de Grenoble - Numothèque",
        "AUTH_URL": "https://numotheque.grenoblealpesmetropole.fr/Default/redirection-contenu-europresse.aspx"
    }, {
        "name": "VetAgro Sup",
        "AUTH_URL": "https://ezproxy.vetagro-sup.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U032869T_1"
    }, {
        "name": "UCLouvain",
        "AUTH_URL": "https://nouveau-europresse-com.proxy.bib.uclouvain.be:2443"
    }, {
        "name": "E-medi@s Savoie Mont Blanc",
        "AUTH_URL": "https://e-medias.biblio7374.fr/Portal/ASSARedirect.ashx?url=https://nouveau.europresse.com/access/httpref/default.aspx?un=PringyU_2"
    }, {
        "name": "Science Po Grenoble",
        "AUTH_URL": "http://iepnomade.grenet.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=IEPT_1"
    }, {
        "name": "ENTPE",
        "AUTH_URL": "https://login.openathens.net/saml/2/sso/entpe.fr/o/81387240/c/proxy.openathens.net?SAMLRequest=jZJRb9owFIX%2FiuX3xI6JSWIRKlY0DanbUEn7sDfjXIqlYGe%2BTlf%2B%2FQIMqZW6qu%2F3nnN0vjO7eTl05BkCWu9qmqWcEnDGt9Y91fSh%2BZqUlGDUrtWdd1BT5%2BnNfIb60PVqMcS9u4ffA2AkC0QIcVS59Q6HA4QNhGdr4OH%2Brqb7GHtUjHX%2Bybq0D%2F7lmPoenI57cJg6iOwkyQTTBhloI4q2hERAO0lyucuTkhd5wrdSm2mb7yZaUrIcXe2ocA7%2B1uB9aUTPwMUe0l1gnpXZpCxEzplh7wWiZLWs6dZk00Ia3mY7k8tWVkIK3kJlSs7LTFbjFeIAK3fqKNZUcCETPkl43nCh5FTJKhVV8YuSdfDRG999se5S7hCc8hotKqcPgCoatVl8v1Mi5Wp7OUL1rWnWyfrnpqHk8QpJnCCN2ByqM4ePpfp%2FvvRCTZ3zhlf%2FH7%2FrK1Y6v3b8f3xjuzYeP8Vvxl6luQ7qx2i%2FWq59Z82RLLrO%2F7kNoOM4u4yy%2BeXl7ezmfwE%3D&RelayState=https%3A%2F%2Fnouveau-europresse-com.proxy.openathens.net%2Faccess%2Fip%2Fdefault.aspx%3Fun%3DENTPET_1"
    }];

    function getOphirofoxConfigByName(search_name) {
        return ophirofox_config_list.find(({
            name
        }) => search_name === name);
    }

    const DEFAULT_SETTINGS = {
        partner_name: "Pas d'intermédiaire",
    };

    let current_settings = DEFAULT_SETTINGS;

    async function getOphirofoxConfig() {
        const url = new URL(window.location);
        try {
            const partner_name = universityName;
            const name_match = getOphirofoxConfigByName(partner_name);
            if (name_match) return name_match;
        } catch (err) {
            console.warn(
                `No ophirofox domain found, using the default ${fallback.name}: ${err}`
            );
        }
        const fallback = ophirofox_config_list[0];
        return fallback;
    }

    const ophirofox_config = getOphirofoxConfig();

    async function setKeywords(keywords, publishedTime) {
        await GM.setValue("ophirofox_keywords", keywords);
        await GM.setValue("ophirofox_published_time", publishedTime);
    }

    /**
     * Crée un lien vers Europresse avec les keywords donnés
     * @param {string} keywords
     * @returns {Promise<HTMLAnchorElement>}
     */
    async function ophirofoxEuropresseLink(keywords, {
        publishedTime
    } = {}) {
        // Keywords is the article name
        keywords = keywords ? keywords.trim() : document.querySelector("h1").textContent;
        // Trying to determine published time with meta tags (Open Graph values)
        publishedTime = publishedTime || document.querySelector("meta[property='article:published_time'], meta[property='og:article:published_time'], meta[property='date:published_time']")
            ?.getAttribute("content") || '';
        // Creating HTML anchor element
        const a = document.createElement("a");
        a.textContent = "Lire sur Europresse";
        a.className = "ophirofox-europresse";
        a.onmousedown = setKeywords(keywords, publishedTime);
        a.onclick = async function(evt) {
            evt.preventDefault();
            await Promise.resolve([ophirofox_config, setKeywords(keywords, publishedTime)])
            const obj = await ophirofox_config;
            window.location = obj.AUTH_URL;
        }
        ophirofox_config.then(({
            AUTH_URL
        }) => {
            a.href = AUTH_URL
        });
        return a;
    }

    if (
        "https://nouveau-europresse-com.essec.idm.oclc.org/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.univ-catholille.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.upf.pf/*".includes(hostname) ||
        "https://nouveau-eureka-cc.res.banq.qc.ca/*".includes(hostname) ||
        "https://nouveau-europresse-com.budistant.univ-nantes.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.proxy.rubens.ens.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.rp1.ensam.eu/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.universite-paris-saclay.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezpaarse.univ-paris1.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.accesdistant.bu.univ-paris8.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.docelec.insa-lyon.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.rproxy.insa-rennes.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.bnf.idm.oclc.org/*".includes(hostname) ||
        "https://nouveau-europresse-com.docelec.univ-lyon1.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezpum.scdi-montpellier.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezpupv.scdi-montpellier.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.sid2nomade-2.grenet.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.u-bordeaux-montaigne.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.docelec.u-bordeaux.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.proxy.sciencespobordeaux.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.proxy.unice.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.acces.bibliotheque-diderot.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.scd-proxy.uha.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.ensta-bretagne.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.u-paris.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.faraway.parisnanterre.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.scd1.univ-fcomte.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.rproxy.univ-pau.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.univ-artois.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.doc-elec.univ-lemans.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.lama.univ-amu.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.portail.psl.eu/*".includes(hostname) ||
        "https://nouveau-europresse-com.passerelle.univ-rennes1.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ressources-electroniques.univ-lille.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.scpo.idm.oclc.org/*".includes(hostname) ||
        "https://nouveau-europresse-com.ressources.univ-poitiers.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.bibelec.univ-lyon2.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.gorgone.univ-toulouse.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezscd.univ-lyon3.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.u-pec.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.univ-smb.idm.oclc.org/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.univ-paris13.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.campus-condorcet.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.mediaproxy.imtbs-tsp.eu/*".includes(hostname) ||
        "https://nouveau-europresse-com.buadistant.univ-angers.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.accesdistant.sorbonne-universite.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.docelec-u-paris2.idm.oclc.org/*".includes(hostname) ||
        "https://nouveau-europresse-com.esc-clermont.idm.oclc.org/*".includes(hostname) ||
        "https://nouveau-europresse-com.acces-distant.bnu.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.bu-services.univ-antilles.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.proxybib-pp.cnam.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.srvext.uco.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.urca.idm.oclc.org/*".includes(hostname) ||
        "https://nouveau-europresse-com.merlin.u-picardie.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.univ-littoral.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.bases-doc.univ-lorraine.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.utbm.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.distant.bu.univ-rennes2.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.hec.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.proxy-bu1.u-bourgogne.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.normandie-univ.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.bibdocs.u-cergy.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.univ-tln.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.univ-paris3.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.proxy.scd.univ-tours.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.federation.unimes.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezp.lib.cam.ac.uk/*".includes(hostname) ||
        "https://nouveau-europresse-com.extranet.enpc.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.scd-proxy.univ-brest.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com-s.docadis.univ-tlse3.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.univ-orleans.fr/*".includes(hostname) ||
        "https://europresse.ezproxy.univ-ubs.fr/*".includes(hostname) ||
        "https://nouveau.europresse.com.elgebar.univ-reunion.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.uca.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ressources.sciencespo-lyon.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.proxy.univ-nc.nc/*".includes(hostname) ||
        "https://nouveau-europresse-com.buproxy2.univ-avignon.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.proxy.utt.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.proxy.bnl.lu/*".includes(hostname) ||
        "https://nouveau-europresse-com.revproxy.escpeurope.eu/*".includes(hostname) ||
        "https://nouveau-europresse-com.univ-eiffel.idm.oclc.org/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.unilim.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.uphf.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.rennes-sb.idm.oclc.org/*".includes(hostname) ||
        "https://nouveau-europresse-com.hub.tbs-education.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.univ-perp.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.vetagro-sup.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.utc.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.ulb.ac.be/*".includes(hostname) ||
        "https://nouveau-europresse-com.gutenberg.univ-lr.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.bpi.idm.oclc.org/*".includes(hostname) ||
        "https://nouveau-europresse-com.eztest.biblio.univ-evry.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.ezproxy.uclouvain.be/*".includes(hostname) ||
        "https://nouveau-europresse-com.iepnomade-2.grenet.fr/*".includes(hostname) ||
        "https://nouveau-europresse-com.eu1.proxy.openathens.net/*".includes(hostname)) {

        function removeMarkElements() {
            // Remove all the <mark> elements, but keep their contents
            Array.from(document.querySelectorAll("article mark")).forEach(mark => {
                const repl = document.createElement("span");
                repl.className = "mark";
                Array.from(mark.childNodes).forEach(repl.appendChild.bind(repl));
                mark.parentNode.replaceChild(repl, mark);
            });
        }

        // Remove <mark> elements each time the page is updated 
        /*
        let nextOp = null;
        new MutationObserver(() => {
            if (nextOp) clearTimeout(nextOp);
            nextOp = setTimeout(removeMarkElements, 500);
        }).observe(document.body, { subtree: true, childList: true });
        */

        async function consumeReadRequest() {
            const keywords = await GM.getValue("ophirofox_keywords");
            const published_time = await GM.getValue("ophirofox_published_time");
            const readRequest = {
                keywords,
                published_time
            };
            await GM.deleteValue("ophirofox_keywords");
            await GM.deleteValue("ophirofox_published_time");
            return readRequest;
        }

        async function onLoad() {
            ophirofoxRealoadOnExpired();
            const path = window.location.pathname;
            if (!(
                    path.startsWith("/Search/Reading") ||
                    path.startsWith("/Search/Advanced") ||
                    path.startsWith("/Search/AdvancedMobile") ||
                    path.startsWith("/Search/Express") ||
                    path.startsWith("/Search/Simple") ||
                    path.startsWith("/Search/Result")
                )) return;

            const readRequest = await consumeReadRequest();
            const search_terms = readRequest.keywords;
            const published_time = readRequest.published_time;

            if (!search_terms) return;
            const stopwords = new Set(['d', 'l', 'et', 'sans', 'or']);
            const keywords = search_terms
                .replace(/œ/g, 'oe')
                .split(/[^\p{L}]+/u)
                .filter(w => !stopwords.has(w))
                .join(' ');

            const keyword_field_id = path.startsWith("/Search/Result") ? "NativeQuery" : "Keywords";

            onElemAvailable('#' + keyword_field_id).then((selector) => {
                const keyword_field = selector;
                keyword_field.value = 'TIT_HEAD=' + keywords;
                keyword_field.form.submit();
            });

            onElemAvailable('#DateFilter_DateRange').then((selector) => {
                const date_filter = selector;
                if (date_filter) {
                    if (!published_time) { // Full expand the time range
                        date_filter.value = 9;
                    } else {
                        const publishedDate = new Date(published_time);
                        publishedDate.setUTCHours(0, 0, 0, 0); // Europresse saves the exact UTC date, but "depuis X jours" is based on midnight 
                        const currentDate = new Date();

                        const timeDifference = currentDate.getTime() - publishedDate.getTime();
                        // Rounds up for tolerance to be sure to not filtering badly
                        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

                        let filterValue = 9;

                        switch (true) {
                            case (daysDifference <= 1):
                                filterValue = 2; // Depuis hier
                                break;
                            case (daysDifference <= 3):
                                filterValue = 11; // Depuis 3 jours
                                break;
                            case (daysDifference <= 7):
                                filterValue = 3; // Depuis 7 jours
                                break;
                            case (daysDifference <= 30):
                                filterValue = 4; // Depuis 30 jours
                                break;
                            case (daysDifference <= 90):
                                filterValue = 5; // Depuis 3 mois
                                break;
                            case (daysDifference <= 180):
                                filterValue = 6; // Depuis 6 mois
                                break;
                            case (daysDifference <= 365):
                                filterValue = 7; // Depuis 1 an
                                break;
                            case (daysDifference <= 730):
                                filterValue = 8; // Depuis 2 ans
                                break;
                            default:
                                filterValue = 9; // Dans toutes les archives
                                break;
                        }

                        date_filter.value = filterValue;
                    }
                }
            });
        }

        function ophirofoxRealoadOnExpired() {
            const params = new URLSearchParams(window.location.search)
            if (params.get("ErrorCode") == "4000112") {
                // session expirée
                window.history.back();
            }
        }

        onLoad().catch(console.error);

        pasteStyle(`
        mark,
        span.mark {
          animation-duration: 3s;
          animation-name: background-fadeout;
          animation-fill-mode: forwards;
          background-color: transparent;
        }
        
        @keyframes background-fadeout {
          from {
            background-color: #fbf592;
          }
        
          to {
            background-color: transparent;
          }
        }
        `);
    }
    if ("https://www.lemonde.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return extractKeywordsFromTitle() || extractKeywordsFromUrl(window.location);
            }

            function extractKeywordsFromTitle() {
                const titleElem = document.querySelector("h1.article__title");
                return titleElem && titleElem.textContent;
            }

            function extractKeywordsFromUrl(url) {
                const source_url = new URL(url);
                const lemonde_match = source_url.pathname.match(/([^/.]+)(_\d*_\d*\.html)?$/);
                if (!lemonde_match) throw new Error("Could not find keywords in lemonde url");
                return lemonde_match[1];
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                a.classList.add("btn", "btn--premium");
                return a;
            }

            async function onLoad() {
                const statusElem = document.querySelector(".article__status");
                if (statusElem) {
                    statusElem.appendChild(await createLink());
                }
                const paywallElem = document.querySelector(".paywall-04__cta");
                if (paywallElem) {
                    const link = await createLink();
                    link.className = "lmd-btn lmd-btn--l lmd-btn--premium paywall-04__cta";
                    paywallElem.parentNode.insertBefore(link, paywallElem);
                }
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            color: black;
            margin-left: 7px;
        }
        
        #js-message-register{
            display: none;
        }
        `);
    }

    if ("https://www.liberation.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document
                    .querySelector("meta[property='og:title']")
                    .getAttribute("content");
            }

            /**
             * Crée un lien vers Europresse avec les keywords donnés
             * @param {string} publishedTime - article publication date (2024-01-01)
             * @returns {Promise<HTMLAnchorElement>}
             */
            async function createLink(publishedTime) {
                const a = await ophirofoxEuropresseLink(extractKeywords(), {
                    publishedTime: publishedTime
                });
                return a;
            }

            function findPremiumBanner() {
                const anchor = document.querySelector('div.TypologyArticle__BlockPremium-sc-1vro4tp-2');
                if (!anchor) {
                    return;
                }
                return anchor;
            }

            async function onLoad(premiumBanner) {
                if (premiumBanner) {
                    /*
                      The UI is reactive (and DOM rewritten), so we need to wait for some nodes to be rewritten to the DOM
                      before we can add our link. It seems that the React components are added to the DOM in a particular order.

                      With heavy loading, the MutationObserver execution is too late, and only catch .dossier-feed class.
                      After caching, we can rely on the .article-body-paywall added node.

                      Weird choices for a nearly-static content-driven website with SEO concerns.
                    */
                    const observer = new MutationObserver(async mutationsList => {
                        for (let mutation of mutationsList) {
                            if (mutation.addedNodes.length > 0) {
                                const addedNode = mutation.addedNodes[0];
                                if (addedNode.classList.contains('dossier-feed') ||
                                    addedNode.classList.contains('article-body-paywall')
                                ) {
                                    observer.disconnect();

                                    // Not sure if premiumBanner is (and will be) still valid after DOM rewrite
                                    if (!document.querySelector('div.TypologyArticle__BlockPremium-sc-1vro4tp-2 + a.ophirofox-europresse')) {
                                        // See #239, Libération replaces date:published_time with the date of edit, which means that a search limited by the time of publication may be too restrictive
                                        // We need to specify the date to use for the generic ophirofoxEuropresseLink function
                                        // Might need refactor if other medias have the same problem, more properties for fail-safe
                                        let publishedDate = document.querySelector("meta[property='article:published_time'], meta[property='og:article:published_time'], meta[property='date:published_time']")?.getAttribute("content") || '';

                                        let firstPublishedDate = null;
                                        let firstPublishedDateInstance = null;

                                        let fusionMetadata = document.getElementById('fusion-metadata');
                                        if (fusionMetadata && fusionMetadata.textContent) {
                                            let match = /"first_publish_date":"(\d{4}-\d{2}-\d{2}[A-Z]+\d{2}:\d{2}:\d{2}\.[0-9+-:]+Z)"/.exec(fusionMetadata.textContent); // 2024-08-27T18:18:55.663Z => UTC
                                            if (match) {
                                                firstPublishedDate = match[1];
                                                firstPublishedDateInstance = new Date(firstPublishedDate);
                                            } else {
                                                console.error("No match for 'first_publish_date' found.");
                                            }
                                        } else {
                                            console.error("'fusion-metadata' element not found or empty.");
                                        }

                                        // Check if publishedDate exists and is not empty
                                        if (publishedDate && publishedDate.trim()) {
                                            // If the first published date is valid and older
                                            if (firstPublishedDateInstance && !isNaN(firstPublishedDateInstance) && (firstPublishedDateInstance < new Date(publishedDate))) {
                                                publishedDate = firstPublishedDate;
                                            }
                                        } else {
                                            // If published date is empty or invalid, use firstPublishedDate if available
                                            if (firstPublishedDateInstance && !isNaN(firstPublishedDateInstance)) {
                                                publishedDate = firstPublishedDate;
                                            }
                                        }

                                        findPremiumBanner().after(await createLink(publishedDate));
                                        console.log('Ophirofox injected after React DOM rewrite');
                                        break;
                                    }
                                }
                            }
                        }
                    });
                    observer.observe(document.querySelector('#fusion-app'), {
                        childList: true,
                        subtree: true
                    });
                }
            }

            // Edge-cases, it costs nothing to try to add it *à l'ancienne*
            createLink().then(link => {
                const premiumBanner = findPremiumBanner();
                if (premiumBanner) {
                    premiumBanner.after(link);
                    console.log('Ophirofox injected');
                }
                onLoad(premiumBanner);
            });
        });

        pasteStyle(`
        .ophirofox-europresse {
            display: inline-block;
            font-size: 0.875rem;
            line-height: 1.125rem;
            margin-bottom: 1rem;
            margin-left: 0px;
            padding: 5px 10px;
            background-color: #eeb54e;
            color: #000;
            border-radius: 2px;
            text-decoration: none;
        }
        
        .ophirofox-europresse:hover {
            color: #666666;
        }
        `);
    }

    if ("https://next.liberation.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document
                    .querySelector("meta[property='og:title']")
                    .getAttribute("content");
            }

            /**
             * Crée un lien vers Europresse avec les keywords donnés
             * @param {string} publishedTime - article publication date (2024-01-01)
             * @returns {Promise<HTMLAnchorElement>}
             */
            async function createLink(publishedTime) {
                const a = await ophirofoxEuropresseLink(extractKeywords(), {
                    publishedTime: publishedTime
                });
                return a;
            }

            function findPremiumBanner() {
                const anchor = document.querySelector('div.TypologyArticle__BlockPremium-sc-1vro4tp-2');
                if (!anchor) {
                    return;
                }
                return anchor;
            }

            async function onLoad(premiumBanner) {
                if (premiumBanner) {
                    /*
                      The UI is reactive (and DOM rewritten), so we need to wait for some nodes to be rewritten to the DOM
                      before we can add our link. It seems that the React components are added to the DOM in a particular order.

                      With heavy loading, the MutationObserver execution is too late, and only catch .dossier-feed class.
                      After caching, we can rely on the .article-body-paywall added node.

                      Weird choices for a nearly-static content-driven website with SEO concerns.
                    */
                    const observer = new MutationObserver(async mutationsList => {
                        for (let mutation of mutationsList) {
                            if (mutation.addedNodes.length > 0) {
                                const addedNode = mutation.addedNodes[0];
                                if (addedNode.classList.contains('dossier-feed') ||
                                    addedNode.classList.contains('article-body-paywall')
                                ) {
                                    observer.disconnect();

                                    // Not sure if premiumBanner is (and will be) still valid after DOM rewrite
                                    if (!document.querySelector('div.TypologyArticle__BlockPremium-sc-1vro4tp-2 + a.ophirofox-europresse')) {
                                        // See #239, Libération replaces date:published_time with the date of edit, which means that a search limited by the time of publication may be too restrictive
                                        // We need to specify the date to use for the generic ophirofoxEuropresseLink function
                                        // Might need refactor if other medias have the same problem, more properties for fail-safe
                                        let publishedDate = document.querySelector("meta[property='article:published_time'], meta[property='og:article:published_time'], meta[property='date:published_time']")?.getAttribute("content") || '';

                                        let firstPublishedDate = null;
                                        let firstPublishedDateInstance = null;

                                        let fusionMetadata = document.getElementById('fusion-metadata');
                                        if (fusionMetadata && fusionMetadata.textContent) {
                                            let match = /"first_publish_date":"(\d{4}-\d{2}-\d{2}[A-Z]+\d{2}:\d{2}:\d{2}\.[0-9+-:]+Z)"/.exec(fusionMetadata.textContent); // 2024-08-27T18:18:55.663Z => UTC
                                            if (match) {
                                                firstPublishedDate = match[1];
                                                firstPublishedDateInstance = new Date(firstPublishedDate);
                                            } else {
                                                console.error("No match for 'first_publish_date' found.");
                                            }
                                        } else {
                                            console.error("'fusion-metadata' element not found or empty.");
                                        }

                                        // Check if publishedDate exists and is not empty
                                        if (publishedDate && publishedDate.trim()) {
                                            // If the first published date is valid and older
                                            if (firstPublishedDateInstance && !isNaN(firstPublishedDateInstance) && (firstPublishedDateInstance < new Date(publishedDate))) {
                                                publishedDate = firstPublishedDate;
                                            }
                                        } else {
                                            // If published date is empty or invalid, use firstPublishedDate if available
                                            if (firstPublishedDateInstance && !isNaN(firstPublishedDateInstance)) {
                                                publishedDate = firstPublishedDate;
                                            }
                                        }

                                        findPremiumBanner().after(await createLink(publishedDate));
                                        console.log('Ophirofox injected after React DOM rewrite');
                                        break;
                                    }
                                }
                            }
                        }
                    });
                    observer.observe(document.querySelector('#fusion-app'), {
                        childList: true,
                        subtree: true
                    });
                }
            }

            // Edge-cases, it costs nothing to try to add it *à l'ancienne*
            createLink().then(link => {
                const premiumBanner = findPremiumBanner();
                if (premiumBanner) {
                    premiumBanner.after(link);
                    console.log('Ophirofox injected');
                }
                onLoad(premiumBanner);
            });
        });

        pasteStyle(`
        .ophirofox-europresse {
            display: inline-block;
            font-size: 0.875rem;
            line-height: 1.125rem;
            margin-bottom: 1rem;
            margin-left: 0px;
            padding: 5px 10px;
            background-color: #eeb54e;
            color: #000;
            border-radius: 2px;
            text-decoration: none;
        }
        
        .ophirofox-europresse:hover {
            color: #666666;
        }
        `);
    }

    if ("https://www.lefigaro.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document.querySelector("h1").textContent;
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                a.classList.add("fig-premium-mark-article__text");
                return a;
            }


            function findPremiumBanner() {
                const title = document.querySelector("h1");
                if (!title) return null;
                const elems = title.parentElement.querySelectorAll("span");
                return [...elems].find(d => d.textContent.includes("Réservé aux abonnés"))
            }

            async function onLoad() {
                const premiumBanner = findPremiumBanner();
                if (!premiumBanner) return;
                premiumBanner.after(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            margin-left: 10px;
        }
        `);
    }

    if ("https://leparticulier.lefigaro.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document.querySelector("h1").textContent;
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                a.classList.add("fig-premium-mark-article__text");
                return a;
            }


            function findPremiumBanner() {
                const title = document.querySelector("h1");
                if (!title) return null;
                const elems = title.parentElement.querySelectorAll("span");
                return [...elems].find(d => d.textContent.includes("Réservé aux abonnés"))
            }

            async function onLoad() {
                const premiumBanner = findPremiumBanner();
                if (!premiumBanner) return;
                premiumBanner.after(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            margin-left: 10px;
        }
        `);
    }

    if ("https://www.monde-diplomatique.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return extractKeywordsFromTitle();
            }

            function extractArticleNumber() {
                let url = window.location.pathname;
                let parameters = url.split('/');
                return parameters[parameters.length - 1];
            }

            function extractKeywordsFromTitle() {
                const titleElem = document.getElementsByClassName("crayon article-titre-" + extractArticleNumber() + " h1")[0].textContent;
                return titleElem;
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                a.classList.add("btn", "btn--premium");
                return a;
            }

            async function onLoad() {
                const payArticle = document.querySelector('.promo_dispo_article');
                if (!payArticle) return;

                const actionElem = document.querySelector(".actions-article");
                if (!actionElem) return;
                actionElem.appendChild(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            margin-left: 10px;
        }
        `);
    }

    if ("https://www.courrierdesmaires.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            async function createLink() {
                return await ophirofoxEuropresseLink();
            }

            async function onLoad() {
                const statusElem = document.querySelector(".encartEssai");
                const abo = document.querySelector(".etiquetteArt");
                if (!statusElem || !abo) return;
                statusElem.before(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            background-color: #fec22d;
            padding: 1rem 1.5rem;
            color: #262626;
            text-align: center;
            display: block;
            margin-top: 1rem;
            margin-bottom: 1rem;
        }
        
        .ophirofox-europresse:hover {
            background-color: #e5ae29;
        }
        `);
    }

    if ("https://www.la-croix.com/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            async function createLink() {
                return await ophirofoxEuropresseLink();
            }

            async function onLoad() {
                const statusElem = document.querySelector(".tag-subscriber");
                if (!statusElem) return;
                statusElem.appendChild(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            -webkit-font-smoothing: antialiased;
            align-items: center;
            background-color: #ef7c03;
            color: #fff !important;
            display: inline-flex;
            font-family: Public Sans,sans-serif;
            font-size: 12px;
            font-weight: 500;
            height: 15px;
            hyphens: none;
            justify-content: center;
            letter-spacing: 0;
            line-height: 1.35;
            margin: 0 5px;
            position: relative;
            text-align: center;
            top: 50%;
            vertical-align: middle;
            width: 120px;
        }
        
        .above-image-wrapper {
            align-items: center;
        }
        `);
    }

    if ("https://www.telerama.fr/kiosque/telerama".includes(hostname)) {

        window.addEventListener("load", function(event) {
            // Function to format date to "YYYY-MM-DD"
            function formatDate(date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }

            // Function to add days to a given date
            function addDays(date, days) {
                const result = new Date(date);
                result.setDate(result.getDate() + days);
                return result;
            }

            async function onLoad() {
                // Get articles
                const articles = document.querySelectorAll('#liste-magazine-telerama article');

                for (const article of articles) {
                    const linkElement = article.querySelector('a.popin-link');
                    const tagName = linkElement.getAttribute('data-tagname');
                    const datePattern = /clic_magazine_(\d{4}-\d{2}-\d{2})/;
                    const match = tagName.match(datePattern);
                    const articleDate = new Date(match[1]);
                    // Check if the date object is valid
                    if (isNaN(articleDate.getTime())) {
                        console.error(`Invalid date: ${year}-${month + 1}-${day}`);
                        return;
                    }
                    // Calculate the new date + 3 days
                    const newDate = addDays(articleDate, 3);
                    const formattedDate = formatDate(newDate);

                    // Generate the link
                    const a = await ophirofoxEuropressePDFLink("TA_P", formattedDate);
                    a.classList.add("btn", "btn--premium");

                    // Inject the link into the article
                    article.appendChild(a);
                }
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            -webkit-font-smoothing: antialiased;
            align-items: center;
            background-color: #ef7c03;
            color: #fff !important;
            display: inline-flex;
            font-family: Public Sans,sans-serif;
            font-size: 12px;
            font-weight: 500;
            height: 15px;
            hyphens: none;
            justify-content: center;
            letter-spacing: 0;
            line-height: 1.35;
            margin: 0 5px;
            position: relative;
            text-align: center;
            top: 50%;
            vertical-align: middle;
            width: 120px;
        }
        
        .above-image-wrapper {
            align-items: center;
        }
        `);
    }

    if ("https://www.courrierinternational.com/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            async function createLink() {
                const a = await ophirofoxEuropresseLink();
                a.classList.add("info-reserved");
                return a;
            }

            async function onLoad() {
                const statusElem = document.getElementsByClassName("info-reserved");
                if (statusElem.length == 0) return;
                statusElem[0].after(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            margin-left: 10px;
        }
        `);
    }

    if ("https://www.lamontagne.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document.querySelector("h1").textContent;
            }

            async function createLink() {
                const span = document.createElement("span");
                span.textContent = "Lire sur Europresse";
                span.className = "premium-message ophirofox-europresse";

                const a = await ophirofoxEuropresseLink(extractKeywords());
                a.classList.add("btn", "btn--premium");
                a.innerHTML = "";
                a.appendChild(span);

                return a;
            }

            async function onLoad() {
                const reserve = document.querySelector(".premium-message");
                if (!reserve) return;

                reserve.parentElement.appendChild(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            padding: 10px !important;
        }
        `);
    }

    if ("https://www.humanite.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            async function createLink() {
                const a = await ophirofoxEuropresseLink();
                a.className = "rubric t-header-small c-red ophirofox-europresse";
                return a;
            }

            async function onLoad() {
                const reserve = document.querySelector("main .single__categories .u-icon-32");
                if (!reserve) return;

                const auteurElem = document.querySelector(".single__content__text__published");
                if (!auteurElem) return;

                auteurElem.appendChild(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            padding: 10px !important;
        }
        `);
    }

    if ("https://www.lepoint.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            async function createLink() {
                const a = await ophirofoxEuropresseLink();
                a.classList.add("btn");
                return a;
            }

            async function onLoad() {
                const reserve = document.querySelector(".abo");
                if (!reserve) return;

                reserve.after(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            margin-left: 10px;
            background-color: rgb(255, 187, 0);
        }
        `);
    }

    if ("https://www.lesoir.be/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document.querySelector("h1").textContent;
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                a.classList.add("fig-premium-mark-article__text");
                return a;
            }


            function findPremiumBanner() {
                const title = document.querySelector("h1");
                if (!title) return null;
                const elems = title.parentElement.querySelectorAll("span");
                return [...elems].find(d => d.textContent.includes("réservé aux abonnés"))
            }

            async function onLoad() {
                const premiumBanner = findPremiumBanner();
                if (!premiumBanner) return;
                premiumBanner.after(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            margin-left: 10px;
        }
        `);
    }

    if ("https://www.lesechos.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                const titleElem = document.querySelector("h1").childNodes[0];
                return titleElem && titleElem.textContent;
            }

            async function addEuropresseButton() {
                const ophiroBtnPresence = document.querySelector('.ophirofox-europresse');
                if (!ophiroBtnPresence) {
                    const elt = document.querySelector("button[aria-label=Commenter]")?.parentElement?.parentElement;
                    if (elt) {
                        const a = await ophirofoxEuropresseLink(extractKeywords());
                        elt.appendChild(a);
                    }
                }
            }

            async function onLoad() {

                /* 2 cases:
                1. either a page is initially loaded,  and we must wait for the actual end of loading (determined
                    by a new meta with name ad:postAcces) and add the button (this is the first observer).
                2. Or a page is newly routed (for instance, when one goes from the homepage to an article) :
                    - it is detected with the second observer that watches for changes in <title> and reset the button
                    - we wait for the end of actual loading of the new content by checking if meta[name="ad:postAccess"] exist.
                */

                const isPremium = (metaElement) => {
                    if (metaElement.content == 'subscribers') {
                        return true;
                    }
                    return false;
                };

                // Observer [ Direct URL Access ]
                const callbackDirectAccess = (mutationList, observer) => {
                    const metaElement = document.querySelector('meta[name="ad:postAccess"]');
                    if (metaElement) {
                        if (isPremium(metaElement)) {
                            addEuropresseButton();
                        }
                        observer.disconnect();
                        return;
                    }
                    for (const mutation of mutationList) {
                        for (const e of mutation.addedNodes) {
                            if (e.name == "ad:postAccess") {
                                if (isPremium(e)) {
                                    addEuropresseButton();
                                }
                                observer.disconnect();
                                return;
                            }
                        }
                    }
                };

                const observerDirectAccess = new MutationObserver(callbackDirectAccess);
                observerDirectAccess.observe(document.body, {
                    childList: true,
                    subtree: false
                });

                // Observer [ Dynamic page Loading ]
                const callbackDynamicLoading = (mutationList, observer) => {
                    const metaElement = document.querySelector('meta[name="ad:postAccess"]');
                    if (metaElement) {
                        if (isPremium(metaElement)) {
                            addEuropresseButton();
                        }
                    }
                };

                const observerDynamicLoading = new MutationObserver(callbackDynamicLoading);
                observerDynamicLoading.observe(document.querySelector('title'), {
                    childList: true,
                    subtree: false
                });
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            background-color: #faec70;
            padding: 0.4em;
            padding-right: 1em;
            padding-left: 1em;
            border: 1px solid grey;
            border-radius: 50px;
            text-decoration: none;
            font-size: 1.2rem;
        }
        `);
    }

    if ("https://www.letemps.ch/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document.querySelector("h1").textContent;
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                a.classList.add("ophirofox-europresse");
                return a;
            }


            function findPremiumBanner() {
                const title = document.querySelector("article");
                if (!title) return null;
                const elems = title.parentElement.querySelectorAll("span");
                return [...elems].find(d => d.textContent.includes("Réservé aux abonnés"))
            }

            async function onLoad() {
                const premiumBanner = findPremiumBanner();
                if (!premiumBanner) return;
                premiumBanner.after(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            margin-left: 10px;
        }
        `);
    }

    if ("https://www.lalibre.be/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document.querySelector("h1").textContent;
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                return a;
            }

            async function onLoad() {
                const statusElem = document.getElementsByClassName("ap-PaidPicto");
                if (statusElem.length == 0) return;
                statusElem[0].after(await createLink());
            }


            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
        	margin-left: 0.25em;
        	background-color: #f7b500;
        	border-radius: 0.25rem;
        	color: #5d3c10 !important;
        	margin-right: 0.25em;
        	font-size: medium;
        	font-family: Libre Franklin,Helvetica Neue,Helvetica,Arial,sans-serif;
        	vertical-align: middle;
        	line-height: 2.5rem;
        	padding: 0.5rem 1rem 0.2rem;
        }
        `);
    }

    if ("https://www.lavoixdunord.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document.querySelector("h1").textContent;
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                a.classList.add("r-btn--secondary");
                return a;
            }


            function findPremiumBanner() {
                const title = document.querySelector("article");
                if (!title) return null;
                const elems = title.parentElement.querySelectorAll("span");
                return [...elems].find(d => d.textContent.includes("réservé aux abonnés"))
            }

            async function onLoad() {
                const premiumBanner = findPremiumBanner();
                if (!premiumBanner) return;
                const head = document.querySelector("h1");
                head.before(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            padding: 8px 12px;
            border-radius: 8px;
        }
        `);
    }

    if ("https://www.mediapart.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            /**
             * @description create link <a> to BNF mirror
             * @param {string} AUTH_URL_MEDIAPART
             */
            async function createLink(AUTH_URL_MEDIAPART) {
                const span = document.createElement("span");
                span.textContent = "Lire avec BNF";

                const a = document.createElement("a");
                a.href = new URL(window.location);
                a.host = AUTH_URL_MEDIAPART;
                a.appendChild(span);
                return a;
            }

            /**
             * @description check DOM for article under paywall
             * @return {HTMLElement} DOM Premium Banner and head of the article
             */
            function findPremiumBanner() {
                const article = document.querySelector(".news__body__center__container");
                if (!article) return null;
                const elems = article.querySelectorAll(".paywall-message");
                //labels not the same for mobile or PC display
                const textToFind = ["réservée aux abonné·es", "réservé aux abonné·es"];

                return [...elems].filter((balise) =>
                    textToFind.some((text) => balise.textContent.toLowerCase().includes(text))
                );
            }

            /**
             * @description if not properly logged on the mirror website, fetch the login page
             */
            function handleMediapartMirror(config) {
                const navBar = document.querySelector("ul.nav__actions");
                const spans = navBar.querySelectorAll("span");

                let isNotConnected = Array.from(spans).find(
                    (elem) => elem.textContent == "Se connecter"
                );
                if (isNotConnected) {
                    //account name not found. fetch login page
                    const LOGIN_PAGE = new URL(
                        "licence",
                        "https://" + config.AUTH_URL_MEDIAPART
                    );
                    fetch(LOGIN_PAGE).then(() => window.location.reload());
                }
            }

            async function handleMediapart(config) {
                const reserve = findPremiumBanner();
                if (!reserve) return;

                for (const balise of reserve) {
                    balise.appendChild(await createLink(config.AUTH_URL_MEDIAPART));
                }
            }

            /**@description check for users with mediapart access. If yes, create link button */
            async function onLoad() {
                const config = await configurationsSpecifiques(["BNF"]);
                if (!config) return;
                const currentPage = new URL(window.location);
                if (currentPage.host == config.AUTH_URL_MEDIAPART) {
                    handleMediapartMirror(config);
                } else {
                    handleMediapart(config);
                }
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            padding: 8px 12px;
            border-radius: 8px;
        }
        `);
    }

    if ("https://www-mediapart-fr.bnf.idm.oclc.org/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            /**
             * @description create link <a> to BNF mirror
             * @param {string} AUTH_URL_MEDIAPART
             */
            async function createLink(AUTH_URL_MEDIAPART) {
                const span = document.createElement("span");
                span.textContent = "Lire avec BNF";

                const a = document.createElement("a");
                a.href = new URL(window.location);
                a.host = AUTH_URL_MEDIAPART;
                a.appendChild(span);
                return a;
            }

            /**
             * @description check DOM for article under paywall
             * @return {HTMLElement} DOM Premium Banner and head of the article
             */
            function findPremiumBanner() {
                const article = document.querySelector(".news__body__center__container");
                if (!article) return null;
                const elems = article.querySelectorAll(".paywall-message");
                //labels not the same for mobile or PC display
                const textToFind = ["réservée aux abonné·es", "réservé aux abonné·es"];

                return [...elems].filter((balise) =>
                    textToFind.some((text) => balise.textContent.toLowerCase().includes(text))
                );
            }

            /**
             * @description if not properly logged on the mirror website, fetch the login page
             */
            function handleMediapartMirror(config) {
                const navBar = document.querySelector("ul.nav__actions");
                const spans = navBar.querySelectorAll("span");

                let isNotConnected = Array.from(spans).find(
                    (elem) => elem.textContent == "Se connecter"
                );
                if (isNotConnected) {
                    //account name not found. fetch login page
                    const LOGIN_PAGE = new URL(
                        "licence",
                        "https://" + config.AUTH_URL_MEDIAPART
                    );
                    fetch(LOGIN_PAGE).then(() => window.location.reload());
                }
            }

            async function handleMediapart(config) {
                const reserve = findPremiumBanner();
                if (!reserve) return;

                for (const balise of reserve) {
                    balise.appendChild(await createLink(config.AUTH_URL_MEDIAPART));
                }
            }

            /**@description check for users with mediapart access. If yes, create link button */
            async function onLoad() {
                const config = await configurationsSpecifiques(["BNF"]);
                if (!config) return;
                const currentPage = new URL(window.location);
                if (currentPage.host == config.AUTH_URL_MEDIAPART) {
                    handleMediapartMirror(config);
                } else {
                    handleMediapart(config);
                }
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            padding: 8px 12px;
            border-radius: 8px;
        }
        `);
    }

    if ("https://www.ouest-france.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document.querySelector("h1").textContent;
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                a.classList.add("ophirofox-europresse");
                a.style.cssText = 'color:white;border-bottom:none';
                return a;
            }


            function findPremiumBanner() {
                const title = document.querySelector(".su-premium-info");
                if (!title) return null;
                const elems = title.parentElement.querySelectorAll("span");
                return [...elems].find(d => d.textContent.includes("Article premium"))
            }

            async function onLoad() {
                const premiumBanner = findPremiumBanner();
                if (!premiumBanner) return;
                const head = document.querySelector("h1");
                head.after(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            background: #cba200;
            color: #fff;
            text-transform: none;
            text-decoration: none;
            border: 0;
            font-weight: var(--font-weight-bold);
            border-radius: 8px;
            box-sizing: border-box;
            padding: 8px 12px;
        }
        `);
    }

    if ("https://www.sudouest.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document.querySelector("h1").textContent;
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                a.classList.add();
                return a;
            }


            function findPremiumBanner() {
                const title = document.querySelector(".tag.color-premium.uppercase");
                if (!title) return null;
                const elems = title.parentElement.querySelectorAll("span");
                return [...elems].find(d => d.textContent.includes("Réservé aux abonnés"))
            }

            async function onLoad() {
                const head = document.querySelector(".article-premium-header");
                if (!head) return;
                head.appendChild(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            color: black;
            margin-left: 7px;
            padding: 0.4em 0.6em;
            background-color: #ffc400;
            font-size: 10px;
            font-family: "SF Text","Helvetica Neue","Helvetica","Open Sans","Arial",sans-serif;
            line-height: 1em;
            border-radius: 0;
            display: inline-block;
            width: auto;
           	text-transform: uppercase;
            font-weight: 700;
            height: auto;
        }
        `);
    }

    if ("https://www.laprovence.com/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            async function createLink() {
                const a = await ophirofoxEuropresseLink();
                a.classList.add();
                return a;
            }


            function findPremiumBanner() {
                const array = document.querySelectorAll(".rev-margin-0.rev-text-xs-bold");
                const reserve = Array.from(array).find(p => p.textContent.includes("Article réservé aux abonnés"));
                if (!reserve) return null;
                return reserve
            }

            async function onLoad() {
                const premiumBanner = findPremiumBanner();
                if (!premiumBanner) return;
                premiumBanner.appendChild(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            color: black;
            margin-left: 7px;
            padding: 0.4em 0.6em;
            background-color: #ffcd1d;
        }
        `);
    }

    if ("https://www.ladepeche.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            async function createLink() {
                const a = await ophirofoxEuropresseLink();
                a.classList.add();
                return a;
            }


            function findPremiumBanner() {
                const title = document.querySelector(".article-full__media.article__media--premium.ratio-target");
                if (!title) return null;
                const elems = title.parentElement.querySelectorAll("span");
                return [...elems].find(d => d.classList.contains("article--premium__label"))
            }

            async function onLoad() {
                const premiumBanner = findPremiumBanner();
                if (!premiumBanner) return;
                const head = document.querySelector("h1");
                head.after(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            background-color: #f2c94c;
            color: #695106;
            font-family: Lato,Lato-fallback,Arial,Helvetica,sans-serif;
            padding: 1em;
            vertical-align: middle;
            border-radius: 0.5rem;
        }
        `);
    }

    if ("https://www.leparisien.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document.querySelector("h1").textContent;
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                a.classList.add();
                return a;
            }

            async function addEuropresseButton() {
                const head = document.querySelector("h1");
                head.after(await createLink());
            }

            function findPremiumBanner(bannerSelector) {
                if (!bannerSelector) return null;
                const elems = bannerSelector.parentElement.querySelectorAll("div");
                return [...elems].find(d => d.textContent.includes("Cet article est réservé aux abonnés"));
            }

            async function onLoad() {
                const bannerSelector = document.querySelector(".paywall-sticky.width_full.d_flex.pt_3_m.pb_3_m.pt_4_nm.pb_4_nm.pos_stick.ff_gct.fw_r.justify_center");
                if (findPremiumBanner(bannerSelector)) {
                    addEuropresseButton();
                } else {
                    /* Premium banner couldn't be found, use MutationObserver as fallback */
                    var elementFound = false;
                    const callback = (mutationList, observer) => {
                        for (const mutation of mutationList) {
                            for (const e of mutation.addedNodes) {
                                const bannerSelectorString = 'paywall-sticky width_full d_flex pt_3_m pb_3_m pt_4_nm pb_4_nm pos_stick ff_gct fw_r justify_center';
                                if (e.className == bannerSelectorString) {
                                    observer.disconnect();
                                    elementFound = true;
                                    if (findPremiumBanner(e)) {
                                        addEuropresseButton();
                                    }
                                    break;
                                }
                            }
                            if (elementFound) {
                                break;
                            }
                        }
                    };
                    const observer = new MutationObserver(callback);
                    observer.observe(document.body, {
                        childList: true
                    });
                }
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            background-color: #fc3;
            color: black;
            font-family: GraphikCompact,Arial,sans-serif;
            font-weight: 600;
            letter-spacing: .02em;
            font-size: 1rem;
            line-height: 1.5rem;
            text-decoration: none;
            border-radius: 1.25rem;
            padding: 0.7em;
            margin-bottom: 10px;
            display: block;
            width: 135px;
        }
        `);
    }

    if ("https://www.lexpress.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function findPremiumBanner() {
                const banner = document.querySelector('.article__premium--icon');
                return banner;
            }

            async function onLoad() {
                const banner = findPremiumBanner();
                if (!banner) return;
                const anchor = document.querySelector(
                    '.article__icons'
                );
                const newDiv = document.createElement('div');
                newDiv.classList.add('europresse-button');
                anchor.appendChild(newDiv);
                newDiv.appendChild(await ophirofoxEuropresseLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            text-decoration: none;
            color: #1b1b1b;
            transition: color 0.3s;
        }
        
        .ophirofox-europresse:hover {
            color: #fff;
        }
        
        .ophirofox-europresse:visited {
            color: #1b1b1b;
        }
        
        .ophirofox-europresse:visited:hover {
            color: #fff;
        }
        
        .europresse-button {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            color: #1b1b1b;
            border: solid 1px #1b1b1b;
            gap: 8px;
            height: 39px;
            background-color: #fff;
            font-weight: 600;
            border-radius: 42px;
            text-decoration: none;
            font-size: 0.75rem;
            cursor: pointer;
            padding: 10px 14px;
            font-family: Spartan, Spartan Fallback 1, Spartan Fallback 2, system-ui,
                -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans,
                sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol,
                Noto Color Emoji;
            transition: background-color 0.3s, color 0.3s;
        }
        
        .europresse-button:hover {
            color: #fff;
            background-color: #1b1b1b;
        }
        
        .europresse-button:hover a {
            color: #fff;
        }
        
        .europresse-button:visited {
            color: #1b1b1b;
        }
        `);
    }

    if ("https://www.nouvelobs.com/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document.querySelector("h1").textContent;
            }

            const isPremium = () => {
                const metaElement = document.querySelector('meta[name="ad:teaser"]');
                if (metaElement) {
                    if (metaElement.content === 'true')
                        return true;
                }
                return false;
            };

            async function onLoad() {
                if (!isPremium()) return;
                document.querySelector("h1").after(await ophirofoxEuropresseLink(extractKeywords()));
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            background-color: #FEEB6F;
            padding: 1rem 1.5rem;
            color: #000;
            border: none;
            border-radius: 3.6rem;
            text-decoration: none;
            box-shadow: none;
            text-transform: uppercase;
            font-size: 1.2rem;
            font-family: "Karla",ff-karla,sans-serif;
            font-weight: 700;
            text-align: center;
            display: block;
            width: 200px;
            margin-top: 1rem;
            margin-bottom: 1rem;
        
        }
        
        .ophirofox-europresse:hover, .ophirofox-europresse:active {
            background-color: #FFC70F;
        }
        `);
    }

    if ("https://www.estrepublicain.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            async function createLink() {
                const a = await ophirofoxEuropresseLink();
                a.classList.add('bt_special');
                return a;
            }


            function findPremiumBanner() {
                const title = document.querySelector(".non-paywall");
                if (!title) return null;
                const elems = title.parentElement.querySelectorAll("span");
                return [...elems].find(d => d.classList.contains("flagPaid"))
            }

            async function onLoad() {
                const premiumBanner = findPremiumBanner();
                if (!premiumBanner) return;
                const head = document.querySelector("h1");
                head.after(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            border-radius: 3px;
            background-color: #f9dc00;
        }
        `);
    }

    if ("https://www.latribune.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document.querySelector('h1').textContent;
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                a.classList.add();
                return a;
            }

            function findPremiumBanner() {
                const title = document.querySelector('.rev-premium-tag-article-lt__container');
                if (!title) return null;
                const elems = title.querySelectorAll('p');
                return [...elems].find((d) => d.textContent === 'Ce contenu est réservé aux abonnés');
            }

            async function onLoad() {
                const premiumBanner = findPremiumBanner();
                if (!premiumBanner) return;
                premiumBanner.after(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            background-color: #ffc612;
            font-family: "Roboto",sans-serif;
            padding: 2px 1rem;
            font-size: 15px;
            color: #163860;
            border-radius: 1px;
            display: inline-block;
        }
        `);
    }

    if ("https://www.lopinion.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            async function createLink() {
                const a = await ophirofoxEuropresseLink();
                a.classList.add();
                return a;
            }

            function findPremiumBanner() {
                const title = document.querySelector('div.paywall');
                if (!title) return null;
                return title;
            }

            async function onLoad() {
                const premiumBanner = findPremiumBanner();
                if (!premiumBanner) return;
                const anchor = document.querySelector('.Article-date');
                anchor.after(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            background-color: #ffc612;
            font-family: serif;
            padding: 0.5rem 1.3rem;
            font-size: 1.3rem;
            font-weight: bold;
            vertical-align: middle;
            text-align: center;
            border-radius: 5px;
            display: inline-block;
        }
        `);
    }

    if ("https://www.nicematin.com/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            async function createLink() {
                const a = await ophirofoxEuropresseLink();
                a.classList.add();
                return a;
            }

            function findPremiumBanner() {
                const title = document.querySelector('div.header-subscriber');
                if (!title) return null;
                return title;
            }

            async function onLoad() {
                const premiumBanner = findPremiumBanner();
                if (!premiumBanner) return;
                premiumBanner.appendChild(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            background-color: #faec70;
            font-family: "Raleway", Arial, Helvetica, sans-serif;
            margin-left: 2em;
            padding: 2px 1em;
            font-size: 1.4rem;
            font-weight: bold;
            border-radius: 24px;
            display: inline-block;
        }
        `);
    }

    if ("https://www.corsematin.com/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            async function createLink() {
                const a = await ophirofoxEuropresseLink();
                a.classList.add();
                return a;
            }

            function findPremiumBanner() {
                const title = document.querySelector('div.ml-2');
                if (!title) return null;
                return title;
            }

            async function onLoad() {
                const premiumBanner = findPremiumBanner();
                if (!premiumBanner) return;
                premiumBanner.after(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            background-color: #ffc612;
            font-family: "Roboto", sans-serif;
            padding: 2px 1em;
            font-size: 1.4rem;
            font-weight: 700;
            border-radius: 24px;
            margin-left: 1rem;
            display: inline-block;
        }
        `);
    }

    if ("https://www.lorientlejour.com/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            async function createLink() {
                const a = await ophirofoxEuropresseLink();
                a.classList.add();
                return a;
            }

            function findPremiumBanner() {
                const title = document.querySelector('article.main.premium');
                if (!title) return null;
                return title;
            }

            async function onLoad() {
                const premiumBanner = findPremiumBanner();
                if (!premiumBanner) return;
                const anchor = premiumBanner.querySelector('h1');
                anchor.appendChild(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            font-size: 10px;
            font-family: "AktivGrotesk-Medium", Helvetica, Arial, sans-serif;
            text-transform: uppercase;
            color: #8f7f54;
            width: auto;
            height: 26px;
            padding-left: 8px;
            padding-right: 8px;
            background-color: #ffdf8a;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
            margin: 0 0 0 10px;
            line-height: 26px;
        }
        `);
    }

    if ("https://www.lavenir.net/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document.querySelector("h1").textContent;
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                return a;
            }

            async function onLoad() {
                const statusElem = document.getElementsByClassName("ap-PaidPicto");
                if (statusElem.length == 0) return;
                statusElem[0].after(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            display: inline-block;
            margin: 0.4em 0.7em 0 -0.25em;
            padding: 0 1em;
            border-radius: 0.25em;
            background-color: #ffcb00;
            color: #000 !important;
            font-size: small;
            vertical-align: top;
            line-height: 2.5;
        }
        `);
    }

    if ("https://www.dhnet.be/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document.querySelector("h1").textContent;
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                return a;
            }

            async function onLoad() {
                const statusElem = document.getElementsByClassName("ap-PaidPicto");
                if (statusElem.length == 0) return;
                statusElem[0].after(await createLink());
            }

            onLoad().catch(console.error);

            //OK
        });

        pasteStyle(`
        .ophirofox-europresse {
            display: inline-block;
            margin: 0 0.7em 0 0.1em;
            padding: 0 1em;
            border-radius: 0.25rem;
            background-color: #f7b500;
            color: #000 !important;
            font-size: small;
            vertical-align: middle;
            line-height: 2.7;
        }
        `);
    }

    if ("https://www.sudinfo.be/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document.querySelector("h1").textContent;
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                return a;
            }

            function findPremiumBanner() {
                const title = document.querySelector("h1");
                if (!title) return null;
                const elems = title.parentElement.querySelectorAll("span");
                return [...elems].find(d => d.classList.contains("r-article--payant"));
            }

            async function onLoad() {
                const premiumBanner = findPremiumBanner();
                if (!premiumBanner) return;
                premiumBanner.after(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            display: inline-block;
            padding: 3px 5px 1px 5px;
            background-color: #ffc549;
            color: #000;
            vertical-align: bottom;
            font-weight: bold;
        }
        `);
    }

    if ("https://www.letelegramme.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document.querySelector("h1").textContent;
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                a.classList.add("tlg-btn", "tlg-btn-premium");
                return a;
            }

            function findPremiumBanner() {
                return document.querySelector(".tlg-article-premium");
            }

            async function onLoad() {
                const premiumBanner = findPremiumBanner();
                if (!premiumBanner) return;
                premiumBanner.after(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            margin-bottom: 24px;
        }
        `);
    }

    if ("https://www.lsa-conso.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document
                    .querySelector("meta[property='og:title']")
                    .getAttribute("content");
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                return a;
            }

            function findPremiumBanner() {
                const anchor = document.querySelector('div.epMetaData__head-open');
                if (!anchor) {
                    return;
                }
                return anchor;
            }

            async function onLoad() {
                const premiumBanner = findPremiumBanner();
                if (!premiumBanner) return;
                premiumBanner.parentElement.before(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            background-color: rgb(254, 194, 45);
            box-sizing: border-box;
            color: rgb(0, 0, 0);
            display: block;
            font-family: robotoslab-bold, Arial, Helvetica, sans-serif;
            font-size: 16px;
            height: 38px;
            line-height: 18.4px;
            padding-bottom: 10px;
            padding-left: 10px;
            padding-right: 10px;
            padding-top: 10px;
            text-align: center;
            width: 190px;
            -webkit-user-drag: auto;
            -webkit-user-select: text;
            text-decoration: none;
            margin-bottom: 10px;
        }
        
        .ophirofox-europresse:hover {
            color: #ffffff;
        }
        `);
    }

    if ("https://www.leprogres.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                // Works better with keywords from url
                return extractKeywordsFromUrl(window.location) || extractKeywordsFromTitle();
            }

            function extractKeywordsFromTitle() {
                const titleElem = document.querySelector("head > title, article h1");
                return titleElem && titleElem.textContent;
            }

            function extractKeywordsFromUrl(url) {
                const source_url = new URL(url);
                const le_progres_match = source_url.pathname.match(/([^/.]+)(_\d*_\d*\.html)?$/);
                if (!le_progres_match) return false;
                return le_progres_match[1];
            }

            function extractPublishDate() {
                try {
                    const script = document.querySelector("script[type='application/ld+json']")
                    const json = JSON.parse(script.innerText)
                    const datePublished = json[0].datePublished;
                    return datePublished;
                } catch {
                    // tant pis
                    return null;
                }
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords(), {
                    publishedTime: extractPublishDate()
                });
                a.classList.add("btn", "bt_default");
                return a;
            }

            function waitForElm(selector) {
                return new Promise(resolve => {
                    if (document.querySelector(selector)) {
                        return resolve(document.querySelector(selector));
                    }

                    const observer = new MutationObserver(mutations => {
                        if (document.querySelector(selector)) {
                            observer.disconnect();
                            resolve(document.querySelector(selector));
                        }
                    });

                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                });
            }

            async function onLoad() {
                const actionElement = document.querySelector(".fullDetailActions");
                if (actionElement) {
                    actionElement.appendChild(await createLink());
                }

                let paywallElem = await waitForElm(".p3-advanced-paywall");
                if (!paywallElem) return;

                const link = await createLink();
                link.className = "button";
                paywallElem.parentNode.insertBefore(link, paywallElem);
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            margin-left: 4px;
            margin-top: 0px;
        
        }
        `);
    }

    if ("https://www.levif.be/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                const titleElem = document.querySelector("h1").childNodes[0];
                return titleElem && titleElem.textContent;
            }

            let buttonAdded = false;

            async function addEuropresseButton() {
                if (!buttonAdded) {
                    const elt = document.querySelector('.datawall-wrapper .register');
                    if (elt) {
                        const a = await ophirofoxEuropresseLink(extractKeywords());
                        elt.after(a);
                        buttonAdded = true;
                    }
                }
            }

            async function onLoad() {
                const callback = (mutationList, observer) => {
                    for (const mutation of mutationList) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            const newClassState = mutation.target.classList.contains('is-hidden');
                            if (classState !== newClassState) {
                                addEuropresseButton();
                            }
                        }
                    }
                };

                const htmlElement = document.querySelector('#paywall-modal');
                const classState = htmlElement.classList.contains('is-hidden');
                const observer = new MutationObserver(callback);
                observer.observe(htmlElement, {
                    attributes: true,
                    subtree: true
                });
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.5rem 1.5rem;
            border-radius: 0.3rem;
            background-color: #ffc700;
            color: #000;
            font-family: "Aeonik","Publica Slab","Helvetica","Arial",sans-serif;
            font-size: 1.5rem;
            text-decoration: none;
        }
        `);
    }

    if ("https://trends.levif.be/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                const titleElem = document.querySelector("h1").childNodes[0];
                return titleElem && titleElem.textContent;
            }

            let buttonAdded = false;

            async function addEuropresseButton() {
                if (!buttonAdded) {
                    const elt = document.querySelector('.datawall-wrapper .login');
                    if (elt) {
                        const a = await ophirofoxEuropresseLink(extractKeywords());
                        elt.after(a);
                        buttonAdded = true;
                    }
                }
            }

            async function onLoad() {
                const callback = (mutationList, observer) => {
                    for (const mutation of mutationList) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            const newClassState = mutation.target.classList.contains('is-hidden');
                            if (classState !== newClassState) {
                                addEuropresseButton();
                            }
                        }
                    }
                };

                const htmlElement = document.querySelector('#paywall-modal');
                const classState = htmlElement.classList.contains('is-hidden');
                const observer = new MutationObserver(callback);
                observer.observe(htmlElement, {
                    attributes: true,
                    subtree: true
                });
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.5rem 1.5rem;
            border-radius: 0.3rem;
            background-color: #ffc700;
            color: #000;
            font-family: "Aeonik","Publica Slab","Helvetica","Arial",sans-serif;
            font-size: 1.5rem;
            text-decoration: none;
        }
        `);
    }

    if ("https://www.knack.be/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                const titleElem = document.querySelector("h1").childNodes[0];
                return titleElem && titleElem.textContent;
            }

            let buttonAdded = false;

            async function addEuropresseButton() {
                if (!buttonAdded) {
                    const elt = document.querySelector('.datawall-wrapper .register');
                    if (elt) {
                        const a = await ophirofoxEuropresseLink(extractKeywords());
                        elt.after(a);
                        buttonAdded = true;
                    }
                }
            }

            async function onLoad() {
                const callback = (mutationList, observer) => {
                    for (const mutation of mutationList) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            const newClassState = mutation.target.classList.contains('is-hidden');
                            if (classState !== newClassState) {
                                addEuropresseButton();
                            }
                        }
                    }
                };

                const htmlElement = document.querySelector('#paywall-modal');
                const classState = htmlElement.classList.contains('is-hidden');
                const observer = new MutationObserver(callback);
                observer.observe(htmlElement, {
                    attributes: true,
                    subtree: true
                });
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.5rem 1.5rem;
            border-radius: 0.3rem;
            background-color: #ffc700;
            color: #000;
            font-family: "Aeonik","Publica Slab","Helvetica","Arial",sans-serif;
            font-size: 1.5rem;
            text-decoration: none;
        }
        `);
    }

    if ("https://www.demorgen.be/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                const titleElem = document.querySelector("h1").childNodes[0];
                return titleElem && titleElem.textContent;
            }

            let buttonAdded = false;

            async function addEuropresseButton() {
                if (!buttonAdded) {
                    const elts = document.querySelectorAll('.tm-account');
                    if (elts) {
                        for (let elt of elts) {
                            const a = await ophirofoxEuropresseLink(extractKeywords());
                            elt.after(a);
                            buttonAdded = true;
                        }
                    }
                }
            }

            async function onLoad() {
                const callback = (mutationList, observer) => {
                    for (const mutation of mutationList) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            const newClassState = mutation.target.classList.contains('js-tm-backdrop-active');
                            if (classState !== newClassState) {
                                addEuropresseButton();
                                observer.disconnect();
                            }
                        }
                    }
                };

                const htmlElement = document.querySelector('body');
                const classState = htmlElement.classList.contains('js-tm-backdrop-active');
                const observer = new MutationObserver(callback);
                observer.observe(htmlElement, {
                    attributes: true,
                    subtree: true
                });
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            display: block;
            width: 12vw;
            margin: 1rem auto;
            padding: 0.25rem;
            border-radius: 0.3rem;
            background-color: #ffc700;
            color: #000 !important;
            text-align: center;
            text-decoration: none;
        }
        `);
    }

    if ("https://www.standaard.be/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            let buttonAdded = false;
            const article_title = document.querySelector('header[data-testid="article-header"] h1');

            function extractKeywords() {
                return article_title.textContent;
            }

            async function createLink(elt) {
                if (elt && buttonAdded == false) {
                    const a = await ophirofoxEuropresseLink(extractKeywords());
                    elt.after(a);
                    console.log(elt);
                    if (elt !== article_title) {
                        //second link is in shadow dom context -> no access to stylesheet
                        a.style.display = "block"
                        a.style.width = "35%";
                        a.style.margin = "0.5rem auto";
                        a.style.padding = "0.5rem 0";
                        a.style.borderRadius = "0.3rem";
                        a.style.backgroundColor = "#ffc700";
                        a.style.color = "#000";
                        a.style.textDecoration = "none";
                        a.style.textAlign = "center";
                    }
                }
            }

            async function onLoad() {
                const callback = (mutationList, observer) => {
                    for (const mutation of mutationList) {
                        if (mutation.type === 'childList') {
                            for (let node of mutation.addedNodes) {
                                const paywall_modal = document.querySelector('.PSAPAG_root');
                                if (paywall_modal) {
                                    ;
                                    const shadow_content = document.querySelector('.PSAPAG_root').shadowRoot;
                                    const modal_content = shadow_content.firstChild.lastChild;
                                    createLink(article_title);
                                    createLink(modal_content);

                                    buttonAdded = true;
                                    observer.disconnect();
                                }
                            }
                        }
                    }
                };

                const htmlElement = document.querySelector('body');
                const observer = new MutationObserver(callback);
                observer.observe(htmlElement, {
                    childList: true
                });
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.25rem 1rem;
            border-radius: 0.3rem;
            background-color: #ffc700 !important;
            color: #000 !important;
            text-align: center;
            text-decoration: none !important;
        }
        `);
    }

    if ("https://www.ft.com/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document.querySelector("#barrier-page h1").textContent;
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                return a;
            }

            async function onLoad() {
                const paywall = document.querySelector('#barrier-page');
                if (paywall == null) return;
                const title = document.querySelector("#barrier-page h1");
                title.after(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            display: inline-block;
            margin-bottom: 1rem;
            padding: 0.5rem 1.5rem;
            border-radius: 0.3rem;
            background-color: #ffc700;
            color: #000;
            text-decoration: none;
        }
        `);
    }

    if ("https://www.gva.be/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            let buttonAdded = false;
            const article_title = document.querySelector('header[data-testid="article-header"] h1');

            function extractKeywords() {
                return article_title.textContent;
            }

            async function createLink(elt) {
                if (elt && buttonAdded == false) {
                    const a = await ophirofoxEuropresseLink(extractKeywords());
                    elt.after(a);
                    console.log(elt);
                    if (elt !== article_title) {
                        //second link is in shadow dom context -> no access to stylesheet
                        a.style.display = "block"
                        a.style.width = "35%";
                        a.style.margin = "0.5rem auto";
                        a.style.padding = "0.5rem 0";
                        a.style.borderRadius = "0.3rem";
                        a.style.backgroundColor = "#ffc700";
                        a.style.color = "#000";
                        a.style.textDecoration = "none";
                        a.style.textAlign = "center";
                    }
                }
            }

            async function onLoad() {
                const callback = (mutationList, observer) => {
                    for (const mutation of mutationList) {
                        if (mutation.type === 'childList') {
                            for (let node of mutation.addedNodes) {
                                const paywall_modal = document.querySelector('.PSAPAG_root');
                                if (paywall_modal) {
                                    ;
                                    const shadow_content = document.querySelector('.PSAPAG_root').shadowRoot;
                                    const modal_content = shadow_content.firstChild.lastChild;
                                    createLink(article_title);
                                    createLink(modal_content);

                                    buttonAdded = true;
                                    observer.disconnect();
                                }
                            }
                        }
                    }
                };

                const htmlElement = document.querySelector('body');
                const observer = new MutationObserver(callback);
                observer.observe(htmlElement, {
                    childList: true
                });
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.25rem 1rem;
            border-radius: 0.3rem;
            background-color: #ffc700;
            color: #000 !important;
            text-align: center;
            text-decoration: none;
        }
        `);
    }

    if ("https://www.nieuwsblad.be/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            let buttonAdded = false;
            const article_title = document.querySelector('header[data-testid="article-header"] h1');

            function extractKeywords() {
                return article_title.textContent;
            }

            async function createLink(elt) {
                if (elt && buttonAdded == false) {
                    const a = await ophirofoxEuropresseLink(extractKeywords());
                    elt.after(a);
                    console.log(elt);
                    if (elt !== article_title) {
                        //second link is in shadow dom context -> no access to stylesheet
                        a.style.display = "block"
                        a.style.width = "35%";
                        a.style.margin = "0.5rem auto";
                        a.style.padding = "0.5rem 0";
                        a.style.borderRadius = "0.3rem";
                        a.style.backgroundColor = "#ffc700";
                        a.style.color = "#000";
                        a.style.textDecoration = "none";
                        a.style.textAlign = "center";
                    }
                }
            }

            async function onLoad() {
                const callback = (mutationList, observer) => {
                    for (const mutation of mutationList) {
                        if (mutation.type === 'childList') {
                            for (let node of mutation.addedNodes) {
                                const paywall_modal = document.querySelector('.PSAPAG_root');
                                if (paywall_modal) {
                                    ;
                                    const shadow_content = document.querySelector('.PSAPAG_root').shadowRoot;
                                    const modal_content = shadow_content.firstChild.lastChild;
                                    createLink(article_title);
                                    createLink(modal_content);

                                    buttonAdded = true;
                                    observer.disconnect();
                                }
                            }
                        }
                    }
                };

                const htmlElement = document.querySelector('body');
                const observer = new MutationObserver(callback);
                observer.observe(htmlElement, {
                    childList: true
                });
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.25rem 1rem;
            border-radius: 0.3rem;
            background-color: #ffc700;
            color: #000 !important;
            text-align: center;
            text-decoration: none;
        }
        `);
    }

    if ("https://www.hln.be/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                const titleElem = document.querySelector("h1").childNodes[0];
                return titleElem && titleElem.textContent;
            }

            let buttonAdded = false;

            async function addEuropresseButton() {
                if (!buttonAdded) {
                    const elts = document.querySelectorAll('.tm-account');
                    if (elts) {
                        for (let elt of elts) {
                            const a = await ophirofoxEuropresseLink(extractKeywords());
                            elt.after(a);
                            buttonAdded = true;
                        }
                    }
                }
            }

            async function onLoad() {
                const callback = (mutationList, observer) => {
                    for (const mutation of mutationList) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            const newClassState = mutation.target.classList.contains('js-tm-backdrop-active');
                            if (classState !== newClassState) {
                                addEuropresseButton();
                                observer.disconnect();
                            }
                        }
                    }
                };

                const htmlElement = document.querySelector('body');
                const classState = htmlElement.classList.contains('js-tm-backdrop-active');
                const observer = new MutationObserver(callback);
                observer.observe(htmlElement, {
                    attributes: true,
                    subtree: true
                });
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            display: block;
            width: 12vw;
            margin: 1rem auto;
            padding: 0.25rem;
            border-radius: 0.3rem;
            background-color: #ffc700;
            color: #000 !important;
            text-align: center;
            text-decoration: none !important;
        }
        `);
    }

    if ("https://www.challenges.fr/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            console.log('Ophirofox loaded');

            async function createLink() {
                return await ophirofoxEuropresseLink();
            }

            async function onLoad() {
                const statusElem = document.querySelector("span.article-abo-tag");
                if (!statusElem) return;
                statusElem.before(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            background-color: #fcc525;
            font-family: "DIN",Helvetica,arial,sans-serif;
            color: #101010 !important;
            text-transform: uppercase;
            font-size: 11px;
            padding: 4px 6px 1px 6px;
            display: inline-block;
        }
        
        .ophirofox-europresse:hover {
            color: #a6a6a6 !important;
        }
        `);
    }

    if ("https://www.arretsurimages.net/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            //Aknowledgment : arret-sur-images feature found already mostly done on https://github.com/Rohirrim03/ profile.
            //BNF : Bibliothèque Nationale de France

            /**
             * @description create link <a> to BNF mirror
             * @param {string} AUTH_URL_ARRETSURIMAGES
             */
            async function createLink(AUTH_URL_ARRETSURIMAGES) {
                const span = document.createElement("span");
                span.textContent = "Lire avec BNF";
                span.className = "sub-stamp-component etiquette ophirofox-europresse";

                const a = document.createElement("a");
                var newUrl = new URL(window.location); //current page
                newUrl.host = AUTH_URL_ARRETSURIMAGES //change only the domain name
                newUrl.href
                a.href = newUrl;

                a.appendChild(span);

                return a;
            }

            /**
             * @description check DOM for article under paywall 
             * @return {HTMLElement} DOM Premium Banner and head of the article
             */
            function findPremiumBanner() {
                const article = document.querySelector(".article");
                if (!article) return null;
                const elems = article.querySelectorAll("span, mark");
                const textToFind = ["réservé aux abonné.e.s", "Réservé à nos abonné.e.s"];

                return [...elems].filter(d => textToFind.some(text => d.textContent.includes(text)))
            }

            /**@description check for BNF users. If yes, create link button */
            async function onLoad() {

                const config = await configurationsSpecifiques(['BNF'])
                if (!config) return;
                const reserve = findPremiumBanner();
                if (!reserve) return;

                for (const balise of reserve) {
                    balise.parentElement.appendChild(await createLink(config.AUTH_URL_ARRETSURIMAGES));
                }
            }

            setTimeout(function() {
                onLoad().catch(console.error);
            }, 1000);
        });

        pasteStyle(`
        .ophirofox-europresse {
            background-color: #f05246;
            border: 1px #f05246 solid;
            padding: calc(0.25em - 1px) 0.5em !important;
            color: #fff;
            font-family: "Merriweather", serif;
            font-weight: 900 !important;
            font-style: italic !important;
            text-transform: none !important;
        }
        `);
    }

    if ("https://www.pressreader.com/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            async function createLink(AUTH_URL) {
                const div = document.createElement("div");
                div.className = "ophirofox-europresse"
                const a = document.createElement("a");
                a.textContent = "Cliquez pour lire avec BNF"
                var newUrl = new URL(window.location); //current page
                newUrl.host = AUTH_URL //change only the domain name
                a.href = newUrl;

                div.appendChild(a);
                return div;
            }

            /**
             * @description website navigation without window reload.
             */
            async function onLoad() {
                const config = await configurationsSpecifiques(['BNF'])
                if (!config) return;
                //too much js dom updates everywere to choose a more specific DOM.element.
                const element = document.querySelector('body');
                if (!element) return;
                element.insertAdjacentElement('beforeend', await createLink(config.AUTH_URL_PRESSREADER));
            }

            onLoad().catch(console.error)
        });

        pasteStyle(`
        .ophirofox-europresse {
          visibility: visible !important;
          position: fixed;
          text-align: center;
          width: 100%;
          top: 0px;
          left: 0px;
          z-index: 50;
        }
        .ophirofox-europresse > a {
          color: #fff !important;
          padding: 1px 20px;
          font-weight: 600;
          background-color: #2bc48c;
          border-radius: 25px;
        }
        `);
    }

    if ("https://www.usinenouvelle.com/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            function extractKeywords() {
                return document.querySelector(".editoSocialBar__item[data-title]").dataset.title
            }

            async function createLink() {
                const a = await ophirofoxEuropresseLink(extractKeywords());
                a.style = 'font-family: "arimo-bold",Arial,Helvetica,sans-serif; border-bottom: 2px solid #000; margin-left : 1rem'
                return a;
            }

            function findPremiumBanner() {
                const div = document.querySelector(".epPayWallTop");
                if (!div) return null;
                console.log('all div', div)
                console.log('last child', div.lastElementChild)
                return elem = div.lastElementChild;
            }

            async function onLoad() {
                const premiumBanner = findPremiumBanner();
                if (!premiumBanner) return;
                premiumBanner.after(await createLink());
            }

            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
          visibility: visible !important;
          position: fixed;
          text-align: center;
          width: 100%;
          top: 0px;
          left: 0px;
          z-index: 50;
        }
        .ophirofox-europresse > a {
          color: #fff !important;
          padding: 1px 20px;
          font-weight: 600;
          background-color: #2bc48c;
          border-radius: 25px;
        }
        `);
    }

    if ("https://elpais.com/*".includes(hostname)) {

        window.addEventListener("load", function(event) {
            let buttonAdded = false;

            function extractKeywords() {
                let currentURL = new URL(window.location);
                // get title at the end of URL pathname.
                // Remove noise characters, and make it search-ready for europress
                const result = currentURL.pathname
                    .split("/")
                    .pop()
                    .replace(/-|\.html$/g, " ")
                    .trim();
                return result;
            }

            async function createLink(title) {
                if (title && buttonAdded == false) {
                    const div = document.createElement("div");
                    const a = await ophirofoxEuropresseLink(extractKeywords());
                    a.textContent = "Lire sur europresse (Lexis Nexis)";
                    div.appendChild(a);
                    title.after(div);
                }
            }

            async function onLoad() {
                console.log("ophirofox loaded");
                const callback = (mutationList, observer) => {
                    for (const mutation of mutationList) {
                        if (mutation.type === "childList") {
                            for (let node of mutation.addedNodes) {
                                const paywall = document.querySelector("#ctn_freemium_article");
                                if (paywall == null) return;

                                if (buttonAdded == false) {
                                    const article = document.querySelector(".a_s_b");
                                    createLink(article);

                                    const title = document.querySelector("h1");
                                    createLink(title);
                                }
                                buttonAdded = true;
                                observer.disconnect();
                            }
                        }
                    }
                };
                const htmlElement = document.querySelector("article");
                const observer = new MutationObserver(callback);
                observer.observe(htmlElement, {
                    childList: true,
                    subtree: true
                });
            }
            onLoad().catch(console.error);
        });

        pasteStyle(`
        .ophirofox-europresse {
            padding: .5rem;
          font-size: .75rem;
          min-width: 10rem;
          background: #f7cf3c;
          font-weight: 700;
          font-family: MarcinAntB,sans-serif;
        }
        `);
    }
})();