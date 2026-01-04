// ==UserScript==
// @name         WME GIS Layers - Alt County layer 2019
// @namespace    https://greasyfork.org/users/
// @version      2019.07.23.0001
// @description  Adds GIS layers in WME
// @author       MapOMatic
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://greasyfork.org/scripts/381289-jquery-ui-1-11-4-wazedev-custom-min-js/code/jquery-ui-1114wazedevcustomminjs.js
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @license      GNU GPLv3
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @connect      *
// @connect tigerweb.geo.census.gov
// @connect 131.156.137.22
// @connect 131.187.129.114
// @connect 136.234.11.196
// @connect 136.234.13.165
// @connect 184.12.255.122
// @connect 204.63.176.116
// @connect 206.176.83.74
// @connect 206.74.124.99
// @connect 216.110.207.61
// @connect 216.167.160.20
// @connect 23.96.59.134
// @connect 311webservreq.cityofbeaumont.com
// @connect 35.172.145.31
// @connect 52.37.30.30
// @connect 54.213.14.253
// @connect 63.238.120.156
// @connect 66.119.96.76
// @connect 72.10.206.73
// @connect a2maps.a2gov.org
// @connect adairgis.integritygis.com
// @connect agis.charlottecountyfl.gov
// @connect ags.agdmaps.com
// @connect ags.colliergov.net
// @connect ags.kitsapgov.com
// @connect ags10s1.dot.illinois.gov
// @connect ags2maps.srcity.org
// @connect ags3.lincoln.ne.gov
// @connect ags3.scgov.net
// @connect al.decatur.geopowered.com
// @connect aldotgis.dot.state.al.us
// @connect alleganygis.allconet.org
// @connect alphagis.alpharetta.ga.us
// @connect andrewgis.integritygis.com
// @connect apnsgis1.apsu.edu
// @connect app.mdt.mt.gov
// @connect apps.douglas.co.us
// @connect apps.fs.usda.gov
// @connect apps.lcounty.com
// @connect apps.willcogis.org
// @connect apps.wyoroad.info
// @connect arc2000.florenceco.org
// @connect arcgis.atlantaregional.com
// @connect arcgis.cityofcapegirardeau.org
// @connect arcgis.co.beltrami.mn.us
// @connect arcgis.lakecountyohio.gov
// @connect arcgis.mobile311.com
// @connect arcgis.racinecounty.com
// @connect arcgis.sd.gov
// @connect arcgis.tampagov.net
// @connect arcgis.tuscaloosa-al.gov
// @connect arcgis.vgsi.com
// @connect arcgis.waxahachie.com
// @connect arcgis.wycokck.org
// @connect arcgis.yumacountyaz.gov
// @connect arcgis2.williamsoncounty-tn.gov
// @connect arcgis4.roktech.net
// @connect arcgisce.co.valencia.nm.us
// @connect arcgiswap01.ci.temple.tx.us
// @connect arcgisweb.carteretcountync.gov
// @connect arcgisweb.co.fort-bend.tx.us
// @connect arcgisweb.countyofnewaygo.com
// @connect arcgiswebadp3.morpc.org
// @connect arcmobile.co.albany.wy.us
// @connect arcserv.co.washington.ar.us
// @connect arcserver.madisoncountyky.us
// @connect arcweb.hcad.org
// @connect arcweb.ycpc.org
// @connect ash.bernco.gov
// @connect atchisongis.integritygis.com
// @connect atlas.co.anson.nc.us
// @connect atlas.geoportalmaps.com
// @connect audraingis.integritygis.com
// @connect batesgis.integritygis.com
// @connect bcgis.baltimorecountymd.gov
// @connect bcgis.broward.org
// @connect bcmaps.bradfordco.org
// @connect bcweb-adapters.bcpa.net
// @connect bentongis.integritygis.com
// @connect bocagis.ci.boca-raton.fl.us
// @connect bradleytn.geopowered.com
// @connect broadbandgis.bakerprojects.com
// @connect bryangis.bryan-county.org
// @connect bsm.sfdpw.org
// @connect buchanangis.integritygis.com
// @connect c39gisserver.co.richland.nd.us
// @connect ca.dep.state.fl.us
// @connect cache.gis.lacounty.gov
// @connect cagisonline.hamilton-co.org
// @connect calvertgis.co.cal.md.us
// @connect camdengis.integritygis.com
// @connect cassgis.integritygis.com
// @connect cassweb3.co.cass.mn.us
// @connect ccgis.crawfordcountypa.net
// @connect ccgisapps.charlestoncounty.org
// @connect ccmap.cccounty.us
// @connect cdsd.co.teller.co.us
// @connect cecilmaps.ccgov.org
// @connect cloud.longviewtexas.gov
// @connect cloud.sagis.org
// @connect cloudgis.bonnercountyid.gov
// @connect co.kent.de.us
// @connect coagisweb.cabq.gov
// @connect coopergis.integritygis.com
// @connect crgis.cedar-rapids.org
// @connect dadegis.integritygis.com
// @connect dallasgis.integritygis.com
// @connect data.wsdot.wa.gov
// @connect data1.digitaldataservices.com
// @connect dc-web.co.douglas.mn.us
// @connect dcimapapps.countyofdane.com
// @connect dekalbgis.integritygis.com
// @connect doniphangis.integritygis.com
// @connect douglasgis.integritygis.com
// @connect douglasil.com
// @connect dtdapps.coloradodot.info
// @connect dungis.dunwoodyga.gov
// @connect ec2-13-59-57-177.us-east-2.compute.amazonaws.com
// @connect ecgis.co.ellis.tx.us
// @connect egis.pinellascounty.org
// @connect elb.elevatemaps.io
// @connect elb2.39dn.com
// @connect emapsplus.com
// @connect engineer.gomvo.org
// @connect epv.ci.juneau.ak.us
// @connect eservices.co.crook.or.us
// @connect essex-gis.co.essex.ny.us
// @connect esuite.concordnh.gov
// @connect fremontgis.com
// @connect geaugarealink.co.geauga.oh.us
// @connect gem.edcgov.us
// @connect geo.brunswickcountync.gov
// @connect geo.forsythco.com
// @connect geo.oit.ohio.gov
// @connect geodata.hawaii.gov
// @connect geodata.md.gov
// @connect geodata.sarpy.com
// @connect geodataportal.net
// @connect geopowered.wilson.wilsontngis.com
// @connect geoservices.co.polk.or.us
// @connect geoweb.martin.fl.us
// @connect gis-2.warrencountyny.gov
// @connect gis-server.co.becker.mn.us
// @connect gis-server.co.montezuma.co.us
// @connect gis-web.co.union.nc.us
// @connect gis-webpub.sonoma-county.org
// @connect gis-world3.aacounty.org
// @connect gis.abilenetx.com
// @connect gis.acgov.org
// @connect gis.adamscounty.org
// @connect gis.aecomonline.net
// @connect gis.allencountyohio.com
// @connect gis.arapahoegov.com
// @connect gis.arkansas.gov
// @connect gis.arlingtonva.us
// @connect gis.atlantaga.gov
// @connect gis.auglaizecounty.org
// @connect gis.azdot.gov
// @connect gis.baltimorecity.gov
// @connect gis.bentoncountyar.gov
// @connect gis.berkeleycountysc.gov
// @connect gis.bgky.org
// @connect gis.bisclient.com
// @connect gis.blairco.org
// @connect gis.bransonmo.gov
// @connect gis.brevardcounty.us
// @connect gis.brookhavenga.gov
// @connect gis.buncombecounty.org
// @connect gis.burkenc.org
// @connect gis.burleighco.com
// @connect gis.buttecounty.net
// @connect gis.caldwellcountync.org
// @connect gis.calhouncounty.org
// @connect gis.carboncounty.com
// @connect gis.cayugacounty.us
// @connect gis.cccounty.us
// @connect gis.ccgisonline.com
// @connect gis.ccgov.net
// @connect gis.ccpa.net
// @connect gis.cherokeega.com
// @connect gis.ci.mcminnville.or.us
// @connect gis.citruspa.org
// @connect gis.cityofaikensc.gov
// @connect gis.cityofboston.gov
// @connect gis.cityofmiddletown.com
// @connect gis.clearfieldco.org
// @connect gis.clearwatercounty.org
// @connect gis.clevelandtn.gov
// @connect gis.cmpdd.org
// @connect gis.co.benton.or.us
// @connect gis.co.berks.pa.us
// @connect gis.co.big-stone.mn.us
// @connect gis.co.brown.wi.us
// @connect gis.co.carlton.mn.us
// @connect gis.co.carver.mn.us
// @connect gis.co.cumberland.nc.us
// @connect gis.co.fillmore.mn.us
// @connect gis.co.fulton.pa.us
// @connect gis.co.grant.wi.gov
// @connect gis.co.green-lake.wi.us
// @connect gis.co.guilford.nc.us
// @connect gis.co.hubbard.mn.us
// @connect gis.co.kandiyohi.mn.us
// @connect gis.co.kendall.il.us
// @connect gis.co.knox.il.us
// @connect gis.co.lancaster.pa.us
// @connect gis.co.marathon.wi.us
// @connect gis.co.mifflin.pa.us
// @connect gis.co.mille-lacs.mn.us
// @connect gis.co.monterey.ca.us
// @connect gis.co.nezperce.id.us
// @connect gis.co.oneida.wi.us
// @connect gis.co.polk.mn.us
// @connect gis.co.pope.mn.us
// @connect gis.co.richland.wi.us
// @connect gis.co.roseau.mn.us
// @connect gis.co.santa-cruz.ca.us
// @connect gis.co.sauk.wi.us
// @connect gis.co.sherburne.mn.us
// @connect gis.co.stearns.mn.us
// @connect gis.co.wadena.mn.us
// @connect gis.co.waseca.mn.us
// @connect gis.co.washington.ny.us
// @connect gis.co.wood.wi.us
// @connect gis.co.ym.mn.gov
// @connect gis.coloradosprings.gov
// @connect gis.cosb.us
// @connect gis.countyofriverside.us
// @connect gis.cowleycounty.org
// @connect gis.cranstonri.org
// @connect gis.crookcounty.wy.gov
// @connect gis.dallascityhall.com
// @connect gis.dauphincounty.org
// @connect gis.dbqco.org
// @connect gis.dentoncounty.com
// @connect gis.dogis.org
// @connect gis.dot.nh.gov
// @connect gis.dot.state.oh.us
// @connect gis.douglascountyks.org
// @connect gis.douglascountywa.net
// @connect gis.dupageco.org
// @connect gis.dutchessny.gov
// @connect gis.eastgreenwichri.com
// @connect gis.ebparks.org
// @connect gis.elpasotexas.gov
// @connect gis.emmetcounty.org
// @connect gis.franklincountypa.gov
// @connect gis.fultoncountyga.gov
// @connect gis.fultoncountyoh.com
// @connect gis.fwb.org
// @connect gis.fwp.mt.gov
// @connect gis.gallatin.mt.gov
// @connect gis.garfield-county.com
// @connect gis.gastongov.com
// @connect gis.gcppwa.net
// @connect gis.gilacountyaz.gov
// @connect gis.gocolumbiamo.com
// @connect gis.goshencounty.org
// @connect gis.gptx.org
// @connect gis.grand-island.com
// @connect gis.greenegovernment.com
// @connect gis.gscplanning.com
// @connect gis.gwinnettcounty.com
// @connect gis.hcpafl.org
// @connect gis.hennepin.us
// @connect gis.in.gov
// @connect gis.interdev.com
// @connect gis.iowadot.gov
// @connect gis.ircgov.com
// @connect gis.itd.idaho.gov
// @connect gis.jccal.org
// @connect gis.johnscreekga.gov
// @connect gis.johnson-county.com
// @connect gis.johnsoncitytn.org
// @connect gis.kanawhacountyassessor.com
// @connect gis.kentcountymi.gov
// @connect gis.lacrossecounty.org
// @connect gis.lafayettecountywi.org
// @connect gis.lakecountyfl.gov
// @connect gis.lapazcountyaz.org
// @connect gis.latah.id.us
// @connect gis.leecountyil.com
// @connect gis.leoc.net
// @connect gis.linncounty.org
// @connect gis.littleelm.org
// @connect gis.losalamosnm.us
// @connect gis.luzernecounty.org
// @connect gis.lyco.org
// @connect gis.maine.gov
// @connect gis.marinpublic.com
// @connect gis.marioncountyfl.org
// @connect gis.massdot.state.ma.us
// @connect gis.mcassessor.maricopa.gov
// @connect gis.mercercountyohio.org
// @connect gis.missoulacounty.us
// @connect gis.mono.ca.gov
// @connect gis.mytoddcounty.com
// @connect gis.napa.ca.gov
// @connect gis.nassaucountyny.gov
// @connect gis.nccde.org
// @connect gis.neccog.org
// @connect gis.nevadadot.com
// @connect gis.nevcounty.net
// @connect gis.newedgeservices.com
// @connect gis.nhcgov.com
// @connect gis.niagaracounty.com
// @connect gis.nola.gov
// @connect gis.norrycopa.net
// @connect gis.northamptoncounty.org
// @connect gis.odot.state.or.us
// @connect gis.ohiodnr.gov
// @connect gis.okc.gov
// @connect gis.orangecountync.gov
// @connect gis.owensboro.org
// @connect gis.pandai.com
// @connect gis.pearlandtx.gov
// @connect gis.peoriacounty.org
// @connect gis.perryco.org
// @connect gis.personcounty.net
// @connect gis.pgatlas.com
// @connect gis.pikepa.org
// @connect gis.pittcountync.gov
// @connect gis.plantation.org
// @connect gis.polkcountyiowa.gov
// @connect gis.port-orange.org
// @connect gis.pottcounty-ia.gov
// @connect gis.putnam-fl.com
// @connect gis.qac.org
// @connect gis.rapides911.org
// @connect gis.rcgov.org
// @connect gis.renvillecountymn.com
// @connect gis.rileycountyks.gov
// @connect gis.rrnm.gov
// @connect gis.salkeiz.k12.or.us
// @connect gis.sandyspringsga.gov
// @connect gis.sangis.org
// @connect gis.santacruzcounty.us
// @connect gis.sheboygancounty.com
// @connect gis.slocounty.ca.gov
// @connect gis.snco.us
// @connect gis.southington.org
// @connect gis.southkingstownri.com
// @connect gis.spokanecounty.org
// @connect gis.stancounty.com
// @connect gis.summitcountyco.gov
// @connect gis.sumtercountyfl.gov
// @connect gis.tazewell.com
// @connect gis.thomsonreuters.com
// @connect gis.transportation.wv.gov
// @connect gis.tularecounty.ca.gov
// @connect gis.ulstercountyny.gov
// @connect gis.ventura.org
// @connect gis.weatherfordtx.gov
// @connect gis.westplains.net
// @connect gis.wilco.org
// @connect gis.wiu.edu
// @connect gis.worldviewsolutions.com
// @connect gis.wyo.gov
// @connect gis.yavapai.us
// @connect gis1.cookcountyil.gov
// @connect gis1.georgetowncountysc.org
// @connect gis1.hartford.gov
// @connect gis1.hcpao.org
// @connect gis10.dot.ga.gov
// @connect gis11.services.ncdot.gov
// @connect gis2.arlingtontx.gov
// @connect gis2.ashtabulacounty.us
// @connect gis2.cambriacountypa.gov
// @connect gis2.co.dakota.mn.us
// @connect gis2.co.josephine.or.us
// @connect gis2.erie.gov
// @connect gis2.gisworkshop.com
// @connect gis2.idaho.gov
// @connect gis2.lawrenceks.org
// @connect gis2.odessa-tx.gov
// @connect gis2.orangeburgcounty.org
// @connect gis2.richmondnc.com
// @connect gis2.siouxfalls.org
// @connect gis2.waukcogeo.com
// @connect gis3.gisworkshop.com
// @connect gis3.montgomerycountymd.gov
// @connect gis4.montgomerycountymd.gov
// @connect gis5.oit.ohio.gov
// @connect gisago-qa.mcgi.state.mi.us
// @connect gisago.mcgi.state.mi.us
// @connect gisapp.adcogov.org
// @connect gisapp.mahoningcountyoh.gov
// @connect gisdata.alleghenycounty.us
// @connect gisdata.dot.ca.gov
// @connect gisdata.kingcounty.gov
// @connect gisdemo1.cdmsmith.com
// @connect gisdemo2.cdmsmith.com
// @connect gisext.lincoln.ne.gov
// @connect gisgate.co.clark.nv.us
// @connect gisinfo.co.portage.wi.us
// @connect gisinfo.co.walworth.wi.us
// @connect gismap.augustaga.gov
// @connect gismap.cityofaspen.com
// @connect gismap.co.juneau.wi.us
// @connect gismap.co.marshall.mn.us
// @connect gismap.co.norman.mn.us
// @connect gismap.eaglecounty.us
// @connect gismaps.cityofboise.org
// @connect gismaps.co.cerro-gordo.ia.us
// @connect gismaps.co.sangamon.il.us
// @connect gismaps.coconino.az.gov
// @connect gismaps.columbiapa.org
// @connect gismaps.flower-mound.com
// @connect gismaps.pinalcountyaz.gov
// @connect gismaps.snoco.org
// @connect gismaps.vita.virginia.gov
// @connect gismaps.wichita.gov
// @connect gismapserver.leegov.com
// @connect gisp.co.genesee.ny.us
// @connect gisportal.co.calaveras.ca.us
// @connect gisportal.fnsb.us
// @connect gisprod10.co.fresno.ca.us
// @connect gisprodops.chesco.org
// @connect gisprpxy.itd.state.ma.us
// @connect gispub.cityofmesquite.com
// @connect gispublic.co.lake.ca.us
// @connect gissd.sandag.org
// @connect gisserver.christiancountymo.gov
// @connect gisserver18.co.teton.id.us
// @connect gisservicemt.gov
// @connect gisservices.chathamnc.org
// @connect gisservices.co.anoka.mn.us
// @connect gisservices.dorchestercounty.net
// @connect gisservices.douglasnv.us
// @connect gisservices.its.ny.gov
// @connect gisservices.oakgov.com
// @connect gisservices2.cabarruscounty.us
// @connect gisservices2.suffolkcountyny.gov
// @connect gissites2.centrecountypa.gov
// @connect gistech.countyofkane.org
// @connect gisweb.albemarle.org
// @connect gisweb.casscountynd.gov
// @connect gisweb.co.aitkin.mn.us
// @connect gisweb.co.hinds.ms.us
// @connect gisweb.co.washington.wi.us
// @connect gisweb.co.wilkin.mn.us
// @connect gisweb.fdlco.wi.gov
// @connect gisweb.jeffcowa.us
// @connect gisweb.miamidade.gov
// @connect giswww.westchestergov.com
// @connect git.co.tioga.ny.us
// @connect grandgis.com
// @connect granitweb.sr.unh.edu
// @connect gweb01.co.olmsted.mn.us
// @connect harpergis.integritygis.com
// @connect harrisonms.geopowered.com
// @connect haslet.halff.com
// @connect hazards.fema.gov
// @connect helenamontanamaps.org
// @connect henrygis.integritygis.com
// @connect hgis.hialeahfl.gov
// @connect hidgis.co.hidalgo.tx.us
// @connect holtgis.integritygis.com
// @connect host.cdmsmithgis.com
// @connect idpgis.ncep.noaa.gov
// @connect ims.districtiii.org
// @connect intervector.leoncountyfl.gov
// @connect iowagis.integritygis.com
// @connect ira.property-appraiser.org
// @connect jcgis.jacksongov.org
// @connect jeffarcgis.jeffersoncountywi.gov
// @connect joplingis.org
// @connect k3gis.com
// @connect kc-web-01.kenoshacounty.org
// @connect kcearth.kcgov.us
// @connect kcgis.kcor.org
// @connect kingscountygis.com
// @connect kygisserver.ky.gov
// @connect lacledegis.integritygis.com
// @connect lafayettegis.integritygis.com
// @connect landrecords.greencountywi.org
// @connect lawrencegis.integritygis.com
// @connect lcmaps.lanecounty.org
// @connect leegis.leegov.com
// @connect lgmap.wdm.iowa.gov
// @connect lincolngis.integritygis.com
// @connect linkgis.org
// @connect lio.milwaukeecountywi.gov
// @connect livingstongis.integritygis.com
// @connect lpcgis.laplata.co.us
// @connect lrs.co.columbia.wi.us
// @connect macongis.co.macon.il.us
// @connect madison.rexburg.org
// @connect map-gis.paducahky.gov
// @connect map.claycountymn.gov
// @connect map.co.clearwater.mn.us
// @connect map.co.merced.ca.us
// @connect map.co.thurston.wa.us
// @connect map.collincad.org
// @connect map.coppelltx.gov
// @connect map.livingstoncounty.us
// @connect map.newberrycounty.net
// @connect map.opkansas.org
// @connect map.polkpa.org
// @connect map.sccmo.org
// @connect map.stclairco.com
// @connect map8.incog.org
// @connect mapcache.friscotexas.gov
// @connect mapitwest.fortworthtexas.gov
// @connect mapp.co.cook.mn.us
// @connect mapping.adamscounty.us
// @connect mapping.cabellassessor.com
// @connect mapping.huntingdoncounty.net
// @connect mapping.modot.org
// @connect maps.alexandercountync.gov
// @connect maps.alexandriava.gov
// @connect maps.bayfieldcounty.org
// @connect maps.berkeleywv.org
// @connect maps.boonecountyil.org
// @connect maps.bouldercounty.org
// @connect maps.brazoriacountytx.gov
// @connect maps.bryantx.gov
// @connect maps.burlesontx.com
// @connect maps.butlercountyauditor.org
// @connect maps.canyonco.org
// @connect maps.casperwy.gov
// @connect maps.chautauquacounty.com
// @connect maps.ci.sherman.tx.us
// @connect maps.cityhs.net
// @connect maps.cityofmobile.org
// @connect maps.cityoftulsa.org
// @connect maps.claycountygov.com
// @connect maps.clermontauditor.org
// @connect maps.clintoncountypa.com
// @connect maps.co.blaine.id.us
// @connect maps.co.butler.pa.us
// @connect maps.co.forsyth.nc.us
// @connect maps.co.goodhue.mn.us
// @connect maps.co.gov
// @connect maps.co.grayson.tx.us
// @connect maps.co.itasca.mn.us
// @connect maps.co.jefferson.id.us
// @connect maps.co.kern.ca.us
// @connect maps.co.lincoln.wi.us
// @connect maps.co.palm-beach.fl.us
// @connect maps.co.pueblo.co.us
// @connect maps.co.ramsey.mn.us
// @connect maps.co.routt.co.us
// @connect maps.co.shasta.ca.us
// @connect maps.co.shawano.wi.us
// @connect maps.co.washington.mn.us
// @connect maps.co.yellowstone.mt.gov
// @connect maps.coj.net
// @connect maps.crc.ga.gov
// @connect maps.cstx.gov
// @connect maps.ctmetro.org
// @connect maps.dcad.org
// @connect maps.dekalbcountyga.gov
// @connect maps.deltacounty.com
// @connect maps.deschutes.org
// @connect maps.desotocountyms.gov
// @connect maps.dmgov.org
// @connect maps.donaanacounty.org
// @connect maps.escpa.org
// @connect maps.flathead.mt.gov
// @connect maps.floridadisaster.org
// @connect maps.franklincountyauditor.com
// @connect maps.frederickcountymd.gov
// @connect maps.garlandtx.gov
// @connect maps.garrettcounty.org
// @connect maps.grundyco.org
// @connect maps.highlandvillage.org
// @connect maps.indiana.edu
// @connect maps.kcmo.org
// @connect maps.kpb.us
// @connect maps.kytc.ky.gov
// @connect maps.lagrange-ga.org
// @connect maps.lakecountyil.gov
// @connect maps.laramiecounty.com
// @connect maps.lcwy.org
// @connect maps.lex-co.com
// @connect maps.lexingtonky.gov
// @connect maps.libertymo.gov
// @connect maps.lincolncountysd.org
// @connect maps.matsugov.us
// @connect maps.maurycounty-tn.gov
// @connect maps.mckinneytexas.org
// @connect maps.meshekgis.com
// @connect maps.miamigov.com
// @connect maps.nashville.gov
// @connect maps.nassauflpa.com
// @connect maps.nj.gov
// @connect maps.normanok.gov
// @connect maps.ocpafl.org
// @connect maps.outdoornebraska.gov
// @connect maps.palmcoastgov.com
// @connect maps.parkco.us
// @connect maps.pasda.psu.edu
// @connect maps.phoenix.gov
// @connect maps.pitkincounty.com
// @connect maps.placer.ca.gov
// @connect maps.planogis.org
// @connect maps.raleighnc.gov
// @connect maps.sanbag.ca.gov
// @connect maps.sanmiguelcountyco.gov
// @connect maps.santabarbaraca.gov
// @connect maps.shelbyal.com
// @connect maps.showmeboone.com
// @connect maps.sjcounty.net
// @connect maps.smcgov.org
// @connect maps.springfieldmo.gov
// @connect maps.stlouisco.com
// @connect maps.sussexcountyde.gov
// @connect maps.talbgov.org
// @connect maps.udot.utah.gov
// @connect maps.vcgi.vermont.gov
// @connect maps.vcgov.org
// @connect maps.vilascountywi.gov
// @connect maps.wakegov.com
// @connect maps.washco-md.net
// @connect maps1.larimer.org
// @connect maps2.bgadd.org
// @connect maps2.cattco.org
// @connect maps2.ci.euless.tx.us
// @connect maps2.dcgis.dc.gov
// @connect maps2.timmons.com
// @connect maps2.tucsonaz.gov
// @connect maps2.yorkcountygov.com
// @connect maps3.murfreesborotn.gov
// @connect mapsdev.hamiltontn.gov
// @connect mapserv.mesquitenv.gov
// @connect mapserver.co.calaveras.ca.us
// @connect mapservices.gis.saccounty.net
// @connect mapservices.legis.wisconsin.gov
// @connect mapservices.santacruzcountyaz.gov
// @connect mapservices2.jeffco.us
// @connect mapsonline.columbiacountyga.gov
// @connect mcggis.mcgtn.org
// @connect mcgis.mesacounty.us
// @connect mcgis2.mohavecounty.us
// @connect mcgis4.monroecounty-fl.gov
// @connect mcmap2.montrosecounty.net
// @connect mcogis.co.marion.oh.us
// @connect midland.newedgeservices.com
// @connect millergis.integritygis.com
// @connect mndotgis.dot.state.mn.us
// @connect morgangis.integritygis.com
// @connect msdisweb.missouri.edu
// @connect mtbachelor.co.washington.or.us
// @connect nbgis.newportbeachca.gov
// @connect ndgishub.nd.gov
// @connect newgis.co.yuba.ca.us
// @connect nhgeodata.unh.edu
// @connect oak.co.lake-of-the-woods.mn.us
// @connect oc17maps.co.oconto.wi.us
// @connect ocgis.orangecountygov.com
// @connect oklahomacounty.geocortex.com
// @connect oldhamgis.org
// @connect oncorng.co.ontario.ny.us
// @connect operationserver.ci.henderson.nc.us
// @connect orfmaps.norfolk.gov
// @connect pagis.org
// @connect parcels.rsdigital.com
// @connect pascoview.pascocountyfl.net
// @connect phelpsgis.integritygis.com
// @connect polaris3g.mecklenburgcountync.gov
// @connect prodmaps.ne.gov
// @connect propaccess.traviscad.org
// @connect propaccess.wadtx.com
// @connect propertyrecords.montcopa.org
// @connect propertyviewer.andersoncountysc.org
// @connect proxy.roktech.net
// @connect psportal.harrisoncountywv.com
// @connect pubgis.ci.lubbock.tx.us
// @connect public1.co.waupaca.wi.us
// @connect publicmap01.co.st-clair.il.us
// @connect pulaskigis.integritygis.com
// @connect qagis1.sanantonio.gov
// @connect rallsgis.integritygis.com
// @connect raygis.integritygis.com
// @connect regis.solanocounty.com
// @connect renogis3.renogov.org
// @connect romefloyd.agdmaps.com
// @connect rpgis.isd.lacounty.gov
// @connect rptsgisweb.oswegocounty.com
// @connect scgisa.starkcountyohio.gov
// @connect secure.boonecountygis.com
// @connect seminolearcgis.seminolecountyfl.gov
// @connect server1.mapxpress.net
// @connect server2.mapxpress.net
// @connect services.arcgis.com
// @connect services.ccgisc.org
// @connect services.gis.ca.gov
// @connect services.kansasgis.org
// @connect services.nconemap.gov
// @connect services.putnamco.org
// @connect services.wvgis.wvu.edu
// @connect services1.arcgis.com
// @connect services2.arcgis.com
// @connect services2.bhamaps.com
// @connect services2.geopowered.com
// @connect services2.integritygis.com
// @connect services3.arcgis.com
// @connect services5.arcgis.com
// @connect services6.arcgis.com
// @connect services7.arcgis.com
// @connect services8.arcgis.com
// @connect services9.arcgis.com
// @connect sjmap.org
// @connect slco.org
// @connect spatial.gishost.com
// @connect spatial.jacksoncounty.org
// @connect springsgis.coralsprings.org
// @connect stlgis.stlouis-mo.gov
// @connect stmgis.stmarysmd.com
// @connect stonegis.integritygis.com
// @connect summitmaps.summitoh.net
// @connect sumnertn.geopowered.com
// @connect svr4.sumtercountysc.org
// @connect tigerweb.geo.census.gov
// @connect tiogagis.tiogacountypa.us
// @connect tlcgisinter.leoncountyfl.gov
// @connect tn.hardeman.geopowered.com
// @connect tn.mcminn.geopowered.com
// @connect tnmap.tn.gov
// @connect tsc-gis-ags101a.schneidercorp.com
// @connect utility.arcgis.com
// @connect vernongis.integritygis.com
// @connect w04.co.delaware.pa.us
// @connect wallawallagis.com
// @connect wcgis3.co.winnebago.wi.us
// @connect wcgisweb.washoecounty.us
// @connect wcsvrgis.washcopa.org
// @connect web2.kcsgis.com
// @connect web3.kcsgis.com
// @connect weba.co.clayton.ga.us
// @connect webgis.bcgov.net
// @connect webgis.bedfordcountyva.gov
// @connect webgis.co.humboldt.ca.us
// @connect webgis.myokaloosa.com
// @connect webgis.providenceri.gov
// @connect webgis.sccgov.org
// @connect webmap.co.hood-river.or.us
// @connect webmap.co.jackson.ms.us
// @connect webmap.jeffparish.net
// @connect webmap.trueautomation.com
// @connect webmap1.co.warren.oh.us
// @connect webmap2.manitowoc-county.com
// @connect webmaps.coconino.az.gov
// @connect webserverholis.honolulugis.org
// @connect wfs.ksdot.org
// @connect ww1.bucoks.com
// @connect www.1stdistrict.org
// @connect www.adacountyassessor.org
// @connect www.adamscountyarcserver.com
// @connect www.ancgis.com
// @connect www.bcad.org
// @connect www.bcgis.com
// @connect www.cameroncad.org
// @connect www.centralilmaps.com
// @connect www.co.bingham.id.us
// @connect www.co.chippewa.mn.us
// @connect www.co.coles.il.us
// @connect www.co.pierce.wi.us
// @connect www.co.rock.wi.us
// @connect www.co.steele.mn.us
// @connect www.cobbgis.org
// @connect www.ctgismaps2.ct.gov
// @connect www.cvcog911.org
// @connect www.dmcwebgis.com
// @connect www.dot.state.ak.us
// @connect www.efsedge.com
// @connect www.finneycountygis.com
// @connect www.gcgis.org
// @connect www.gfgis.com
// @connect www.gis.bocc.co.st-johns.fl.us
// @connect www.gis.dcga.us
// @connect www.gisonline.ms.gov
// @connect www.greenwoodsc.gov
// @connect www.hernandocountygis-fl.us
// @connect www.horrycounty.org
// @connect www.insideidaho.org
// @connect www.kandrive.org
// @connect www.landmarkgeospatial.com
// @connect www.loraincountyauditor.com
// @connect www.mcgisweb.org
// @connect www.mchenrycountygis.org
// @connect www.midmogis.org
// @connect www.monroegis.org
// @connect www.mymanatee.org
// @connect www.ncpub.org
// @connect www.ocgis.com
// @connect www.ottertailcounty.net
// @connect www.paslc.org
// @connect www.pdarcgissvr.pa.gov
// @connect www.richlandcountyauditor.org
// @connect www.saludacountysc.net
// @connect www.sanduskycountygis.org
// @connect www.sccgov.org
// @connect www.sciotocountyengineer.org
// @connect www.semogis.com
// @connect www.smithcountymapsite.org
// @connect www.tgisites.com
// @connect www.tremplocounty.com
// @connect www.unionco.org
// @connect www.valorgis.com
// @connect www.vernoncounty.org
// @connect www.wataugacounty.org
// @connect www.wcgis.us
// @connect www.webgis.net
// @connect www.wingis.org
// @connect www2.ci.lancaster.oh.us
// @connect www2.pottcounty.org
// @connect www3.co.union.oh.us
// @connect www3.multco.us
// @connect yolo-gis-prod.yolocounty.org
// @downloadURL https://update.greasyfork.org/scripts/391297/WME%20GIS%20Layers%20-%20Alt%20County%20layer%202019.user.js
// @updateURL https://update.greasyfork.org/scripts/391297/WME%20GIS%20Layers%20-%20Alt%20County%20layer%202019.meta.js
// ==/UserScript==

