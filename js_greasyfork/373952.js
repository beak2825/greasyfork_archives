// ==UserScript==
// @name         WME GIS Layers - Alt County Layer
// @namespace    https://greasyfork.org/users/45389
// @version      2018.09.24.001
// @description  Adds GIS layers in WME
// @author       MapOMatic
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
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
// @connect 161.6.109.206
// @connect 184.12.255.122
// @connect 204.63.176.116
// @connect 206.176.83.74
// @connect 206.74.124.99
// @connect 216.110.207.61
// @connect 216.81.174.57
// @connect 23.96.59.134
// @connect 50.120.220.154
// @connect 52.37.30.30
// @connect 54.213.14.253
// @connect 63.238.120.156
// @connect 72.10.206.73
// @connect adairgis.integritygis.com
// @connect agis.charlottecountyfl.gov
// @connect ags.agdmaps.com
// @connect ags.colliergov.net
// @connect ags.kitsapgov.com
// @connect ags10s1.dot.illinois.gov
// @connect ags2.scgov.net
// @connect ags2maps.srcity.org
// @connect ags3.lincoln.ne.gov
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
// @connect arc2000.florenceco.org
// @connect arcgis.atlantaregional.com
// @connect arcgis.cityofcapegirardeau.org
// @connect arcgis.co.beltrami.mn.us
// @connect arcgis.lakecountyohio.gov
// @connect arcgis.mobile311.com
// @connect arcgis.sd.gov
// @connect arcgis.sprocketcomm.com
// @connect arcgis.tampagov.net
// @connect arcgis.tuscaloosa-al.gov
// @connect arcgis.waxahachie.com
// @connect arcgis.wycokck.org
// @connect arcgis2.williamsoncounty-tn.gov
// @connect arcgis4.roktech.net
// @connect arcgisce.co.valencia.nm.us
// @connect arcgiswap01.ci.temple.tx.us
// @connect arcgisweb.co.fort-bend.tx.us
// @connect arcgisweb.countyofnewaygo.com
// @connect arcmobile.co.albany.wy.us
// @connect arcserv.co.washington.ar.us
// @connect arcserve1.hornershifrin.com
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
// @connect bcweb-adapters.bcpa.net
// @connect bentongis.integritygis.com
// @connect bradleytn.geopowered.com
// @connect broadbandgis.bakerprojects.com
// @connect bryangis.bryan-county.org
// @connect bsm.sfdpw.org
// @connect buchanangis.integritygis.com
// @connect c39gisserver.co.richland.nd.us
// @connect cache.gis.lacounty.gov
// @connect cagisonline.hamilton-co.org
// @connect calvertgis.co.cal.md.us
// @connect camdengis.integritygis.com
// @connect cassweb3.co.cass.mn.us
// @connect ccgisapps.charlestoncounty.org
// @connect cdsd.co.teller.co.us
// @connect cecilmaps.ccgov.org
// @connect cloud.longviewtexas.gov
// @connect cloud.sagis.org
// @connect co.kent.de.us
// @connect coagisweb.cabq.gov
// @connect coopergis.integritygis.com
// @connect copgisweb.ci.pearland.tx.us
// @connect crgis.cedar-rapids.org
// @connect data.wsdot.wa.gov
// @connect data1.digitaldataservices.com
// @connect dc-web.co.douglas.mn.us
// @connect doniphangis.integritygis.com
// @connect douglasgis.integritygis.com
// @connect douglasil.com
// @connect dtdapps.coloradodot.info
// @connect dungis.dunwoodyga.gov
// @connect egis.pinellascounty.org
// @connect elb2.39dn.com
// @connect emapsplus.com
// @connect epv.ci.juneau.ak.us
// @connect eservices.co.crook.or.us
// @connect essex-gis.co.essex.ny.us
// @connect ewebmap.ci.lubbock.tx.us
// @connect fremontgis.com
// @connect geaugarealink.co.geauga.oh.us
// @connect gem.edcgov.us
// @connect geo.forsythco.com
// @connect geo.nhcgov.com
// @connect geo.oit.ohio.gov
// @connect geodata.hawaii.gov
// @connect geodata.md.gov
// @connect geodata.sarpy.com
// @connect geodata.state.nj.us
// @connect geodataportal.net
// @connect geopowered.wilson.wilsontngis.com
// @connect geoservices.co.polk.or.us
// @connect geoweb.martin.fl.us
// @connect gis-2.warrencountyny.gov
// @connect gis-server.co.becker.mn.us
// @connect gis-server.co.montezuma.co.us
// @connect gis-web.co.union.nc.us
// @connect gis-world3.aacounty.org
// @connect gis.abilenetx.com
// @connect gis.acgov.org
// @connect gis.adamscounty.org
// @connect gis.aecomonline.net
// @connect gis.allencountyohio.com
// @connect gis.arapahoegov.com
// @connect gis.arkansas.gov
// @connect gis.arlingtonva.us
// @connect gis.ashland-ohio.com
// @connect gis.auglaizecounty.org
// @connect gis.azdot.gov
// @connect gis.baltimorecity.gov
// @connect gis.bentoncountyar.gov
// @connect gis.berkeleycountysc.gov
// @connect gis.bgky.org
// @connect gis.bisclient.com
// @connect gis.blairco.org
// @connect gis.brevardcounty.us
// @connect gis.brookhavenga.gov
// @connect gis.broomfield.org
// @connect gis.buncombecounty.org
// @connect gis.burleighco.com
// @connect gis.buttecounty.net
// @connect gis.calhouncounty.org
// @connect gis.canyonco.org
// @connect gis.carboncounty.com
// @connect gis.cayugacounty.us
// @connect gis.cccounty.us
// @connect gis.ccgisonline.com
// @connect gis.ccpa.net
// @connect gis.cherokeega.com
// @connect gis.citruspa.org
// @connect gis.cityofaikensc.gov
// @connect gis.cityofboston.gov
// @connect gis.clearfieldco.org
// @connect gis.clearwatercounty.org
// @connect gis.clevelandtn.gov
// @connect gis.cmpdd.org
// @connect gis.co.benton.or.us
// @connect gis.co.berks.pa.us
// @connect gis.co.big-stone.mn.us
// @connect gis.co.carlton.mn.us
// @connect gis.co.carver.mn.us
// @connect gis.co.cumberland.nc.us
// @connect gis.co.fillmore.mn.us
// @connect gis.co.fulton.pa.us
// @connect gis.co.guilford.nc.us
// @connect gis.co.hubbard.mn.us
// @connect gis.co.kandiyohi.mn.us
// @connect gis.co.kendall.il.us
// @connect gis.co.knox.il.us
// @connect gis.co.lancaster.pa.us
// @connect gis.co.mifflin.pa.us
// @connect gis.co.mille-lacs.mn.us
// @connect gis.co.monterey.ca.us
// @connect gis.co.nezperce.id.us
// @connect gis.co.polk.mn.us
// @connect gis.co.pope.mn.us
// @connect gis.co.roseau.mn.us
// @connect gis.co.santa-cruz.ca.us
// @connect gis.co.stearns.mn.us
// @connect gis.co.tuolumne.ca.us
// @connect gis.co.wadena.mn.us
// @connect gis.co.waseca.mn.us
// @connect gis.co.washington.ny.us
// @connect gis.co.ym.mn.gov
// @connect gis.coloradosprings.gov
// @connect gis.cosb.us
// @connect gis.countyofriverside.us
// @connect gis.cowleycounty.org
// @connect gis.cranstonri.org
// @connect gis.crawfordcountypa.net
// @connect gis.crookcounty.wy.gov
// @connect gis.dauphincounty.org
// @connect gis.dbqco.org
// @connect gis.dentoncounty.com
// @connect gis.dogis.org
// @connect gis.dot.state.oh.us
// @connect gis.douglascountyks.org
// @connect gis.douglascountywa.net
// @connect gis.dupageco.org
// @connect gis.dutchessny.gov
// @connect gis.eastgreenwichri.com
// @connect gis.ebparks.org
// @connect gis.elpasotexas.gov
// @connect gis.emmetcounty.org
// @connect gis.fnsb.us
// @connect gis.franklincountypa.gov
// @connect gis.fultoncountyga.gov
// @connect gis.fultoncountyoh.com
// @connect gis.fwb.org
// @connect gis.gallatin.mt.gov
// @connect gis.garfield-county.com
// @connect gis.gastongov.com
// @connect gis.gcppwa.net
// @connect gis.gilacountyaz.gov
// @connect gis.gocolumbiamo.com
// @connect gis.goshencounty.org
// @connect gis.gptx.org
// @connect gis.greenegovernment.com
// @connect gis.gscplanning.com
// @connect gis.hcpafl.org
// @connect gis.hendersonky.us
// @connect gis.hennepin.us
// @connect gis.in.gov
// @connect gis.interdev.com
// @connect gis.iowadot.gov
// @connect gis.ircgov.com
// @connect gis.itd.idaho.gov
// @connect gis.johnson-county.com
// @connect gis.johnsoncitytn.org
// @connect gis.kanawhacountyassessor.com
// @connect gis.kentcountymi.gov
// @connect gis.lakecountyfl.gov
// @connect gis.latah.id.us
// @connect gis.leecountyil.com
// @connect gis.leoc.net
// @connect gis.libertycountyga.com
// @connect gis.linncounty.org
// @connect gis.losalamosnm.us
// @connect gis.luzernecounty.org
// @connect gis.lyco.org
// @connect gis.maine.gov
// @connect gis.marinpublic.com
// @connect gis.marioncountyfl.org
// @connect gis.massdot.state.ma.us
// @connect gis.mcassessor.maricopa.gov
// @connect gis.missoulacounty.us
// @connect gis.mono.ca.gov
// @connect gis.mytoddcounty.com
// @connect gis.napa.ca.gov
// @connect gis.nassaucountyny.gov
// @connect gis.nccde.org
// @connect gis.nevadadot.com
// @connect gis.nevcounty.net
// @connect gis.newedgeservices.com
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
// @connect gis.parkcounty.org
// @connect gis.peoriacounty.org
// @connect gis.perryco.org
// @connect gis.personcounty.net
// @connect gis.pgatlas.com
// @connect gis.phila.gov
// @connect gis.pikepa.org
// @connect gis.pittcountync.gov
// @connect gis.plantation.org
// @connect gis.polkcountyiowa.gov
// @connect gis.pottcounty-ia.gov
// @connect gis.putnam-fl.com
// @connect gis.qac.org
// @connect gis.rcgov.org
// @connect gis.renvillecountymn.com
// @connect gis.rileycountyks.gov
// @connect gis.rrnm.gov
// @connect gis.sandyspringsga.gov
// @connect gis.sangis.org
// @connect gis.santacruzcountyaz.gov
// @connect gis.slocounty.ca.gov
// @connect gis.snco.us
// @connect gis.southkingstownri.com
// @connect gis.spokanecounty.org
// @connect gis.stancounty.com
// @connect gis.summitcountyco.gov
// @connect gis.tazewell.com
// @connect gis.thomsonreuters.com
// @connect gis.transportation.wv.gov
// @connect gis.tularecounty.ca.gov
// @connect gis.ulstercountyny.gov
// @connect gis.ventura.org
// @connect gis.weatherfordtx.gov
// @connect gis.whitfieldcountyga.com
// @connect gis.wilco.org
// @connect gis.wiu.edu
// @connect gis.worldviewsolutions.com
// @connect gis.wyo.gov
// @connect gis.yavapai.us
// @connect gis.yumacountyaz.gov
// @connect gis1.cookcountyil.gov
// @connect gis1.georgetowncountysc.org
// @connect gis1.hcpao.org
// @connect gis10.dot.ga.gov
// @connect gis11.services.ncdot.gov
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
// @connect gis3.gisworkshop.com
// @connect gis3.montgomerycountymd.gov
// @connect gis4.dfwmaps.com
// @connect gis4.montgomerycountymd.gov
// @connect gisago.mcgi.state.mi.us
// @connect gisapp.adcogov.org
// @connect gisapp.mahoningcountyoh.gov
// @connect gisdata.alleghenycounty.us
// @connect gisdata.dot.ca.gov
// @connect gisdata.kingcounty.gov
// @connect gisdemo1.cdmsmith.com
// @connect gisgate.co.clark.nv.us
// @connect gismap.augustaga.gov
// @connect gismap.cityofaspen.com
// @connect gismap.co.marshall.mn.us
// @connect gismap.co.norman.mn.us
// @connect gismap.eaglecounty.us
// @connect gismaps.cityofboise.org
// @connect gismaps.co.sangamon.il.us
// @connect gismaps.columbiapa.org
// @connect gismaps.flower-mound.com
// @connect gismaps.pinalcountyaz.gov
// @connect gismaps.snoco.org
// @connect gismaps.vita.virginia.gov
// @connect gismaps.wichita.gov
// @connect gismapserver.leegov.com
// @connect gisp.co.genesee.ny.us
// @connect gisprod10.co.fresno.ca.us
// @connect gisprodops.chesco.org
// @connect gisprpxy.itd.state.ma.us
// @connect gispub.cityofmesquite.com
// @connect gispublic.co.lake.ca.us
// @connect gissd.sandag.org
// @connect gisserver.christiancountymo.gov
// @connect gisserver1.co.teton.id.us
// @connect gisservicemt.gov
// @connect gisservices.chathamnc.org
// @connect gisservices.co.anoka.mn.us
// @connect gisservices.dorchestercounty.net
// @connect gisservices.douglasnv.us
// @connect gisservices.its.ny.gov
// @connect gisservices.oakgov.com
// @connect gisservices2.suffolkcountyny.gov
// @connect gissites2.centrecountypa.gov
// @connect gistech.countyofkane.org
// @connect gisweb.casscountynd.gov
// @connect gisweb.ci.boca-raton.fl.us
// @connect gisweb.co.aitkin.mn.us
// @connect gisweb.co.hinds.ms.us
// @connect gisweb.co.wilkin.mn.us
// @connect gisweb.jeffcowa.us
// @connect gisweb.miamidade.gov
// @connect gisweb.port-orange.org
// @connect gisweb2.azwater.gov
// @connect giswww.westchestergov.com
// @connect git.co.tioga.ny.us
// @connect grandgis.com
// @connect granitweb.sr.unh.edu
// @connect gtg.smcg.co.saint-marys.md.us
// @connect gweb01.co.olmsted.mn.us
// @connect harpergis.integritygis.com
// @connect harrisonms.geopowered.com
// @connect haslet.halff.com
// @connect helenamontanamaps.org
// @connect hgis.hialeahfl.gov
// @connect hidgis.co.hidalgo.tx.us
// @connect ims.districtiii.org
// @connect intervector.leoncountyfl.gov
// @connect iowagis.integritygis.com
// @connect ira.property-appraiser.org
// @connect jcgis.jacksongov.org
// @connect jeffcogis.jccal.org
// @connect jessie.rexburg.org
// @connect k3gis.com
// @connect kcearth.kcgov.us
// @connect kcgis.kcor.org
// @connect kingscountygis.com
// @connect kygisserver.ky.gov
// @connect lafayettegis.integritygis.com
// @connect lawrencegis.integritygis.com
// @connect lcmaps.lanecounty.org
// @connect leegis.leegov.com
// @connect lgmap.wdm.iowa.gov
// @connect lincolngis.integritygis.com
// @connect linkgis.org
// @connect lpcgis.laplata.co.us
// @connect macongis.co.macon.il.us
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
// @connect map7.incog.org
// @connect mapcache.friscotexas.gov
// @connect mapit.tarrantcounty.com
// @connect mapitwest.fortworthtexas.gov
// @connect mapp.co.cook.mn.us
// @connect mapping.adamscounty.us
// @connect mapping.cabellassessor.com
// @connect mapping.huntingdoncounty.net
// @connect mapping.modot.org
// @connect mappingmonroe.monroecounty.gov
// @connect maps.alexandriava.gov
// @connect maps.berkeleywv.org
// @connect maps.bonnercounty.us
// @connect maps.boonecountyil.org
// @connect maps.bouldercounty.org
// @connect maps.bryantx.gov
// @connect maps.butlercountyauditor.org
// @connect maps.casperwy.gov
// @connect maps.chautauquacounty.com
// @connect maps.ci.liberty.mo.us
// @connect maps.ci.sherman.tx.us
// @connect maps.cityhs.net
// @connect maps.cityofmobile.org
// @connect maps.claycountygov.com
// @connect maps.clermontauditor.org
// @connect maps.clintoncountypa.com
// @connect maps.co.blaine.id.us
// @connect maps.co.bonneville.id.us
// @connect maps.co.butler.pa.us
// @connect maps.co.forsyth.nc.us
// @connect maps.co.goodhue.mn.us
// @connect maps.co.gov
// @connect maps.co.grayson.tx.us
// @connect maps.co.itasca.mn.us
// @connect maps.co.jefferson.id.us
// @connect maps.co.kern.ca.us
// @connect maps.co.palm-beach.fl.us
// @connect maps.co.pueblo.co.us
// @connect maps.co.ramsey.mn.us
// @connect maps.co.routt.co.us
// @connect maps.co.shasta.ca.us
// @connect maps.co.washington.mn.us
// @connect maps.co.yellowstone.mt.gov
// @connect maps.coj.net
// @connect maps.crc.ga.gov
// @connect maps.cstx.gov
// @connect maps.dcad.org
// @connect maps.dekalbcountyga.gov
// @connect maps.deltacounty.com
// @connect maps.deschutes.org
// @connect maps.desotocountyms.gov
// @connect maps.dmgov.org
// @connect maps.donaanacounty.org
// @connect maps.escpa.org
// @connect maps.flathead.mt.gov
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
// @connect maps.lincolncountysd.org
// @connect maps.maurycounty-tn.gov
// @connect maps.mckinneytexas.org
// @connect maps.meshekgis.com
// @connect maps.miamigov.com
// @connect maps.nashville.gov
// @connect maps.nassauflpa.com
// @connect maps.ocpafl.org
// @connect maps.outdoornebraska.gov
// @connect maps.palmcoastgov.com
// @connect maps.parkco.us
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
// @connect maps.vcgov.org
// @connect maps.vermont.gov
// @connect maps.wakegov.com
// @connect maps.washco-md.net
// @connect maps1.larimer.org
// @connect maps2.bgadd.org
// @connect maps2.cattco.org
// @connect maps2.dcgis.dc.gov
// @connect maps2.timmons.com
// @connect maps2.yorkcountygov.com
// @connect maps3.murfreesborotn.gov
// @connect mapsdev.hamiltontn.gov
// @connect mapserver.co.calaveras.ca.us
// @connect mapservices.gis.saccounty.net
// @connect mapservices.legis.wisconsin.gov
// @connect mapservices2.jeffco.us
// @connect mapsonline.columbiacountyga.gov
// @connect mcggis.mcgtn.org
// @connect mcgis.mesacounty.us
// @connect mcgis.mohavecounty.us
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
// @connect oak.co.lake-of-the-woods.mn.us
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
// @connect pimamaps.pima.gov
// @connect polaris3g.mecklenburgcountync.gov
// @connect prodmaps.ne.gov
// @connect propaccess.traviscad.org
// @connect propaccess.wadtx.com
// @connect propertyrecords.montcopa.org
// @connect propertyviewer.andersoncountysc.org
// @connect psportal.harrisoncountywv.com
// @connect publicmap.co.st-clair.il.us
// @connect qagis1.sanantonio.gov
// @connect rallsgis.integritygis.com
// @connect rapcgis.rapc.info
// @connect raygis.integritygis.com
// @connect regis.solanocounty.com
// @connect renogis3.renogov.org
// @connect romefloyd.agdmaps.com
// @connect rptsgisweb.oswegocounty.com
// @connect sagiscloud.thempc.org
// @connect scgis.siouxcounty.org
// @connect secure.boonecountygis.com
// @connect seminolearcgis.seminolecountyfl.gov
// @connect server1.mapxpress.net
// @connect server2.mapxpress.net
// @connect services.arcgis.com
// @connect services.ccgisc.org
// @connect services.geoviewer8.com
// @connect services.gis.ca.gov
// @connect services.nconemap.gov
// @connect services.putnamco.org
// @connect services.wvgis.wvu.edu
// @connect services1.arcgis.com
// @connect services2.arcgis.com
// @connect services2.bhamaps.com
// @connect services2.integritygis.com
// @connect services3.arcgis.com
// @connect services5.arcgis.com
// @connect services6.arcgis.com
// @connect services7.arcgis.com
// @connect services9.arcgis.com
// @connect sjmap.org
// @connect spatial.gishost.com
// @connect spatial.jacksoncounty.org
// @connect springsgis.coralsprings.org
// @connect stlgis.stlouis-mo.gov
// @connect summitmaps.summitoh.net
// @connect svr4.sumtercountysc.org
// @connect tigerweb.geo.census.gov
// @connect tiptontn.geopowered.com
// @connect tlcgisinter.leoncountyfl.gov
// @connect tn.hardeman.geopowered.com
// @connect tn.mcminn.geopowered.com
// @connect tn.sumner.geopowered.com
// @connect tnmap.tn.gov
// @connect tsc-gis-ags101a.schneidercorp.com
// @connect utility.arcgis.com
// @connect vernongis.integritygis.com
// @connect w04.co.delaware.pa.us
// @connect wallawallagis.com
// @connect wcgisweb.washoecounty.us
// @connect wcsvrgis.washcopa.org
// @connect web3.kcsgis.com
// @connect weba.co.clayton.ga.us
// @connect webdmz.starkcountyohio.gov
// @connect webgis.bcgov.net
// @connect webgis.bedfordcountyva.gov
// @connect webgis.co.humboldt.ca.us
// @connect webgis.okaloosafl.com
// @connect webgis.providenceri.gov
// @connect webmap.co.hood-river.or.us
// @connect webmap.co.jackson.ms.us
// @connect webmap.jeffparish.net
// @connect webmap.trueautomation.com
// @connect webmap1.co.warren.oh.us
// @connect webmapssecure.ewashtenaw.org
// @connect webserverholis.honolulugis.org
// @connect wfs.ksdot.org
// @connect ww1.bucoks.com
// @connect www.1stdistrict.org
// @connect www.adacountyassessor.org
// @connect www.adamscountyarcserver.com
// @connect www.ancgis.com
// @connect www.bcad.org
// @connect www.bcgis.com
// @connect www.centralilmaps.com
// @connect www.co.bingham.id.us
// @connect www.co.chippewa.mn.us
// @connect www.co.steele.mn.us
// @connect www.cobbgis.org
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
// @connect www.landmarkgeospatial.com
// @connect www.laurenscountygis.org
// @connect www.loraincountyauditor.com
// @connect www.mcegisohio.org
// @connect www.mcgisweb.org
// @connect www.mchenrycountygis.org
// @connect www.mercercountyohio.org
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
// @connect www.unionco.org
// @connect www.valorgis.com
// @connect www.wcgis.us
// @connect www.webgis.net
// @connect www.wingis.org
// @connect www2.pottcounty.org
// @connect www3.multco.us
// @connect www4.co.union.oh.us
// @connect yolo-gis-prod.yolocounty.org
// @downloadURL https://update.greasyfork.org/scripts/373952/WME%20GIS%20Layers%20-%20Alt%20County%20Layer.user.js
// @updateURL https://update.greasyfork.org/scripts/373952/WME%20GIS%20Layers%20-%20Alt%20County%20Layer.meta.js
// ==/UserScript==