/* global OL */
/* global W */
/* global GM_info */
/* global WazeWrap */
/* global _ */
/* global $ */
/* global localStorage */
/* global GM_xmlhttpRequest */
/* global alert */
/* global performance */
/* global atob */
/* global window */
/* global jQuery */

// **************************************************************************************************************
// IMPORTANT: Update this when releasing a new version of script that includes changes to the spreadsheet format
//            that may cause old code to break.  This # should match the version listed in the spreadsheet
//            i.e. update them at the same time.

// const LAYER_DEF_VERSION = '2018.04.27.001';  // NOT ACTUALLY USED YET

// **************************************************************************************************************
const UPDATE_MESSAGE = 'Bug fix due to WME update';
// const UPDATE_MESSAGE = `<ul>${[
//     'Added ability to shift layers. Right click a layer in the list to bring up the layer settings window.'
// ].map(item => `<li>${item}</li>`).join('')}</ul><br>`;
const GF_URL = 'https://greasyfork.org/scripts/369632-wme-gis-layers';
// Used in tooltips to tell people who to report issues to.  Update if a new author takes ownership of this script.
const SCRIPT_AUTHOR = 'MapOMatic';
// const LAYER_INFO_URL = 'https://spreadsheets.google.com/feeds/list/1cEG3CvXSCI4TOZyMQTI50SQGbVhJ48Xip-jjWg4blWw/o7gusx3/public/values?alt=json';
const LAYER_DEF_SPREADSHEET_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1cEG3CvXSCI4TOZyMQTI50SQGbVhJ48Xip-jjWg4blWw/values/layerDefs';
const API_KEY = 'YTJWNVBVRkplbUZUZVVGTlNXOWlVR1pWVjIxcE9VdHJNbVY0TTFoeWNrSlpXbFZuVmtWelRrMVVWUT09';
const DEC = s => atob(atob(s));
const PRIVATE_LAYERS = { 'nc-henderson-sl-signs': ['the_cre8r', 'mapomatic'] }; // case sensitive -- use all lower case
const DEFAULT_STYLE = {
    fillColor: '#000',
    pointRadius: 4,
    label: '${label}',
    strokeColor: '#ffa500',
    strokeOpacity: '0.95',
    strokeWidth: 1.5,
    fontColor: '#ffc520',
    fontSize: '13',
    labelOutlineColor: 'black',
    labelOutlineWidth: 3
};
const LAYER_STYLES = {
    cities: {
        fillOpacity: 0.3,
        fillColor: '#f65',
        strokeColor: '#f65',
        fontColor: '#f62'
    },
    forests_parks: {
        fillOpacity: 0.4,
        fillColor: '#585',
        strokeColor: '#484',
        fontColor: '#8b8'
    },
    milemarkers: {
        strokeColor: '#fff',
        fontColor: '#fff',
        fontWeight: 'bold',
        fillOpacity: 0,
        labelYOffset: 10,
        pointRadius: 2,
        fontSize: 12
    },
    parcels: {
        fillOpacity: 0,
        fillColor: '#ffa500'
    },
    points: {
        strokeColor: '#000',
        fontColor: '#0ff',
        fillColor: '#0ff',
        labelYOffset: -10,
        labelAlign: 'ct'
    },
    post_offices: {
        strokeColor: '#000',
        fontColor: '#f84',
        fillColor: '#f84',
        fontWeight: 'bold',
        labelYOffset: -10,
        labelAlign: 'ct'
    },
    state_parcels: {
        fillOpacity: 0,
        strokeColor: '#e62',
        fillColor: '#e62',
        fontColor: '#e73'
    },
    state_points: {
        strokeColor: '#000',
        fontColor: '#3cf',
        fillColor: '#3cf',
        labelYOffset: -10,
        labelAlign: 'ct'
    },
    road_labels: {
        strokeOpacity: 0,
        fillOpacity: 0,
        fontColor: '#faf'
    },
    structures: {
        fillOpacity: 0,
        strokeColor: '#f7f',
        fontColor: '#f7f'
    }
};
const ROAD_STYLE = new OL.Style(
    {
        pointRadius: 12,
        fillColor: '#369',
        pathLabel: '${label}',
        label: '',
        fontColor: '#faf',
        labelSelect: true,
        pathLabelYOffset: '${getOffset}',
        pathLabelCurve: '${getSmooth}',
        pathLabelReadable: '${getReadable}',
        labelAlign: '${getAlign}',
        labelOutlineWidth: 3,
        labelOutlineColor: '#000',
        strokeWidth: 3,
        stroke: true,
        strokeColor: '#f0f',
        strokeOpacity: 0.4,
        fontWeight: 'bold',
        fontSize: 16
    }, {
        context: {
            getOffset() { return -(W.map.getZoom() + 5); },
            getSmooth() { return ''; },
            getReadable() { return '1'; },
            getAlign() { return 'cb'; }
        }
    }
);
// eslint-disable-next-line no-unused-vars
const _regexReplace = {
    // Strip leading zeros or blank full label for any label starting with a non-digit or
    // is a Zero Address, use with '' as replace.
    r0: /^(0+(\s.*)?|\D.*)/,
    // Strip Everything After Street Type to end of the string by use $1 and $2 capture
    // groups, use with replace '$1$2'
    // eslint-disable-next-line max-len
    r1: /^(.* )(Ave(nue)?|Dr(ive)?|St(reet)?|C(our)?t|Cir(cle)?|Blvd|Boulevard|Pl(ace)?|Ln|Lane|Fwy|Freeway|R(oa)?d|Ter(r|race)?|Tr(ai)?l|Way|Rte \d+|Route \d+)\b.*/gi,
    // Strip SPACE 5 Digits from end of string, use with replace ''
    r2: /\s\d{5}$/,
    // Strip Everything after a "~", ",", ";" to the end of the string, use with replace ''
    r3: /(~|,|;|\s?\r\n).*$/,
    // Move the digits after the last space to before the rest of the string using, use with
    // replace '$2 $1'
    r4: /^(.*)\s(\d+).*/,
    // Insert newline between digits (including "-") and everything after the digits,
    // except(and before) a ",", use with replace '$1\n$2'
    r5: /^([-\d]+)\s+([^,]+).*/,
    // Insert newline between digits and everything after the digits, use with
    // replace '$1\n$2'
    r6: /^(\d+)\s+(.*)/
};

let _gisLayers = [];

const _layerRefinements = [
    {
        id: 'us-post-offices',
        labelHeaderFields: ['LOCALE_NAME']
    }
];

const STATES = {
    _states: [
        ['US (Country)', 'US', -1], ['Alabama', 'AL', 1], ['Alaska', 'AK', 2],
        ['American Samoa', 'AS', 60], ['Arizona', 'AZ', 4], ['Arkansas', 'AR', 5],
        ['California', 'CA', 6], ['Colorado', 'CO', 8], ['Connecticut', 'CT', 9],
        ['Delaware', 'DE', 10], ['District of Columbia', 'DC', 11], ['Florida', 'FL', 12],
        ['Georgia', 'GA', 13], ['Guam', 'GU', 66], ['Hawaii', 'HI', 15], ['Idaho', 'ID', 16],
        ['Illinois', 'IL', 17], ['Indiana', 'IN', 18], ['Iowa', 'IA', 19],
        ['Kansas', 'KS', 20], ['Kentucky', 'KY', 21], ['Louisiana', 'LA', 22],
        ['Maine', 'ME', 23], ['Maryland', 'MD', 24], ['Massachusetts', 'MA', 25],
        ['Michigan', 'MI', 26], ['Minnesota', 'MN', 27], ['Mississippi', 'MS', 28],
        ['Missouri', 'MO', 29], ['Montana', 'MT', 30], ['Nebraska', 'NE', 31],
        ['Nevada', 'NV', 32], ['New Hampshire', 'NH', 33], ['New Jersey', 'NJ', 34],
        ['New Mexico', 'NM', 35], ['New York', 'NY', 36], ['North Carolina', 'NC', 37],
        ['North Dakota', 'ND', 38], ['Northern Mariana Islands', 'MP', 69], ['Ohio', 'OH', 39],
        ['Oklahoma', 'OK', 40], ['Oregon', 'OR', 41], ['Pennsylvania', 'PA', 42],
        ['Puerto Rico', 'PR', 72], ['Rhode Island', 'RI', 44], ['South Carolina', 'SC', 45],
        ['South Dakota', 'SD', 46], ['Tennessee', 'TN', 47], ['Texas', 'TX', 48],
        ['Utah', 'UT', 49], ['Vermont', 'VT', 50], ['Virgin Islands', 'VI', 78],
        ['Virginia', 'VA', 51], ['Washington', 'WA', 53], ['West Virginia', 'WV', 54],
        ['Wisconsin', 'WI', 55], ['Wyoming', 'WY', 56]
    ],
    toAbbr(fullName) { return this._states.find(a => a[0] === fullName)[1]; },
    toFullName(abbr) { return this._states.find(a => a[1] === abbr)[0]; },
    toFullNameArray() { return this._states.map(a => a[0]); },
    toAbbrArray() { return this._states.map(a => a[1]); },
    fromId(id) { return this._states.find(a => a[2] === id); }
};
const DEFAULT_VISIBLE_AT_ZOOM = 6;
const SETTINGS_STORE_NAME = 'wme_gis_layers_fl';
//const COUNTIES_URL = 'https://tigerweb.geo.census.gov/arcgis/rest/services/Census2010/State_County/MapServer/1/';
const COUNTIES_URL = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Counties/FeatureServer/0/';
const ALERT_UPDATE = false;
const SCRIPT_VERSION = GM_info.script.version;
const SCRIPT_VERSION_CHANGES = [
    GM_info.script.name,
    `v${SCRIPT_VERSION}`,
    'What\'s New',
    '------------------------------'
    // new stuff here
].join('\n');
let _mapLayer = null;
let _roadLayer = null;
let _settings = {};
let _ignoreFetch = false;
let _lastToken = {};