/* global OL */
/* global W */
/* global GM_info */
/* global WazeWrap */
/* global _ */
/* global $ */

(function() {
    // **************************************************************************************************************
    // IMPORTANT: Update this when releasing a new version of script that includes changes to the spreadsheet format
    //            that may cause old code to break.  This # should match the version listed in the spreadsheet
    //            i.e. update them at the same time.

    const LAYER_DEF_VERSION = '2018.04.27.001';

    // **************************************************************************************************************

    const SCRIPT_AUTHOR = 'MapOMatic'; // Used in tooltips to tell people who to report issues to.  Update if a new author takes ownership of this script.
    const LAYER_INFO_URL = 'https://spreadsheets.google.com/feeds/list/1cEG3CvXSCI4TOZyMQTI50SQGbVhJ48Xip-jjWg4blWw/o7gusx3/public/values?alt=json';
    const LAYER_DEF_URL = 'https://spreadsheets.google.com/feeds/list/1cEG3CvXSCI4TOZyMQTI50SQGbVhJ48Xip-jjWg4blWw/oj7k5j6/public/values?alt=json';
    const PRIVATE_LAYERS = {'nc-henderson-sl-signs': ['the_cre8r','mapomatic']}; // case sensitive -- use all lower case

    const DEFAULT_STYLE = {
        fillColor: '#000',
        pointRadius: 4,
        label : '${label}',
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
        structures: {
            fillOpacity: 0,
            strokeColor: '#f7f',
            fontColor: '#f7f'
        }
    };

    const ROAD_STYLE = new OL.Style(
        {
            pointRadius: 12,
            fillColor:'#369',
            pathLabel: '${label}',
            label:'',
            fontColor:'#faf',
            labelSelect: true,
            pathLabelYOffset:'${getOffset}',
            pathLabelCurve: '${getSmooth}',
            pathLabelReadable: '${getReadable}',
            labelAlign: '${getAlign}',
            labelOutlineWidth: 3,
            labelOutlineColor: '#000',
            strokeWidth:3,
            stroke:true,
            strokeColor:'#f0f',
            strokeOpacity: 0.4,
            fontWeight: 'bold',
            fontSize: 16
        }, {
            context: {
                getOffset: function() { return -(W.map.getZoom()+5); },
                getSmooth: function() { return ''; },
                getReadable: function() { return '1'; },
                getAlign: function() { return 'cb'; }
            }
        }
    );

    let _regexReplace = {
        // Strip leading zeros or blank full label for any label starting with a non-digit or is a Zero Address, use with '' as replace.
        r0: /^(0+(\s.*)?|\D.*)/,
        // Strip Everything After Street Type to end of the string by use $1 and $2 capture groups, use with replace '$1$2'
        r1: /^(.* )(Ave(nue)?|Dr(ive)?|St(reet)?|C(our)?t|Cir(cle)?|Blvd|Boulevard|Pl(ace)?|Ln|Lane|Fwy|Freeway|R(oa)?d|Ter(r|race)?|Tr(ai)?l|Way|Rte \d+|Route \d+)\b.*/gi,
        // Strip SPACE 5 Digits from end of string, use with replace ''
        r2: /\s\d{5}$/,
        // Strip Everything after a "~", ",", ";" to the end of the string, use with replace ''
        r3: /(~|,|;|\s?\r\n).*$/,
        // Move the digits after the last space to before the rest of the string using, use with replace '$2 $1'
        r4: /^(.*)\s(\d+).*/,
        // Insert newline between digits (including "-") and everything after the digits, except (and before) a ",", use with replace '$1\n$2'
        r5: /^([-\d]+)\s+([^,]+).*/,
        // Insert newline between digits and everything after the digits, use with replace '$1\n$2'
        r6: /^(\d+)\s+(.*)/
    };

    let _gisLayers = [];

    let _layerRefinements = [
        {id: 'us-post-offices',
         labelHeaderFields: ['LOCALE_NAME']
        },

        {id: 'ky-warren-co-wku-structures',
         labelHeaderFields: ['Bldg_Name']
        }
    ];

    const STATES = {
        _states:[
            ['US (Country)','US',-1],['Alabama','AL',1],['Alaska','AK',2],['American Samoa','AS',60],['Arizona','AZ',4],['Arkansas','AR',5],['California','CA',6],['Colorado','CO',8],['Connecticut','CT',9],['Delaware','DE',10],['District of Columbia','DC',11],
            ['Florida','FL',12],['Georgia','GA',13],['Guam','GU',66],['Hawaii','HI',15],['Idaho','ID',16],['Illinois','IL',17],['Indiana','IN',18],['Iowa','IA',19],['Kansas','KS',20],
            ['Kentucky','KY',21],['Louisiana','LA',22],['Maine','ME',23],['Maryland','MD',24],['Massachusetts','MA',25],['Michigan','MI',26],['Minnesota','MN',27],['Mississippi','MS',28],['Missouri','MO',29],
            ['Montana','MT',30],['Nebraska','NE',31],['Nevada','NV',32],['New Hampshire','NH',33],['New Jersey','NJ',34],['New Mexico','NM',35],['New York','NY',36],['North Carolina','NC',37],['North Dakota','ND',38],
            ['Northern Mariana Islands','MP',69],['Ohio','OH',39],['Oklahoma','OK',40],['Oregon','OR',41],['Pennsylvania','PA',42],['Puerto Rico','PR',72],['Rhode Island','RI',44],['South Carolina','SC',45],
            ['South Dakota','SD',46],['Tennessee','TN',47],['Texas','TX',48],['Utah','UT',49],['Vermont','VT',50],['Virgin Islands','VI',78],['Virginia','VA',51],['Washington','WA',53],['West Virginia','WV',54],['Wisconsin','WI',55],['Wyoming','WY',56]
        ],
        toAbbr: function(fullName) { return this._states.find(a => a[0] === fullName)[1]; },
        toFullName: function(abbr) { return this._states.find(a => a[1] === abbr)[0]; },
        toFullNameArray: function() { return this._states.map(a => a[0]); },
        toAbbrArray: function() { return this._states.map(a => a[1]); },
        fromId: function(id) { return this._states.find(a => a[2] === id); }
    };
    const DEFAULT_VISIBLE_AT_ZOOM = 6;
    const SETTINGS_STORE_NAME = 'wme_gis_layers_fl';
    //const COUNTIES_URL = 'https://tigerweb.geo.census.gov/arcgis/rest/services/Census2010/State_County/MapServer/1/';
    const COUNTIES_URL = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Counties/FeatureServer/0/';
    const ALERT_UPDATE = false;
    const SCRIPT_VERSION = GM_info.script.version;
    const SCRIPT_VERSION_CHANGES = [
        GM_info.script.name + '\nv' + SCRIPT_VERSION + '\n\nWhat\'s New\n------------------------------\n',
        '\n- Update for new WME layers menu.'
    ].join('');
    let _mapLayer = null;
    let _roadLayer = null;
    let _settings = {};
    let _ignoreFetch = false;
    let _lastToken = {};

    const DEBUG = true;
    function log(message) { console.log('GIS Layers:', message); }
    function logError(message) { console.error('GIS Layers:', message); }
    function logDebug(message) { if (DEBUG) console.debug('GIS Layers:', message); }
    function logWarning(message) { console.warn('GIS Layers:', message); }

    function loadSettingsFromStorage() {
        let loadedSettings = $.parseJSON(localStorage.getItem(SETTINGS_STORE_NAME));
        let defaultSettings = {
            lastVersion: null,
            visibleLayers: [],
            onlyShowApplicableLayers: false,
            selectedStates: [],
            enabled: true,
            fillParcels: false,
            addrLabelDisplay: 'all'
        };
        _settings = loadedSettings ? loadedSettings : defaultSettings;
        for (let prop in defaultSettings) {
            if (!_settings.hasOwnProperty(prop)) {
                _settings[prop] = defaultSettings[prop];
            }
        }
    }

    function saveSettingsToStorage() {
        if (localStorage) {
            _settings.lastVersion = SCRIPT_VERSION;
            localStorage.setItem(SETTINGS_STORE_NAME, JSON.stringify(_settings));
            log('Settings saved');
        }
    }

    function getUrl(extent, gisLayer) {
        if (gisLayer.spatialReference) {
            let proj = new OL.Projection('EPSG:' + gisLayer.spatialReference);
            extent.transform(W.map.getProjection(), proj);
        }
        let geometry = { xmin:extent.left, ymin:extent.bottom, xmax:extent.right, ymax:extent.top, spatialReference: {wkid: gisLayer.spatialReference ? gisLayer.spatialReference : 102100, latestWkid: gisLayer.spatialReference ? gisLayer.spatialReference : 3857} };
        let geometryStr = JSON.stringify(geometry);
        let url = gisLayer.url + '/query?geometry=' + encodeURIComponent(geometryStr);
        let fields = gisLayer.labelFields;
        if (gisLayer.labelHeaderFields) {
            fields = fields.concat(gisLayer.labelHeaderFields);
        }
        if (gisLayer.distinctFields) {
            fields = fields.concat(gisLayer.distinctFields);
        }
        url += gisLayer.token ? '&token=' + gisLayer.token : '';
        url += '&outFields=' + encodeURIComponent(fields.join(','));
        url += '&returnGeometry=true';
        url += '&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=' + (gisLayer.spatialReference ? gisLayer.spatialReference : '102100') + '&outSR=3857&f=json';
        if (gisLayer.where) {
            url += '&where=' + encodeURIComponent(gisLayer.where);
        }
        logDebug('Request URL: ' + url);
        return url;
    }

    function getCountiesUrl(extent) {
        let geometry = { xmin:extent.left, ymin:extent.bottom, xmax:extent.right, ymax:extent.top, spatialReference: {wkid: 102100, latestWkid: 3857} };
        let url = COUNTIES_URL + '/query?geometry=' + encodeURIComponent(JSON.stringify(geometry));
        //return url + '&outFields=BASENAME%2CSTATE&returnGeometry=false&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=102100&outSR=3857&f=json';
        return url + '&outFields=NAME%2CSTATE_FIPS&returnGeometry=false&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=102100&outSR=3857&f=json';
        //return url + '&outFields=NAME&returnGeometry=false&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=102100&outSR=3857&f=json';
    }

    let _countiesInExtent = [];
    let _statesInExtent = [];

    function getFetchableLayers(getInvisible) {
        return _gisLayers.filter(gisLayer => {
            let isValidUrl = gisLayer.url && gisLayer.url.trim().length > 0;
            let isVisible = (getInvisible || _settings.visibleLayers.indexOf(gisLayer.id) > -1) && _settings.selectedStates.indexOf(gisLayer.state) > -1;
            let isInState = gisLayer.state === 'US' || _statesInExtent.indexOf(STATES.toFullName(gisLayer.state)) > -1;
            // Be sure to use hasOwnProperty when checking this, since 0 is a valid value.
            let isValidZoom = getInvisible || W.map.getZoom() >= (gisLayer.hasOwnProperty('visibleAtZoom') ? gisLayer.visibleAtZoom : DEFAULT_VISIBLE_AT_ZOOM);
            return isValidUrl && isInState && isVisible && isValidZoom;
        });
    }

    function filterLayerCheckboxes() {
        let applicableLayers = getFetchableLayers(true).filter(layer => {
            let hasCounties = layer.hasOwnProperty('counties');
            return (hasCounties && layer.counties.some(county => _countiesInExtent.indexOf(county.toLowerCase()) > -1)) || !hasCounties;
        });
        var statesToHide = STATES.toAbbrArray();

        _gisLayers.forEach(gisLayer => {
            let id = '#gis-layer-' + gisLayer.id + '-container';
            if(!_settings.onlyShowApplicableLayers || applicableLayers.indexOf(gisLayer) > -1){
                $(id).show();
                $('#gis-layers-for-' + gisLayer.state).show();
                let idx = statesToHide.indexOf(gisLayer.state);
                if (idx > -1) statesToHide.splice(idx, 1);
            } else {
                $(id).hide();
            }
        });
        if (_settings.onlyShowApplicableLayers) {
            statesToHide.forEach(st => $('#gis-layers-for-' + st).hide());
        }
    }

    const ROAD_ABBR = [[/\bAVENUE$/,'AVE'], [/\bCIRCLE$/,'CIR'], [/\bCOURT$/,'CT'], [/\bDRIVE$/,'DR'], [/\bLANE$/,'LN'], [/\bPARK$/,'PK'], [/\bPLACE$/,'PL'], [/\bROAD$/,'RD'], [/\bSTREET$/,'ST'],  [/\bTERRACE$/,'TER']];
    function processFeatures(data, token, gisLayer) {
        let features = [];
        if (data.skipIt) {
            // do nothing
        } else if (data.error) {
            logError('Error in layer "' + gisLayer.name + '": ' + data.error.message);
        } else {
            let items = data.features;
            if (!token.cancel) {
                let error = false;
                let distinctValues = [];
                items.forEach(item => {
                    let skipIt = false;
                    if (!token.cancel && !error) {
                        let feature;
                        let featureGeometry;
                        let area;
                        if (gisLayer.distinctFields) {
                            if (distinctValues.some( v => gisLayer.distinctFields.every(fld => v[fld] === item.attributes[fld]) )) {
                                skipIt = true;
                            } else {
                                let dist = {};
                                gisLayer.distinctFields.forEach(fld => dist[fld] = item.attributes[fld]);
                                distinctValues.push(dist);
                            }
                        }
                        if (!skipIt) {
                            let layerOffset = gisLayer.layerOffset ? gisLayer.layerOffset : {x: 0, y: 0};
                            // Special handling for this layer, because it doesn't have a geometry property.  Coordinates are stored in the attributes.
                            if (gisLayer.id === 'nc-richmond-co-pts') {
                                let pt = new OL.Geometry.Point(item.attributes.XCOOR, item.attributes.YCOOR);
                                pt.transform(W.map.displayProjection, W.map.projection);
                                item.geometry = pt;
                            }
                            if (item.geometry) {
                                if (item.geometry.x) {
                                    featureGeometry = new OL.Geometry.Point(item.geometry.x + layerOffset.x, item.geometry.y + layerOffset.y);
                                } else if (item.geometry.points) {
                                    // @TODO Fix for multiple points instead of just grabbing first.
                                    featureGeometry = new OL.Geometry.Point(item.geometry.points[0][0] + layerOffset.x, item.geometry.points[0][1] + layerOffset.y);
                                } else if (item.geometry.rings) {
                                    let rings = [];
                                    item.geometry.rings.forEach(function(ringIn) {
                                        let pnts= [];
                                        for(let i=0;i<ringIn.length;i++){
                                            pnts.push(new OL.Geometry.Point(ringIn[i][0] + layerOffset.x, ringIn[i][1] + layerOffset.y));
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
                                    let pointList = [];
                                    item.geometry.paths.forEach(function(path){
                                        path.forEach(point => pointList.push(new OL.Geometry.Point(point[0] + layerOffset.x, point[1] + layerOffset.y)));
                                    });
                                    featureGeometry = new OL.Geometry.LineString(pointList);
                                    featureGeometry.skipDupeCheck = true;
                                } else {
                                    logDebug('Unexpected feature type in layer: ' + JSON.stringify(item));
                                    logError('Error: Unexpected feature type in layer "' + gisLayer.name + '"');
                                    error = true;
                                }
                                if (!error) {
                                    let hasVisibleAtZoom = gisLayer.hasOwnProperty('visibleAtZoom');
                                    let hasLabelsVisibleAtZoom = gisLayer.hasOwnProperty('labelsVisibleAtZoom');
                                    let displayLabelsAtZoom = hasLabelsVisibleAtZoom ? gisLayer.labelsVisibleAtZoom : (hasVisibleAtZoom ? gisLayer.visibleAtZoom : DEFAULT_VISIBLE_AT_ZOOM) + 1;
                                    let label = '';
                                    if (gisLayer.labelHeaderFields) {
                                        label = gisLayer.labelHeaderFields.map(fieldName => item.attributes[fieldName]).join(' ').trim() + '\n';
                                    }
                                    if (W.map.getZoom() >= displayLabelsAtZoom || area >= 5000) {
                                        label += gisLayer.labelFields.map(fieldName => item.attributes[fieldName]).join(' ').trim();
                                        if (gisLayer.processLabel) label = gisLayer.processLabel(label, item.attributes).trim();
                                    }
                                    if (label && [LAYER_STYLES.points, LAYER_STYLES.parcels, LAYER_STYLES.state_points, LAYER_STYLES.state_parcels].indexOf(gisLayer.style) > -1) {
                                        if (_settings.addrLabelDisplay === 'hn') {
                                            let m = label.match(/^\d+/);
                                            label = m ? m[0] : '';
                                        } else if (_settings.addrLabelDisplay === 'street') {
                                            let m = label.match(/^(?:\d+\s)?(.*)/);
                                            label = m ? m[1].trim() : '';
                                        }
                                    }
                                    let attributes = {
                                        layerID: gisLayer.id,
                                        label: label
                                    };
                                    feature = new OL.Feature.Vector(featureGeometry,attributes);
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
            for (let i=0; i<features.length; i++) {
                let f1 = features[i];
                if (!f1.geometry.skipDupeCheck) {
                    let c1 = f1.geometry.getCentroid();
                    let labels = [f1.attributes.label];
                    for (let j=i+1; j<features.length; j++) {
                        let f2 = features[j];
                        if (!f2.geometry.skipDupeCheck && f2.geometry.getCentroid().distanceTo(c1) < 1) {
                            features.splice(j,1);
                            labels.push(f2.attributes.label);
                            j--;
                        }
                    }
                    labels = _.unique(labels);
                    if (labels.length > 1) {
                        labels.forEach((label, idx) => {
                            label = label.replace(/\n/g,' ').replace(/\s{2,}/,' ').replace(/\bUNIT\s.{1,5}$/i,'').trim();
                            ROAD_ABBR.forEach(abbr => label = label.replace(abbr[0], abbr[1]));
                            labels[idx] = label;
                        });
                        labels = _.unique(labels);
                        labels.sort();
                        if (labels.length > 12) {
                            let len = labels.length;
                            labels = labels.slice(0,10);
                            labels.push('(' + (len - 10) + ' more...)');
                        }
                        f1.attributes.label = _.unique(labels).join('\n');
                    } else {
                        let label = f1.attributes.label;
                        ROAD_ABBR.forEach(abbr => label = label.replace(abbr[0], abbr[1]));
                        f1.attributes.label = label;
                    }
                }
            }

            let layer = gisLayer.isRoadLayer ? _roadLayer : _mapLayer;
            layer.removeFeatures(layer.getFeaturesByAttribute('layerID', gisLayer.id));
            layer.addFeatures(features);

            if (features.length) {
                $('label[for="gis-layer-' + gisLayer.id + '"]').css({color:'#00a009'});
            }
        }
    }  // END processFeatures()

    function fetchFeatures() {
        if (_ignoreFetch) return;
        _lastToken.cancel = true;
        _lastToken = {cancel: false, features: [], layersProcessed: 0};
        $('.gis-state-layer-label').css({'color':'#777'});

        let _layersCleared = false;

        //if (layersToFetch.length) {
            let extent = W.map.getExtent();
            GM_xmlhttpRequest({
                url: getCountiesUrl(extent),
                method: 'GET',
                onload: function(res) {
                    if (res.status < 400) {
                        let data = $.parseJSON(res.responseText);
                        if (data.error) {
                            logError('Error in US Census counties data: ' + data.error.message);
                        } else {
                            //_countiesInExtent = data.features.map(feature => feature.attributes.BASENAME.toLowerCase());
                            _countiesInExtent = data.features.map(feature => feature.attributes.NAME.toLowerCase());
                            logDebug('US Census counties: ' + _countiesInExtent.join(', '));
                            //_statesInExtent = _.unique(data.features.map(feature => STATES.fromId(parseInt(feature.attributes.STATE))[0]));
                            _statesInExtent = _.unique(data.features.map(feature => STATES.fromId(parseInt(feature.attributes.STATE_FIPS))[0]));

                            let layersToFetch;
                            if (!_layersCleared) {
                                _layersCleared = true;
                                 layersToFetch = getFetchableLayers();

                                // Remove features of any layers that won't be mapped.
                                _gisLayers.forEach(gisLayer => {
                                    if (layersToFetch.indexOf(gisLayer) === -1)  {
                                        _mapLayer.removeFeatures(_mapLayer.getFeaturesByAttribute('layerID', gisLayer.id));
                                        _roadLayer.removeFeatures(_roadLayer.getFeaturesByAttribute('layerID', gisLayer.id));
                                    }
                                });
                            }

                            layersToFetch = layersToFetch.filter( layer => !layer.hasOwnProperty('counties') || layer.counties.some(county => _countiesInExtent.indexOf(county.toLowerCase()) > -1) );
                            filterLayerCheckboxes();
                            logDebug('Fetching ' + layersToFetch.length + ' layers...');
                            logDebug(layersToFetch);
                            layersToFetch.forEach(gisLayer => {
                                let url = getUrl(extent, gisLayer);
                                GM_xmlhttpRequest({
                                    url: url,
                                    context: _lastToken,
                                    method: 'GET',
                                    onload: function(res) {
                                        if (res.status < 400) { // Handle stupid issue where http 4## is considered success //
                                            processFeatures($.parseJSON(res.responseText), res.context, gisLayer);
                                        } else {
                                            logDebug('HTTP request error: ' + JSON.stringify(res));
                                            logError('Could not fetch layer "' + gisLayer.id + '". Request returned ' + res.status);
                                        }},
                                    onerror: function(res) {
                                        logDebug('xmlhttpRequest error:' + JSON.stringify(res));
                                        logError('Could not fetch layer "' + gisLayer.id + '". An error was thrown.');
                                    }
                                });
                            });
                        }
                    } else {
                        logDebug('HTTP request error: ' + JSON.stringify(res));
                        logError('Could not fetch counties from US Census site.  Request returned ' + res.status);
                    }
                },
                onerror: function(res) {
                    logDebug('xmlhttpRequest error:' + JSON.stringify(res));
                    logError('Could not fetch counties from US Census site.  An error was thrown.');
                }
            });
        //} else {
        //    filterLayerCheckboxes();
        //}
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
        let color = value ? '#00bd00' : '#ccc';
        $('span#gis-layers-power-btn').css({color:color});
        if (value) fetchFeatures();
        $('#layer-switcher-item_gis_layers').prop('checked',value);
    }

    function onLayerToggleChanged(checked, layerID) {
        let idx = _settings.visibleLayers.indexOf(layerID);
        if (checked) {
            if (idx === -1) _settings.visibleLayers.push(layerID);
        } else {
            if (idx > -1) _settings.visibleLayers.splice(idx, 1);
        }
        if (!_ignoreFetch) {
            saveSettingsToStorage();
            fetchFeatures();
        }
    }

    function onOnlyShowApplicableLayersChanged(checked) {
        _settings.onlyShowApplicableLayers = checked;
        saveSettingsToStorage();
        fetchFeatures();
    }

    function onStateCheckChanged(checked, st) {
        let idx = _settings.selectedStates.indexOf(st);
        if (checked) {
            if (idx === -1) _settings.selectedStates.push(st);
        } else {
            if (idx > -1) _settings.selectedStates.splice(idx, 1);
        }
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

    function onFillParcelsCheckedChanged(checked) {
        setFillParcels(checked);
        _settings.fillParcels = checked;
        saveSettingsToStorage();
        fetchFeatures();
    }

    function onMapMove() {
        if (_settings.enabled) fetchFeatures();
    }

    function initLayer(){
        let rules = _gisLayers.map(gisLayer => {
            return new OL.Rule({
                filter: new OL.Filter.Comparison({
                    type: OL.Filter.Comparison.EQUAL_TO,
                    property: 'layerID',
                    value: gisLayer.id
                }),
                symbolizer: gisLayer.style
            });
        });

        setFillParcels(_settings.fillParcels);

        let style = new OL.Style(DEFAULT_STYLE, { rules: rules } );

        _mapLayer = new OL.Layer.Vector('GIS Layers - Default', {
            uniqueName: 'wmeGISLayersDefault',
            styleMap: new OL.StyleMap(style)
        });

        _roadLayer = new OL.Layer.Vector('GIS Layers - Roads', {
            uniqueName: 'wmeGISLayersRoads',
            styleMap: new OL.StyleMap(ROAD_STYLE)
        });

        _mapLayer.setVisibility(_settings.enabled);
        _roadLayer.setVisibility(_settings.enabled);

        W.map.addLayer(_roadLayer);
        W.map.addLayer(_mapLayer);

    } // END InitLayer

    function initLayersTab() {
        let user = W.loginManager.user.userName.toLowerCase();
        let states = _.uniq(_gisLayers.map(l => l.state)).filter(st => _settings.selectedStates.indexOf(st) > -1);
        $('#panel-gis-state-layers').empty();
        $('#panel-gis-state-layers').append(
            $('<div>', {class: 'controls-container'}).css({'padding-top':'2px'}).append(
                $('<input>', {type:'checkbox', id:'only-show-applicable-gis-layers'}).change(function() { onOnlyShowApplicableLayersChanged($(this).is(':checked')); }).prop('checked', _settings.onlyShowApplicableLayers),
                $('<label>', {for:'only-show-applicable-gis-layers'}).css({'white-space':'pre-line'}).text('Only show applicable layers')
            ),
            $('.gis-layers-state-checkbox:checked').length === 0 ? $('<div>').text('Turn on layer categories in the Settings tab.') : states.map(st => {
                return $('<fieldset>', {id:'gis-layers-for-' + st, style:'border:1px solid silver;padding:8px;border-radius:4px;-webkit-padding-before: 0;'}).append(
                    $('<legend>', {style:'margin-bottom:0px;border-bottom-style:none;width:auto;'}).append($('<i>', {class:'fa fa-fw fa-chevron-down', style:'cursor: pointer;font-size: 12px;margin-right: 4px'}).click(function() {
                        $(this).toggleClass('fa fa-fw fa-chevron-down');
                        $(this).toggleClass('fa fa-fw fa-chevron-right');
                        $(`#${st}_body`).toggleClass('collapse');
                    }), $('<span>', {style:'font-size:14px;font-weight:600;text-transform: uppercase;'}).text(STATES.toFullName(st))),
                    $('<div>', {id:`${st}_body`}).append(
                        $('<div>').css({'font-size':'11px'}).append(
                            $('<span>').append(
                                'Select ',
                                $('<a>', {href:'#'}).text('All').click(function(){
                                    _ignoreFetch = true;
                                    $(this).closest('fieldset').find('input').prop('checked', false).trigger('click');
                                    _ignoreFetch = false;
                                    saveSettingsToStorage();
                                    fetchFeatures();
                                }),
                                ' / ',
                                $('<a>', {href:'#'}).text('None').click(function(){
                                    _ignoreFetch = true;
                                    $(this).closest('fieldset').find('input').prop('checked', true).trigger('click');
                                    _ignoreFetch = false;
                                    saveSettingsToStorage();
                                    fetchFeatures();
                                })
                            )
                        ),
                        $('<div>', {class:'controls-container', style:'padding-top:0px;'}).append(
                            _gisLayers.filter(l => (l.state === st && (!PRIVATE_LAYERS.hasOwnProperty(l.id) || PRIVATE_LAYERS[l.id].indexOf(user) > -1))).map(gisLayer => {
                                let id = 'gis-layer-' + gisLayer.id;
                                return $('<div>', {class: 'controls-container', id: id+'-container'}).css({'padding-top':'2px', 'display':'block'}).append(
                                    $('<input>', {type:'checkbox', id:id}).change(function() { onLayerToggleChanged($(this).is(':checked'), gisLayer.id); }).prop('checked', _settings.visibleLayers.indexOf(gisLayer.id) > -1),
                                    $('<label>', {for:id, class:'gis-state-layer-label'}).css({'white-space':'pre-line'}).text(gisLayer.name)
                                );
                            })
                        )
                    )
                );
            })
        );
    }

    function initSettingsTab() {
        let states = _.uniq(_gisLayers.map(l => l.state));
        let createRadioBtn = (name, value, text, checked) => {
            let id = `${name}-${value}`;
            return [$('<input>', {type:'radio', id:id, name:name, value:value}).prop('checked',checked),$('<label>', {for:id}).text(text).css({paddingLeft:'15px', marginRight:'4px'})];
        };
        $('#panel-gis-layers-settings').append(
            $('<fieldset>', {style:'border:1px solid silver;padding:8px;border-radius:4px;-webkit-padding-before: 0;'}).append(
                $('<legend>', {style:'margin-bottom:0px;border-bottom-style:none;width:auto;'}).append($('<span>', {style:'font-size:14px;font-weight:600;text-transform: uppercase;'}).text('Labels')),
                $('<div>', {id:'labelSettings'}).append(
                    $('<div>', {class: 'controls-container'}).css({'padding-top':'2px'}).append(
                        $('<label>',{style:'font-weight:normal;'}).text('Addresses:'),
                        createRadioBtn('gisAddrDisplay', 'hn', 'HN', _settings.addrLabelDisplay === 'hn'),
                        createRadioBtn('gisAddrDisplay', 'street', 'Street', _settings.addrLabelDisplay === 'street'),
                        createRadioBtn('gisAddrDisplay', 'all', 'Both', _settings.addrLabelDisplay === 'all'),
                        $('<i>', {class:'waze-tooltip', id:'gisAddrDisplayInfo', 'data-toggle':'tooltip', style:'margin-left:8px; font-size:12px', 'data-placement':'bottom',
                                  'title':`This may not work properly for all layers. Please report issues to ${SCRIPT_AUTHOR}.`}).tooltip()
                    )
                )
            ),
            $('<fieldset>', {style:'border:1px solid silver;padding:8px;border-radius:4px;-webkit-padding-before: 0;'}).append(
                $('<legend>', {style:'margin-bottom:0px;border-bottom-style:none;width:auto;'}).append($('<span>', {style:'font-size:14px;font-weight:600;text-transform: uppercase;'}).text('Layer Categories')),
                $('<div>', {id:'states_body'}).append(
                    $('<div>').css({'font-size':'11px'}).append(
                        $('<span>').append(
                            'Select ',
                            $('<a>', {href:'#'}).text('All').click(function(){
                                _ignoreFetch = true;
                                $(this).closest('fieldset').find('input').prop('checked', false).trigger('click');
                                _ignoreFetch = false;
                                saveSettingsToStorage();
                                initLayersTab();
                                fetchFeatures();
                            }),
                            ' / ',
                            $('<a>', {href:'#'}).text('None').click(function(){
                                _ignoreFetch = true;
                                $(this).closest('fieldset').find('input').prop('checked', true).trigger('click');
                                _ignoreFetch = false;
                                saveSettingsToStorage();
                                initLayersTab();
                                fetchFeatures();
                            })
                        )
                    ),
                    $('<div>', {class:'controls-container', style:'padding-top:0px;'}).append(
                        states.map(st => {
                            let fullName = STATES.toFullName(st);
                            let id = 'gis-layer-enable-state-' + st;
                            return $('<div>', {class: 'controls-container'}).css({'padding-top':'2px','display':'block'}).append(
                                $('<input>', {type:'checkbox', id:id, class:'gis-layers-state-checkbox'}).change(function() { onStateCheckChanged($(this).is(':checked'), st); }).prop('checked', _settings.selectedStates.indexOf(st) > -1),
                                $('<label>', {for:id}).css({'white-space':'pre-line'}).text(fullName)
                            );
                        })
                    )
                )
            )
        );
        $('#panel-gis-layers-settings').append(
            $('<fieldset>', {style:'border:1px solid silver;padding:8px;border-radius:4px;-webkit-padding-before: 0;'}).append(
                $('<legend>', {style:'margin-bottom:0px;border-bottom-style:none;width:auto;'}).append($('<span>', {style:'font-size:14px;font-weight:600;text-transform: uppercase;'}).text('Appearance')),
                // $('<div>', {class:'controls-container', style:'padding-top:0px;'}).append(
                $('<div>', {class: 'controls-container'}).css({'padding-top':'2px'}).append(
                    $('<input>', {type:'checkbox', id:'fill-parcels'}).change(function() { onFillParcelsCheckedChanged($(this).is(':checked')); }).prop('checked', _settings.fillParcels),
                    $('<label>', {for:'fill-parcels'}).css({'white-space':'pre-line'}).text('Fill parcels')
                )
                // )
            )
        );
        $('input[name=gisAddrDisplay]').on('change', function() {
            _settings.addrLabelDisplay = $(this).val();
            saveSettingsToStorage();
            fetchFeatures();
        });
    }

    function initTab() {
        initSettingsTab();
        initLayersTab();
        if (!$('#gis-layers-power-btn').length) {
            let color = _settings.enabled ? '#00bd00' : '#ccc';
            $('a[href="#sidepanel-gis-a"]').prepend(
                $('<span>', {class:'fa fa-power-off', id:'gis-layers-power-btn', style:'margin-right: 5px;cursor: pointer;color: ' + color + ';font-size: 13px;', title:'Toggle GIS Layers'}).click(function(evt) {
                    evt.stopPropagation();
                    setEnabled(!_settings.enabled);
                })
            );
        }
    }

    function initGui() {
        initLayer();

        let content = $('<div>').append(
            $('<span>', {style:'font-size:14px;font-weight:600'}).text('GIS Layers'),
            $('<span>', {style:'font-size:11px;margin-left:10px;color:#aaa;'}).text(GM_info.script.version),
            '<ul class="nav nav-tabs">' +
            '<li class="active"><a data-toggle="tab" href="#panel-gis-state-layers" aria-expanded="true">Layers</a></li>' +
            '<li><a data-toggle="tab" href="#panel-gis-layers-settings" aria-expanded="true">Settings</a></li>' +
            '</ul>',
            $('<div>', {class:'tab-content',style:'padding:8px;padding-top:2px'}).append(
                $('<div>', {class:'tab-pane active', id:'panel-gis-state-layers'}),
                $('<div>', {class:'tab-pane', id:'panel-gis-layers-settings'})
            )
        ).html();

        new WazeWrap.Interface.Tab('GIS-A', content, initTab, null);
        WazeWrap.Interface.AddLayerCheckbox('Display', 'GIS Layers', _settings.enabled, onLayerCheckboxChanged);
        W.map.events.register('moveend',null,onMapMove);
        showScriptInfoAlert();
    }

    function loadSpreadsheetAsync() {
        return new Promise((resolve, reject) => {
            $.get({
                url: LAYER_DEF_URL,
                success: function(data) {
                    // Critical fields that must be present in the spreadsheet, or script cannot process the data correctly.
                    // If any of these are still null after processing the fields entry, there's a problem.
                    const EXPECTED_FIELD_NAMES = ['state','name','id','counties','url','where','labelFields','processLabel','style','visibleAtZoom','labelsVisibleAtZoom','enabled'];
                    let ssFieldNames;
                    let result = {error:null};
                    let checkFieldNames = fldName => ssFieldNames.indexOf(fldName) > -1;

                    for(let entryIdx = 0; entryIdx < data.feed.entry.length && !result.error; entryIdx++) {
                        let cellValue = data.feed.entry[entryIdx].title.$t;
                        if (entryIdx === 0) {
                            // The minimum script version that the spreadsheet supports.
                            if (SCRIPT_VERSION < cellValue) {
                                result.error = 'Script must be updated to at least version ' + cellValue + ' before layer definitions can be loaded.';
                            }
                        } else if (entryIdx === 1) {
                            // Process field names
                            ssFieldNames = cellValue.split('|').map(fldName => fldName.trim());
                            if (ssFieldNames.length < EXPECTED_FIELD_NAMES.length) {
                                result.error = 'Expected ' + EXPECTED_FIELD_NAMES.length + ' columns in layer definition data.  Spreadsheet returned ' + ssFieldNames.length + '.';
                            } else if (!EXPECTED_FIELD_NAMES.every(fldName => checkFieldNames(fldName))) {
                                result.error = 'Script expected to see the following column names in the layer definition spreadsheet:\n' + EXPECTED_FIELD_NAMES.join(', ') + '\nBut the spreadsheet returned these:\n' + ssFieldNames.join(', ');
                            }
                        } else {
                            let values = cellValue.split('|');
                            if (values[ssFieldNames.indexOf('enabled')]) {
                                let layerDef = {};
                                ssFieldNames.forEach((fldName, fldIdx) => {
                                    let value = values[fldIdx];
                                    if (value.toString().length > 0) {
                                        if (fldName === 'counties' || fldName === 'labelFields') {
                                            value = value.split(',').map(item => item.trim());
                                        } else if (fldName === 'processLabel') {
                                            try {
                                                value = eval('(function(label, fieldValues){' + value + '})');
                                            } catch (ex) {
                                                logError('Error loading label processing function for layer "' + layerDef.id + '".');
                                                logDebug(ex);
                                            }
                                        } else if (fldName === 'style') {
                                            layerDef.isRoadLayer = value === 'roads';
                                            if (LAYER_STYLES.hasOwnProperty(value)) {
                                                value = LAYER_STYLES[value];
                                            }
                                            // If layer is not defined, allow the value to be set as-is because it could be a custom style.
                                            // *** THIS NEEDS TO BE TESTED ***
                                        }
                                        layerDef[fldName] = value;
                                    } else if (fldName === 'labelFields') {
                                        layerDef[fldName] = [''];
                                    }
                                });
                                if (layerDef.enabled && ['0','false','no','n'].indexOf(layerDef.enabled.toString().trim().toLowerCase()) === -1) {
                                    _gisLayers.push(layerDef);
                                }
                            }
                        }
                    }
                    resolve(result);
                },
                error: function() {
                    reject({message: 'An error occurred while loading the GIS layer definition spreadsheet.'});
                }
            });
        });
    }

    function init() {
        installPathFollowingLabels();
        let t0 = performance.now();
        loadSpreadsheetAsync().then(result => {
            if (result.error) {
                logError(result.error);
                return;
            }
            _layerRefinements.forEach(layerRefinement => {
                let layerDef = _gisLayers.find(layerDef => layerDef.id === layerRefinement.id);
                if (layerDef) {
                    Object.keys(layerRefinement).forEach((fldName) => {
                        let value = layerRefinement[fldName];
                        if (fldName !== 'id' && layerDef.hasOwnProperty(fldName)) {
                            logDebug('The "' + fldName + '" property of layer "' + layerDef.id + '" has a value hardcoded in the script, and also defined in the spreadsheet.  The spreadsheet value takes precedence.');
                        } else {
                            if (value) layerDef[fldName] = value;
                        }
                    });
                } else {
                    logDebug('Refined layer "' + layerRefinement.id + '" does not have a corresponding layer defined in the spreadsheet.  It can probably be removed from the script.');
                }
            });
            logDebug('Loaded ' + _gisLayers.length + ' layer definitions in ' + Math.round(performance.now() - t0) + ' ms.');
            loadSettingsFromStorage();
            initGui();
            fetchFeatures();
            log('Initialized.');
        }).catch(err => {
            let msg;
            if (err && err.message) {
                msg = err.message;
            } else {
                msg = err;
            }
            logError(msg);
        });
    }

    function bootstrap() {
        if (W && W.loginManager && W.map && W.loginManager.user && W.model && W.model.states && W.model.states.getObjectArray().length) {
            log('Initializing...');
            init();
        } else {
            log('Bootstrap failed. Trying again...');
            setTimeout(function () {
                bootstrap();
            }, 1000);
        }
    }

    bootstrap();

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

        function removeChildById(node,id) {
            if (node.querySelector) {
                var c = node.querySelector('#'+id);
                if (c) node.removeChild(c);
                return;
            }
            // For old browsers
            var c = node.childNodes;
            if (c) for (var i=0; i<c.length; i++) {
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
        OL.Renderer.SVG.LABEL_STARTOFFSET = { 'l':'0%', 'r':'100%', 'm':'50%' };

        OL.Renderer.SVG.prototype.pathText = function (node, style, suffix) {
            var label = this.nodeFactory(null, 'text');
            label.setAttribute('id',node._featureId+'_'+suffix);
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

            function getpath (pathStr, readeable) {
                var npath = pathStr.split(',');
                var pts = [];
                if (!readeable || Number(npath[0]) - Number(npath[npath.length-2]) < 0) {
                    while (npath.length) pts.push ( { x:Number(npath.shift()), y:Number(npath.shift()) } );
                } else {
                    while (npath.length) pts.unshift ( { x:Number(npath.shift()), y:Number(npath.shift()) } );
                }
                return pts;
            }

            var path = this.nodeFactory(null, 'path');
            var tpid = node._featureId+'_t'+suffix;
            var tpath = node.getAttribute('points');
            if (style.pathLabelCurve) {
                var pts = getpath (tpath, style.pathLabelReadable);
                var p = pts[0].x+' '+pts[0].y;
                var dx, dy, s1, s2;
                dx = (pts[0].x-pts[1].x)/4;
                dy = (pts[0].y-pts[1].y)/4;
                for (var i=1; i<pts.length-1; i++) {
                    p += ' C '+(pts[i-1].x-dx)+' '+(pts[i-1].y-dy);
                    dx = (pts[i-1].x-pts[i+1].x)/4;
                    dy = (pts[i-1].y-pts[i+1].y)/4;
                    s1 = Math.sqrt( Math.pow(pts[i-1].x-pts[i].x,2)+ Math.pow(pts[i-1].y-pts[i].y,2) );
                    s2 = Math.sqrt( Math.pow(pts[i+1].x-pts[i].x,2)+ Math.pow(pts[i+1].y-pts[i].y,2) );
                    p += ' '+(pts[i].x+s1*dx/s2)+' '+(pts[i].y+s1*dy/s2);
                    dx *= s2/s1;
                    dy *= s2/s1;
                    p += ' '+pts[i].x+' '+pts[i].y;
                }
                p += ' C '+(pts[i-1].x-dx)+' '+(pts[i-1].y-dy);
                dx = (pts[i-1].x-pts[i].x )/4;
                dy = (pts[i-1].y-pts[i].y )/4;
                p += ' '+(pts[i].x+dx)+' '+(pts[i].y+dy);
                p += ' '+pts[i].x+' '+pts[i].y;

                path.setAttribute('d','M '+p);
            } else {
                if (style.pathLabelReadable) {
                    var pts = getpath (tpath, style.pathLabelReadable);
                    var p='';
                    for (var i=0; i<pts.length; i++) p += ' '+pts[i].x+' '+pts[i].y;
                    path.setAttribute('d','M '+p);
                } else path.setAttribute('d','M '+tpath);
            }
            path.setAttribute('id',tpid);

            var defs = this.createDefs();
            removeChildById (defs, tpid);
            defs.appendChild(path);

            var textPath = this.nodeFactory(null, 'textPath');
            textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#'+tpid);
            var align = style.labelAlign || OL.Renderer.defaultSymbolizer.labelAlign;
            label.setAttributeNS(null, 'text-anchor', OL.Renderer.SVG.LABEL_ALIGN[align[0]] || 'middle');
            textPath.setAttribute('startOffset', style.pathLabelXOffset || OL.Renderer.SVG.LABEL_STARTOFFSET[align[0]] || '50%');
            label.setAttributeNS(null, 'dominant-baseline', OL.Renderer.SVG.LABEL_ALIGN[align[1]] || 'central');
            if (style.pathLabelYOffset) label.setAttribute('dy', style.pathLabelYOffset);
            //textPath.setAttribute('method','stretch');
            //textPath.setAttribute('spacing','auto');

            textPath.textContent = style.pathLabel;
            label.appendChild(textPath);

            removeChildById (this.textRoot, node._featureId+'_'+suffix);
            this.textRoot.appendChild(label);
        };

        OL.Renderer.SVG.prototype.setStyle = function(node, style, options) {
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
                    setStyle.apply(this,arguments);
                }
            } else setStyle.apply(this,arguments);
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
        OL.Renderer.SVG.prototype.drawGeometry = function(geometry, style, id) {
            var rendered = drawGeometry.apply(this,arguments);
            if (rendered === false) {
                removeChildById(this.textRoot,  id+'_txtpath');
                removeChildById(this.textRoot,  id+'_txtpath0');
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
        OL.Renderer.SVG.prototype.eraseGeometry = function(geometry, featureId) {
            eraseGeometry.apply(this,arguments);
            removeChildById(this.textRoot,  featureId+'_txtpath');
            removeChildById(this.textRoot,  featureId+'_txtpath0');
        };

    }
})();