const DEBUG = true;
function log(message) { console.log('GIS Layers:', message); }
function logError(message) { console.error('GIS Layers:', message); }
function logDebug(message) { if (DEBUG) console.debug('GIS Layers:', message); }
// function logWarning(message) { console.warn('GIS Layers:', message); }

let _layerSettingsDialog;

class LayerSettingsDialog {
    constructor() {
        this._$titleText = $('<span>');
        this._$closeButton = $('<span>', {
            style: 'cursor:pointer;padding-left:4px;font-size:17px;color:#d6e6f3;float:right;',
            class: 'fa fa-window-close'
        }).click(() => this._onCloseButtonClick());
        this._$shiftUpButton = LayerSettingsDialog._createShiftButton('fa-angle-up').click(() => this._onShiftButtonClick(0, 1));
        this._$shiftLeftButton = LayerSettingsDialog._createShiftButton('fa-angle-left').click(() => this._onShiftButtonClick(-1, 0));
        this._$shiftRightButton = LayerSettingsDialog._createShiftButton('fa-angle-right').click(() => this._onShiftButtonClick(1, 0));
        this._$shiftDownButton = LayerSettingsDialog._createShiftButton('fa-angle-down').click(() => this._onShiftButtonClick(0, -1));
        this._$resetButton = $('<button>', {
            class: 'form-control',
            style: 'height: 24px; width: auto; padding: 2px 6px 0px 6px; display: inline-block; float: right;'
        }).text('Reset').click(() => this._onResetButtonClick());

        this._dialogDiv = $('<div>', {
            style: 'position: fixed; top: 15%; left: 400px; width: 200px; z-index: 100; background-color: #73a9bd; border-width: 1px; border-style: solid;'
                + 'border-radius: 10px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.7); border-color: #50667b; padding: 4px;'
        }).append($('<div>').append( // The extra div is needed here. When the header text wraps, the main dialog div won't expand properly without it.
            // HEADER
            $('<div>', { style: 'border-radius:5px 5px 0px 0px; padding: 4px; color: #fff; font-weight: bold; text-align:left; cursor: default;' }).append(
                this._$closeButton,
                this._$titleText
            ),
            // BODY
            $('<div>', { style: 'border-radius: 5px; width: 100%; padding: 4px; background-color:#d6e6f3; display:inline-block; margin-right:5px;' }).append(
                this._$resetButton,
                $('<input>', {
                    type: 'radio', id: 'gisLayerShiftAmt1', name: 'gisLayerShiftAmt', value: '1', checked: 'checked'
                }),
                $('<label>', { for: 'gisLayerShiftAmt1' }).text('1m'),
                $('<input>', {
                    type: 'radio', id: 'gisLayerShiftAmt10', name: 'gisLayerShiftAmt', value: '10', style: 'margin-left: 6px'
                }),
                $('<label>', { for: 'gisLayerShiftAmt10' }).text('10m'),
                $('<div>', { style: 'padding: 4px' }).append(
                    $('<table>', { style: 'table-layout:fixed; width:60px; height:84px; margin-left:auto;margin-right:auto;' }).append(
                        $('<tr>', { style: 'width: 20px; height: 28px;' }).append(
                            $('<td>', { align: 'center' }),
                            $('<td>', { align: 'center' }).append(this._$shiftUpButton),
                            $('<td>', { align: 'center' })
                        ),
                        $('<tr>', { style: 'width: 20px; height: 28px;' }).append(
                            $('<td>', { align: 'center' }).append(this._$shiftLeftButton),
                            $('<td>', { align: 'center' }),
                            $('<td>', { align: 'center' }).append(this._$shiftRightButton)
                        ),
                        $('<tr>', { style: 'width: 20px; height: 28px;' }).append(
                            $('<td>', { align: 'center' }),
                            $('<td>', { align: 'center' }).append(this._$shiftDownButton),
                            $('<td>', { align: 'center' })
                        )
                    )
                )
            )
        ));

        this.hide();
        this._dialogDiv.appendTo('body');

        if (typeof jQuery.ui !== 'undefined') {
            const that = this;
            this._dialogDiv.draggable({
                // Gotta nuke the height setting the dragging inserts otherwise the panel cannot dynamically resize
                stop() { that._dialogDiv.css('height', ''); }
            });
        }
    }

    get gisLayer() {
        return this._gisLayer;
    }

    set gisLayer(value) {
        if (value !== this._gisLayer) {
            this._gisLayer = value;
            this.title = value.name;
        }
    }

    get title() {
        return this._$titleText.text();
    }

    set title(value) {
        this._$titleText.text(value);
    }

    // eslint-disable-next-line class-methods-use-this
    getShiftAmount() {
        return $('input[name=gisLayerShiftAmt]:checked').val();
    }

    show() {
        this._dialogDiv.show();
    }

    hide() {
        this._dialogDiv.hide();
    }

    _onCloseButtonClick() {
        this.hide();
    }

    _onShiftButtonClick(x, y) {
        const shiftAmount = this.getShiftAmount();
        x *= shiftAmount;
        y *= shiftAmount;
        this._shiftLayerFeatures(x, y);
        const { id } = this._gisLayer;
        let offset = _settings.getLayerSetting(id, 'offset');
        if (!offset) {
            offset = { x: 0, y: 0 };
            _settings.setLayerSetting(id, 'offset', offset);
        }
        offset.x += x;
        offset.y += y;
        saveSettingsToStorage();
    }

    _onResetButtonClick() {
        const offset = _settings.getLayerSetting(this._gisLayer.id, 'offset');
        if (offset) {
            this._shiftLayerFeatures(offset.x * -1, offset.y * -1);
            delete _settings.layers[this._gisLayer.id].offset;
            saveSettingsToStorage();
        }
    }

    _shiftLayerFeatures(x, y) {
        const layer = this.gisLayer.isRoadLayer ? _roadLayer : _mapLayer;
        layer.getFeaturesByAttribute('layerID', this.gisLayer.id).forEach(f => f.geometry.move(x, y));
        layer.redraw();
    }

    static _createShiftButton(fontAwesomeClass) {
        return $('<button>', {
            class: 'form-control',
            style: 'cursor:pointer;font-size:14px;padding: 3px;border-radius: 5px;width: 21px;height: 21px;'
        }).append(
            $('<i>', { class: 'fa', style: 'vertical-align: super' }).addClass(fontAwesomeClass)
        );
    }
}

function loadSettingsFromStorage() {
    const loadedSettings = $.parseJSON(localStorage.getItem(SETTINGS_STORE_NAME));
    const defaultSettings = {
        lastVersion: null,
        visibleLayers: [],
        onlyShowApplicableLayers: false,
        selectedStates: [],
        enabled: true,
        fillParcels: false,
        toggleHnsOnlyShortcut: '',
        oneTimeAlerts: {},
        layers: {}
    };
    _settings = loadedSettings || defaultSettings;
    Object.keys(defaultSettings).forEach(prop => {
        if (!_settings.hasOwnProperty(prop)) {
            _settings[prop] = defaultSettings[prop];
        }
    });

    _settings.getLayerSetting = function getLayerSetting(layerID, settingName) {
        const layerSettings = this.layers[layerID];
        if (!layerSettings) {
            return undefined;
        }
        return layerSettings[settingName];
    };
    _settings.setLayerSetting = function setLayerSetting(layerID, settingName, value) {
        let layerSettings = this.layers[layerID];
        if (!layerSettings) {
            layerSettings = {};
            this.layers[layerID] = layerSettings;
        }
        layerSettings[settingName] = value;
    };
}

function saveSettingsToStorage() {
    let keys = '';
    const { shortcut } = W.accelerators.Actions.GisLayersAddrDisplay;
    if (shortcut) {
        if (shortcut.altKey) keys += 'A';
        if (shortcut.shiftKey) keys += 'S';
        if (shortcut.ctrlKey) keys += 'C';
        if (keys.length) keys += '+';
        if (shortcut.keyCode) keys += shortcut.keyCode;
    }
    _settings.toggleHnsOnlyShortcut = keys;
    _settings.lastVersion = SCRIPT_VERSION;
    localStorage.setItem(SETTINGS_STORE_NAME, JSON.stringify(_settings));
    log('Settings saved');
}

function getUrl(extent, gisLayer) {
    if (gisLayer.spatialReference) {
        const proj = new OL.Projection(`EPSG:${gisLayer.spatialReference}`);
        extent.transform(W.map.getProjection(), proj);
    }
    let layerOffset = _settings.getLayerSetting(gisLayer.id, 'offset');
    if (!layerOffset) {
        layerOffset = { x: 0, y: 0 };
    }
    const geometry = {
        xmin: extent.left - layerOffset.x,
        ymin: extent.bottom - layerOffset.y,
        xmax: extent.right - layerOffset.x,
        ymax: extent.top - layerOffset.y,
        spatialReference: {
            wkid: gisLayer.spatialReference ? gisLayer.spatialReference : 102100,
            latestWkid: gisLayer.spatialReference ? gisLayer.spatialReference : 3857
        }
    };
    const geometryStr = JSON.stringify(geometry);
    let fields = gisLayer.labelFields;
    if (gisLayer.labelHeaderFields) {
        fields = fields.concat(gisLayer.labelHeaderFields);
    }
    if (gisLayer.distinctFields) {
        fields = fields.concat(gisLayer.distinctFields);
    }
    let url = `${gisLayer.url}/query?geometry=${encodeURIComponent(geometryStr)}`;
    url += gisLayer.token ? `&token=${gisLayer.token}` : '';
    url += `&outFields=${encodeURIComponent(fields.join(','))}`;
    url += '&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope';
    url += `&inSR=${gisLayer.spatialReference ? gisLayer.spatialReference : '102100'}`;
    url += '&outSR=3857&f=json';
    url += gisLayer.where ? `&where=${encodeURIComponent(gisLayer.where)}` : '';

    logDebug(`Request URL: ${url}`);
    return url;
}

function hashString(value) {
    let hash = 0;
    if (value.length === 0) return hash;
    for (let i = 0; i < value.length; i++) {
        const chr = value.charCodeAt(i);
        // eslint-disable-next-line no-bitwise
        hash = ((hash << 5) - hash) + chr;
        // eslint-disable-next-line no-bitwise
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function getCountiesUrl(extent) {
    const geometry = {
        xmin: extent.left,
        ymin: extent.bottom,
        xmax: extent.right,
        ymax: extent.top,
        spatialReference: { wkid: 102100, latestWkid: 3857 }
    };
    const url = `${COUNTIES_URL}/query?geometry=${encodeURIComponent(JSON.stringify(geometry))}`;
    //return `${url}&outFields=BASENAME%2CSTATE&returnGeometry=false&spatialRel=esriSpatialRelIntersects`
    return `${url}&outFields=NAME%2CSTATE_FIPS&returnGeometry=false&spatialRel=esriSpatialRelIntersects`
        + '&geometryType=esriGeometryEnvelope&inSR=102100&outSR=3857&f=json';
}

let _countiesInExtent = [];
let _statesInExtent = [];

function getFetchableLayers(getInvisible) {
    return _gisLayers.filter(gisLayer => {
        const isValidUrl = gisLayer.url && gisLayer.url.trim().length > 0;
        const isVisible = (getInvisible || _settings.visibleLayers.indexOf(gisLayer.id) > -1)
            && _settings.selectedStates.indexOf(gisLayer.state) > -1;
        const isInState = gisLayer.state === 'US' || _statesInExtent.indexOf(STATES.toFullName(gisLayer.state)) > -1;
        // Be sure to use hasOwnProperty when checking this, since 0 is a valid value.
        const isValidZoom = getInvisible || W.map.getZoom() >= (gisLayer.hasOwnProperty('visibleAtZoom')
            ? gisLayer.visibleAtZoom : DEFAULT_VISIBLE_AT_ZOOM);
        return isValidUrl && isInState && isVisible && isValidZoom;
    });
}

function filterLayerCheckboxes() {
    const applicableLayers = getFetchableLayers(true).filter(layer => {
        const hasCounties = layer.hasOwnProperty('counties');
        return (hasCounties && layer.counties.some(county => _countiesInExtent.indexOf(county.toLowerCase()) > -1))
            || !hasCounties;
    });
    const statesToHide = STATES.toAbbrArray();

    _gisLayers.forEach(gisLayer => {
        const id = `#gis-layer-${gisLayer.id}-container`;
        if (!_settings.onlyShowApplicableLayers || applicableLayers.indexOf(gisLayer) > -1) {
            $(id).show();
            $(`#gis-layers-for-${gisLayer.state}`).show();
            const idx = statesToHide.indexOf(gisLayer.state);
            if (idx > -1) statesToHide.splice(idx, 1);
        } else {
            $(id).hide();
        }
    });
    if (_settings.onlyShowApplicableLayers) {
        statesToHide.forEach(st => $(`#gis-layers-for-${st}`).hide());
    }
}

const ROAD_ABBR = [
    [/\bAVENUE$/, 'AVE'], [/\bCIRCLE$/, 'CIR'], [/\bCOURT$/, 'CT'], [/\bDRIVE$/, 'DR'],
    [/\bLANE$/, 'LN'], [/\bPARK$/, 'PK'], [/\bPLACE$/, 'PL'], [/\bROAD$/, 'RD'], [/\bSTREET$/, 'ST'],
    [/\bTERRACE$/, 'TER']
];
function processFeatures(data, token, gisLayer) {
    const features = [];
    if (data.skipIt) {
        // do nothing
    } else if (data.error) {
        logError(`Error in layer "${gisLayer.name}": ${data.error.message}`);
    } else {
        const items = data.features;
        if (!token.cancel) {
            let error = false;
            const distinctValues = [];
            items.forEach(item => {
                let skipIt = false;
                if (!token.cancel && !error) {
                    let feature;
                    let featureGeometry;
                    let area;
                    if (gisLayer.distinctFields) {
                        if (distinctValues.some(v => gisLayer.distinctFields.every(
                            fld => v[fld] === item.attributes[fld]
                        ))) {
                            skipIt = true;
                        } else {
                            const dist = {};
                            gisLayer.distinctFields.forEach(fld => (dist[fld] = item.attributes[fld]));
                            distinctValues.push(dist);
                        }
                    }
                    if (!skipIt) {
                        let layerOffset = _settings.getLayerSetting(gisLayer.id, 'offset');
                        if (!layerOffset) {
                            layerOffset = { x: 0, y: 0 };
                        }
                        // Special handling for this layer, because it doesn't have a geometry property.
                        // Coordinates are stored in the attributes.
                        if (gisLayer.id === 'nc-richmond-co-pts') {
                            const pt = new OL.Geometry.Point(item.attributes.XCOOR, item.attributes.YCOOR);
                            pt.transform(W.map.displayProjection, W.map.projection);
                            item.geometry = pt;
                        }
                        if (item.geometry) {
                            if (item.geometry.x) {
                                featureGeometry = new OL.Geometry.Point(item.geometry.x + layerOffset.x,
                                    item.geometry.y + layerOffset.y);
                            } else if (item.geometry.points) {
                                // @TODO Fix for multiple points instead of just grabbing first.
                                featureGeometry = new OL.Geometry.Point(item.geometry.points[0][0] + layerOffset.x,
                                    item.geometry.points[0][1] + layerOffset.y);
                            } else if (item.geometry.rings) {
                                const rings = [];
                                item.geometry.rings.forEach(ringIn => {
                                    const pnts = [];
                                    for (let i = 0; i < ringIn.length; i++) {
                                        pnts.push(new OL.Geometry.Point(ringIn[i][0] + layerOffset.x,
                                            ringIn[i][1] + layerOffset.y));
                                    }
                                    rings.push(new OL.Geometry.LinearRing(pnts));
                                });
                                featureGeometry = new OL.Geometry.Polygon(rings);
                                if (gisLayer.areaToPoint) {
                                    featureGeometry = featureGeometry.getCentroid();
                                } else {
                                    area = featureGeometry.getArea();
                                }
                            } else if (data.geometryType === 'esriGeometryPolyline') {
                                const pointList = [];
                                item.geometry.paths.forEach(path => {
                                    path.forEach(point => pointList.push(new OL.Geometry.Point(point[0] + layerOffset.x,
                                        point[1] + layerOffset.y)));
                                });
                                featureGeometry = new OL.Geometry.LineString(pointList);
                                featureGeometry.skipDupeCheck = true;
                            } else {
                                logDebug(`Unexpected feature type in layer: ${JSON.stringify(item)}`);
                                logError(`Error: Unexpected feature type in layer "${gisLayer.name}"`);
                                error = true;
                            }
                            if (!error) {
                                const hasVisibleAtZoom = gisLayer.hasOwnProperty('visibleAtZoom');
                                const hasLabelsVisibleAtZoom = gisLayer.hasOwnProperty('labelsVisibleAtZoom');
                                const displayLabelsAtZoom = hasLabelsVisibleAtZoom ? gisLayer.labelsVisibleAtZoom
                                    : (hasVisibleAtZoom ? gisLayer.visibleAtZoom : DEFAULT_VISIBLE_AT_ZOOM) + 1;
                                let label = '';
                                if (gisLayer.labelHeaderFields) {
                                    label = `${gisLayer.labelHeaderFields.map(
                                        fieldName => item.attributes[fieldName]
                                    ).join(' ').trim()}\n`;
                                }
                                if (W.map.getZoom() >= displayLabelsAtZoom || area >= 5000) {
                                    label += gisLayer.labelFields.map(
                                        fieldName => item.attributes[fieldName]
                                    ).join(' ').trim();
                                    if (gisLayer.processLabel) {
                                        label = gisLayer.processLabel(label, item.attributes);
                                        label = label ? label.trim() : '';
                                    }
                                }
                                if (label && [
                                    LAYER_STYLES.points, LAYER_STYLES.parcels, LAYER_STYLES.state_points,
                                    LAYER_STYLES.state_parcels
                                ].indexOf(gisLayer.style) > -1) {
                                    if (_settings.addrLabelDisplay === 'hn') {
                                        const m = label.match(/^\d+/);
                                        label = m ? m[0] : '';
                                    } else if (_settings.addrLabelDisplay === 'street') {
                                        const m = label.match(/^(?:\d+\s)?(.*)/);
                                        label = m ? m[1].trim() : '';
                                    }
                                }
                                const attributes = {
                                    layerID: gisLayer.id,
                                    label
                                };
                                feature = new OL.Feature.Vector(featureGeometry, attributes);
                                features.push(feature);
                            }
                        }
                    }
                }
            });
        }
    }
    if (!token.cancel) {
        // Check for duplicate geometries.
        for (let i = 0; i < features.length; i++) {
            const f1 = features[i];
            if (!f1.geometry.skipDupeCheck) {
                const c1 = f1.geometry.getCentroid();
                let labels = [f1.attributes.label];
                for (let j = i + 1; j < features.length; j++) {
                    const f2 = features[j];
                    if (!f2.geometry.skipDupeCheck && f2.geometry.getCentroid().distanceTo(c1) < 1) {
                        features.splice(j, 1);
                        labels.push(f2.attributes.label);
                        j--;
                    }
                }
                labels = _.uniq(labels);
                if (labels.length > 1) {
                    labels.forEach((label, idx) => {
                        label = label.replace(/\n/g, ' ').replace(/\s{2,}/, ' ').replace(/\bUNIT\s.{1,5}$/i, '').trim();
                        ROAD_ABBR.forEach(abbr => (label = label.replace(abbr[0], abbr[1])));
                        labels[idx] = label;
                    });
                    labels = _.uniq(labels);
                    labels.sort();
                    if (labels.length > 12) {
                        const len = labels.length;
                        labels = labels.slice(0, 10);
                        labels.push(`(${len - 10} more...)`);
                    }
                    f1.attributes.label = _.uniq(labels).join('\n');
                } else {
                    let { label } = f1.attributes;
                    ROAD_ABBR.forEach(abbr => (label = label.replace(abbr[0], abbr[1])));
                    f1.attributes.label = label;
                }
            }
        }

        const layer = gisLayer.isRoadLayer ? _roadLayer : _mapLayer;
        layer.removeFeatures(layer.getFeaturesByAttribute('layerID', gisLayer.id));
        layer.addFeatures(features);

        if (features.length) {
            $(`label[for="gis-layer-${gisLayer.id}"]`).css({ color: '#00a009' });
        }
    }
} // END processFeatures()

function fetchFeatures() {
    if (_ignoreFetch) return;
    _lastToken.cancel = true;
    _lastToken = { cancel: false, features: [], layersProcessed: 0 };
    $('.gis-state-layer-label').css({ color: '#777' });

    let _layersCleared = false;

    // if (layersToFetch.length) {
    const extent = W.map.getExtent();
    GM_xmlhttpRequest({
        url: getCountiesUrl(extent),
        method: 'GET',
        onload(res) {
            if (res.status < 400) {
                const data = $.parseJSON(res.responseText);
                if (data.error) {
                    logError(`Error in US Census counties data: ${data.error.message}`);
                } else {
                    //_countiesInExtent = data.features.map(feature => feature.attributes.BASENAME.toLowerCase());
                    _countiesInExtent = data.features.map(feature => feature.attributes.NAME.toLowerCase());
                    logDebug(`US Census counties: ${_countiesInExtent.join(', ')}`);
                    _statesInExtent = _.uniq(data.features.map(
                        //feature => STATES.fromId(parseInt(feature.attributes.STATE, 10))[0]
                        feature => STATES.fromId(parseInt(feature.attributes.STATE_FIPS, 10))[0]
                    ));

                    let layersToFetch;
                    if (!_layersCleared) {
                        _layersCleared = true;
                        layersToFetch = getFetchableLayers();

                        // Remove features of any layers that won't be mapped.
                        _gisLayers.forEach(gisLayer => {
                            if (layersToFetch.indexOf(gisLayer) === -1) {
                                _mapLayer.removeFeatures(_mapLayer.getFeaturesByAttribute('layerID', gisLayer.id));
                                _roadLayer.removeFeatures(_roadLayer.getFeaturesByAttribute('layerID', gisLayer.id));
                            }
                        });
                    }

                    layersToFetch = layersToFetch.filter(layer => !layer.hasOwnProperty('counties')
                        || layer.counties.some(county => _countiesInExtent.indexOf(county.toLowerCase()) > -1));
                    filterLayerCheckboxes();
                    logDebug(`Fetching ${layersToFetch.length} layers...`);
                    logDebug(layersToFetch);
                    layersToFetch.forEach(gisLayer => {
                        const url = getUrl(extent, gisLayer);
                        GM_xmlhttpRequest({
                            url,
                            context: _lastToken,
                            method: 'GET',
                            onload(res2) {
                                if (res2.status < 400) { // Handle stupid issue where http 4## is considered success
                                    processFeatures($.parseJSON(res2.responseText), res2.context, gisLayer);
                                } else {
                                    logDebug(`HTTP request error: ${JSON.stringify(res2)}`);
                                    logError(`Could not fetch layer "${gisLayer.id}". Request returned ${res2.status}`);
                                }
                            },
                            onerror(res3) {
                                logDebug(`xmlhttpRequest error:${JSON.stringify(res3)}`);
                                logError(`Could not fetch layer "${gisLayer.id}". An error was thrown.`);
                            }
                        });
                    });
                }
            } else {
                logDebug(`HTTP request error: ${JSON.stringify(res)}`);
                logError(`Could not fetch counties from US Census site.  Request returned ${res.status}`);
            }
        },
        onerror(res) {
            logDebug(`xmlhttpRequest error:${JSON.stringify(res)}`);
            logError('Could not fetch counties from US Census site.  An error was thrown.');
        }
    });
}

function showScriptInfoAlert() {
    /* Check version and alert on update */
    if (ALERT_UPDATE && SCRIPT_VERSION !== _settings.lastVersion) {
        alert(SCRIPT_VERSION_CHANGES);
    }
}

function setEnabled(value) {
    _settings.enabled = value;
    saveSettingsToStorage();
    _mapLayer.setVisibility(value);
    _roadLayer.setVisibility(value);
    const color = value ? '#00bd00' : '#ccc';
    $('span#gis-layers-power-btn').css({ color });
    if (value) fetchFeatures();
    $('#layer-switcher-item_gis_layers').prop('checked', value);
}

function onGisLayerToggleChanged() {
    const checked = $(this).is(':checked');
    const layerId = $(this).data('layer-id');
    const idx = _settings.visibleLayers.indexOf(layerId);
    if (checked) {
        const gisLayer = _gisLayers.find(l => l.id === layerId);
        if (gisLayer.oneTimeAlert) {
            const lastAlertHash = _settings.oneTimeAlerts[layerId];
            const newAlertHash = hashString(gisLayer.oneTimeAlert);
            if (lastAlertHash !== newAlertHash) {
                alert(`Layer: ${gisLayer.name}\n\nMessage:\n${gisLayer.oneTimeAlert}`);
                _settings.oneTimeAlerts[layerId] = newAlertHash;
                saveSettingsToStorage();
            }
        }
        if (idx === -1) _settings.visibleLayers.push(layerId);
    } else if (idx > -1) _settings.visibleLayers.splice(idx, 1);
    if (!_ignoreFetch) {
        saveSettingsToStorage();
        fetchFeatures();
    }
}

function onOnlyShowApplicableLayersChanged() {
    _settings.onlyShowApplicableLayers = $(this).is(':checked');
    saveSettingsToStorage();
    fetchFeatures();
}

function onStateCheckChanged(evt) {
    const state = evt.data;
    const idx = _settings.selectedStates.indexOf(state);
    if (evt.target.checked) {
        if (idx === -1) _settings.selectedStates.push(state);
    } else if (idx > -1) _settings.selectedStates.splice(idx, 1);
    if (!_ignoreFetch) {
        saveSettingsToStorage();
        initLayersTab();
        fetchFeatures();
    }
}

function onLayerCheckboxChanged(checked) {
    setEnabled(checked);
}

function setFillParcels(doFill) {
    [LAYER_STYLES.parcels, LAYER_STYLES.state_parcels].forEach(style => {
        style.fillOpacity = doFill ? 0.2 : 0;
    });
}

function onFillParcelsCheckedChanged(evt) {
    const { checked } = evt.target;
    setFillParcels(checked);
    _settings.fillParcels = checked;
    saveSettingsToStorage();
    fetchFeatures();
}

function onMapMove() {
    if (_settings.enabled) fetchFeatures();
}

function onRefreshLayersClick() {
    const $btn = $('#gis-layers-refresh');
    if (!$btn.hasClass('fa-spin')) {
        $btn.css({ cursor: 'auto' });
        $btn.addClass('fa-spin');
        init(false);
    }
}

function onChevronClick(evt) {
    const $target = $(evt.currentTarget);
    $($target.children()[0])
        .toggleClass('fa fa-fw fa-chevron-down')
        .toggleClass('fa fa-fw fa-chevron-right');
    $($target.siblings()[0]).toggleClass('collapse');
}

function doToggleABunch(evt, checkState) {
    _ignoreFetch = true;
    $(evt.target).closest('fieldset').find('input').prop('checked', !checkState).trigger('click');
    _ignoreFetch = false;
    saveSettingsToStorage();
    if (evt.data) initLayersTab();
    fetchFeatures();
}

function onSelectAllClick(evt) {
    doToggleABunch(evt, true);
}

function onSelectNoneClick(evt) {
    doToggleABunch(evt, false);
}

function onGisAddrDisplayChange(evt) {
    _settings.addrLabelDisplay = evt.target.value;
    saveSettingsToStorage();
    fetchFeatures();
}

function onAddressDisplayShortcutKey() {
    if (!$('#gisAddrDisplay-hn').is(':checked')) {
        $('#gisAddrDisplay-hn').click();
    } else {
        $('#gisAddrDisplay-all').click();
    }
}

function initLayer() {
    const rules = _gisLayers.map(gisLayer => new OL.Rule({
        filter: new OL.Filter.Comparison({
            type: OL.Filter.Comparison.EQUAL_TO,
            property: 'layerID',
            value: gisLayer.id
        }),
        symbolizer: gisLayer.style
    }));

    setFillParcels(_settings.fillParcels);

    const style = new OL.Style(DEFAULT_STYLE, { rules });
    let existingLayer;
    let uniqueName;

    uniqueName = 'wmeGISLayersDefault';
    existingLayer = W.map.getLayerByUniqueName(uniqueName);
    if (existingLayer) W.map.removeLayer(existingLayer);
    _mapLayer = new OL.Layer.Vector('GIS Layers - Default', {
        uniqueName,
        styleMap: new OL.StyleMap(style)
    });

    uniqueName = 'wmeGISLayersRoads';
    existingLayer = W.map.getLayerByUniqueName(uniqueName);
    if (existingLayer) W.map.removeLayer(existingLayer);
    _roadLayer = new OL.Layer.Vector('GIS Layers - Roads', {
        uniqueName,
        styleMap: new OL.StyleMap(ROAD_STYLE)
    });

    _mapLayer.setVisibility(_settings.enabled);
    _roadLayer.setVisibility(_settings.enabled);

    W.map.addLayer(_roadLayer);
    W.map.addLayer(_mapLayer);
} // END InitLayer

function initLayersTab() {
    const user = W.loginManager.user.userName.toLowerCase();
    const states = _.uniq(_gisLayers.map(l => l.state)).filter(st => _settings.selectedStates.indexOf(st) > -1);

    $('#panel-gis-state-layers').empty().append(
        $('<div>', { class: 'controls-container' }).css({ 'padding-top': '2px' }).append(
            $('<input>', { type: 'checkbox', id: 'only-show-applicable-gis-layers' }).change(
                onOnlyShowApplicableLayersChanged
            ).prop('checked', _settings.onlyShowApplicableLayers),
            $('<label>', { for: 'only-show-applicable-gis-layers' })
                .css({ 'white-space': 'pre-line' }).text('Only show applicable layers')
        ),
        $('.gis-layers-state-checkbox:checked').length === 0
            ? $('<div>').text('Turn on layer categories in the Settings tab.')
            : states.map(st => $('<fieldset>', {
                id: `gis-layers-for-${st}`,
                style: 'border:1px solid silver;padding:8px;border-radius:4px;-webkit-padding-before: 0;'
            }).append(
                $('<legend>', { style: 'margin-bottom:0px;border-bottom-style:none;width:auto;' })
                    .click(onChevronClick).append(
                        $('<i>', {
                            class: 'fa fa-fw fa-chevron-down',
                            style: 'cursor: pointer;font-size: 12px;margin-right: 4px'
                        }),
                        $('<span>', {
                            style: 'font-size:14px;font-weight:600;text-transform: uppercase; cursor: pointer'
                        }).text(STATES.toFullName(st))
                    ),
                $('<div>', { id: `${st}_body` }).append(
                    $('<div>').css({ 'font-size': '11px' }).append(
                        $('<span>').append(
                            'Select ',
                            $('<a>', { href: '#' })
                                .text('All')
                                .click(onSelectAllClick),
                            ' / ',
                            $('<a>', { href: '#' })
                                .text('None')
                                .click(onSelectNoneClick)
                        )
                    ),
                    $('<div>', { class: 'controls-container', style: 'padding-top:0px;' }).append(
                        _gisLayers.filter(l => (l.state === st && (!PRIVATE_LAYERS.hasOwnProperty(l.id)
                            || PRIVATE_LAYERS[l.id].indexOf(user) > -1)))
                            .map(gisLayer => {
                                const id = `gis-layer-${gisLayer.id}`;
                                return $('<div>', { class: 'controls-container', id: `${id}-container` })
                                    .css({ 'padding-top': '2px', display: 'block' })
                                    .append(
                                        $('<input>', { type: 'checkbox', id })
                                            .data('layer-id', gisLayer.id)
                                            .change(onGisLayerToggleChanged)
                                            .prop('checked', _settings.visibleLayers.indexOf(gisLayer.id) > -1),
                                        $('<label>', { for: id, class: 'gis-state-layer-label' })
                                            .css({ 'white-space': 'pre-line' })
                                            .text(`${gisLayer.name}${gisLayer.restrictTo ? ' *' : ''}`)
                                            .attr('title', gisLayer.restrictTo ? `Restricted to: ${gisLayer.restrictTo}` : '')
                                            .contextmenu(evt => {
                                                evt.preventDefault();
                                                // TODO - enable the layer if it isn't already.
                                                // Tried using click function on the evt target, but that didn't work.
                                                _layerSettingsDialog.gisLayer = gisLayer;
                                                _layerSettingsDialog.show();
                                            })
                                    );
                            })
                    )
                )
            ))
    );
}

function initSettingsTab() {
    const states = _.uniq(_gisLayers.map(l => l.state));
    const createRadioBtn = (name, value, text, checked) => {
        const id = `${name}-${value}`;
        return [$('<input>', {
            type: 'radio', id, name, value
        }).prop('checked', checked), $('<label>', { for: id }).text(text).css({
            paddingLeft: '15px', marginRight: '4px'
        })];
    };
    $('#panel-gis-layers-settings').empty().append(
        $('<fieldset>', {
            style: 'border:1px solid silver;padding:8px;border-radius:4px;-webkit-padding-before: 0;margin-top:-8px;'
        }).append(
            $('<legend>', {
                style: 'margin-bottom:0px;border-bottom-style:none;width:auto;'
            }).append($('<span>', {
                style: 'font-size:14px;font-weight:600;text-transform: uppercase;'
            }).text('Labels')),
            $('<div>', { id: 'labelSettings' }).append(
                $('<div>', { class: 'controls-container' }).css({ 'padding-top': '2px' }).append(
                    $('<label>', { style: 'font-weight:normal;' }).text('Addresses:'),
                    createRadioBtn('gisAddrDisplay', 'hn', 'HN', _settings.addrLabelDisplay === 'hn'),
                    createRadioBtn('gisAddrDisplay', 'street', 'Street', _settings.addrLabelDisplay === 'street'),
                    createRadioBtn('gisAddrDisplay', 'all', 'Both', _settings.addrLabelDisplay === 'all'),
                    $('<i>', {
                        class: 'waze-tooltip',
                        id: 'gisAddrDisplayInfo',
                        'data-toggle': 'tooltip',
                        style: 'margin-left:8px; font-size:12px',
                        'data-placement': 'bottom',
                        title: `This may not work properly for all layers. Please report issues to ${SCRIPT_AUTHOR}.`
                    }).tooltip()
                )
            )
        ),
        $('<fieldset>', {
            style: 'border:1px solid silver;padding:8px;border-radius:4px;-webkit-padding-before: 0;'
        }).append(
            $('<legend>', {
                style: 'margin-bottom:0px;border-bottom-style:none;width:auto;'
            }).append($('<span>', {
                style: 'font-size:14px;font-weight:600;text-transform: uppercase;'
            }).text('Layer Categories')),
            $('<div>', { id: 'states_body' }).append(
                $('<div>').css({ 'font-size': '11px' }).append(
                    $('<span>').append(
                        'Select ',
                        $('<a>', { href: '#' }).text('All').click(true, onSelectAllClick),
                        ' / ',
                        $('<a>', { href: '#' }).text('None').click(true, onSelectNoneClick)
                    )
                ),
                $('<div>', { class: 'controls-container', style: 'padding-top:0px;' }).append(
                    states.map(st => {
                        const fullName = STATES.toFullName(st);
                        const id = `gis-layer-enable-state-${st}`;
                        return $('<div>', { class: 'controls-container' })
                            .css({ 'padding-top': '2px', display: 'block' })
                            .append(
                                $('<input>', { type: 'checkbox', id, class: 'gis-layers-state-checkbox' })
                                    .change(st, onStateCheckChanged)
                                    .prop('checked', _settings.selectedStates.indexOf(st) > -1),
                                $('<label>', { for: id }).css({ 'white-space': 'pre-line' }).text(fullName)
                            );
                    })
                )
            )
        )
    );
    $('#panel-gis-layers-settings').append(
        $('<fieldset>', { style: 'border:1px solid silver;padding:8px;border-radius:4px;-webkit-padding-before: 0;' })
            .append(
                $('<legend>', { style: 'margin-bottom:0px;border-bottom-style:none;width:auto;' })
                    .append(
                        $('<span>', { style: 'font-size:14px;font-weight:600;text-transform: uppercase;' })
                            .text('Appearance')
                    ),
                $('<div>', { class: 'controls-container' }).css({ 'padding-top': '2px' }).append(
                    $('<input>', { type: 'checkbox', id: 'fill-parcels' })
                        .change(onFillParcelsCheckedChanged)
                        .prop('checked', _settings.fillParcels),
                    $('<label>', { for: 'fill-parcels' }).css({ 'white-space': 'pre-line' }).text('Fill parcels')
                )
            )
    );
    $('input[name=gisAddrDisplay]').change(onGisAddrDisplayChange);
}

function initTab(firstCall = true) {
    initSettingsTab();
    initLayersTab();
    if (firstCall) {
        if (!$('#gis-layers-power-btn').length) {
            const color = _settings.enabled ? '#00bd00' : '#ccc';
            $('a[href="#sidepanel-gis-l"]').prepend(
                $('<span>', {
                    class: 'fa fa-power-off',
                    id: 'gis-layers-power-btn',
                    style: `margin-right: 5px;cursor: pointer;color: ${color};font-size: 13px;`,
                    title: 'Toggle GIS Layers'
                }).click(evt => {
                    evt.stopPropagation();
                    setEnabled(!_settings.enabled);
                })
            );
        }
        $('#gis-layers-refresh').click(onRefreshLayersClick);
    }
}

function initGui(firstCall = true) {
    initLayer();

    if (firstCall) {
        const content = $('<div>').append(
            $('<span>', { style: 'font-size:14px;font-weight:600' }).text('GIS Layers'),
            $('<span>', { style: 'font-size:11px;margin-left:10px;color:#aaa;' }).text(GM_info.script.version),
            $('<span>', {
                id: 'gis-layers-refresh',
                class: 'fa fa-refresh',
                style: 'float: right;',
                'data-toggle': 'tooltip',
                title: 'Pull new layer info from master sheet and refresh all layers.'
            }),
            '<ul class="nav nav-tabs">'
            + '<li class="active"><a data-toggle="tab" href="#panel-gis-state-layers" aria-expanded="true">'
            + 'Layers'
            + '</a></li>'
            + '<li><a data-toggle="tab" href="#panel-gis-layers-settings" aria-expanded="true">'
            + 'Settings'
            + '</a></li> '
            + '</ul>',
            $('<div>', { class: 'tab-content', style: 'padding:8px;padding-top:2px' }).append(
                $('<div>', { class: 'tab-pane active', id: 'panel-gis-state-layers' }),
                $('<div>', { class: 'tab-pane', id: 'panel-gis-layers-settings' })
            )
        ).html();

        new WazeWrap.Interface.Tab('GIS-L', content, initTab, null);
        WazeWrap.Interface.AddLayerCheckbox('Display', 'GIS Layers', _settings.enabled, onLayerCheckboxChanged);
        W.map.events.register('moveend', null, onMapMove);
        showScriptInfoAlert();
    } else {
        initTab(firstCall);
    }
}

async function loadSpreadsheetAsync() {
    let data;
    try {
        data = await $.getJSON(`${LAYER_DEF_SPREADSHEET_URL}?${DEC(API_KEY)}`);
    } catch (err) {
        throw new Error(`Spreadsheet call failed. (${err.status}: ${err.statusText})`);
    }
    const [[minVersion], fieldNames, ...layerDefRows] = data.values;
    const REQUIRED_FIELD_NAMES = [
        'state', 'name', 'id', 'counties', 'url', 'where', 'labelFields',
        'processLabel', 'style', 'visibleAtZoom', 'labelsVisibleAtZoom', 'enabled',
        'restrictTo', 'oneTimeAlert'
    ];
    const result = { error: null };
    const checkFieldNames = fldName => fieldNames.indexOf(fldName) > -1;

    if (SCRIPT_VERSION < minVersion) {
        result.error = `Script must be updated to at least version ${
            minVersion} before layer definitions can be loaded.`;
    } else if (fieldNames.length < REQUIRED_FIELD_NAMES.length) {
        result.error = `Expected ${
            REQUIRED_FIELD_NAMES.length} columns in layer definition data.  Spreadsheet returned ${
            fieldNames.length}.`;
    } else if (!REQUIRED_FIELD_NAMES.every(fldName => checkFieldNames(fldName))) {
        result.error = 'Script expected to see the following column names in the layer '
            + `definition spreadsheet:\n${REQUIRED_FIELD_NAMES.join(', ')}\n`
            + `But the spreadsheet returned these:\n${fieldNames.join(', ')}`;
    }
    if (!result.error) {
        layerDefRows.filter(row => row.length).forEach(layerDefRow => {
            const layerDef = { enabled: '0' };
            fieldNames.forEach((fldName, fldIdx) => {
                let value = layerDefRow[fldIdx];
                if (value !== undefined && value.trim().length > 0) {
                    value = value.trim();
                    if (fldName === 'counties' || fldName === 'labelFields') {
                        value = value.split(',').map(item => item.trim());
                    } else if (fldName === 'processLabel') {
                        try {
                            // eslint-disable-next-line no-eval
                            value = eval(`(function(label, fieldValues){${value}})`);
                        } catch (ex) {
                            logError(`Error loading label processing function for layer "${
                                layerDef.id}".`);
                            logDebug(ex);
                        }
                    } else if (fldName === 'style') {
                        layerDef.isRoadLayer = value === 'roads';
                        if (LAYER_STYLES.hasOwnProperty(value)) {
                            value = LAYER_STYLES[value];
                        } else if (!layerDef.isRoadLayer) {
                            // If style is not defined, try to read in as JSON (custom style)
                            try {
                                value = JSON.parse(value);
                            } catch (ex) {
                                // ignore error
                            }
                        }
                    } else if (fldName === 'state') {
                        value = value ? value.toUpperCase() : value;
                    } else if (fldName === 'restrictTo') {
                        try {
                            const { user } = W.loginManager;
                            const values = value.split(',').map(v => v.trim().toLowerCase());
                            layerDef.notAllowed = !values.some(entry => {
                                const rankMatch = entry.match(/^r(\d)(\+am)?$/);
                                if (rankMatch) {
                                    if (rankMatch[1] <= user.normalizedLevel && (!rankMatch[2] || user.isAreaManager)) {
                                        return true;
                                    }
                                } else if (entry === 'am' && user.isAreaManager) {
                                    return true;
                                } else if (entry === user.userName.toLowerCase()) {
                                    return true;
                                }
                                return false;
                            });
                        } catch (ex) {
                            logError(ex);
                        }
                    }
                    layerDef[fldName] = value;
                } else if (fldName === 'labelFields') {
                    layerDef[fldName] = [''];
                }
            });
            const enabled = layerDef.enabled && ['0', 'false', 'no', 'n'].indexOf(layerDef.enabled.toString().trim().toLowerCase()) === -1;
            if (!layerDef.notAllowed && (enabled || layerDef.restrictTo)) {
                _gisLayers.push(layerDef);
            }
        });
    }

    return result;
}

async function init(firstCall = true) {
    _gisLayers = [];
    if (firstCall) {
        loadSettingsFromStorage();
        installPathFollowingLabels();
        new WazeWrap.Interface.Shortcut('GisLayersAddrDisplay', 'Toggle HN-only address labels (GIS Layers)',
            'layers', 'layersToggleGisAddressLabelDisplay', _settings.toggleHnsOnlyShortcut, onAddressDisplayShortcutKey, null).add();
        window.addEventListener('beforeunload', saveSettingsToStorage, false);
        _layerSettingsDialog = new LayerSettingsDialog();
    }
    const t0 = performance.now();
    try {
        const result = await loadSpreadsheetAsync();
        if (result.error) {
            logError(result.error);
            return;
        }
        _layerRefinements.forEach(layerRefinement => {
            const layerDef = _gisLayers.find(layerDef2 => layerDef2.id === layerRefinement.id);
            if (layerDef) {
                Object.keys(layerRefinement).forEach(fldName => {
                    const value = layerRefinement[fldName];
                    if (fldName !== 'id' && layerDef.hasOwnProperty(fldName)) {
                        logDebug(`The "${fldName}" property of layer "${
                            layerDef.id}" has a value hardcoded in the script, and also defined in the spreadsheet.`
                            + ' The spreadsheet value takes precedence.');
                    } else if (value) layerDef[fldName] = value;
                });
            } else {
                logDebug(`Refined layer "${layerRefinement.id}" does not have a corresponding layer defined`
                    + ' in the spreadsheet.  It can probably be removed from the script.');
            }
        });
        logDebug(`Loaded ${_gisLayers.length} layer definitions in ${Math.round(performance.now() - t0)} ms.`);
        initGui(firstCall);
        fetchFeatures();
        $('#gis-layers-refresh').removeClass('fa-spin').css({ cursor: 'pointer' });
        log('Initialized.');
    } catch (err) {
        logError(err);
    }
}

function bootstrap() {
    if (W && W.loginManager && W.map && W.loginManager.user && W.model
        && W.model.states && W.model.states.getObjectArray().length && WazeWrap && WazeWrap.Ready) {
        log('Initializing...');
        WazeWrap.Interface.ShowScriptUpdate(GM_info.script.name, SCRIPT_VERSION, UPDATE_MESSAGE, GF_URL);
        init();
    } else {
        log('Bootstrap failed. Trying again...');
        setTimeout(() => {
            bootstrap();
        }, 1000);
    }
}

bootstrap();

/*eslint-disable*/
function installPathFollowingLabels() {
    // Copyright (c) 2015 by Jean-Marc.Viglino [at]ign.fr
    // Dual-licensed under the CeCILL-B Licence (http://www.cecill.info/)
    // and the Beerware license (http://en.wikipedia.org/wiki/Beerware),
    // feel free to use and abuse it in your projects (the code, not the beer ;-).
    //
    //* Overwrite the SVG function to allow text along a path
    //*	setStyle function
    //*
    //*	Add new options to the Openlayers.Style

    // pathLabel: {String} Label to draw on the path
    // pathLabelXOffset: {String} Offset along the line to start drawing text in pixel or %, default: "50%"
    // pathLabelYOffset: {Number} Distance of the line to draw the text
    // pathLabelCurve: {String} Smooth the line the label is drawn on (empty string for no)
    // pathLabelReadable: {String} Make the label readable (empty string for no)

    // *	Extra standard values : all label and text values


    //  *
    //  * Method: removeChildById
    //  * Remove child in a node.
    //  *

    function removeChildById(node, id) {
        if (node.querySelector) {
            var c = node.querySelector('#' + id);
            if (c) node.removeChild(c);
            return;
        }
        // For old browsers
        var c = node.childNodes;
        if (c) for (var i = 0; i < c.length; i++) {
            if (c[i].id === id) {
                node.removeChild(c[i]);
                return;
            }
        }
    }


    //  *
    //  * Method: setStyle
    //  * Use to set all the style attributes to a SVG node.
    //  *
    //  * Takes care to adjust stroke width and point radius to be
    //  * resolution-relative
    //  *
    //  * Parameters:
    //  * node - {SVGDomElement} An SVG element to decorate
    //  * style - {Object}
    //  * options - {Object} Currently supported options include
    //  *                              'isFilled' {Boolean} and
    //  *                              'isStroked' {Boolean}

    var setStyle = OL.Renderer.SVG.prototype.setStyle;
    OL.Renderer.SVG.LABEL_STARTOFFSET = { 'l': '0%', 'r': '100%', 'm': '50%' };

    OL.Renderer.SVG.prototype.pathText = function (node, style, suffix) {
        var label = this.nodeFactory(null, 'text');
        label.setAttribute('id', node._featureId + '_' + suffix);
        if (style.fontColor) label.setAttributeNS(null, 'fill', style.fontColor);
        if (style.fontStrokeColor) label.setAttributeNS(null, 'stroke', style.fontStrokeColor);
        if (style.fontStrokeWidth) label.setAttributeNS(null, 'stroke-width', style.fontStrokeWidth);
        if (style.fontOpacity) label.setAttributeNS(null, 'opacity', style.fontOpacity);
        if (style.fontFamily) label.setAttributeNS(null, 'font-family', style.fontFamily);
        if (style.fontSize) label.setAttributeNS(null, 'font-size', style.fontSize);
        if (style.fontWeight) label.setAttributeNS(null, 'font-weight', style.fontWeight);
        if (style.fontStyle) label.setAttributeNS(null, 'font-style', style.fontStyle);
        if (style.labelSelect === true) {
            label.setAttributeNS(null, 'pointer-events', 'visible');
            label._featureId = node._featureId;
        } else {
            label.setAttributeNS(null, 'pointer-events', 'none');
        }

        function getpath(pathStr, readeable) {
            var npath = pathStr.split(',');
            var pts = [];
            if (!readeable || Number(npath[0]) - Number(npath[npath.length - 2]) < 0) {
                while (npath.length) pts.push({ x: Number(npath.shift()), y: Number(npath.shift()) });
            } else {
                while (npath.length) pts.unshift({ x: Number(npath.shift()), y: Number(npath.shift()) });
            }
            return pts;
        }

        var path = this.nodeFactory(null, 'path');
        var tpid = node._featureId + '_t' + suffix;
        var tpath = node.getAttribute('points');
        if (style.pathLabelCurve) {
            var pts = getpath(tpath, style.pathLabelReadable);
            var p = pts[0].x + ' ' + pts[0].y;
            var dx, dy, s1, s2;
            dx = (pts[0].x - pts[1].x) / 4;
            dy = (pts[0].y - pts[1].y) / 4;
            for (var i = 1; i < pts.length - 1; i++) {
                p += ' C ' + (pts[i - 1].x - dx) + ' ' + (pts[i - 1].y - dy);
                dx = (pts[i - 1].x - pts[i + 1].x) / 4;
                dy = (pts[i - 1].y - pts[i + 1].y) / 4;
                s1 = Math.sqrt(Math.pow(pts[i - 1].x - pts[i].x, 2) + Math.pow(pts[i - 1].y - pts[i].y, 2));
                s2 = Math.sqrt(Math.pow(pts[i + 1].x - pts[i].x, 2) + Math.pow(pts[i + 1].y - pts[i].y, 2));
                p += ' ' + (pts[i].x + s1 * dx / s2) + ' ' + (pts[i].y + s1 * dy / s2);
                dx *= s2 / s1;
                dy *= s2 / s1;
                p += ' ' + pts[i].x + ' ' + pts[i].y;
            }
            p += ' C ' + (pts[i - 1].x - dx) + ' ' + (pts[i - 1].y - dy);
            dx = (pts[i - 1].x - pts[i].x) / 4;
            dy = (pts[i - 1].y - pts[i].y) / 4;
            p += ' ' + (pts[i].x + dx) + ' ' + (pts[i].y + dy);
            p += ' ' + pts[i].x + ' ' + pts[i].y;

            path.setAttribute('d', 'M ' + p);
        } else {
            if (style.pathLabelReadable) {
                var pts = getpath(tpath, style.pathLabelReadable);
                var p = '';
                for (var i = 0; i < pts.length; i++) p += ' ' + pts[i].x + ' ' + pts[i].y;
                path.setAttribute('d', 'M ' + p);
            } else path.setAttribute('d', 'M ' + tpath);
        }
        path.setAttribute('id', tpid);

        var defs = this.createDefs();
        removeChildById(defs, tpid);
        defs.appendChild(path);

        var textPath = this.nodeFactory(null, 'textPath');
        textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + tpid);
        var align = style.labelAlign || OL.Renderer.defaultSymbolizer.labelAlign;
        label.setAttributeNS(null, 'text-anchor', OL.Renderer.SVG.LABEL_ALIGN[align[0]] || 'middle');
        textPath.setAttribute('startOffset', style.pathLabelXOffset || OL.Renderer.SVG.LABEL_STARTOFFSET[align[0]] || '50%');
        label.setAttributeNS(null, 'dominant-baseline', OL.Renderer.SVG.LABEL_ALIGN[align[1]] || 'central');
        if (style.pathLabelYOffset) label.setAttribute('dy', style.pathLabelYOffset);
        //textPath.setAttribute('method','stretch');
        //textPath.setAttribute('spacing','auto');

        textPath.textContent = style.pathLabel;
        label.appendChild(textPath);

        removeChildById(this.textRoot, node._featureId + '_' + suffix);
        this.textRoot.appendChild(label);
    };

    OL.Renderer.SVG.prototype.setStyle = function (node, style, options) {
        if (node._geometryClass === 'OpenLayers.Geometry.LineString' && style.pathLabel) {
            if (node._geometryClass === 'OpenLayers.Geometry.LineString' && style.pathLabel) {
                var drawOutline = (!!style.labelOutlineWidth);
                // First draw text in halo color and size and overlay the
                // normal text afterwards
                if (drawOutline) {
                    var outlineStyle = OL.Util.extend({}, style);
                    outlineStyle.fontColor = outlineStyle.labelOutlineColor;
                    outlineStyle.fontStrokeColor = outlineStyle.labelOutlineColor;
                    outlineStyle.fontStrokeWidth = style.labelOutlineWidth;
                    if (style.labelOutlineOpacity) outlineStyle.fontOpacity = style.labelOutlineOpacity;
                    delete outlineStyle.labelOutlineWidth;
                    this.pathText(node, outlineStyle, 'txtpath0');
                }
                this.pathText(node, style, 'txtpath');
                setStyle.apply(this, arguments);
            }
        } else setStyle.apply(this, arguments);
        return node;
    };

    //  *
    //  * Method: drawGeometry
    //  * Remove the textpath if no geometry is drawn.
    //  *
    //  * Parameters:
    //  * geometry - {<OpenLayers.Geometry>}
    //  * style - {Object}
    //  * featureId - {String}
    //  *
    //  * Returns:
    //  * {Boolean} true if the geometry has been drawn completely; null if
    //  *     incomplete; false otherwise

    var drawGeometry = OL.Renderer.SVG.prototype.drawGeometry;
    OL.Renderer.SVG.prototype.drawGeometry = function (geometry, style, id) {
        var rendered = drawGeometry.apply(this, arguments);
        if (rendered === false) {
            removeChildById(this.textRoot, id + '_txtpath');
            removeChildById(this.textRoot, id + '_txtpath0');
        }
        return rendered;
    };

    // *
    // * Method: eraseGeometry
    // * Erase a geometry from the renderer. In the case of a multi-geometry,
    // *     we cycle through and recurse on ourselves. Otherwise, we look for a
    // *     node with the geometry.id, destroy its geometry, and remove it from
    // *     the DOM.
    // *
    // * Parameters:
    // * geometry - {<OpenLayers.Geometry>}
    // * featureId - {String}

    var eraseGeometry = OL.Renderer.SVG.prototype.eraseGeometry;
    OL.Renderer.SVG.prototype.eraseGeometry = function (geometry, featureId) {
        eraseGeometry.apply(this, arguments);
        removeChildById(this.textRoot, featureId + '_txtpath');
        removeChildById(this.textRoot, featureId + '_txtpath0');
    };

}
