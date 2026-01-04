// ==UserScript==
// @name         SciHub CRX
// @version      8.8.19
// @author       SCI Great
// @namespace    https://www.hezibuluo.com/158935.html
// @homepageURL  https://www.hezibuluo.com/158935.html
// @homepage     https://www.hezibuluo.com/158935.html
// @description  SciHub CRX 油猴版，超级好用的 SCI 科研助手，完美支持 Sci-Hub、Libgen、Pubmed、ResearchGate 等数据库，访问文献网页时会在文献DOI/PMID/PMCID后面添加 SciHub CRX 图标，点击图标可获取详细文章信息，如IF、分区、引用次数、文章 PDF 等，点击 PDF 图标可跳转到下载页，完美支持知网，百度学术，谷歌学术（镜像），Scopus，WOS，Springer，IEEE，PubMed，ScienceDirect 等 400 多个学术期刊网站显示期刊详细等级信息（如JCR/中科院分区、IF/JCI、北大/南大核心、CCF 等 160 多个数据库索引情况），支持显示 985、211、双一流 等学校分类，支持通过 PubPeer、Amend、Retraction Watch 检测学术不端行为，支持文章引用下载功能，点击谷歌学术链接时，自动替换为其他谷歌学术网址，支持网页翻译功能，支持部分文献 AI Summary 功能。脚本主页：https://www.scigreat.com/info/scicrx

// @require      https://unpkg.com/sweetalert2@10.16.9/dist/sweetalert2.all.min.js
// @require      https://unpkg.com/crypto-js@4.2.0/crypto-js.js
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @license      AGPL-3.0-or-later
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @antifeature  payment
// @compatible   chrome
// @compatible   firefox
// @compatible   safari
// @compatible   opera
// @compatible   edge
// @connect      qq.com
// @connect      cnki.net
// @connect      bing.com
// @connect      deepl.com
// @connect      baidu.com
// @connect      iciba.com
// @connect      sogou.com
// @connect      youdao.com
// @connect      taobao.com
// @connect      alibaba.com
// @connect      caiyunai.com
// @connect      googleapis.com
// @connect      scigreat.com
// @connect      sssam.com
// @connect      ooopn.com
// @connect      githubusercontent.com
// @connect      ctcontents.com
// @connect      github.com
// @connect      gitcode.com
// @connect      gitlab.com
// @connect      gitea.com
// @connect      gitee.com
// @connect      llhlf.com
// @connect      libgen.vg
// @connect      libgen.ee
// @connect      libgen.gs
// @connect      libgen.pm
// @connect      libgen.rocks
// @connect      library.lol
// @connect      booksdl.org
// @connect      crossref.org
// @connect      crosscite.org
// @connect      fenqubiao.com
// @connect      arxiv.org
// @connect      doi.org
// @connect      oa.works
// @connect      ieee.org
// @connect      oadoi.org
// @connect      core.ac.uk
// @connect      scopus.com
// @connect      pubpeer.com
// @connect      openalex.org
// @connect      unpaywall.org
// @connect      researchgate.net
// @connect      sciencedirect.com
// @connect      connectedpapers.com
// @connect      semanticscholar.org
// @connect      openaccessbutton.org
// @connect      ncbi.nlm.nih.gov
// @connect      bban.top
// @connect      mksa.top
// @connect      tesble.com
// @connect      pismin.com
// @connect      hkvisa.net
// @connect      sci-hub.ee
// @connect      sci-hub.se
// @connect      sci-hub.st
// @connect      sci-hub.ru
// @connect      sci-hub.wf
// @connect      sci-hub.yt
// @connect      sci-hub.ren
// @connect      sci-hub.cat
// @connect      et-fine.com
// @connect      3800808.com
// @connect      bothonce.com
// @connect      scrongyao.com
// @connect      unblockit.black
// @connect      google.de
// @connect      google.fr
// @connect      google.jp
// @connect      google.hk
// @connect      google.hu
// @connect      google.pl
// @connect      google.com
// @connect      google.co.in
// @connect      google.co.jp
// @connect      google.co.kr
// @connect      google.co.th
// @connect      google.co.uk
// @connect      google.com.au
// @connect      google.com.hk
// @connect      google.com.sg
// @connect      google.com.tw
// @connect      typicalgame.com
// @connect      dotaindex.com
// @connect      imageoss.com
// @connect      panda985.com
// @connect      lanfanshu.cn
// @connect      cljtscd.com
// @connect      aigrogu.com
// @connect      linfen3.top
// @connect      fropet.com
// @connect      beds.ac.uk
// @connect      add.pub
// @connect      *
// @match        *://*.sciencedirect.com/*
// @match        *://*.wiley.com/*
// @match        *://*.acs.org/*
// @match        *://*.baidu.com/*
// @match        *://*.tandfonline.com/*
// @match        *://*.nature.com/*
// @match        *://*.*.ac.cn/*
// @match        *://*.ac.cn/*
// @match        *://*.accessible.com/*
// @match        *://*.aic.ca/*
// @match        *://*.ajas.info/*
// @match        *://*.ajol.info/*
// @match        *://*.aap.org/*
// @match        *://*.adisonline.com/*
// @match        *://*.airitilibrary.com/*
// @match        *://*.airitilibrary.cn/*
// @match        *://*.alexanderstreet.com/*
// @match        *://*.altmetric.com/*
// @match        *://*.aminer.cn/*
// @match        *://*.amsciepub.com/*
// @match        *://*.annee-philologique.com/*
// @match        *://*.anthrosource.net/*
// @match        *://*.appliedradiology.com/*
// @match        *://*.arch-anim-breed.net/*
// @match        *://*.aspresolver.com/*
// @match        *://*.atypon.com/*
// @match        *://*.aviationweek.com/*
// @match        *://*.aip.org/*
// @match        *://*.bbsrc.ac.uk/*
// @match        *://*.begellhouse.com/*
// @match        *://*.bepress.com/*
// @match        *://*.berghahnjournals.com/*
// @match        *://*.bing.com/*
// @match        *://*.biomedcentral.com/*
// @match        *://*.biologists.com/*
// @match        *://*.bioon.com.cn/*
// @match        *://*.bioon.com/*
// @match        *://*.biotechniques.com/*
// @match        *://*.blackwell-synergy.com/*
// @match        *://*.bmj.com/*
// @match        *://*.booksdl.org/*
// @match        *://*.britannica.com/*
// @match        *://*.businessweek.com/*
// @match        *://*.cambridgesoft.com/*
// @match        *://*.cambridge.org/*
// @match        *://*.cdnsciencepub.com/*
// @match        *://*.cas.cn/*
// @match        *://*.cawq.ca/*
// @match        *://*.cell.com/*
// @match        *://*.chadwyck.com/*
// @match        *://*.chaoxing.com/*
// @match        *://*.chemnetbase.com/*
// @match        *://*.china.eastview.com/*
// @match        *://*.chronicle.com/*
// @match        *://*.ci.nii.ac.jp/*
// @match        *://*.citexs.com/*
// @match        *://*.cindasdata.com/*
// @match        *://*.cjc-online.ca/*
// @match        *://*.clarivate.com/*
// @match        *://*.clinicalkey.com/*
// @match        *://*.cnki.com.cn/*
// @match        *://*.cnki.net/*
// @match        *://*.cn-ki.net/*
// @match        *://*.cnpeak.com/*
// @match        *://*.cnpereading.com/*
// @match        *://*.communicationencyclopedia.com/*
// @match        *://*.computerworld.com/*
// @match        *://*.connectedpapers.com/*
// @match        *://*.contemporaryobgyn.net/*
// @match        *://*.corporateaffiliations.com/*
// @match        *://*.cqpress.com/*
// @match        *://*.cqvip.com/*
// @match        *://*.crcnetbase.com/*
// @match        *://*.csiro.au/*
// @match        *://*.csis.cn/*
// @match        *://*.publish.csiro.au/*
// @match        *://*.datapages.com/*
// @match        *://*.dagstuhl.de/*
// @match        *://*.degruyter.com/*
// @match        *://*.db.chemsources.com/*
// @match        *://*.dblp.uni-trier.de/*
// @match        *://*.dccc.chemnetbase.com/*
// @match        *://*.dichtung-digital.de/*
// @match        *://*.dimensions.ai/*
// @match        *://*.discovermagazine.com/*
// @match        *://*.dovepress.com/*
// @match        *://*.dukeupress.edu/*
// @match        *://*.duxiu.com/*
// @match        *://*.eastview.com/*
// @match        *://*.ebsco.com/*
// @match        *://*.ebscohost.com/*
// @match        *://*.economist.com/*
// @match        *://*.edu.cn:*/*
// @match        *://*.edu:*/*
// @match        *://*.edu.cn/*
// @match        *://*.edu/*
// @match        *://*.eenews.net/*
// @match        *://*.ejorel.com/*
// @match        *://*.els.net/*
// @match        *://*.elsevier.com/*
// @match        *://*.emerald.com/*
// @match        *://*.emeraldinsight.com/*
// @match        *://*.emeraldgrouppublishing.com/*
// @match        *://*.engineeringvillage.com/*
// @match        *://*.engineeringvillage2.com/*
// @match        *://*.epnet.com/*
// @match        *://*.eurekaselect.com/*
// @match        *://*.evolutionary-ecology.com/*
// @match        *://*.exacteditions.com/*
// @match        *://*.frymulti.com/*
// @match        *://*.cos.com/*
// @match        *://*.figcheck.com/*
// @match        *://*.futuremedicine.com/*
// @match        *://*.fyesit.metapress.com/*
// @match        *://*.galegroup.com/*
// @match        *://*.gateway.proquest.com/*
// @match        *://*.geenmedical.com/*
// @match        *://*.genomebiology.com/*
// @match        *://*.global-sci.com/*
// @match        *://*.google.com.co.uk/*
// @match        *://*.google.com.*/*
// @match        *://*.google.com.tw/*
// @match        *://*.google.com.hk/*
// @match        *://*.google.com/*
// @match        *://*.google.nl/*
// @match        *://*.brum.beds.ac.uk/*
// @match        *://*.deepsearch.cc/*
// @match        *://*.lanfanshu.cn/*
// @match        *://*.mirrors.pw/*
// @match        *://*.panda321.com/*
// @match        *://*.lsqwl.org/*
// @match        *://*.sb250.gq/*
// @match        *://*.studiodahu.com/*
// @match        *://*.zidianzhan.net/*
// @match        *://*.gpoaccess.gov/*
// @match        *://*.gracescientific.com/*
// @match        *://*.groveart.com/*
// @match        *://*.grovemusic.com/*
// @match        *://*.gut.bmj.com/*
// @match        *://*.harpweek.com/*
// @match        *://*.heart.bmj.com/*
// @match        *://*.hh.um.es/*
// @match        *://*.hindawi.com/*
// @match        *://*.hnlat.com/*
// @match        *://*.hull.ac.uk/*
// @match        *://*.humankinetics.com/*
// @match        *://*.hwwilson.com/*
// @match        *://*.hwwilsonweb.com/*
// @match        *://*.ias.ac.in/*
// @match        *://*.ibisworld.com/*
// @match        *://*.icevirtual.com/*
// @match        *://*.icevirtuallibrary.com/*
// @match        *://*.icf.uab.es/*
// @match        *://*.ida.liu.se/*
// @match        *://*.ihserc.com/*
// @match        *://*.igi-global.com/*
// @match        *://*.ihsglobalinsight.com/*
// @match        *://*.iikx.com/*
// @match        *://*.ijdb.ehu.es/*
// @match        *://*.ijee.ie/*
// @match        *://*.impublications.com/*
// @match        *://*.inderscience.com/*
// @match        *://*.informahealthcare.com/*
// @match        *://*.informaworld.com/*
// @match        *://*.ingentaconnect.com/*
// @match        *://*.ingentaselect.com/*
// @match        *://*.inpractice.bmj.com/*
// @match        *://*.inspirehep.net/*
// @match        *://*.intelecomonline.net/*
// @match        *://*.int-res.com/*
// @match        *://*.ipap.jp/*
// @match        *://*.isa-arbor.com/*
// @match        *://*.isiknowledge.com/*
// @match        *://*.iospress.com/*
// @match        *://*.itn.is/*
// @match        *://*.iwaponline.com/*
// @match        *://*.jamanetwork.com/*
// @match        *://*.jiansuobao.net/*
// @match        *://*.john-libbey-eurotext.fr/*
// @match        *://*.journalguide.com/*
// @match        *://*.journalofinfection.com/*
// @match        *://*.jove.com/*
// @match        *://*.jsad.com/*
// @match        *://*.jstage.jst.go.jp/*
// @match        *://*.jstor.org/*
// @match        *://*.justscience.cn/*
// @match        *://*.karger.com/*
// @match        *://*.kluwerlawonline.com/*
// @match        *://*.kluweronline.com/*
// @match        *://*.knovel.com/*
// @match        *://*.las.ac.cn/*
// @match        *://*.la.rsm.com/*
// @match        *://*.labanimal.com/*
// @match        *://*.landesbioscience.com/*
// @match        *://*.lexisnexis.com/*
// @match        *://*.lexis-nexis.com/*
// @match        *://*.letpub.com.cn/*
// @match        *://*.letpub.com/*
// @match        *://*.libraryissues.com/*
// @match        *://*.liebertonline.com/*
// @match        *://*.liebertpub.com/*
// @match        *://*.livestockscience.com/*
// @match        *://*.magonlinelibrary.com/*
// @match        *://*.mapress.com/*
// @match        *://*.marquiswhoswho.com/*
// @match        *://*.math.ca/*
// @match        *://*.medknow.com/*
// @match        *://*.medreading.cn/*
// @match        *://*.medsci.cn/*
// @match        *://*.mendeley.com/*
// @match        *://*.mcgill.ca/*
// @match        *://*.mdpi.com/*
// @match        *://*.metapress.com/*
// @match        *://*.metla.fi/*
// @match        *://*.micronexx.com/*
// @match        *://*.millerpublishing.com/*
// @match        *://*.mintel.com/*
// @match        *://*.mluri.sari.ac.uk/*
// @match        *://*.modernmedicine.com/*
// @match        *://*.mp.bmj.com/*
// @match        *://*.mp.weixin.qq.com/*
// @match        *://*.mr-gut.cn/*
// @match        *://*.msucares.com/*
// @match        *://*.national.com/*
// @match        *://*.ncbi.nlm.nih.gov/*
// @match        *://*.ncsu.naxosmusic.com/*
// @match        *://*.nejm.org/*
// @match        *://*.news.reseau-concept.net/*
// @match        *://*.newsbank.com/*
// @match        *://*.nlm.nih.gov/*
// @match        *://*.nonlin-processes-geophys.net/*
// @match        *://*.nowpublishers.com/*
// @match        *://*.npprj.spci.se/*
// @match        *://*.nrcresearchpress.com/*
// @match        *://*.nssd.cn/*
// @match        *://*.nstl.gov.cn/*
// @match        *://*.nv-med.com/*
// @match        *://*.nybooks.com/*
// @match        *://*.odyssi.com/*
// @match        *://*.oed.com/*
// @match        *://*.oldcitypublishing.com/*
// @match        *://*.onlinewiley.com/*
// @match        *://*.openacessjournal.com/*
// @match        *://*.org/*
// @match        *://*.org.cn/*
// @match        *://*.oup.com/*
// @match        *://*.osti.gov/*
// @match        *://*.ovid.com/*
// @match        *://*.ooopn.com/*
// @match        *://*.sssam.com/*
// @match        *://*.ovidsp.ovid.com/*
// @match        *://*.oxfordlanguagedictionaries.com/*
// @match        *://*.oxfordmusiconline.com/*
// @match        *://*.pagekoreascience.or.kr/*
// @match        *://*.palgrave.com/*
// @match        *://*.paperpile.com/*
// @match        *://*.pasj.asj.or.jp/*
// @match        *://*.peanutscience.com/*
// @match        *://*.peeref.com/*
// @match        *://*.peerj.com/*
// @match        *://*.pepublishing.com/*
// @match        *://*.perceptionweb.com/*
// @match        *://*.pharmacists.ca/*
// @match        *://*.pkulaw.com/*
// @match        *://*.pleiades.online/*
// @match        *://*.podiatrytoday.com/*
// @match        *://*.polymersdatabase.com/*
// @match        *://*.portal.euromonitor.com/*
// @match        *://*.pubpeer.com/*
// @match        *://*.pracademics.com/*
// @match        *://*.pressdisplay.com/*
// @match        *://*.priory.com/*
// @match        *://*.proquest.com/*
// @match        *://*.proquest.umi.com/*
// @match        *://*.publish.csiro.au/*
// @match        *://*.pubmed.cn/*
// @match        *://*.pubmed.com/*
// @match        *://*.pubmed.pro/*
// @match        *://*.pubmedcentral.nih.gov/*
// @match        *://*.pubmedcentralcanada.ca/*
// @match        *://*.pubservices.nrc-cnrc.ca/*
// @match        *://*.purl.access.gpo.gov/*
// @match        *://*.qjps.com/*
// @match        *://*.railwayage.com/*
// @match        *://*.rdsinc.com/*
// @match        *://*.readpaper.com/*
// @match        *://*.redbooks.com/*
// @match        *://*.reference-global.com/*
// @match        *://*.referenceusa.com/*
// @match        *://*.researcherslinks.com/*
// @match        *://*.researchgate.net/*
// @match        *://*.researchsquare.com/*
// @match        *://*.resurchify.com/*
// @match        *://*.revophth.com/*
// @match        *://*.riag.com/*
// @match        *://*.rsm.com/*
// @match        *://*.safaribooksonline.com/*
// @match        *://*.sagamorepub.com/*
// @match        *://*.sagepub.com/*
// @match        *://*.sanborn.umi.com/*
// @match        *://*.sbrnet.com/*
// @match        *://*.schattauer.de/*
// @match        *://*.scholarmate.com/*
// @match        *://*.sciencegate.app/*
// @match        *://*.scientific.net/*
// @match        *://*.scitation.org/*
// @match        *://*.scialert.net/*
// @match        *://*.sciepub.com/*
// @match        *://*.simplymap.com/*
// @match        *://*.scichina.com/*
// @match        *://*.sciengine.com/*
// @match        *://*.scimagojr.com/*
// @match        *://*.scilit.net/*
// @match        *://*.sciopen.com/*
// @match        *://*.scopus.com/*
// @match        *://*.site.ebrary.com/*
// @match        *://*.socolar.com/*
// @match        *://*.springer.com/*
// @match        *://*.springer.de/*
// @match        *://*.springer-ny.com/*
// @match        *://*.springerprotocols.com/*
// @match        *://*.standardandpoors.com/*
// @match        *://*.statpak.gov.pk/*
// @match        *://*.swissmedic.ch/*
// @match        *://*.technologyreview.com/*
// @match        *://*.techscience.com/*
// @match        *://*.telospress.com/*
// @match        *://*.theannals.com/*
// @match        *://*.thecochrane.com/*
// @match        *://*.thelancet.com/*
// @match        *://*.theses.com/*
// @match        *://*.thieme.de/*
// @match        *://*.thieme.com/*
// @match        *://*.thieme-connect.de/*
// @match        *://*.topeditsci.com/*
// @match        *://*.tsinghuajournals.com/*
// @match        *://*.uni-trier.de/*
// @match        *://*.ualberta.ca/*
// @match        *://*.ulrichsweb.com/*
// @match        *://*.unb.ca/*
// @match        *://*.unesp.br/*
// @match        *://*.uni.wroc.pl/*
// @match        *://*.victoriandatabase.com/*
// @match        *://*.victorianperiodicals.com/*
// @match        *://*.wanfangdata.com.cn/*
// @match        *://*.wanfangdata.com/*
// @match        *://*.webofknowledge.com/*
// @match        *://*.webofscience.com/*
// @match        *://*.wgsn.com/*
// @match        *://*.wkap.nl/*
// @match        *://*.worldscientific.com/*
// @match        *://*.worldscinet.com/*
// @match        *://*.worldscinetarchives.com/*
// @match        *://*.wssa.allenpress.com/*
// @match        *://*.x-mol.com/*
// @match        *://*.ybook.co.jp/*
// @match        *://*.yitlink.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.zhizhen.com/*
// @match        *://*.znaturforsch.com/*
// @match        *://*.add.pub/*
// @match        *://*/doi/*
// @match        *://benjamins.com/*
// @match        *://core.ac.uk/*
// @match        *://ems.press/*
// @match        *://fatcat.wiki/*
// @match        *://hal.science/*
// @match        *://inspirehep.net/*
// @match        *://jiansuobao.net/*
// @match        *://libgen.ee/*
// @match        *://libgen.rocks/*
// @match        *://libgen.top/*
// @match        *://libgen.click/*
// @match        *://lww.com/*
// @match        *://oa.mg/*
// @match        *://paperpile.com/*
// @match        *://peerj.com/*
// @match        *://plu.mx/*
// @match        *://pubpeer.com/*
// @match        *://research.com/*
// @match        *://sciencechina.cn/*
// @match        *://sciendo.com/*
// @match        *://scite.ai/*
// @match        *://specialsci.cn/*
// @match        *://storkapp.me/*
// @match        *://portlandpress.com/*
// @match        *://hosteagle.club/*
// @match        *://stealthsurfer.online/*
// @match        *://*.exlibrisgroup.com.cn/*
// @match        *://*.*.exlibrisgroup.com.cn/*
// @match        *://*/*
// @exclude      *://pos.baidu.com/*
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/447389/SciHub%20CRX.user.js
// @updateURL https://update.greasyfork.org/scripts/447389/SciHub%20CRX.meta.js
// ==/UserScript==

const scibtn_ico = "data:image/png;base64,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";
const doi_ico = "data:image/png;base64,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";
const pmid_ico = "data:image/png;base64,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";
const pmcid_ico = "data:image/png;base64,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";
const arxiv_ico = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABWFJREFUWEfFl39M1HUYx184OxxcQHWHKYhKWupJpqYeosLU2WzlL344mYuWWanD+GFMolxzK9MKEcVKbIUMbR5pnCxZgYY/xnk6lZCDBAGRQ+TOROGcctK17xc5uF/iRVvPP7c99/k8z/t5f57P+/N8PbBg4X80D3sAKvJFOKklG7ka0ojZv3PA8BJJYiYzxTixrbHib09cKwA5ctSoea52EJXlR4je/Q3GNUaIGnB+hKLCTXOoLMok9/IJ1C/pMC40ioGtAMooQ3n+Lmu0n1NYUkWrphVLAZinDJwBAUCJupjC3EKSJoXwS3EVF3d1YJxo7AVgab+F7mgmyy+omBU6i3hlPHGtcZybeG5AFLxcFkzO0H1M6PIicc96Fo8IYm9TLXn1WlD1YWBV3VLKU8qpvtLKkY8SiRgdwSe3TpBHnmMvZACn7XCFAQm2PtklGaW6eCYsXA+Fe0k8X8De4ouYqk1YjltA2QeAIlWBrlxHwIIAMXju7DkwdT4bTmcxqcsb9T0dwR1GghohORmUSttkGg189RU0BoE2FGRfy8QFqsULUHR5kWvSs+X4WdiBSH2PWXtAWi/F5G8S/QHZ3SCCFgThldfMi13ehCZUEqqEgIBHn4heD2UaiH7YvIFRgbw2bzz5qguwAWvzOQCwDxuYEUh483AuG+rIfNfoUHF/jSEwsmgR3PaU4PO8j0Pl/QIQGIlIDiQtpdrt5D3B1ZlyFr9vYPCuJ3iwzuwUs4MQWVflg8oDoiJt9wkUi8dkdxSu/LtT5KybbnCpJy4BTE+GQ0mOiWbM6AZw5owtMFf+y1oJS78E3UHneuISQFQ0qFSOrHl4dPvqD49l1JKa3m524Tc1S4heBkc17gDIgDKl41UTpdNNAMIesRf+NjjohBjP6WsYDRYn1QsbhO4Wqp8f1YZ8msHKgCu/sKDh57GMzqsRlc/e3AYgBBBo9R7uSKkr/38CwFVwZ3fLfu2AARjOyomLv82mjM5+NUE4is0JEnJ2+lqPyH0AfZrQ2sVnOklK6tb7R5nwTqSnw9xxT/LT4e6V6h2jiHuhwo0mBPpeQ6GqJj18sQ1WrIAEu1evB1BGBmRvlfBmxEiCJ97n9fhr3G2WErkUjlW1O8XtthBFR0NpKRh6L4AY2E/iwZRgKT/uG2JzO4o2TiO5rtx9IRJGwyytnLXb7DI9vIoCI31tqI8HISOk+I3rrVTonR/S/UiJrHFfirezHVKuMMJXLVIp8XFveNaXBFGS78vbftWYtzh/iFwKkTDFpl+PF6eYSUU5bJoyiMi0xkd338N/haY1aEdSWjSEhO8vMTj2GW5vveNyuraZisMJJ4wwElqWYDjwKYnX/6C0vpm2Z9vYZBzGvJg2gsffw2t4hw0jQlLzHU9ataOo0w2h4mobaacaREgxKyaLMVqybvDA35EJ26lYGNIEK/yOlSf2sH/nWbx13uKkZDlqYfxBCcMqPFm78immKjytjJj0fpyruMe+0gauh9ynKqYTmbcMhFfwnSQ0V1uoeXUkG/1T8S3wEfcZV9uN5cLoHIqSmvoaKm9UEnSgiNgZv9MR2+FIvRtDadSpyWxWrEI+ezm0NKCq/5W091KxpD9N7bza3sdoTMkYsjqXIRm3EIW/AvZ8yFsnT1J46M/HOntXiwI1geRq5xARPBfVTS20/0Va9jHqf2sXj8RGB4QxugdxbmkOqd+W0Hlt4B8mQnGfeX2A4loLr6iyIQyaEppEzA5CJN0vZfIWKZq2m5hjzNCP9D4OPQKAgptv8HHbMbR3a9Gv1mPx7r7WTpVQYMJYbHSq3Y+T0NkaWbYMY4hR/Bjpa66H0n+byc19/wCDSG7/cKNFzQAAAABJRU5ErkJggg==";
const crossref_ico = "data:image/png;base64,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";
const pdf_scihub_ico = "data:image/png;base64,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";
const pdf_libgen_ico = "data:image/png;base64,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";
const pdf_openalex_ico = "data:image/png;base64,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";
const pdf_semantic_ico = "data:image/png;base64,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";
const pdf_oabtn_ico = "data:image/png;base64,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";
const pdf_oadoi_ico = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAABACAMAAAB4KUSAAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACIlBMVEUAAAAg4Wgh4Wcg4Wcj4mge4Wcf4Wgf4mcg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgg4Wgf4Wcd4WYe4Wcn4mwx43M15HYm4mwe4WZV6IyV8bfC99bX+uTd+ujC99Ul4mxI5oOw9Mrz/ff////y/fav9MlH5oNk6pbg++rf++lj6pVj6pbr/PHq/PFi6pRG5oHe++n4/vrK+Nud8r2O8LKe8r3L+NtE5oEk4mur9MZs65wr43As43Bt65yp88Uk4WpP54jv/fRQ54gc4WZR6Inu/fRN54eL77D6/vty7J907KH6/vyJ768j4Wq39c7S+eEw43PU+eK19c0f4Wgr4m/N+N0h4Wiu9MjL+Nwq4m8u43HT+eGZ8bpM54bA9tTV+eLO+N5v7J0o4m0v43Kc8rwb4GQ85Xti6pW29c5X6I5Z6Y5Z6Y9Y6I495Xth6pT+//78//33/vpf6ZO+9tO89tEl4mvM+Nwo4m7J+NrH99mH7637/vyF76wp4m5u652W8biX8bjdKUXHAAAARXRSTlMAAAAAAAAAABA1ZZW92u35/kOIxOn7InPG9SGB3A5r2LT8BWPiifcUoKeKZDbjD7Zt/dmDI911EchF9sXqZpa+2+7HbDQqOJcOAAAAAWJLR0RY7bXEjgAAAAd0SU1FB+YHAwgjOUPjjxAAAAKISURBVEjHpdf3X9QwFADw1gkucOCeuBBxj3OiqEnreQeC61w470RUVFznVkDtuRfi3htUVPz/TOHu0/QladPc++l6zbcZTZMXTWNCtyMnt0/ffv0H5OUjQXBZzsBBg4cUIM/gsKHDho9AvsGwkaNG+ysACRszdpwUo2E34nLHT5B0iK6ucOIkWeZAu5mTp8g75LipRfkBXBp2J25aEJaBpJ1FwRxKu8LiQO1MQ9LB6YJxwRh7wpIZvHuGuTa8LhwxDQHU9ZmzOHeikfKK9ZVVlRsqyjdGebCHrs+ew94wN23eEuuKrdu2mxxIPoe5nM7t2BlzonoX5sF5nPp274nRsXcfrJO4+QvY/u2P28UTB2oO1h5K2D+rDpsMXMhWeKSus/DRY6ZhHq/vfMiJkxCGFrHv4dRpUjR+Jmn3DCfP2t09d94AcPESFl4gJS9eSmYuL18h11chLGZb2tBICjZdy4wkDl8n1zca3DC0lHFW6iYpWOf8ces2ub5z13LBkmXsO7x3nxSsdYYx+oADlxcIYI0DzYePHjc/AaNaivwhwi1PU6CQtkIGIgtbEK6UgmxoZaowj/3PSDUR+Oy5AcL1JI2z1rx4ac/OV6/fuOLtu/fe0PxQnfhI4KfPIBLxL1SdbFMjX2Oi+PbdY3CsVLMQtlKTh3kdXROVH/SsYyaANCxVhXCSS0P4WUlD+CFLQ7h0yEOwWMnD0CpFCBbkANC9BUhDuOl4wVYAXduc1fZDCH+2IAr21PXV9MaKf7ULXPtvTEO4lVt//nb840VHfZvlgjB5sAxR0EukT7oijqwSJPWUTOulmgQqp53qia56aq1pvRWTefXjQxYHFvUjUhaHMucYuMbnGPgfZy6/6L/fYN0AAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMDctMDNUMDg6MzU6NDkrMDA6MDB1IKXKAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTA3LTAzVDA4OjM1OjQ5KzAwOjAwBH0ddgAAAABJRU5ErkJggg==";
const pdf_core_ico = "data:image/png;base64,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";
const pdf_OA_ico = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAUhSURBVFhHtZdZiBxVFIZ7eq2u6VnijDOZsWcLyGDAJUgEFxTR4IsLOmrENRF8cceAGygoiBBFQY1roiQiIUFRcHkYNFEEHUENKCERXGIIbomGyYPOYvfx+2/X7VSPzmIsC3666tatc/77n+XeTs12VUd6AxsID9pgs9nAkeHe1ux2TBVrFue+RsAGsD6G1y4JM3Ztc9auAhcUMw4Xg2t4vg7o/YU8C5dzrzHhjpacVfub3TzsjJVSqTZ+57w2Ak22bFPKVgQZu6GUtVMLaTcmnM3YyjBrJ+UPjw1n07ZCBHDen2mqj6dBpS+0VTUC1rQAEuuAm7wo3WQTfDzaVbBdvUV7pD3vVipJt3YWbO8xRXvr6IJlmfvZ4oDn0N7pCpxS3kYnNuIEhPlINBAYL4fWze9qDOyFhGTdw6/ed7NSkZHs23G8dlHejRVQztvwBKIQ1DEXiTqBdj7+mVV+0aPVFd0qRlBgH/d+zk/c39qStVdR5ACOdkNOueHfi4Axfv0MAhHGQCdouBoUOIQCa0ikoWwtrjL0Y0TgIhxJgeNzaRvrDuyh9pyFrF4h8TZEYLxcdKo9f1TenothQ0fBtnTktjCv4WogcAACy/OHV7QSBSbJ6k+J+Z5o9Rr/nOd7WnP1eR4i8AvzKGNHtgFDJSqk+D7zGq4XgftYGdzPynOxmAqKs1fEI5gxx0Nq7BeB/tAmCUUcIjFRDkaZ13AtA6tjWLU0k74bySovINvT4DGS7XHwFJCUkvYJ7tcB3cexGZn/iJwJSsj5CPztqp4YdlYHwoo3Mi/iHTO6H6VK3qBkHZlIDY0viMBET+5Y+kHlzxj72aC+odKVEzmQMsJWnKuhLaN5qaIq0ftECei9HJ9Pdagy7m/L2ZOEoZVEbAO9UYf01ZMogSkgg3KoXLmTijgOEkpYOVdCY8ohT8LuoywVnsQIyPmbyMx020jiqcSkhsLxA5KreamVn0wIShD4hL6RGAFl9iFQjiT+RqvDuVRxsQaao/1DlXNmIWPfJ6mAVv8uGxZTHTZ15J3x+PuXUUXSG03Mk0ssB2ToYyRlqoP2kB10Rk9C7+8iJ5SMslGNfZcIgWlQYWXaqJju0EU4tlH7IiFHb0f58W0UHn2XGAFBsVaTuTK267Hluq4pR8JSquJq3seVSYyAoJXJqJJNfYBPHXR6GuedNi896+zgSSVKQFA4nGF+n6Ef+E1rkJDsRP73cD7I2K/qlklVwT9BZSci6gNrqX8lIKbsdXLhJYjdTFu2of+RgMqsGoVEjvZD5EacYs7lxaOQ+hpFqIjkCGjVfo7yQQeR3T1F+0hdLyKiRoRJd3jRISYRAlqt3imu+lVsN9F4dJA9hyM8JuwySnRKivDuDI74OuR8hwKQ/m8EXEfD6Aes8iwMD5P9O1i1zpEncK+tdyBKRP1JsSUle5izo543Uy3VwSMgIKceaq33se0qyZ4luU5hs1En1ElIfUCnZXXJZlbckk7ZNCpIGcy6+f+KgFqoq/V6cpXcnxam2C0cTqcZ28Xq9XwaajwIMd2fRxiEc8GlhELENL6TuZy0FkaA1VZ+I8brYa1udzoObkPSJcgrZyLkTzk6G/KZXUEDeiAiMRP6/6iknFpQGS7ODavBSH5l9pcw138A/QPqQO6vXH+vtVcXFkh8iOw3oYr2fa10DVmvHFlOiG5nXNu3cuf3crAtcjP7Ve0LeibLwUHVtet00Ur1p0XQs09KDxciqRKbHw+f7xETfcErNS+p1F9b1z/MoMKQ6AAAAABJRU5ErkJggg==";
const copy_ico = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAA5RJREFUeF7t21voZ1MUB/DPmBnXmgfMwxRyaYqIKWNcksvLZNyiyCVTY8KDJx5ca9ySCIU8KJdQwhu5Ew8eCIkXwhQPI2Q8uJTIJa2x/8Xf75zf77f/+5zz82/v17PXWmd999prrb33Wku0j2NxNU7AnmPm9vn5a7yG2/DpQgQvaSG+HPdh6UIEdEz7M87Fi7lymgA4Gm9hJzyA+xPSv+cKKki3Mw7HFpyJn3AwvsqR0QTAUzgPD+HSHMY90MTivI6TcAtuzJHZBMAX2B9hCe/mMO6JZiMexys4JUdmEwDbsTf2xZc5jHuiORlv4G0clyOzAtCAWrWAugX+Xz4g8oFv5lnzD3gv5TIfNfmHxeID2vzfb7gMj46atFgA+GBEvrIXNuECRAJ3DN6fD8JiAaAtDD6MzXga55cGIBCOM0NkZaVHmO4N6dDTxHuSPGAd3kEkdweWBmAuZS6t/By/W1POvxAA9sE2fIeVpQHYA0dhWQcI/JoyvLYD2CQW0CkAHeg9FcsKwARngWoBXfqAqey1g8l1Cwy9BTakbKvtbjF34cP73z0qe/sHw8Et4Nl0L5er5Di6u3BVy6TBAViF48dpkfn9z5QF/jjLAGTqVoxscAsopkkmowrA0FEgc+GKkVULGNoCjsQ56CIP+ANxmfH5LEeB53FaMYP+L6N7cOUsA3AoTu8IgMgDnhzzMlV9wNA+oKPFn5httYBqAeNfh+uNUJc3QlFEsX7iHfv3xLjtjUeKX6akGzV9cB/wXGYYjLe6BxcDACfiwikVCQuI8rb5r7lTstkxfXALyPnpkjQVgBoGaxgcWyVW84Au84CSDi2HV3WC1QlWJ1id4Lha4RoFahTIKJL6DKsRh503c+JTTzSXpFPlCy2n0qwt8AguxjM4uydlphUTrTNR/7cG1+KOBgZZAEQPTpSf7poakqJnaCviqnroESV5h+E6rE3H6kPwfUkAgtdZeAK7D61xi/xvccaYtp4sC5iTeQCuSH2DKxp+JIokdksrEWXrfYyo+nwV96YK0DaZCwJgEmUiDkdOfipemoSg5zkVgJw8YJpFiq7NqBa7KPmMaWj7mHsEPkwg7DdfYIln7dtxDeKlOBzSrI3W/ysBQNTgf4xd8BjuxCeI9/0hx0Epl4kcIfqf4/0iGq7/NUoAEAzjajx6cpYPqXGL7Jtw86jvpQAI3lEtcn3q5Z2FVvtoqo623yi2fLkJnL8Au+yIUNZdUAkAAAAASUVORK5CYII=";
const abs_ico = "data:image/png;base64,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";

(() => {
    "use strict";
    let $ = jQuery, myHost = window.location.hostname, myHref = window.location.href, docAsStr = document.documentElement.innerHTML;
    let doc = $(document), random, scihub_link, libgen_link, Target, tgoing, rankSite = "", originalBody = "", browser = "";
    let jabb = {}, jdata = {}, jssn = {}, sdata = {}, odata = {}, tdata = {}, initOption = {}, dochtml = [];
    const intro = {
        imf:  "《IF》影响因子，科睿唯安 JCR 期刊引证报告中代表期刊影响大小的定量指标，衡量相同研究领域中期刊的引文影响，即某期刊前2年发表论文在该年份中被引用总次数除以前2年发表论文总数。每年更新一次，数据来源为《Journal Citation Reports（2024.6）》",
        bank: "《JCR来源》科睿唯安 JCR 期刊引证报告中引文来源为 WOS 核心合集，包括 SCIE、SSCI、ESCI、AHCI 期刊，其中 AHCI 部分 无分区信息。每年更新一次，数据来源为《Journal Citation Reports（2024.6）》",
        jcr:  "《JCR》科睿唯安 JCR 期刊引证报告基于不同学科的当年影响因子高低对 SCIE、SSCI 期刊进行综合排序分区。数据从高到低分为：Q1、Q2、Q3、Q4，每年更新一次，数据来源为《Journal Citation Reports（2024.6）》",
        cas:  "《CAS》中科院文献情报中心采用“期刊超越指数”指标，汇总期刊的影响力水平。数据从高到低分为：C1、C2、C3、C4，每年更新一次，数据来源为《中科院文献情报中心期刊分区表（2023.12）》",
        top:  "《Top》中科院分区中在某一研究领域内综合排名在前5%-10%的期刊，就是指各个专业内的顶尖刊物。每年更新一次，数据来源为《中科院文献情报中心期刊分区表（2023.12）》",
        ei:   "《EI》工程索引，美国工程信息公司编辑出版的著名工程技术类综合性检索系统，主要收录工程技术领域重要期刊和会议文献。每年更新一次，数据来源为《CPXSourceList（2024）》",
        cscd: "《CSCD》中国科学引文数据库收录我国众多领域出版的中英文科技核心期刊和优秀期刊千余种。数据从高到低分为：核心库、扩展库，每2年更新一次，数据来源为《中国科学引文数据库来源期刊列表（2023-2024）》",
        pku:  "《北大核心》北京大学等众多学术机构根据期刊影响因子等诸多因素所划分的优秀期刊目录，属于国内学术期刊的顶级。数据只有一个等级：核心，每3年更新一次，数据来源为《北大中文核心期刊要目总览（2023）》",
        sos:  "《预警期刊》中科院预警期刊旨在提醒科研人员审慎选择成果发表平台、提示出版机构强化期刊质量管理，不建议把多年累积期刊列表合并使用。数据从高到低分为：高、中、低预警（2020-2023版）、显示具体预警原因（2024版），每年更新一次，数据来源为《中科院国际期刊预警名单（2020/2021/2023/2024）》",
        pubp: "《PubPeer》鼓励科研人员匿名对已发表论文进行评论，可以批评、质疑、改进和建议等，评论的问题多半是论文中捏造或是变造资料，或是有抄袭他人论文的情形，对此类文章请谨慎引用，数据来源为《PubPeer.com》",
        tip:  "\r\nSciHub CRX 安装成功，即将加载数据，请按提示操作！\r\n\r\n功能简介：\r\n\r\n(1) 点击 SciHub CRX 图标，显示文章详细/下载/引用信息\r\n\r\n(2) 显示期刊详细等级信息（IF/分区/数据库收录情况等）\r\n\r\n(3) 中英互译：选中文字按 T 翻译，按 Y 取消（快捷键可改）\r\n\r\n"
    };
    const def = {
        version:  GM_info.script.version,
        mDOI:     /(10\.\d{4,9}\/[-._;()<>/:0-9a-zA-Z]+)\b/gi,
        msDOI:    /(10\.\d{4,9}\/[-._;()<>/:0-9a-zA-Z]+)(.*)/i,
        mDOIURL:  /^(?:https?:\/\/)(?:dx\.)?doi\.org\/(10\.\d{4,9}\/[-._;()<>/:0-9a-zA-Z]+)\b/i,
        mArXiv:   /arXiv:(\d{4}\.\d{4,5}[v\d+]*)\b/gi,
        mArXivURL:/^https?:\/\/arxiv\.org\/abs\/(\d{4}\.\d{4,5}[v\d+]*)\b/i,
        mPMID:    /PMID:?\s(\d{4,9})\b/gi,
        mPMIDURL: /^https?:\/\/((www|pubmed)\.ncbi\.nlm\.nih\.gov(\/pubmed)?|europepmc\.org\/article\/MED)\/\d{4,9}\b/i,
        mPMCID:   /PMC\s?\d{4,9}\b/gi,
        mPMCIDURL:/^https?:\/\/www\.ncbi\.nlm\.nih\.gov\/pmc\/articles\/pmc\d{4,9}\b/i,
        mSDIDURL:  /[^=]\/(science\/article|retrieve)(.*)\/pii\/[0-9a-zA-Z]+\b/i,
        mSetting: /scigreat\.com\/s\/app/i,
        doi:      "aHR0cHM6Ly9kb2kub3JnLw==",
        arxiv:    "aHR0cHM6Ly9hcnhpdi5vcmcvYWJzLw==",
        unpaywall:"aHR0cHM6Ly9hcGkub2Fkb2kub3JnL3YyLw==",
        crossref: "aHR0cHM6Ly9hcGkuY3Jvc3NyZWYub3JnL3dvcmtzLw==",
        openalex: "aHR0cHM6Ly9hcGkub3BlbmFsZXgub3JnL3dvcmtzL2h0dHBzOi8vZG9pLm9yZy8=",
        semantic: "aHR0cHM6Ly9hcGkuc2VtYW50aWNzY2hvbGFyLm9yZy9ncmFwaC92MS9wYXBlci8=",
        pubpeer:  "aHR0cHM6Ly9wdWJwZWVyLmNvbS9hcGkvc2VhcmNoLz9xPQ==",
        pmid: "aHR0cHM6Ly9wdWJtZWQubmNiaS5ubG0ubmloLmdvdi8=",
        pmcid:"aHR0cHM6Ly93d3cubmNiaS5ubG0ubmloLmdvdi9wbWMvYXJ0aWNsZXMv",
        oabtn:"aHR0cHM6Ly9hcGkub3BlbmFjY2Vzc2J1dHRvbi5vcmcvZmluZD9pZD0=",
        core: "aHR0cHM6Ly9hcGkuY29yZS5hYy51ay92My93b3Jrcy8=",
        cait: "cWdlbXY0anIxeTM4anlxNnZodmk=",
        bing: "aHR0cHM6Ly9jbi5iaW5nLmNvbQ==",
        bdt:  "aHR0cHM6Ly9mYW55aS5iYWlkdS5jb20=",
        ticb: "NmtleV93ZWJfZmFueWlpZmFueWl3ZWI4aGM5czk4ZQ==",
        cai:  "aHR0cHM6Ly9hcGkuaW50ZXJwcmV0ZXIuY2FpeXVuYWkuY29tL3Yx",
        sgt:  "aHR0cHM6Ly9mYW55aS5zb2dvdS5jb20vdGV4dD9rZXl3b3JkPQ==",
        ali:  "aHR0cHM6Ly90cmFuc2xhdGUuYWxpYmFiYS5jb20vYXBpL3RyYW5zbGF0ZS90ZXh0",
        csrf: "aHR0cHM6Ly90cmFuc2xhdGUuYWxpYmFiYS5jb20vYXBpL3RyYW5zbGF0ZS9jc3JmdG9rZW4=",
        ydm:  "aHR0cDovL20ueW91ZGFvLmNvbS90cmFuc2xhdGU=",
        ydf:  "aHR0cHM6Ly9mYW55aS55b3VkYW8uY29tL3RyYW5zbGF0ZT8mZG9jdHlwZT1qc29uJnR5cGU9",
        ydt:  "aHR0cHM6Ly9mYW55aS55b3VkYW8uY29tL3RyYW5zbGF0ZV9vP3NtYXJ0cmVzdWx0PWRpY3Qmc21hcnRyZXN1bHQ9cnVsZQ==",
        icb:  "aHR0cHM6Ly9pZmFueWkuaWNpYmEuY29tL2luZGV4LnBocD9jPXRyYW5zJm09ZnkmY2xpZW50PTYmYXV0aF91c2VyPWtleV93ZWJfZmFueWkmc2lnbj0=",
        sciencedirect:"aHR0cHM6Ly93d3cuc2NpZW5jZWRpcmVjdC5jb20vc2NpZW5jZS9hcnRpY2xlL3BpaS8=",
        arxiv_api: "aHR0cHM6Ly9leHBvcnQuYXJ4aXYub3JnL2FwaS9xdWVyeT9pZF9saXN0PQ==",
        pmid_api:  "aHR0cHM6Ly9hcGkubmNiaS5ubG0ubmloLmdvdi9saXQvY3R4cC92MS9wdWJtZWQvP2Zvcm1hdD1jc2wmaWQ9",
        pmcid_api: "aHR0cHM6Ly9hcGkubmNiaS5ubG0ubmloLmdvdi9saXQvY3R4cC92MS9wbWMvP2Zvcm1hdD1jc2wmaWQ9",
        pmid_cite: "aHR0cHM6Ly9ldXRpbHMubmNiaS5ubG0ubmloLmdvdi9lbnRyZXovZXV0aWxzL2VsaW5rLmZjZ2k/ZGJmcm9tPXB1Ym1lZCZsaW5rbmFtZT1wdWJtZWRfcHVibWVkX2NpdGVkaW4maWQ9",
        pmid_abs:  "aHR0cHM6Ly9ldXRpbHMubmNiaS5ubG0ubmloLmdvdi9lbnRyZXovZXV0aWxzL2VmZXRjaC5mY2dpP2RiPXB1Ym1lZCZpZD0=",
        pCiteUrl:  "aHR0cHM6Ly9wdWJtZWQubmNiaS5ubG0ubmloLmdvdi8/bGlua25hbWU9cHVibWVkX3B1Ym1lZF9jaXRlZGluJmZyb21fdWlkPQ==",
        doi2pmid:  "aHR0cHM6Ly93d3cubmNiaS5ubG0ubmloLmdvdi9wbWMvdXRpbHMvaWRjb252L3YxLjAvP2lkdHlwZT1kb2kmZm9ybWF0PWpzb24mdG9vbD1kb2kycG1pZCZpZHM9",
        crosscite: "aHR0cHM6Ly9jaXRhdGlvbi5jcm9zc2NpdGUub3JnL2Zvcm1hdD9zdHlsZT0=",
        t_reqr: "aHR0cHM6Ly9hcGkuc3NzYW0uY29tL2RhdGE/Y2lkPXNjaWNyeA==",
        t_tua:  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    };
    const sci_code = { IF: ["A", "ccif"], Bank: ["CA", "cbank"], JCR: ["C", "cjcr"], CAS: ["D", "ccas"], Top: ["E", "ctop"], EI: ["F", "ccei"], CSCD: ["G", "cscd"], 北大核心: ["H", "cpku"], 预警期刊: ["S", "csos"] };
    const warning_ico = `<svg class="scicon" viewBox="0 0 1295 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M1276.114671 845.562676L753.465992 51.804384a115.120854 115.120854 0 0 0-191.100618 0L20.14615 843.835863A115.120854 115.120854 0 0 0 115.120854 1024h1064.867904a115.120854 115.120854 0 0 0 96.125913-178.437324z m-617.047779 70.223721a86.340641 86.340641 0 1 1 86.34064-86.340641 86.340641 86.340641 0 0 1-86.34064 86.340641zM762.100056 322.338392l-38.565486 306.221473a65.043283 65.043283 0 0 1-129.510961 0L556.033727 322.338392A86.340641 86.340641 0 0 1 633.164699 225.636875h45.472738a86.340641 86.340641 0 0 1 83.462619 96.701517z" fill="#F03535"></path><path d="M676.33502 225.06127H633.164699A86.340641 86.340641 0 0 0 556.033727 322.338392l38.565486 306.221473a65.043283 65.043283 0 0 0 129.510961 0l38.565486-306.221473a86.340641 86.340641 0 0 0-85.765036-97.277122z" fill="#FFFFFF" p-id="8187"></path><path d="M659.066892 829.445756m-86.340641 0a86.340641 86.340641 0 1 0 172.681281 0 86.340641 86.340641 0 1 0-172.681281 0Z" fill="#FFFFFF"></path></svg>`;
    const sci_Panel = '<div id="scicrx-info-panel"><div class="scicrxPanel notranslate" translate="no"><div class="scicrxBar"><div class="sCloseBtn"title="Close the Paper Info Panel">✕</div><div class="sInfoBtn">SciHub CRX v' + def.version + '</div><div class="sRefreshBtn"title="Refresh the Paper Infomation">◐</div></div><div class="scicrxView"><div class="sciTerm"></div><div class="sciCard"><div class="swcard seTitle"><span class="sePaper"></span></div><div class="swcard seDOI"><div class="scixName">DOI</div><div class="scixValue"><span><a></a></span><span><img class="sCopyIcon"></span></div></div><div class="swcard sePMID"><div class="scixName">PMID</div><div class="scixValue"><span><a></a></span><span><img class="sCopyIcon"></span></div></div><div class="swcard sePMCID"><div class="scixName">PMCID</div><div class="scixValue"><span><a></a></span><span><img class="sCopyIcon"></span></div></div><div class="swcard seType"><div class="scixName">Type</div><div class="scixValue stype"></div></div><div class="swcard seJourrnal"><div class="scixName">Journal</div><div class="scixValue sjournal"></div></div><div class="swcard seISSN"><div class="scixName">ISSN</div><div class="scixValue sissn"></div></div><div class="swcard seInfo"><div class="scixName">Rank</div><div class="scixValue"></div></div><div class="swcard sePublisher"><div class="scixName">Publisher</div><div class="scixValue spublisher"></div></div><div class="swcard seAuthor"><div class="scixName">Author</div><div class="scixValue sauthor"><span></span></div></div><div class="swcard seYear"><div class="scixName">Year</div><div class="scixValue syear"></div></div><div class="swcard seCited"><div class="scixName">Citation</div><div class="scixValue scited" title="Cited Count in CrossRef"></div></div><div class="swcard seWebsite"><div class="scixName">Website</div><div class="scixLink seWeb"></div></div><div class="swcard seFile"><div class="scixName">Find PDF</div><div class="scixLink sePDF"></div></div></div></div><div class="scicrxAbs"><img class="banner_wx"alt="微信扫码关注公众号"title="微信扫码关注公众号"src="https://pic.rmb.bdstatic.com/bjh/61d680b9e58cfc99f4a48d4236f250d6.png"></div></div></div>';
    const scicrx_filter = '<div class="scicrx-filter"><div class="choice-block"><span class="htitle">SciHub CRX Filter</span><span class="hshow">隐藏</span></div><form id="sci-if-order"><div class="choice-block"><strong class="ftitle">`IF影响因子排序</strong><ul class="items"><li><input type="checkbox"id="sci-if-up"name="if-order"value="1"><label for="sci-if-up">升序</label></li><li><input type="checkbox"id="sci-if-down"name="if-order"value="2"><label for="sci-if-down">降序</label></li></ul></div></form><form id="sci-jci-order"><div class="choice-block"><strong class="ftitle">`JCI引文指标排序</strong><ul class="items"><li><input type="checkbox"id="sci-jci-up"name="jci-order"value="1"><label for="sci-jci-up">升序</label></li><li><input type="checkbox"id="sci-jci-down"name="jci-order"value="2"><label for="sci-jci-down">降序</label></li></ul></div></form><form id="sci-cited-order"><div class="choice-block"><strong class="ftitle">`引用次数排序</strong><ul class="items"><li><input type="checkbox"id="sci-cited-up"name="cited-order"value="1"><label for="sci-cited-up">升序</label></li><li><input type="checkbox"id="sci-cited-down"name="cited-order"value="2"><label for="sci-cited-down">降序</label></li></ul></div></form><form id="sci-year-order"><div class="choice-block"><strong class="ftitle">`发表年份排序</strong><ul class="items"><li><input type="checkbox"id="sci-year-up"name="year-order"value="1"><label for="sci-year-up">升序</label></li><li><input type="checkbox"id="sci-year-down"name="year-order"value="2"><label for="sci-year-down">降序</label></li></ul></div></form><form id="sci-jcr-cas-top"><div class="choice-block"><strong class="ftitle">`TOP期刊 / Review文章</strong><ul class="items"><li><input type="checkbox"id="sci-top"name="sci-top"value="Top"><label for="sci-top">TOP期刊</label></li><li><input type="checkbox"id="sci-review"name="sci-review"value="Review"><label for="sci-review">Review文章</label></li></ul></div><div class="choice-block"><strong class="ftitle">`JCR / CAS分区</strong><ul class="items"><li><input type="checkbox"id="sci-jcr-1"name="sci-jcr"value="Q1"checked><label for="sci-jcr-1">Q1</label></li><li><input type="checkbox"id="sci-jcr-2"name="sci-jcr"value="Q2"checked><label for="sci-jcr-2">Q2</label></li><li><input type="checkbox"id="sci-jcr-3"name="sci-jcr"value="Q3"checked><label for="sci-jcr-3">Q3</label></li><li><input type="checkbox"id="sci-jcr-4"name="sci-jcr"value="Q4"checked><label for="sci-jcr-4">Q4</label></li></ul><ul class="items"><li><input type="checkbox"id="sci-cas-1"name="sci-cas"value="C1"checked><label for="sci-cas-1">C1</label></li><li><input type="checkbox"id="sci-cas-2"name="sci-cas"value="C2"checked><label for="sci-cas-2">C2</label></li><li><input type="checkbox"id="sci-cas-3"name="sci-cas"value="C3"checked><label for="sci-cas-3">C3</label></li><li><input type="checkbox"id="sci-cas-4"name="sci-cas"value="C4"checked><label for="sci-cas-4">C4</label></li></ul></div></form></div>';
    const rank = { cscd: ["核心库", "扩展库"], bank: ["SCIE", "SSCI", "ESCI", "AHCI", "SCIE/SSCI", "SCIE/SSCI/AHCI", "SCIE/AHCI", "SSCI/AHCI"], sos: ["高预警", "中预警", "低预警", "引用操纵", "引用操纵/论文工厂", "论文工厂", "论文工厂/CN作者占比畸高", "CN作者占比畸高"] };
    
    let base = {
        dz(str) {
            return decodeURIComponent(escape(atob(str)));
        },
        ez(str) {
            return btoa(unescape(encodeURIComponent(str)));
        },
        d(str) {
            const binary = atob(str);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return new TextDecoder().decode(bytes);
        },
        e(str) {
            const bytes = new TextEncoder().encode(str);
            return btoa(String.fromCharCode(...bytes));
        },
        deURL(str) {
            return decodeURIComponent(str);
        },
        enURL(str) {
            return encodeURIComponent(str);
        },
        setV(name, value) {
            GM_setValue(name, value);
        },
        getV(name) {
            return GM_getValue(name);
        },
        delV(name) {
            GM_deleteValue(name);
        },
        open(url) {
            GM_openInTab(url, { active: true });
        },
        isType(obj) {
            return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
        },
        get(url, type) {
            return new Promise((resolve,reject) => {
                GM_xmlhttpRequest({
                    method: "GET", url,
                    timeout: 1.5e4,
                    responseType: type ? "text" : "json",
                    onload: (res) => {
                        resolve(res.response || res.responseText);
                    },
                    onerror: (e) => {
                        resolve("");
                    },
                    ontimeout: (e) => {
                        resolve("");
                    }
                });
            });
        },
        post(url, data, headers, h) {
            if (this.isType(data) === "object") { data = JSON.stringify(data); }
            headers === undefined || headers.length == 0 ? headers = h === undefined ?
                { "Content-Type": "application/x-www-form-urlencoded" } : { "Content-Type": "application/json", "User-Agent": def.t_tua } : "";
            return new Promise((resolve,reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url,data, headers,
                    responseType: "json",
                    onload: (res) => {
                        resolve(res.response || res.responseText);
                    },
                    onerror: (e) => {
                        resolve("");
                    }
                });
            });
        },
        runRegexOnDoc(re, host) {
            if (!host || host == myHost) {
                let m = re.exec(docAsStr);
                if (m && m.length > 1) return m[1];
            }
            return false;
        },
        t(reg) {
            return reg.test(myHost.replace(/[-_]/gi,"."));
        },
        md5(str, m, n) {
            if (str) {
                str = CryptoJS.MD5(str).toString();
                if (!m) str = str.toUpperCase();
                if (!n) str = str.substring(8, 24);
            }
            return str;
        },
        deltaT(preT) {
            return Date.now() - preT;
        },
        toDay(tt,ok) {
            tt = new Date(tt);
            if (ok) return `${tt.getFullYear()}-${tt.getMonth() < 9 ? "0" : ""}${tt.getMonth() + 1}-${tt.getDate() <= 9 ? "0" : ""}${tt.getDate()}`;
            return tt.getFullYear() + "年" + (tt.getMonth() + 1) + "月" + tt.getDate() + "日";
        },
        compare(i, e, type) {
            let r = new Map(), num = type ? 0.88 : 0.95;
            for (let t = 0; t < e.length - 1; t++) {
                let i = e.substring(t, t + 2), s = r.has(i) ? r.get(i) + 1 : 1;
                r.set(i, s);
            }
            let s = 0;
            for (let t = 0; t < i.length - 1; t++) {
                let e = i.substring(t, t + 2), n = r.has(e) ? r.get(e) : 0;
                0 < n && (r.set(e, n - 1), s++);
            }
            if (2 * s / (e.length + i.length - 2) >= num) return i;
            return;
        },
        addStyle(id, tag, css) {
            let doc = document, styleDom = doc.getElementById(id), style = doc.createElement(tag);
            if (styleDom) return;
            style.id = id;
            style.innerHTML = css;
            doc.getElementsByTagName("head")[0].appendChild(style);
        },
        message(text, type, cBtn, dBtn, eBtn, t, url, center, cBtnTxt) {
            const toast = Swal.mixin({
                toast: true,
                position: center ? "center" : "top",
                showConfirmButton: cBtn || false,
                confirmButtonText: cBtnTxt || "登录账号",
                showDenyButton: dBtn || false,
                denyButtonText: "今天不再提醒",
                showCancelButton: eBtn || false,
                cancelButtonText: "关闭",
                timer: t || 4e3,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener("mouseenter", Swal.stopTimer);
                    toast.addEventListener("mouseleave", Swal.resumeTimer);
                }
            });
            toast.fire({
                title: text,
                icon: type || "success"
            }).then((res) => {
                if (res.isConfirmed) {
                    base.open(url);
                } else if (res.isDenied) {
                    base.setV("dialog_time", Date.now());
                }
            });
        }
    };

    let load = {
        initConfig() {
            initOption = {
                "uclass_open": true,
                "float_open" : false,
                "trans_open" : true,
                "link_open"  : true,
                "rank_open"  : true,
                "trans_tip"  : true,
                "trans_key"  : ["T", "Y"],
                "tran_engine": "SG",
                "trans_color" : "#1b538c",
                "scicrx_color": "#1b538c",
                "scicrx_rank"  : ["IF", "Bank", "JCR", "CAS", "Top", "EI", "CSCD", "北大核心", "预警期刊"],
                "scicrx_uclass": ["985", "211", "双一流", "C9", "E9", "G7", "Z14", "QS", "Times", "RK"],
                "rank_font"  : "13",
                "rank_style" : "Style 1",
                "libgen_url" : "https://libgen.bz",
                "scihub_url" : "https://www.sci-hub.ren",
                "google_url" : "scholar.google.com"
            };
            odata = base.getV("odata");
            if (odata === undefined) {
                odata = initOption;
                base.setV("odata", initOption);
                base.setV("firstInstalled", true);
                base.message(intro.tip, "info");
                setTimeout(() => { location.reload(); }, 4e3);
            }
            if (odata) {
                for (let k in initOption) {
                    if (odata[k] === undefined) {
                        odata[k] = initOption[k];
                        base.setV("odata", odata);
                    }
                }
            }
        },
        async getBaseData() {
            if (navigator && navigator.userAgent) {
                let brs = {
                    "Edge": /Edge?\/([0-9\._]+)/i,
                    "Chrome": /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/i,
                    "Firefox": /Firefox\/([0-9\.]+)(?:\s|$)/i,
                    "Safari": /Version\/([0-9\._]+).*Safari/i
                };
                for (let key in brs) {
                    if (brs[key].test(navigator.userAgent)) {
                        browser = key;
                        break;
                    }
                }
            }
            if (browser != "Safari") {
                ((scope,GM)=>{if(GM_info.scriptHandler!=="Tampermonkey"||compareVersions(GM_info.version,"5.3.2")<0)return;let GM_xmlhttpRequestOrig=GM_xmlhttpRequest,GM_xmlHttpRequestOrig=GM.xmlHttpRequest;function compareVersions(v1,v2){let parts1=v1.split(".").map(Number),parts2=v2.split(".").map(Number),length=Math.max(parts1.length,parts2.length);for(let i=0;i<length;i++){let num1=parts1[i]||0,num2=parts2[i]||0;if(num1>num2)return 1;if(num1<num2)return-1}return 0}function GM_xmlhttpRequestWrapper(odetails){if(odetails.redirect!==undefined){return GM_xmlhttpRequestOrig(odetails)}let{onload,onloadend,onerror,onabort,ontimeout,...details}=odetails;let handleRedirects=(initialDetails)=>{let request=GM_xmlhttpRequestOrig({...initialDetails,redirect:"manual",onload:function(response){if(response.status>=300&&response.status<400){let m=response.responseHeaders.match(/Location:\s*(\S+)/i),redirectUrl=m&&m[1];if(redirectUrl){let absoluteUrl=new URL(redirectUrl,initialDetails.url).href;handleRedirects({...initialDetails,url:absoluteUrl});return}}if(onload)onload.call(this,response);if(onloadend)onloadend.call(this,response)},onerror:function(response){if(onerror)onerror.call(this,response);if(onloadend)onloadend.call(this,response)},onabort:function(response){if(onabort)onabort.call(this,response);if(onloadend)onloadend.call(this,response)},ontimeout:function(response){if(ontimeout)ontimeout.call(this,response);if(onloadend)onloadend.call(this,response)}});return request};return handleRedirects(details)}function GM_xmlHttpRequestWrapper(odetails){let abort;let p=new Promise((resolve,reject)=>{let{onload,ontimeout,onerror,...send}=odetails;send.onerror=function(r){if(onerror){resolve(r);onerror.call(this,r)}else{reject(r)}};send.ontimeout=function(r){if(ontimeout){resolve(r);ontimeout.call(this,r)}else{reject(r)}};send.onload=function(r){resolve(r);if(onload)onload.call(this,r)};let a=GM_xmlhttpRequestWrapper(send).abort;if(abort===true){a()}else{abort=a}});p.abort=()=>{if(typeof abort==="function"){abort()}else{abort=true}};return p}GM_xmlhttpRequest=GM_xmlhttpRequestWrapper;scope.GM_xmlhttpRequestOrig=GM_xmlhttpRequestOrig;Object.defineProperties(GM,{"xmlHttpRequest":{get:()=>GM_xmlHttpRequestWrapper,set:(value)=>{GM.xmlHttpRequestOrig=value},configurable:true},"xmlHttpRequestOrig":{value:GM_xmlHttpRequestOrig,writable:true,configurable:true}})})(this,typeof GM!=="undefined"?GM:{});
            }
            let first = base.getV("firstInstalled");
            let rUrl = base.d(def.t_reqr) + `&br=${browser.toLowerCase()}&v=${def.version}`;
            let td = base.getV("tdata"), td_time = base.getV("tdata_time");
            if (!td || td == "undefined" || !td_time || base.deltaT(td_time) > 5e8) {
                let res = await base.get(rUrl);
                if (res) {
                    td = res.info;
                    base.setV("tdata", td);
                    base.setV("tdata_time", Date.now());
                    if (res.version > def.version) base.setV("newVersion", res.version);
                }
                if (first) {
                    base.delV("firstInstalled");
                }
            }
            if (td) { tdata = JSON.parse(base.d(td)); }
            if (base.getV("sdata")) { sdata = base.getV("sdata"); }
            if (base.getV("odata")) {
                odata = base.getV("odata");
                Target = odata.link_open ? "_blank" : "_self";
                scihub_link = tdata.scihub ? tdata.scihub : odata.scihub_url;
                libgen_link = tdata.libgen ? tdata.libgen : odata.libgen_url;
            }
            !rankSite && await utils.getRankSite();
        },
        async getRankData() {
            if (!$.isEmptyObject(tdata) && !/(Android|iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                let gitee = tdata.gitee, github = tdata.github, gitlab = tdata.gitlab, gitcode = tdata.gitcode;
                let jtime = "jt_240622", jdata_time = base.getV("jdata_time");
                if (!jdata_time || jdata_time != jtime) {
                    base.delV("jdata");
                    base.delV("jssn");
                    base.delV("jabb");
                }
                base.delV("jabb_time");
                base.delV("jssn_time");
                let o_jdata = base.getV("jdata");
                let o_jssn = base.getV("jssn");
                let o_jabb = base.getV("jabb");
                if (!o_jdata || !o_jssn || !o_jabb) {
                    if ((!o_jdata || !o_jssn || !o_jabb) && gitlab) {
                        let dd = await base.get(gitlab.replace("jdata", "odata"));
                        if (dd && dd.jdata && dd.jssn && dd.jabb) {
                            o_jdata = dd.jdata;
                            o_jssn = dd.jssn;
                            o_jabb = dd.jabb;
                        }
                    }
                    if ((!o_jssn || !o_jdata || !o_jabb) && gitcode) {
                        let dd = await base.get(gitcode.replace("jdata", "odata"));
                        if (dd && dd.jdata && dd.jssn && dd.jabb) {
                            o_jdata = dd.jdata;
                            o_jssn = dd.jssn;
                            o_jabb = dd.jabb;
                        }
                    }
                    if ((!o_jssn || !o_jdata || !o_jabb) && gitee) {
                        let dd = await base.get(gitee.replace("jdata", "odata"));
                        if (dd && dd.jdata && dd.jssn && dd.jabb) {
                            o_jdata = dd.jdata;
                            o_jssn = dd.jssn;
                            o_jabb = dd.jabb;
                        }
                    }
                    if ((!o_jdata || !o_jssn || !o_jabb) && github) {
                        let dd = await base.get(github.replace("jdata", "odata"));
                        if (dd && dd.jdata && dd.jssn && dd.jabb) {
                            o_jdata = dd.jdata;
                            o_jssn = dd.jssn;
                            o_jabb = dd.jabb;
                        }
                    }
                    if (o_jdata && o_jssn && o_jabb) {
                        base.setV("jdata", o_jdata);
                        base.setV("jssn", o_jssn);
                        base.setV("jabb", o_jabb);
                        base.setV("jdata_time", jtime);
                    }
                }
                jdata = o_jdata ? JSON.parse(base.d(o_jdata.slice(5))) : {};
                jssn = o_jssn ? JSON.parse(base.d(o_jssn.slice(4))) : {};
                jabb = o_jabb ? JSON.parse(base.d(o_jabb.slice(4))) : {};
            }
        },
        registerMenu() {
            if (tdata) { 
                GM_registerMenuCommand("选项设置", () => { base.open(tdata.sciapp) });
                GM_registerMenuCommand("插件主页", () => { base.open(tdata.sciinfo) });
                GM_registerMenuCommand("学术网站", () => { base.open(tdata.scisite) });
                GM_registerMenuCommand("获取新版", () => { base.open(tdata.sciinfo) });
            }
        },
        addInitStyle() {
            let sel = "#scicrx", scicrx_color = odata.scicrx_color, trans_color = odata.trans_color;
            let css = $("#gs_top #gs_bdy").length ? ".adsbygoogle{display:none!important;}" : "";
            let rank_css = `span.sinfo{word-break:break-all;}span.sinfo,span.srankInfo{position:relative!important;font-size:13px!important;padding:0 7px!important;line-height:18px;color:#fff!important;cursor:pointer;font-style:normal;font-weight:initial;white-space:nowrap;border:initial!important;`;
            let sos_css = `svg.scicon > path:empty{display:initial!important}svg.scicon{position:relative;width:17px!important;height:15px!important;`;
            switch (odata.rank_style) {
                case "Style 2":
                    rank_css += `margin:0 2px!important;border-style:double!important;}.scolor-sos{background:#c6c6c6!important;}${sos_css}margin:0 0 -3px 0!important;}`;
                    break;
                case "Style 3":
                    rank_css += `margin:0 2px!important;border:1px solid #333333!important;}.scolor-sos{background:initial!important;}${sos_css}margin:0 0 -3px 0!important;}`;
                    break;
                case "Style 4":
                    rank_css += `margin:0!important;}span.scolor-sos{background:#c6c6c6!important;}${sos_css}margin:0 0 -3px 0!important;}`;
                    break;
                default:
                    rank_css += `border-radius:3px!important;margin:0 2px!important;}.scolor-sos{background:initial!important;}${sos_css}margin:0 0 -3px -6px!important;}`;
                    break;
            }
            if (/Apple/i.test(navigator.vendor || "")) rank_css += `span.sinfo{white-space:initial;}`;
            css +=
`${rank_css}
.translate_span {
	color: ${trans_color}
}
.scixName,.sCloseBtn,.sRefreshBtn,.citeIt-act,.ssetting-act {
	background: ${scicrx_color}
}
#scicrx-info-panel {
	position: fixed;
    top: 10%;
    right: 0;
    min-height: 550px;
    max-height: 660px;
    width: 350px;
	z-index: 9999999998!important;
	color: #333333!important;
	background-color: #ffffff;
	border-left-color: rgba(0,0,0,0.2);
	box-shadow: 0px 0px 20px #0000004d!important;
	border-radius: 5px 0px 0px 5px;
	font-size: 14px;
	cursor: auto
}
.scicrx-btnimg {
	height: 17px!important;
	width: 17px!important;
	min-width: 10px!important;
	min-height: 10px!important;
	margin-left: 3px!important;
	cursor: pointer!important;
	display: inline!important;
	vertical-align: initial!important;
	border: none!important;
	box-shadow: none!important;
}
.scicrxPanel {
	margin: 0 10px
}
.landing_sciadd,.swcard .sinfo,.ssetting-act {
	display: none
}
.scicrxPanel .main,.scicrxPanel .easyScholarDOI,.scicrxPanel .pp_comm,#swal2-title .scicrx-ico,#scicrx-cite .main,
#scicrx-cite .easyScholarDOI,#scicrx-cite .scicrx-ico,.flexrow.open-in-icons .scicrx-ico {
	display: none!important;
}
.seTitle,.scixName,.scixValue,.scixLink {
	line-height: 17px;
	text-align: left
}
div.scicrxBar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px 0
}
.sciCard .swcard {
	display: none;
	margin: 4px 0!important
}
.swcard a {
	border: none
}
.swcard img {
	display: initial
}
.seTitle {
	font-weight: bold;
	font-size: 15px;
	line-height: 20px!important
}
.scixValue a {
	color: #333333!important;
	font-weight: 400!important;
	text-decoration: none!important
}
.scolor-warning {
	background: #db2828!important;
	font-size: 12px;
	margin: 0 5px 0 0!important;
	padding: 1px 5px;
	border-radius: 2px
}
.scolor-warning a {
	color: #ffffff!important;
	text-decoration: none
}
.scixValue,.scixLink {
	width: 77%;
	max-height: 68px;
	word-break: break-all;
}
.seRank .scixValue {
	max-height: 124px;
}
.scixLink img {
	margin: 0 10px 0 0;
	padding: 0;
}
.swcard a:hover {
	text-decoration: underline!important
}
.ccif {
	margin-left: 0px!important
}
.sRefreshBtn {
	margin-left: auto
}
.sCopyIcon {
	width: 12px!important;
	height: 12px!important;
	filter: invert(26%) sepia(63%) saturate(859%) hue-rotate(175deg) brightness(92%) contrast(91%);
	cursor: pointer;
	padding: 0;
	margin: 0 0 0 2px;
}
.pdflink,.weblink {
	height: 16px!important;
	width: 16px!important;
}
.srankdiv {
	display: inline;
	margin: 0 2px;
	padding: 0!important;
}
.rankNoVIP {
	margin: 0 2px!important;
	cursor: pointer;
}
.srankInfo a {
	color: #fff!important
}
#scicrx-cite a::before,#scicrx-cite a::after,.swcard a::before,
.swcard a::after,.srankInfo::before,.srankInfo::after {
	content: none!important
}
.scolor-if {
	background: #ff0099!important
}
.scolor-jci {
	background: #9027ff!important
}
.scolor-1 {
	background: #00b155!important
}
.scolor-2 {
	background: #00c5ff!important
}
.scolor-3 {
	background: #e88b00!important
}
.scolor-4 {
	background: #9b8365!important
}
.scolor-5 {
	background: #7dd515!important
}
.scolor-6 {
	background: #ddaf00!important
}
.scolor-7 {
	background: #4569ff!important
}
.scolor-8 {
	background: #ff3f3f!important
}
.scolor-9 {
	background: #dd25ff!important
}
.scolor-10 {
	background: #6a9dd2!important
}
.scolor-11 {
	background: #3b9c92!important
}
.scolor-12 {
	background: #0c80b4!important
}
.sInfoBtn {
	align-self: center;
	font-weight: bold
}
.scicrxAbs {
	position: absolute;
	height: 22px!important;
	width: 310px!important;
	font-weight: bold;
	font-size: 13px;
	bottom: 10px;
	z-index: -1
}
.scicrxAbs .citebtn {
	display: flex
}
.citebtn .scixName {
	display: none;
	cursor: pointer
}
.scicrxAbs .ttip {
	width: 100%;
	font-size: 13px;
	text-align: center
}
.banner_wx {
	display: none;
	width: 310px!important;
	height: 72px!important
}
#scicrx-float-icon {
	position: fixed;
	top: 15%;
	right: 6%;
	cursor: pointer;
	z-index: 99999999999
}
.sfloatImg {
	height: 50px!important;
	width: 50px!important
}
.translate_span {
	font-weight: bold
}
.sciabs_open,.sciabs_close {
	margin: 0 2px;
	width: 16px;
	height: 16px;
	cursor: pointer
}
.scixName {
	width: 23%;
	color: #fff;
	text-align: center;
	align-self: flex-start;
	border-radius: 2px;
	margin-right: 5px
}
.sCloseBtn,.sRefreshBtn {
	color: #fff;
	padding: 4px 8px;
	cursor: pointer;
	border-radius: 3px;
	align-self: center;
	line-height: 18px;
	margin: 0;
}
.scicrxPanel,.sCloseBtn,.sInfoBtn,.sRefreshBtn,.sePaper,.scixName,.scixValue,.scixValue a,.sinfo,
.srankInfo,.scicrxAbs,.citeIt-close,.smry-close,.ssetting-close,.citeIt-detail div,.citeIt-detail a,
.citeIt-post label,.citeIt-act,.ssetting-body,.translate_span,.scicrx-filter,.choice-block label,.swal2-styled {
	font-family: Times New Roman,Times,STKaiTi,KaiTi,SimSun,Microsoft Yahei!important
}
.swal2-styled {
	font-size: 13px!important;
}
#swal2-title {
	text-align: initial!important;
	line-height: 1.3!important;
	font-size: 13px!important;
	font-family: Merriweather,Georgia,Cambria,"Times New Roman",Times,serif;
}
.scicrx-filter {
	border: dotted 1px;
	padding: 10px 5px 0;
	font-size: 14px
}
.choice-block {
	margin-bottom: 8px
}
.choice-block .htitle {
	text-transform: none;
	font-variant: none;
	font-weight: bold;
	font-size: 16px
}
.choice-block .hshow {
	float: right;
	cursor: pointer;
}
.choice-block .items {
	display: flex;
	padding: 0;
	margin: 0;
	list-style: none
}
.choice-block li {
	padding: 0;
	margin: 0
}
.choice-block label {
	padding: 0;
	margin: 5px 5px 0 5px;
}
.choice-block input[type=checkbox]+label::before {
	height: 1.4rem;
	width: 1.4rem
}
#scicrx-cite,#scicrx-smry,#scicrx-ssetting {
	position: fixed;
	z-index: 9999999999;
	font-size: 14px;
	color: #1a1a1a
}
.citeIt-cover,.smry-cover,.ssetting-cover {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background: rgba(0,0,0,0.7);
	z-index: 999
}
.citeIt-modal,.smry-modal,.ssetting-modal {
	background: #fff;
	padding: 22px;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	box-shadow: 0 2px 20px 0 rgba(0,0,0,0.2);
	border-radius: 5px;
	z-index: 9999
}
.citeIt-close,.smry-close,.ssetting-close {
	position: absolute;
	right: 4px;
	top: 4px;
	width: 18px;
	height: 18px;
	text-align: center;
	line-height: 18px;
	color: #666;
	font-size: 18px;
	cursor: pointer
}
.citeIt-body,.smry-body,.ssetting-body {
	padding: 0;
	width: 450px;
	background: none;
	border: 1px solid #d6d6d6;
	border-radius: 3px
}
.ssetting-input {
	padding: 5px;
	width: 439px;
	min-height: 125px;
	line-height: 1.3;
	border: 0px solid rgb(214,214,214);
	vertical-align: middle;
	resize: none
}
.citeIt-body input[type="radio"] {
	display: inline-block;
	position: relative;
	appearance: auto;
	cursor: pointer;
	margin: 0px 3px;
	padding: 0;
	border: 0;
	width: auto;
	height: auto;
	left: auto
}
.citeIt-pick {
	display: flex;
	justify-content: space-evenly;
	margin: 2px 0
}
.citeIt-post,.ssetting-post {
	padding: 8px 0;
	border-top: 1px solid #d6d6d6
}
.ssetting-post {
	text-align: center;
}
.citeIt-post label {
	display: inline-block;
	margin: 0 0 0 5px;
	padding: 0;
	color: #1a1a1a;
	text-transform: none!important;
	font-size: 13px;
	line-height: 1.0;
}
.citeIt-action,.ssetting-action {
	display: flex;
	justify-content: space-evenly;
	padding: 5px 0;
	border-top: 1px solid #d6d6d6;
}
.citeIt-act,.ssetting-act {
	padding: 3px 12px;
	cursor: pointer;
	color: white;
	border-radius: 2px
}
.citeIt-detail,.smry-detail {
	white-space: pre;
	word-break: break-all;
	line-height: 1.0;
	padding: 8px;
	max-height: 300px;
	overflow: hidden auto;
	font-family: monospace
}
.smry-detail {
	line-height: 1.3;
	border-bottom: 1px solid #d6d6d6;
}
.citeIt-detail a,.citeIt-detail a.visited,.citeIt-detail a:visited {
	color: #1a1a1a!important;
	font-weight: 400;
	text-decoration: none!important
}
@media (max-width: 720px) {
    .scicrx-filter {
        padding-left: 15px
    }
}`;
            if (odata.rank_font && odata.rank_font != 13) {
                css += `span.srankInfo{font-size:${odata.rank_font}px!important;}`;
            }
            base.addStyle("scicrx_style", "style", css);
            if (def.mSetting.test(myHref)) {
                let vip_db = "\u66f4\u591a\u671f\u520a\u5206\u533a\u6570\u636e", svipTip = " \u0056\u0049\u0050\u0020\u4e13\u5c5e", node = ["#tran_engine", "#google_url", "#rank_style"];
                $(sel).attr("version", def.version).attr("type", "scicrx");
                $(sel + " .scivip_db").attr("title", vip_db + " - " + svipTip);
                $(sel + " .scivip_db input").attr("disabled", true);
                $(sel + " .scivip_db .layui-form-checkbox").addClass("layui-checkbox-disabled layui-disabled");
                for (let i of node) {
                    $(sel + " " + i).attr("title", "\u6b64\u529f\u80fd\u4e3a" + svipTip);
                    $(sel + " " + i + " select").attr("disabled", true);
                    $(sel + " " + i + " .layui-form-select").addClass("layui-select-disabled layui-disabled");
                    $(sel + " " + i + " .layui-form-select input").addClass("layui-disabled").attr("disabled", true);
                    $(sel + " " + i + " .layui-anim-upbit").remove();
                }
                for (let k in odata) {
                    let spa = `${sel} #${k}`;
                    switch (k) {
                        case "trans_key":
                            $(spa).val(odata[k][0]);
                            $(sel + " #h" + k).val(odata[k][1]);
                            break;
                        case "scicrx_color": case "trans_color":
                            $(spa + " input").val(odata[k]);
                            $(spa + " .layui-colorpicker-trigger-span").css({ "background": odata[k] });
                            break;
                        case "scihub_url": case "libgen_url": case "google_url":
                        case "tran_engine": case "rank_style": case "rank_font":
                            $(spa + " dd[lay-value]").removeClass("layui-this");
                            $(spa + " option").each((i,e) => {
                                $(e).text() === odata[k] &&
                                $(e).attr("selected", true) &&
                                $(e).parent().parent().find("input").val(odata[k]) &&
                                $(e).parent().parent().find('dd[lay-value="' + $(e).val() + '"]').addClass("layui-this");
                            });
                        break;
                        case "scicrx_rank":
                            for (let rk of odata.scicrx_rank) {
                                $(`${spa} input[name="${rk}"]`).each((i,e) => {
                                    $(e).prop("checked", true) &&
                                    $(e.nextSibling).addClass("layui-form-checked") &&
                                    $(spa + "_order").append(`<span cid="${rk}">${rk}</span>`);
                                });
                            } break;
                        case "float_open": case "trans_open": case "link_open":
                        case "rank_open": case "uclass_open": case "trans_tip":
                            if (odata[k] === true) {
                                $(spa + " input").prop("checked", true);
                                $(spa + " .layui-form-switch").addClass("layui-form-onswitch");
                                $(spa + " em").text("ON");
                            } break;
                        default:
                            break;
                    }
                }
            }
            let check_vtime = base.getV("check_vtime");
            if (!check_vtime || base.deltaT(check_vtime) > 1e6) {
                let now_rank = ["IF", "Bank", "JCR", "CAS", "Top", "EI", "CSCD", "北大核心", "预警期刊"];
                let new_rank = [...odata.scicrx_rank].filter((rr) => rr && now_rank.includes(rr));
                odata.scicrx_uclass = [];
                odata.scicrx_rank = new_rank;
                odata.tran_engine = "SG";
                odata.rank_style = "Style 1";
                odata.google_url = "scholar.google.com";
                base.setV("odata", odata);
                base.setV("check_vtime", Date.now());
            }
            if (/sci-?hub\./i.test(myHref) || $("#input > form > input[name='request']").length || $("#main > form > #enter > textarea#request").length) {
                let purl = $("#pdf").attr("src"), doi = base.getV("scihub_doi");
                if (purl && purl.includes("//sci-hub")) {
                    purl = purl.replace("//sci-hub", "//www.sci-hub");
                    if (/^\/\//i.test(purl)) { purl = "https:" + purl; }
                    $("#pdf").attr("src", purl);
                }
                if (doi) { 
                    setTimeout(() => {
                        if ($("form > input[name='request']").length) {
                            $("form > input[name='request']").val(doi);
                            base.delV("scihub_doi");
                        }
                        if ($("#enter > textarea#request").length) {
                            $("textarea#request").val(doi);
                            base.delV("scihub_doi");
                        }
                    }, 1e3);
                }
            }
            if (/(libgen|llhlf|booksdl)\./i.test(myHref) || $("#formlibgen > div > input.form-control").length) {
                $("[id][style*='position'] > a[id][style]").each((i,e) => {
                    $(e).parent().hide();
                });
                let doi = base.getV("libgen_doi");
                if (doi) {
                    setTimeout(() => {
                    
                        if ($("#formlibgen > div > input").length) {
                            $("#formlibgen > div > input").val(doi);
                            base.delV("libgen_doi");
                        }
                        if ($("form > #searchform").length) {
                            $("form > #searchform").val(doi);
                            base.delV("libgen_doi");
                        }
                    }, 1e3);
                }
            }

        },
        pageListener() {
            doc.on("click", ".scicrx-ico", (e) => {
                if (e.currentTarget.className == "scicrx-ico pclked") {
                    e.currentTarget.className = "scicrx-ico";
                    $("#scicrx-info-panel").remove();
                } else {
                    $(".scicrx-ico").removeClass("pclked");
                    e.currentTarget.className = "scicrx-ico pclked";
                    let pid = $(e.currentTarget).attr("paper_id");
                    let pid_type = $(e.currentTarget).attr("paper_id_type");
                    $("#scicrx-info-panel").remove();
                    $("body").append(sci_Panel);
                    utils.getPaperInfo(pid, pid_type);
                }
            });
            doc.on("click", ".sRefreshBtn", () => {
                let pid = $("#scicrx-info-panel").attr("pid");
                let pid_type = $("#scicrx-info-panel").attr("pid-type");
                $(".scixLink").empty();
                utils.getPaperInfo(pid, pid_type, true);
                base.message("刷新成功！");
            });
            doc.on("click", ".sCopyIcon", (e) => {
                let copyid = $(e.currentTarget).attr("copyid");
                if (copyid) {
                    GM_setClipboard(copyid);
                    base.message("复制成功 - " + copyid);
                } else {
                    base.message("复制失败 - " + copyid);
                }
            });
            doc.on("click", ".sCloseBtn", () => { $("#scicrx-info-panel").remove(); $(".scicrx-ico").removeClass("pclked"); });
            doc.on("click", ".cite-cover", () => { $("#scicrx-cite").remove(); });
            doc.on("click", ".cite-close", () => { $("#scicrx-cite").remove(); });
            doc.on("click", ".citebtn .scixName", () => {
                base.message("\u6b64\u529f\u80fd\u4e3a\u0020\u0056\u0049\u0050\u0020\u4e13\u5c5e\uff0c\u70b9\u51fb\u4e86\u89e3\u0020\u0056\u0049\u0050\u0020\u529f\u80fd\uff01", "info", true, false, true, 8e3, tdata.sciinfo, true, "点击查看");
            });
            doc.on("click", ".sciabs_open", (e) => {
                let id = $(e.currentTarget).attr("cid");
                e.currentTarget.className = "sciabs_close";
                e.currentTarget.title = "点击折叠摘要内容";
                $(".docsum-title[data-ga-label='" + id + "']").parent().find(".sciabs_abb").hide();
                $(".docsum-title[data-ga-label='" + id + "']").parent().find(".sciabs_full").show();
            });
            doc.on("click", ".sciabs_close", (e) => {
                let id = $(e.currentTarget).attr("cid");
                e.currentTarget.className = "sciabs_open";
                e.currentTarget.title = "点击展开摘要内容";
                $(".docsum-title[data-ga-label='" + id + "']").parent().find(".sciabs_full").hide();
                $(".docsum-title[data-ga-label='" + id + "']").parent().find(".sciabs_abb").show();
            });
            doc.on("click", ".items input[name='if-order']", (e) => {
                if (e.currentTarget.value == "1") $("#sci-if-down").prop("checked",false);
                if (e.currentTarget.value == "2") $("#sci-if-up").prop("checked",false);
                let cks = []; if ($(".full-docsum").length != dochtml.length) {
                    dochtml = [];
                    $(".full-docsum").each(function () {
                        dochtml.push($(this).html());
                    })
                }
                $("input[name='if-order']").each(function () {
                    if ($(this).prop("checked")) cks.push($(this).val());
                });
                if (cks.includes("1")) pubmed.getOrder(dochtml, ".rimf", 1);
                if (cks.includes("2")) pubmed.getOrder(dochtml, ".rimf", 2);
                if (cks.length == 0) { pubmed.getOrder(dochtml, "span.position-number"); }
            });
            doc.on("click", ".items input[name='jci-order']", (e) => {
                if (e.currentTarget.value == "1") $("#sci-jci-down").prop("checked",false);
                if (e.currentTarget.value == "2") $("#sci-jci-up").prop("checked",false);
                let cks = [];
                if ($(".full-docsum").length != dochtml.length) {
                    dochtml = [];
                    $(".full-docsum").each(function () {
                        dochtml.push($(this).html());
                    })
                }
                $("input[name='jci-order']").each(function() {
                    if ($(this).prop("checked")) cks.push($(this).val());
                });
                if (cks.includes("1")) pubmed.getOrder(dochtml, ".rjci", 1);
                if (cks.includes("2")) pubmed.getOrder(dochtml, ".rjci", 2);
                if (cks.length == 0) { pubmed.getOrder(dochtml, "span.position-number"); }
            });
            doc.on("click", ".items input[name='cited-order']", (e) => {
                if (e.currentTarget.value == "1") $("#sci-cited-down").prop("checked",false);
                if (e.currentTarget.value == "2") $("#sci-cited-up").prop("checked",false);
                let cks = [];
                if ($(".full-docsum").length != dochtml.length) {
                    dochtml = [];
                    $(".full-docsum").each(function () {
                        dochtml.push($(this).html());
                    })
                }
                $("input[name='cited-order']").each(function() {
                    if ($(this).prop("checked")) cks.push($(this).val());
                });
                if (cks.includes("1")) pubmed.getOrder(dochtml, ".rcited", 1);
                if (cks.includes("2")) pubmed.getOrder(dochtml, ".rcited", 2);
                if (cks.length == 0) pubmed.getOrder(dochtml, "span.position-number");
            });
            doc.on("click", ".items input[name='year-order']", (e) => {
                if (e.currentTarget.value == "1") $("#sci-year-down").prop("checked",false);
                if (e.currentTarget.value == "2") $("#sci-year-up").prop("checked",false);
                let cks = [];
                if ($(".full-docsum").length != dochtml.length) {
                    dochtml = [];
                    $(".full-docsum").each(function () {
                        dochtml.push($(this).html());
                    })
                }
                $("input[name='year-order']").each(function() {
                    if ($(this).prop("checked")) cks.push($(this).val());
                });
                if (cks.includes("1")) pubmed.getOrder(dochtml, ".ryear", 1);
                if (cks.includes("2")) pubmed.getOrder(dochtml, ".ryear", 2);
                if (cks.length == 0) pubmed.getOrder(dochtml, "span.position-number");
            });
            doc.on("click", ".items input[name='sci-top']", () => {
                let cks = [];
                $("input[name='sci-top']").each(function () {
                    if ($(this).prop("checked")) cks.push($(this).val());
                });
                $(".full-docsum").each(function () {
                    if (cks.includes($(this).find(".rtop").text()) || cks.length == 0) {
                        $(this).slideDown();
                    } else {
                        $(this).slideUp();
                    }
                });
            });
            doc.on("click", ".items input[name='sci-review']", () => {
                let cks = [];
                $("input[name='sci-review']").each(function () {
                    if ($(this).prop("checked")) cks.push($(this).val());
                });
                $(".full-docsum").each(function () {
                    if (cks.includes($(this).find(".rtype").text()) || cks.length == 0) {
                        $(this).slideDown();
                    } else {
                        $(this).slideUp();
                    }
                });
            });
            doc.on("click", ".items input[name='sci-jcr']", () => {
                let cks = [];
                $("input[name='sci-jcr']").each(function () {
                    if ($(this).prop("checked")) cks.push($(this).val());
                });
                $(".full-docsum").each(function () {
                    if (cks.includes($(this).find(".rjcr").attr("val")) || cks.length == 4) {
                        $(this).slideDown();
                    } else {
                        $(this).slideUp();
                    }
                });
            });
            doc.on("click", ".items input[name='sci-cas']", () => {
                let cks = [];
                $("input[name='sci-cas']").each(function () {
                    if ($(this).prop("checked")) cks.push($(this).val());
                });
                $(".full-docsum").each(function () {
                    if (cks.includes($(this).find(".rcas").attr("val")) || cks.length == 4) {
                        $(this).slideDown();
                    } else {
                        $(this).slideUp();
                    }
                });
            });
            doc.on("click", "span.hshow", (e) => {
                let text = e.currentTarget.textContent;
                if (text.includes("显示")) {
                    e.currentTarget.textContent = "隐藏";
                    $(".scicrx-filter form[id]").show();
                    localStorage.scicrx_filter_show = 1;
                } else {
                    e.currentTarget.textContent = "显示";
                    $(".scicrx-filter form[id]").hide();
                    localStorage.scicrx_filter_show = 0;
                }
            });
            doc.on("click", "a.pdf_scihub", () => {
                let sd = base.getV("sdata");
                if (sd.doi) { base.setV("scihub_doi", sd.doi) }
            });
            doc.on("click", "a.pdf_libgen", () => {
                let sd = base.getV("sdata");
                if (sd.doi) { base.setV("libgen_doi", sd.doi) }
            });
            doc.on("click", ".sePDF > a[class^='pdf']", (e) => {
                let k = e.currentTarget.className, text = e.currentTarget.title;
                if (k != "pdf_scihub" && k != "pdf_libgen" && k != "pdf_arxiv") {
                    e.preventDefault();
                    base.message(text, "info", true, false, true, 8e3, tdata.sciinfo, true, "点击查看");
                } else {
                    return true;
                }
            });
            doc.on("click", "#scicrx .sciSave", () => {
                let sel = "#scicrx", option = {};
                for (let k in odata) {
                    let spa = sel + " #" + k;
                    switch (k) {
                        case "scicrx_color": case "trans_color": case "tran_engine":
                        case "scihub_url": case "libgen_url": case "google_url": case "rank_style": case "rank_font": {
                            let val = $(spa + " input").val();
                            option[k] = val ? val : odata[k];
                        } break;
                        case "trans_key": {
                            let val = $(spa).val(), hval = $(sel + " #h" + k).val();
                            option[k] = []; // 翻译快捷键
                            option[k][0] = val ? val : odata[k][0];
                            option[k][1] = hval ? hval : odata[k][1];
                        } break;
                        case "scicrx_rank":
                            option[k] = [];
                            $(spa + "_order > span").each((i,e) => {
                                let cc = $(e).attr("cid");
                                cc && option[k].push(cc);
                            });
                            break;
                        case "float_open": case "trans_open": case "link_open":
                        case "rank_open": case "trans_tip": { // 开关类的选项
                            let node = spa + " > input";
                            if ($(node).length) option[k] = $(node)[0].checked;
                        } break;
                        default:
                            option[k] = odata[k];
                            break;
                    }
                }
                base.setV("odata", option);
            });
            doc.on("click", "#scicrx .sciReset", () => {
                if (confirm("提示：即将进行初始化，所有设置将重置，确认吗？")) {
                    base.setV("odata", initOption);
                    base.message("设置初始化成功，插件重启中！");
                    setTimeout(() => { location.replace(tdata.sciapp); }, 1.5e3);
                }
            });
            doc.on("click", "#scicrx .sciDelete", () => {
                let del_time = base.getV("del_time");
                if (!del_time || base.deltaT(del_time) > 1.8e6) {
                    if (confirm("警告！！！！！！\n\n除非脚本无法使用，否则不要删除所有数据！\n\n删除数据后无法<恢复数据>，你确认吗？")) {
                        base.delV("jtime");
                        base.delV("tdata_time");
                        base.setV("odata", initOption);
                        base.setV("del_time", Date.now());
                        base.message("数据删除成功，插件重启中！");
                        setTimeout(() => { location.replace(tdata.sciapp + "-vip"); }, 1.5e3);
                    }
                } else {
                    base.message("提示：30分钟内删除过所有数据，请30分钟后重试！", "info");
                }
            });
            doc.keydown((e) => {
                if (odata.trans_open && !def.mSetting.test(myHref)) {
                    let t_num = 0, keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
                    $(".translate_span").each((i,e) => {
                        let v = parseInt($(e).attr("value"));
                        if (v > t_num) t_num = v;
                    });
                    if (!tgoing && keyCode == odata.trans_key[0].charCodeAt(0)) {
                        let sCont, startNode, selected = window.getSelection();
                        selected && (sCont = selected.toString()) && (startNode = selected.getRangeAt(0));
                        if (sCont.length > 0) { startNode.collapse(false); utils.getTransInfo(sCont, startNode, t_num); }
                    } else if (keyCode == odata.trans_key[1].charCodeAt(0) && $(".translate_span").length) {
                        utils.getTransInfo(0,0,t_num);
                    }
                }
            });
        }
    };

    let findDOI = {
        fromMetaTags() {
            let pid, doiMetas = ["citation_doi", "doi", "dc.doi", "dc.identifier", "dc.identifier.doi", "bepress_citation_doi", "rft_id", "dcsext.wt_doi"];
            $("meta").each((i,e) => {
                if (!e.name || !doiMetas.includes(e.name.toLowerCase()) || (e.scheme && e.scheme.toLowerCase() != "doi")) return true;
                let metaDOI = e.content.replace("doi:","").replace(/https?:\/\/(www\.)?doi\.org\//i,"").trim();
                if (metaDOI.indexOf("10.") === 0) pid = metaDOI;
            });
            if (!pid) pid = $("meta[name='citation_pmid']").attr("content");
            return pid;
        },
        fromScienceDirect() {
            if (!/sciencedirect/i.test(myHost)) return;
            let sdoi = base.runRegexOnDoc(/SDM.doi\s*=\s*'([^']+)'/);
            if (sdoi) return sdoi;
            let doiEle = $("a[class='doi']");
            if (doiEle.length) {
                let m = doiEle[0].innerHTML.match(/doi\.org\/(.+)/);
                if (m && m.length > 1) return m[1];
            }
        },
        fromIeee() {
            return base.runRegexOnDoc(/"doi":"([^"]+)"/, "ieeexplore.ieee.org");
        },
        fromNumber() {
            return base.runRegexOnDoc(/Document Object Identifier \(DOI\): (10.*?)<\/p>/, "www.nber.org");
        },
        fromEpistemonikos() {
            if (!/epistemonikos\.org/.test(myHost)) return;
            let doiEle = $("a").filter(() => {
                return $(this).text() == "DOI";
            });
            if (doiEle.length) return doiEle[0].href;
        },
        fromPubmed() {
            if (!/ncbi\.nlm\.nih\.gov/.test(myHost)) return;
            let doiEle = $("a[ref='aid_type=doi']");
            if (doiEle.length) return doiEle[0].innerHTML;
        },
        fromPsycnet() {
            return base.runRegexOnDoc(/href="\/doi\/(10\..+?)"/, "psycnet.apa.org");
        },
        fromInderScienceOnline() {
            if (/(www\.)?inderscienceonline\.com/.test(myHost)) {
                let pbText = $("meta[name='pbContext']").attr("content");
                if (pbText) {
                    let m = /article:article:(10\.\d+[^;]*)/.exec(pbText);
                    if (m && m.length > 1) return m[1];
                }
            } return;
        },
        fromCairn() {
            if (/(www\.)?cairn\.info/.test(myHost)) {
                let linkUrls = $("div#article-details").find("a").map(() => { return this.href }).get();
                for (let i = 0; i < linkUrls.length; i++) {
                    let m = /https?:\/\/doi.org\/(10\.\d+\/.*)/.exec(linkUrls[i]);
                    if (m && m.length > 1) return m[1];
                }
            } return;
        },
        head() {
            let doiFinder = [
                findDOI.fromMetaTags,
                findDOI.fromScienceDirect,
                findDOI.fromIeee,
                findDOI.fromNumber,
                findDOI.fromPsycnet,
                findDOI.fromPubmed,
                findDOI.fromInderScienceOnline,
                findDOI.fromCairn,
                findDOI.fromEpistemonikos
            ];
            for (let i = 0; i < doiFinder.length; i++) {
                let myDoi = doiFinder[i]();
                if (myDoi) return myDoi;
            }
        }
    };

    let findInfo = {
        crossref(doi, isPubMed) {
            let email = "unpaywall" + random + "@impactstory.org", url = base.d(def.unpaywall) + doi + "?email=" + email;
            GM_xmlhttpRequest({
                method: "GET", url,
                responseType: "json",
                onload: (res) => {
                    if (res && res.status == 200 && res.response) {
                        let obj = res.response;
                        sdata.doi = doi;
                        try { if (!sdata.type) sdata.type = obj.genre; } catch (e) {}
                        try {
                            if (!sdata.title) {
                                let ptitle = obj.title.replace(/<\/?(su(b|p)|i|b|scp?|span)>|\n/gi, "");
                                sdata.title = ptitle
                            }
                        } catch (e) { }
                        try {
                            if (!sdata.author) {
                                let au = obj.z_authors, author = [];
                                for (let i in au) {
                                    if (au[i].raw_author_name) author.push([ au[i].raw_author_name ]);
                                }
                                if (author.length) sdata.author = author;
                            }
                        } catch (e) { }
                        try { if (!sdata.journal) sdata.journal = obj.journal_name.replace(/&amp;(amp;)?/gi, "&") } catch (e) {}
                        try { if (!sdata.publisher) sdata.publisher = obj.publisher } catch (e) {}
                        try {
                            if (!sdata.info) {
                                sdata.info = utils.getJourInfo(sdata.journal, [obj.journal_issn_l]);
                            }
                        } catch (e) { }
                        try {
                            if (obj.oa_locations) {
                                let oa = obj.oa_locations;
                                for (let i in oa) {
                                    if (oa[i].url_for_pdf) {
                                        sdata.pdf_oadoi = oa[i].url_for_pdf;
                                        break;
                                    } else if (/pmc\/articles\/PMC/i.test(oa[i].url)) {
                                        sdata.pdf_oadoi = oa[i].url;
                                        if (!/\/pdf/i.test(sdata.pdf_oadoi)) sdata.pdf_oadoi += "/pdf/";
                                        break;
                                    }
                                }
                            }
                        } catch (e) { }
                        base.setV("sdata", sdata);
                        for (let k in sdata) utils.updatePanel(k, sdata[k], random);
                    }
                }
            });
            url = base.d(def.crossref) + doi;
            GM_xmlhttpRequest({
                method: "GET", url,
                responseType: "json",
                onload: (res) => {
                    if (res && res.status == 200 && res.response) {
                        let obj = res.response;
                        if (obj.message) {
                            let m = obj.message; sdata.doi = doi;
                            try { if (!sdata.type || !/journal|book|monograph|proceedings/gi.test(sdata.type)) sdata.type = m.type; } catch (e) {}
                            try {
                                if (!sdata.title) {
                                    let ptitle = m.title[0].replace(/<\/?(su(b|p)|i|b|scp?|span)>|\n/gi, "");
                                    if (m.subtitle[0] && sdata.type != "journal-article") ptitle += ": " + m.subtitle[0];
                                    sdata.title = ptitle;
                                }
                            } catch (e) { }
                            try {
                                if (!sdata.year) {
                                    if (m.issued && m.issued["date-parts"]) sdata.year = m.issued["date-parts"][0][0];
                                }
                            } catch (e) {
                                if (m.published && m.published["date-parts"]) sdata.year = m.published["date-parts"][0][0];
                            }
                            try {
                                if (!sdata.author) {
                                    let au = m.author, author = [];
                                    for (let i in au) {
                                        au[i].name ? author.push([au[i].name]) : (au[i].given ? author.push([au[i].family, au[i].given]) : "");
                                    }
                                    if (author.length) sdata.author = author;
                                }
                            } catch (e) { }
                            try {
                                if (!sdata.editor) {
                                    let ed = m.editor, editor = [];
                                    for (let j in ed) editor.push([ed[j].family, ed[j].given]);
                                    if (editor.length) sdata.editor = editor;
                                }
                            } catch (e) { }
                            try { if (!sdata.volume) sdata.volume = m.volume; } catch (e) {}
                            try {
                                if (!sdata.issn) {
                                    sdata.issn = m.ISSN[0];
                                    if (m.ISSN[1]) sdata.issn = sdata.issn + "," + m.ISSN[1]
                                }
                            } catch (e) { }
                            try {
                                if (!sdata.jabb || /journal/gi.test(sdata.type)) sdata.jabb = m["short-container-title"][0].replace(/&amp;(amp;)?/gi, "&");
                            } catch (e) { }
                            try {
                                if (!sdata.journal || /journal/gi.test(sdata.type)) {
                                    sdata.journal = m["container-title"][1] ? m["container-title"][1] : m["container-title"][0];
                                    sdata.journal = sdata.journal.replace(/&amp;(amp;)?/gi, "&");
                                }
                            } catch (e) { }
                            try { if (!sdata.location) sdata.location = m["publisher-location"] ? m["publisher-location"] : m.event.location; } catch (e) {}
                            try { if (!sdata.publisher) sdata.publisher = m.publisher } catch (e) {}
                            try { if (!sdata.language) sdata.language = m.language; } catch (e) {}
                            try { if (!sdata.pages) sdata.pages = m.page; } catch (e) {}
                            try {
                                if (!sdata.issn) {
                                    sdata.issn = m.ISSN;
                                    if (/book|monograph/gi.test(sdata.type)) sdata.issn = m.ISBN;
                                }
                            } catch (e) { }
                            try { if (!sdata.cited_crossref) sdata.cited_crossref = m["is-referenced-by-count"] ? m["is-referenced-by-count"] : 0 } catch (e) {}
                            try { if (!sdata.web_crossref) sdata.web_crossref = m.resource.primary.URL; } catch (e) {}
                            try {
                                if (!sdata.abstract) {
                                    let ab = /<jats:p>(.*)<\/jats:p>/gi.exec(m.abstract);
                                    sdata.abstract = ab[1] ? ab[1] : m.abstract;
                                    sdata.abstract = sdata.abstract.replace(/<\/?jats:(i|b|p|bold|scp?|span|title|italic|sup|sub|styled-content)>|Abstract.?|\n/gi, "").trim();
                                }
                            } catch (e) {}
                            try {
                                if (!sdata.info) {
                                    if (sdata.type == "journal") sdata.journal = "";
                                    sdata.info = utils.getJourInfo(sdata.journal, m.ISSN);
                                }
                            } catch (e) { }
                            base.setV("sdata", sdata);
                            for (let k in sdata) utils.updatePanel(k, sdata[k], random);
                        }
                    }
                }
            });
            if (/\/arXiv/i.test(doi)) {
                this.arxiv(doi.slice(15));
            } else {
                if (!isPubMed) {
                    url = base.d(def.doi2pmid) + doi + "&email=" + email;
                    GM_xmlhttpRequest({
                        method: "GET", url,
                        responseType: "json",
                        onload: (res) => {
                            if (res && res.status == 200 && res.response) {
                                let obj = res.response;
                                try {
                                    if (obj.status == "ok") {
                                        let record = obj.records[0];
                                        if (record.pmid) {
                                            sdata.pmid = record.pmid;
                                            sdata.web_pmid = base.d(def.pmid) + record.pmid;
                                        }
                                        if (record.pmcid) {
                                            sdata.pmcid = record.pmcid;
                                            sdata.pdf_pmcid = base.d(def.pmcid) + record.pmcid + "/pdf/";
                                        }
                                        base.setV("sdata", sdata);
                                        for (let k in sdata) utils.updatePanel(k, sdata[k], random);
                                    }
                                } catch (e) {}
                            }
                        }
                    });
                }
                findPDF.scihub(doi);
                findPDF.libgen(doi);
                findPDF.openalex(doi);
                findPDF.semantic(doi);
                findPDF.oabtn(doi);
                findPDF.core(doi);
            }
            this.pubpeer(doi);
            this.website(doi);
            findPDF.OA(doi);
        },
        pubmed(pid) {
            let url;
            if (pid.includes("PMC")) {
                url = base.d(def.pmcid_api) + pid.slice(3);
            } else {
                url = base.d(def.pmid_api) + pid;
            }
            GM_xmlhttpRequest({
                method: "GET", url,
                responseType: "json",
                onload: (res) => {
                    if (res && res.status == 200 && res.response) {
                        let obj = res.response;
                        if (obj.PMID) {
                            sdata.pmid = obj.PMID; sdata.web_pmid = base.d(def.pmid) + obj.PMID;
                            try {
                                if (!sdata.type) {
                                    let s = { "article-journal": "journal-article", "book": "book", "chapter": "book-chapter", "article-proceedings": "proceedings-article" };
                                    sdata.type = s[obj.type] ? s[obj.type] : "";
                                }
                            } catch (e) { }
                            try { if (!sdata.title) { let ptitle = obj.title.replace(/<\/?(su(b|p)|i|b|scp?|span)>|\n/gi, ""); sdata.title = ptitle; } } catch (e) {}
                            try { if (!sdata.year) /\d{4}/i.exec(obj.issued["date-parts"][0])[0]; } catch (e) {}
                            try {
                                if (!sdata.author) {
                                    let au = obj.author, author = [];
                                    for (let i in au) {
                                        au[i].name ? author.push([au[i].name]) : (au[i].given ? author.push([au[i].family, au[i].given]) : "");
                                    }
                                    if (author.length) sdata.author = author;
                                }
                            } catch (e) { }
                            try {
                                if (!sdata.editor) {
                                    let ed = obj.editor, editor = [];
                                    for (let j in ed) editor.push([ed[j].family, ed[j].given]);
                                    if (editor.length) sdata.editor = editor;
                                }
                            } catch (e) { }
                            try { if (!sdata.journal) sdata.journal = obj["container-title"].replace(/&amp;(amp;)?/gi, "&"); } catch (e) {}
                            try { if (!sdata.jabb) sdata.jabb = obj["container-title-short"].replace(/&amp;(amp;)?/gi, "&"); } catch (e) {}
                            try { if (!sdata.location) sdata.location = obj["publisher-place"]; } catch (e) {}
                            try { if (!sdata.publisher) sdata.publisher = obj.publisher; } catch (e) {}
                            try { if (!sdata.pages) sdata.pages = obj.page; } catch (e) {}
                            try { if (!sdata.volume) sdata.volume = obj.volume; } catch (e) {}
                            try { if (!sdata.issue) sdata.issue = obj.issue; } catch (e) {}
                            try { if (!sdata.info) sdata.info = utils.getJourInfo(sdata.jabb); } catch (e) {}
                            this.pubpeer(obj.PMID);
                        }
                        if (obj.PMCID) {
                            sdata.pmcid = obj.PMCID;
                            sdata.pdf_pmcid = base.d(def.pmcid) + obj.PMCID + "/pdf/";
                        }
                        if (obj.DOI) {
                            sdata.doi = obj.DOI;
                            findInfo.crossref(obj.DOI, "pubmed");
                        }
                        base.setV("sdata", sdata);
                        for (let k in sdata) utils.updatePanel(k, sdata[k], random);
                    }
                }
            });
        },
        sciencedirect(pid) {
            let url = base.d(def.sciencedirect) + pid;
            GM_xmlhttpRequest({
                method: "GET", url,
                onload: (res) => {
                    if (res && res.status == 200 && res.response && !sdata.doi) {
                        let obj = $(res.response);
                        try {
                            sdata.doi = obj.filter("meta[name*='citation_doi']").attr("content") || obj.filter("meta[name='dc.identifier']").attr("content");
                            if (sdata.doi) {
                                base.setV("sdata", sdata);
                                for (let k in sdata) utils.updatePanel(k, sdata[k], random);
                                findInfo.crossref(sdata.doi);
                            }
                        } catch (e) {}
                    }
                }
            });
        },
        arxiv(pid) {
            let url = base.d(def.arxiv_api) + pid;
            GM_xmlhttpRequest({
                method: "GET", url,
                onload: (res) => {
                    if (res && res.responseXML) {
                        let entry = $(res.responseXML).find("entry");
                        try {
                            sdata.doi = "10.48550/arXiv." + pid;
                            sdata.arxiv = pid;
                            sdata.type = "journal-article";
                        } catch (e) { }
                        try {
                            let ptitle = $(entry).find("title").text().replace(/<\/?(su(b|p)|i|b|scp?|span)>|\n/gi, "");
                            sdata.title = ptitle;
                        } catch (e) { }
                        try { sdata.year = $(entry).find("updated").text().slice(0,4) } catch (e) {}
                        try {
                            sdata.journal = "arXiv.org";
                            sdata.jabb = "arXiv.org";
                        } catch (e) { }
                        try {
                            let au = $(entry).find("author name"), author = [];
                            for (let i in au) au[i].textContent ? author.push([au[i].textContent]) : "";
                            if (author.length) sdata.author = author;
                        } catch (e) { }
                        try {
                            let ab = $(entry).find("summary").text();
                            sdata.abstract = ab ? ab.replace(/<\/?jats:(i|b|p|bold|scp?|span|title|italic|sup|sub)>|Abstract.?|\n/gi, "").trim() : "";
                        } catch (e) { }
                    }
                }
            });
            sdata.web_arxiv = "https://arxiv.org/abs/" + pid;
            sdata.pdf_arxiv = "https://arxiv.org/pdf/" + pid;
            base.setV("sdata", sdata);
            for (let k in sdata) utils.updatePanel(k, sdata[k], random);
        },
        pubpeer(doi) {
            let url = base.d(def.pubpeer) + doi;
            GM_xmlhttpRequest({
                method: "GET", url,
                responseType: "json",
                onload: (res) => {
                    if (res && res.status == 200 && res.response) {
                        let obj = res.response, pubpeers = [0,0];
                        if (obj.publications[0]) {
                            let pub = obj.publications[0];
                            if (pub.comments_total) {
                                pubpeers[0] = doi;
                                if (pub.updates.data[0]) {
                                    let act = pub.updates.data[0].action;
                                    pubpeers[1] = act.charAt(0).toUpperCase() + act.toLowerCase().slice(1);
                                }
                            }
                            utils.updatePanel("pubpeer", pubpeers, random);
                        }
                        sdata.pubpeer = pubpeers; base.setV("sdata", sdata);
                    }
                }
            });
        },
        website(doi) {
            sdata.web_doi = base.d(def.doi) + doi;
            utils.updatePanel("web_doi", sdata.web_doi, random);
        }
    };

    let findPDF = {
        scihub(doi) {
            let url = scihub_link + "/" + doi;
            GM_xmlhttpRequest({
                method: "GET", url,
                onload: (res) => {
                    if (res && res.status == 200 && res.response) {
                        let surl = $(res.response).find("#pdf").attr("src") || $(res.response).find("#plugin").attr("original-url");
                        if (surl) {
                            sdata.pdf_scihub = scihub_link;
                            base.setV("sdata", sdata);
                            tdata.scilib && utils.updatePanel("pdf_scihub", sdata.pdf_scihub, random);
                        }
                    }
                }
            });
        },
        libgen(doi) {
            let url = libgen_link + "/ads.php?doi=" + doi;
            GM_xmlhttpRequest({
                method: "GET", url,
                onload: (res) => {
                    if (res && res.status == 200 && res.response) {
                        let gurl = $(res.response).find("a[href*='get.php']").attr("href");
                        if (gurl) {
                            sdata.pdf_libgen = libgen_link;
                            base.setV("sdata", sdata);
                            tdata.scilib && utils.updatePanel("pdf_libgen", sdata.pdf_libgen, random);
                        }
                    }
                }
            });
        },
        oabtn(doi) {
            let url = base.d(def.oabtn) + doi;
            GM_xmlhttpRequest({
                method: "GET", url,
                responseType: "json",
                onload: (res) => {
                    if (res && res.status == 200 && res.response) {
                        let obj = res.response;
                        if (obj.url) {
                            sdata.pdf_oabtn = obj.url;
                            if (/pmc\/articles\/PMC/i.test(sdata.pdf_oabtn) && !/\/pdf/i.test(sdata.pdf_oabtn)) sdata.pdf_oabtn += "/pdf/";
                            base.setV("sdata", sdata);
                            utils.updatePanel("pdf_oabtn", sdata.pdf_oabtn, random);
                        }
                    }
                }
            });
        },
        semantic(doi) {
            let url = base.d(def.semantic) + doi + "?fields=openAccessPdf";
            GM_xmlhttpRequest({
                method: "GET", url,
                responseType: "json",
                onload: (res) => {
                    if (res && res.status == 200 && res.response) {
                        let obj = res.response;
                        if (obj.paperId) {
                            sdata.web_semantic = "https://www.semanticscholar.org/paper/" + obj.paperId;
                            utils.updatePanel("web_semantic", sdata.web_semantic, random);
                        }
                        if (obj.openAccessPdf && obj.openAccessPdf.url) {
                            sdata.pdf_semantic = obj.openAccessPdf.url;
                            utils.updatePanel("pdf_semantic", sdata.pdf_semantic, random);
                        }
                        base.setV("sdata", sdata);
                    }
                }
            });
        },
        openalex(doi) {
            let url = base.d(def.openalex) + doi;
            GM_xmlhttpRequest({
                method: "GET", url,
                responseType: "json",
                onload: (res) => {
                    if (res && res.status == 200 && res.response) {
                        let obj = res.response;
                        if (obj.locations) {
                            let oa = obj.locations;
                            for (let i in oa) {
                                if (oa[i].pdf_url) {
                                    sdata.pdf_openalex = oa[i].pdf_url;
                                } else if (/pmc\/articles\/PMC/i.test(oa[i].landing_page_url)) {
                                    sdata.pdf_openalex = oa[i].landing_page_url;
                                    if (!/\/pdf/i.test(sdata.pdf_openalex)) sdata.pdf_openalex += "/pdf/";
                                }
                                if (sdata.pdf_openalex) {
                                    base.setV("sdata", sdata);
                                    utils.updatePanel("pdf_openalex", sdata.pdf_openalex, random);
                                    break;
                                }
                            }
                        }
                    }
                }
            });
        },
        core(doi) {
            let url = base.d(def.core) + doi;
            GM_xmlhttpRequest({
                method: "GET", url,
                responseType: "json",
                onload: (res) => {
                    if (res && res.status == 200 && res.response) {
                        let obj = res.response;
                        if (obj.downloadUrl) {
                            sdata.pdf_core = obj.downloadUrl;
                        } else if (obj.sourceFulltextUrls) {
                            for (let i in obj.sourceFulltextUrls) {
                                let url = obj.sourceFulltextUrls[i];
                                if (/(\/|\.)pdf/i.test(url)) {
                                    sdata.pdf_core = url;
                                    break;
                                }
                            }
                        }
                        if (sdata.pdf_core) {
                            base.setV("sdata", sdata);
                            utils.updatePanel("pdf_core", sdata.pdf_core, random);
                        }
                    }
                }
            });
        },
        OA(doi) {
            if (doi == findDOI.head()) {
                let pdfUrl;
                $("meta[name='citation_pdf_url']").each((i,e) => {
                    if (e.content) pdfUrl = e.content;
                });
                $("a").each((i,e) => {
                    if (/\/nature\/journal(.+?)\/pdf\/(.+?)\.pdf$/.test(e.href) || /\/articles\/nmicrobiol\d+\.pdf$/.test(e.href) || e.getAttribute("data-download-content") == "Article") {
                        pdfUrl = e.href;
                        return false;
                    }
                    if (myHost == "www.tandfonline.com" && /\/doi\/pdf\/10(.+?)needAccess=true$/i.test(e.href)) {
                        pdfUrl = e.href;
                        return false;
                    }
                    if (myHost == "www.cdc.gov" && e.classList[0] == "noDecoration" && /\.pdf$/.test(e.href)) {
                        pdfUrl = e.href;
                        return false;
                    }
                    if (myHost == "www.sciencedirect.com" && e.getAttribute("pdfurl")) {
                        pdfUrl = e.getAttribute("pdfurl");
                        return false;
                    }
                    if (myHost == "www.frontiersin.org" && /\/articles\/(.+?)\/pdf$/i.test(e.href)) {
                        pdfUrl = e.href;
                        return false;
                    }
                });
                let ieeePdf = base.runRegexOnDoc(/"pdfPath":"(.+?)\.pdf",/, "ieeexplore.ieee.org");
                if (ieeePdf) { pdfUrl = "https://ieeexplore.ieee.org" + ieeePdf + ".pdf"; }
                if (pdfUrl) {
                    if (/(hindawi|mdpi)\.com|(frontiersin)\.org/.test(pdfUrl)) {
                        sdata.pdf_OA = pdfUrl; base.setV("sdata", sdata);
                        utils.updatePanel("pdf_OA", pdfUrl, random);
                    } else {
                        $.get(pdfUrl, (res) => {
                            if (res && res.includes("%PDF")) {
                                sdata.pdf_OA = pdfUrl;
                                base.setV("sdata", sdata);
                                utils.updatePanel("pdf_OA", pdfUrl, random);
                            }
                        });
                    }
                }
            }
        }
    };

    let pubmed = {
        getOrder(arr, node, order) {
            for (let i = 0; i <= arr.length - 1; i++) {
                for (let j = 0; j <= arr.length - 1 - i; j++) {
                    let temp, m, n;
                    if (!order) {
                        m = parseFloat($(arr[j]).find(node).text());
                        n = parseFloat($(arr[j+1]).find(node).text());
                    } else {
                        m = parseFloat($(arr[j]).find(node).attr("val"));
                        n = parseFloat($(arr[j+1]).find(node).attr("val"));
                        if (!m) m = 0; if (!n) n = 0;
                    }
                    if (m < n) { temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp; }
                }
            }
            $(".full-docsum").each(function (i) {
                $(this).empty();
                if (order == 2) {
                    $(this).append(arr[i]);
                } else {
                    $(this).append(arr[arr.length - i - 1]);
                }
            });
        },
        getCite(pmid, head) {
            let ptext = pmid.length == 1 ? pmid[0] : pmid.join("&id="), url = base.d(def.pmid_cite) + ptext;
            if (head) {
                $("h1.heading-title").attr("cited", "1");
            } else {
                for (let id of pmid) {
                    $(".docsum-title[data-ga-label='" + id + "']").attr("cited", "1");
                }
            }
            GM_xmlhttpRequest({
                method: "GET", url,
                onload: (res) => {
                    if (res && res.responseXML) {
                        $(res.responseXML).find("IdList Id").each((i,e) => {
                            let id = $(e).text(), citeNum = 0, citeUrl = base.d(def.pCiteUrl) + id, srankdiv = head ? $("h1.heading-title").parent() : $(".docsum-title[data-ga-label='" + id + "']").parent();
                            citeNum = $(e).parent().parent().find("Link Id").length;
                            if (citeNum) {
                                let citeSpan = `<span class="srankInfo rcited scolor-7" val="${citeNum}" title="此文章被引 ${citeNum} 次，引用数据来自PubMed，点击查看详细信息"><a href="${citeUrl}" target="_blank" pcked="1">Cited ${citeNum}</a></span>`,
                                citeDiv = `<div class="srankdiv notranslate" translate="no">${citeSpan}</div>`;
                                if (!srankdiv.find(".srankdiv .rcited").length) {
                                    if (srankdiv.find(".srankdiv").length) {
                                        srankdiv.find(".srankdiv").append(citeSpan);
                                    } else if (srankdiv.children(".scicrx-ico").length) {
                                        srankdiv.children(".scicrx-ico").after(citeDiv);
                                    } else {
                                        srankdiv.append(citeDiv);
                                    }
                                }
                            }
                        });
                    }
                }
            });
        },
        getAbs(pmid) {
            let ptext = pmid.length == 1 ? pmid[0] : pmid.join(","), url = base.d(def.pmid_abs) + ptext;
            GM_xmlhttpRequest({
                method: "GET", url,
                onload: (res) => {
                    if (res && res.responseXML) {
                        $(res.responseXML).find("PMID").each((i,e) => {
                            let pubSpan = "", pubDiv, absText, id = $(e).text(), abstract = $(e).parent().find("Abstract AbstractText"),
                            pubType = $(e).parent().find("PublicationType[UI='D016454']"), pubYear = $(e).parent().find("PubDate Year"), srankdiv = $(".docsum-title[data-ga-label='" + id + "']").parent();
                            if (pubYear.length) {
                                if (pubType[0] && pubType[0].textContent == "Review" && !srankdiv.find(".srankdiv .rtype").length) {
                                    pubSpan += `<span class="srankInfo rtype scolor-8" title="PubMed文章类型: Review">Review</span>`;
                                }
                                if (!srankdiv.find(".srankdiv .ryear").length) {
                                    pubSpan += `<span class="srankInfo ryear scolor-9" title="发表时间: ${pubYear[0].textContent}" val="${pubYear[0].textContent}">${pubYear[0].textContent}</span>`;
                                }
                                pubDiv = `<div class="srankdiv notranslate" translate="no">${pubSpan}</div>`;
                                if (srankdiv.find(".srankdiv").length) {
                                    srankdiv.find(".srankdiv").append(pubSpan);
                                } else if (srankdiv.children(".scicrx-ico").length) {
                                    srankdiv.children(".scicrx-ico").after(pubDiv);
                                } else {
                                    srankdiv.append(pubDiv);
                                }
                            }
                            if (abstract.length) {
                                if (abstract.length > 1) {
                                    let tt = [];
                                    for (let j = 0; j < abstract.length; j++) {
                                        let e = $(abstract[j]).attr("Label") || $(abstract[j]).attr("label");
                                        e = e.toLowerCase(); e = e.charAt(0).toUpperCase() + e.slice(1);
                                        tt.push("<p><b>" + e + ": </b>" + $(abstract[j]).text() + "</p>");
                                    }
                                    absText = tt.join("");
                                } else {
                                    absText = abstract.text();
                                }
                                let absopen = `<span class="sciabs_span"><img class="sciabs_open" cid="${id}" src="${abs_ico}" title="点击展开摘要内容"></span>`;
                                let absfull = `<div class="full-view-snippet sciabs_full" style="display:none;"><span class="abstract-text">${absText}</span></div>`;
                                let snippet = `<div class="docsum-snippet"><div class="full-view-snippet"></div><div class="short-view-snippet"></div></div>`;
                                srankdiv.each((i,e) => {
                                    !$(e).find(".docsum-snippet").length && $(e).append(snippet);
                                });
                                !srankdiv.find(".sciabs_span").length && srankdiv.find("[class*='docsum-citation']").append(absopen);
                                !srankdiv.find(".sciabs_abb").length && srankdiv.find(".short-view-snippet:nth-child(1)").addClass("sciabs_abb") && srankdiv.find(".full-view-snippet:nth-child(1)").addClass("sciabs_abb");
                                !srankdiv.find(".sciabs_full").length && srankdiv.find(".docsum-snippet").append(absfull);
                            }
                        });
                    }
                }
            });
        }
    };

    let utils = {
        getTransInfo(e,node,t_num) {
            if (e) {
                let tspan = document.createElement("span"), eng = odata.tran_engine, num = { BY: 2500 };
                $(tspan).addClass("translate_span").attr("value", ++t_num).text(" 翻译等待中... ");
                node.insertNode(tspan);
                if (e.length > 5e3) {
                    $(tspan).text(" 字数过多，翻译暂不可用，请减少字数重试...");
                } else {
                    if (!num[eng] || e.length < num[eng]) {
                        utils.getTransText(e,tspan);
                    } else {
                        $(tspan).text(" " + eng + "只能翻译" + num[eng] + "字符以内，请减少字数重试...");
                    }
                }
            } else {
                $(".translate_span[value=" + t_num + "]").remove();
            }
        },
        async getTransText(e,node) {
            let tapi, url, data, header, sign, num = 0, res = "", resTxt = "", lang = /[\u4E00-\u9FA5]/g.test(e) ? "en" : "zh";
            tgoing = true;
            e = e.replace(/\r|\n|\r\n/g, " ");
            switch (odata.tran_engine) {
                case "爱词霸":
                    while (!resTxt.length && num < 2) {
                        sign = base.md5(base.d(def.ticb) + e.replace(/(^\s*)|(\s*$)/g, ""), true, true).substring(0, 16);
                        data = `from=auto&t=${lang}&q=${base.enURL(e)}`;
                        res = await base.post(base.d(def.icb) + sign, data);
                        resTxt = res.content ? res.content.out : "";
                        !resTxt.length && num++;
                    }
                    utils.transOutput("", node, resTxt);
                    break;
                default:
                    utils.transOutput(base.d(def.sgt) + base.enURL(e), node, " ", "#trans-result");
                    break;
            }
        },
        async transOutput(url,node,e,s) {
            if (url.length > 0) {
                let res = await base.get(url);
                if (res) e += $(res).find(s).text();
                e.length > 1 ? $(node).text(e + " ") : $(node).text(" 翻译暂不可用，请重新尝试，或者更换翻译引擎...");
            } else {
                e.length > 0 ? $(node).text(" " + e + " ") : $(node).text(" 翻译暂不可用，请重新尝试，或者更换翻译引擎...");
            }
            setTimeout(() => { tgoing = false; }, 1.5e3);
        },
        async getRankSite() {
            if (base.t(/aacrjournals\.org/) || base.t(/aap\.org/)) {
                rankSite = "aap";
            } else if (base.t(/academic\.oup\.com/) || $(".oup-header-logo > a > img[alt*='Oxford Academic']").length) {
                rankSite = "oup";
            } else if (base.t(/aip\.org/) || base.t(/scitation\.org/) || $(".global-nav > a > picture > img[src*='/AIPP-Master-Logo']").length) {
                rankSite = "aip";
            } else if (base.t(/aminer\.cn/)) {
                rankSite = "aminer";
            } else if (base.t(/apa\.org/) || $("#headLogo > a > img[alt^='American Psychological Association']").length) {
                rankSite = "apa";
            } else if (base.t(/bmj\.com/)) {
                rankSite = "bmj";
            } else if (base.t(/cell\.com/) || base.t(/arthroplastyjournal\.org/) || base.t(/seizure[-.]journal\.com/) || base.t(/jbc\.org/)) {
                rankSite = "cell";
            } else if (base.t(/connectedpapers\.com/)) {
                rankSite = "connectedpapers";
            } else if (base.t(/cqvip\.com/) || $("#header > div > div > a > img[alt^='维普']").length) {
                rankSite = "cqvip";
            } else if (base.t(/dblp\.(org|uni[-.]trier\.de|dagstuhl\.de)/) || $("#completesearch-publs div.body").length) {
                rankSite = "dblp";
            } else if (base.t(/doaj\.org/)) {
                rankSite = "doaj";
            } else if (base.t(/engineeringvillage\.com/) || $(".__group > a > img[alt*='Engineering Village']").length) {
                rankSite = "engineeringvillage";
            } else if (base.t(/frontiersin\.org/)) {
                rankSite = "frontiersin";
            } else if (base.t(/frontierspartnerships\.org/)) {
                rankSite = "frontierspartner";
            } else if (base.t(/geoscienceworld\.org/) || $(".global-nav > a > picture > img[alt^='GeoScienceWorld']").length) {
                rankSite = "geoscienceworld";
            } else if (base.t(/hindawi\.com/)) {
                rankSite = "hindawi";
            } else if (base.t(/ieeexplore\.ieee\.org/) || $("xpl-xplore-logo > div > a > img[alt*='IEEE Xplore']").length) {
                rankSite = "ieeexplore";
            } else if (base.t(/iopscience\.iop\.org/) || $(".wrapper > a > svg > image[src*='/iops-logo']").length) {
                rankSite = "iop";
            } else if (base.t(/journals\.aps\.org/) || $(".name > h1 > a > img[alt*='APS Logo']").length) {
                rankSite = "aps";
            } else if (base.t(/mdpi\.com/)) {
                rankSite = "mdpi";
            } else if (base.t(/(onlinelibrary|journalfinder)\.wiley\.com/) || $(".logo-container > a > img[alt='Wiley Online']").length) {
                rankSite = "wiley";
            } else if (base.t(/orcid\.org/)) {
                rankSite = "orcid";
            } else if (base.t(/plos\.org/)) {
                rankSite = "plos";
            } else if (base.t(/pubs\.acs\.org/) || $(".header_content_left > a > img[alt*='ACS Publications']").length) {
                rankSite = "acs";
            } else if (base.t(/pubs\.rsc\.org/) || $(".pubs-header__cell--logo > a > img[alt*='Royal Society of Chemistry']").length) {
                rankSite = "rsc";
            } else if (base.t(/readpaper\.com/)) {
                rankSite = "readpaper";
            } else if (base.t(/sapub\.org/) || base.t(/nature\.com/) || $("a > picture.c-header__logo > img[alt*='Nature']").length) {
                rankSite = "nature";
            } else if (base.t(/scimagojr\.com/)) {
                rankSite = "scimagojr";
            } else if (base.t(/science\.org/) || $(".navbar-brand__wrapper > a > img[alt^='Science']").length) {
                rankSite = "science";
            } else if (base.t(/sciencedirect\.com/) || $("#gh-branding[aria-label^='ScienceDirect'] > img").length) {
                rankSite = "sciencedirect";
            } else if (base.t(/scopus\.com/) || $(".Icon-module__p52B2 > svg > title[id^='gh-wm-scopus']").length) {
                rankSite = "scopus";
            } else if (base.t(/semanticscholar\.org/)) {
                rankSite = "semanticscholar";
            } else if (base.t(/springer(open)?\.com/) || $("#header > #logo > img[alt*='SpringerLink']").length) {
                rankSite = "springer";
            } else if (base.t(/tandfonline\.com/) || $(".header-logo > .widget-body > a > img[alt*='Taylor and Francis']").length) {
                rankSite = "tandfonline";
            } else if (base.t(/wanfangdata\.com/) || $(".anxs-top-88qwe-logo_sns > a > img#anxs-logo_sns").length || $("#logo_nav > div.logo_div > a[title^='万方']").length) {
                rankSite = "wanfangdata";
            } else if (base.t(/webofscience\.com/) || base.t(/clarivate\.(com|cn)/) || myHref.includes("/wos/alldb/") || $("app-wos.mat-typography").length) {
                rankSite = "webofscience";
            } else if (base.t(/worldscientific\.com/) || $(".pull-left > a > img[alt^='World Scientific']").length) {
                rankSite = "worldscientific";
            } else if (base.t(/x[-.]mol\.com/)) {
                rankSite = "xmol";
            } else if (base.t(/xueshu\.baidu\.com/)) {
                rankSite = "baiduxueshu";
            } else if (base.t(/cnki\.(net|com)/) || $("#journal-summarize > .detail_journal_name__b1mas").length || $(".rightC > .mainContent > .searchResultContainer").length
                || $(".wrapper > .main > .container > div > div > .brief > div > h1").length || $(".content .main-w1.fl p.baseinfo").length || $(".container .doc ul.ebBd > li").length
                || $(".doc-top-scholar > .top-first > .top-tip-scholar > span:nth-child(2) > a").length || $(".resault-cont > div > .filtrate-wrap > .filtrate > .ti").length
                || $("#gridTable table.result-table-list > thead").length || $(".head-left > a#cnki-logo > img#img-logo").length || $("#qk > .bodymain > dl > dd > h3.titbox").length
                || $("#divSearchResult > .s-result > .s-item > .fl > .s-single > h1.s-title").length || $("#content > div:nth-child(2) > div:nth-child(2) > h1.xx_title").length
                || $(".detail_content__3IojM > .detail_content-left__2vUAX > div > .undefined").length || $(".result-detail-list > dd > .middle > .baseinfo").length
                || $("#iframeResult").contents().find(".GridTableContent .GTContentTitle").length || $(".search-box > .content > .search-left > .logo > a[href*='/kns']").length
                || $(".tjts_bctj > div > #arcontent > table > tbody > tr:nth-child(1) > td:nth-child(2)").length || $(".tjts_cont > #table_box > #datatable > tbody > tr.tm > td > a").length
            ) {
                rankSite = "cnki";
            } else if (base.t(/ncbi\.nlm\.nih\.gov/) || $("header.ncbi-header .ncbi-header__logo > a > img[alt^='NIH']").length) {
                rankSite = "pubmed";
            } else if (base.t(/researchgate\.net/)) {
                rankSite = "researchgate";
            } else if ($("#gs_top #gs_bdy").length) {
                rankSite = "ggscholar";
            }
            let aa = "border-radius: 2px 0 0 2px; background: #00b894; color: #fff; opacity: 0.75;";
            let bb = "border-radius: 0 2px 2px 0; background: #2c3e50; color: #fff; opacity: 0.75;";
            rankSite && console.log(`%c SciHub CRX %c ${rankSite.toUpperCase()} `, aa, bb);
        },
        getJourInfo(e,issn) {
            e = e.trim().toLowerCase()
                .replace(/&amp;(amp;)?|&/gi, "and")
                .replace(/^the |switzerland|basel|\s|\n| |[\-–—.,、→_:;()·•*，：；+（）®《》<>“”"'/?]+/gi, "")
                .replace("英文版", "英文")
                .replace("学版", "学");
            let ee = e.replace(/journal/gi, "xx").replace(/international/gi, "ii");
            if (jdata && jabb && jssn) {
                if (issn) {
                    if (typeof issn === "string") issn = [issn];
                    for (let sn of issn) {
                        sn = sn.toLowerCase().replace("-", "").trim();
                        if (jssn[sn]) {
                            return jssn[sn];
                        } else if (jabb[sn]) { // ISSN(Jabb)-ISSN-IF
                            let esn = jabb[sn];
                            if (jssn[esn]) {
                                return jssn[esn];
                            }
                        }
                    }
                }
                if (jdata[ee]) {
                    let mm = jdata[ee];
                    if (typeof mm === "object") {
                        return mm;
                    } else if (jssn[mm]) {
                        return jssn[mm];
                    }
                }
                if (jabb[e]) {
                    let nn = jabb[e];
                    if (typeof nn === "object") {
                        return nn;
                    } else if (jssn[nn]) {
                        return jssn[nn];
                    } else {
                        let eee = nn.replace(/journal/gi, "xx").replace(/international/gi, "ii");
                        if (jdata[eee]) {
                            let kk = jdata[eee];
                            if (typeof kk === "object") {
                                return kk;
                            } else if (jssn[kk]) {
                                return jssn[kk];
                            }
                        }
                    }
                }
                if (/symposium|conference|workshop|proceeding/gi.test(e) && e.length > 30) {
                    for (let j in jdata) {
                        if (/symposium|conference|workshop|proceeding/gi.test(j)) {
                            let jee = base.compare(j,ee,1);
                            if (jee) {
                                let ke = jdata[jee];
                                if (typeof ke === "object") {
                                    return ke;
                                } else if (jssn[ke]) {
                                    return jssn[ke];
                                }
                            }
                        }
                    }
                }
            }
            return;
        },
        getPaperInfo(pid, pid_type, refresh) {
            let sd = base.getV("sdata"); sdata = {};
            if (!refresh) random = (Math.floor(Math.random() * 9e5) + 1e5).toString();
            $("#scicrx-info-panel .seInfo > .scixValue").empty();
            $(".scicrxAbs").html(`<div class="swcard citebtn"><div class="scixName">Cite</div><div class="scixValue ttip"></div></div>`);
            if (odata.trans_tip && odata.trans_key) $(".scicrxAbs .ttip").text(`选中文字，按 ${odata.trans_key[0]} 翻译，按 ${odata.trans_key[1]} 取消`);
            if (tdata.ads) setTimeout(() => { $(".scicrxAbs .ttip").html(tdata.ads); }, 3e3);
            for (let i of odata.scicrx_rank) {
                let pInfo = document.createElement("span"), seInfo = "#scicrx-info-panel .seInfo > .scixValue";
                $(pInfo).addClass("sinfo " + sci_code[i][1]);
                $(seInfo).append(pInfo);
            }
            $("#scicrx-info-panel").attr("pid", pid).attr("pid-type", pid_type);
            $(".scixLink").addClass("TO" + random);
            $(".sciTerm").text(pid_type + ": " + pid);
            if (!refresh && sd && (pid == sd.doi || pid == sd.pmid || pid == sd.pmcid || pid == sd.arxiv || pid == sd.sdid || pid == sd.scopusid)) {
                for (let k in sd) utils.updatePanel(k, sd[k]);
            } else {
                switch (pid_type) {
                    case "DOI":
                        sdata.doi = pid;
                        findInfo.crossref(pid);
                        break;
                    case "PMID":
                        sdata.pmid = pid;
                        findInfo.pubmed(pid);
                        break;
                    case "PMCID":
                        sdata.pmcid = pid;
                        findInfo.pubmed(pid);
                        break;
                    case "ScopusID":
                        sdata.scopusid = pid;
                        findInfo.scopus(pid);
                        break;
                    case "arXiv":
                        sdata.arxiv = pid;
                        findInfo.arxiv(pid);
                        break;
                    case "SDID":
                        sdata.sdid = pid;
                        findInfo.sciencedirect(pid);
                        break;
                    default:
                        break;
                }
            }
            let num = 0, interval = setInterval(() => {
                let tt = base.getV("sdata");
                if (tt && tt.title && (tt.doi || tt.pmid) && /(journal|monograph|book|proceedings)/gi.test(tt.type)) {
                    $(".citebtn .scixName").show();
                    $(".scicrxAbs .ttip").css({"width":"76%"});
                    clearInterval(interval);
                }
                if (num > 8) clearInterval(interval); num++;
            }, 1e3);
        },
        getUnpayInfo(node, title, todo, interval, yr, jtt, issn) {
            let email = "unpaywall" + random + "@impactstory.org", url = "https://api.unpaywall.org/v2/search?email=" + email + "&query=" + title.trim();
            $(node).attr("oadoi","1");
            setTimeout(() => {
                GM_xmlhttpRequest({
                    method: "GET", url,
                    responseType: "json",
                    onload: (res) => {
                        if (res && res.status == 200 && res.response) {
                            let obj = res.response;
                            if (obj.results && obj.results[0]) {
                                for (let i = 0; i < obj.results.length; i++) {
                                    try {
                                        let o = obj.results[i].response, jt, gdoi = {}, reg = /&amp;(amp;)?|&| |[\-\[\]–—.,、→_:;()·•*，：；+（）®《》<>“”"'’/?]+/gi,
                                            type = o.genre,
                                            m = o.title.toLowerCase().replace(reg, ""),
                                            n = $(node).text().trim().toLowerCase().replace(reg, ""),
                                            k = o.journal_name.toLowerCase().replace(reg, "");
                                        if (jtt) jtt = jtt.toLowerCase().replace(reg,"");
                                        if (/journal/i.test(type) && ((jtt && k.includes(jtt)) || base.compare(m, n)) && (!yr || yr == o.year)) {
                                            if (todo == "all") {
                                                jt = o.journal_name;
                                                if (jt) utils.getRankInfo(node, jt, "", "", [o.journal_issn_l]);
                                                gdoi[1] = gdoi[2] = o.doi;
                                                if (gdoi && !$(node).parent().find(".scicrx-ico").length) start.addPinfoSpan(gdoi,"DOI",node);
                                            } else if (todo == "rank") {
                                                jt = o.journal_name;
                                                if (jt) utils.getRankInfo(node, jt, "", "", [o.journal_issn_l]);
                                            } else if (todo == "doi") {
                                                gdoi[1] = gdoi[2] = o.doi;
                                                if (gdoi && !$(node).parent().find(".scicrx-ico").length) start.addPinfoSpan(gdoi,"DOI",node);
                                            }
                                            break;
                                        } else if (issn) {
                                            utils.getRankInfo(node, "researchgate", "", "", issn);
                                        }
                                    } catch (e) {}
                                }
                            }
                        }
                        $(node).attr("ranked", "1");
                    }
                });
            }, (Math.random() + 1) * 6e2 * (interval % 10 + 0.5));
        },
        getRankInfo(node, jTitle, inner, head, issn) {
            if (jTitle && jTitle.length > 0) {
                jTitle.trim() && utils.getRankSpan(node, jTitle, inner, issn);
            } else if (head) {
                let jt = $("meta[name*='citation_journal_title']").attr("content")
                    || $("meta[property*='citation_journal_title']").attr("content")
                    || $("meta[name='prism.publicationName']").attr("content");
                if (jt) utils.getRankSpan(node, jt, inner, issn);
            } else {
                for (let k in node) {
                    $(node[k]).each((i,e) => {
                        if (!$(e).is(".srankInfo")) {
                            let jt = $(e).text();
                            if (jt) utils.getRankSpan(e, jt, inner, issn);
                        }
                    });
                }
            }
        },
        getRankSpan(node, jTitle, inner, issn) {
            if (!$(node).attr("ranked")) {
                $(node).attr("ranked", "1");
                let sci_order = [], srankDiv = document.createElement("div"), rdata = utils.getJourInfo(jTitle,issn);
                for (let i of odata.scicrx_rank) {
                    sci_order.push(i);
                }
                if (rdata) {
                    $(srankDiv).addClass("srankdiv notranslate").attr("translate","no");
                    if (/(rsc|acs|ieeexplore|iop|aip|frontiersin|aps|geoscienceworld|orcid|semanticscholar|plos|science|annualreviews)/.test(rankSite) ||
                        /(scimagojr|nature|worldscientific|oup|mdpi|biomedcentral|hindawi|sagepub|wiley|tandfonline|scopus|webofscience)/.test(rankSite) ||
                        /(engineeringvillage|cqvip|readpaper|springer|sciencedirect|baiduxueshu|sapub|doaj|xmol|cnki|pubmed|google|ggscholar)/.test(rankSite)
                    ) {
                        for (let i of sci_order) {
                            let pos = sci_code[i][0], v = rdata[pos];
                            if (v) {
                                let rsp = document.createElement("span");
                                $(rsp).addClass("srankInfo");
                                switch (pos) {
                                    case "A":
                                        $(rsp).addClass("rimf scolor-if").text("IF " + v.toFixed(1)).attr("title", intro.imf).attr("val", v);
                                        break;
                                    case "C":
                                        $(rsp).addClass("rjcr scolor-" + v).text("JCR Q" + v).attr("title", intro.jcr).attr("val", "Q" + v);
                                        break;
                                    case "CA":
                                        $(rsp).addClass("rbank scolor-" + v).text(rank.bank[v - 1]).attr("title", intro.bank);
                                        break;
                                    case "D":
                                        $(rsp).addClass("rcas scolor-" + v % 10).text("中科院" + v % 10 + "区").attr("title", intro.cas).attr("val", "C" + v % 10);
                                        break;
                                    case "E":
                                        $(rsp).addClass("rtop scolor-1").text("Top").attr("title", intro.top);
                                        break;
                                    case "F":
                                        $(rsp).addClass("scolor-5").text("EI").attr("title", intro.ei);
                                        break;
                                    case "G":
                                        $(rsp).addClass("scolor-6").text("CSCD" + rank.cscd[v - 1]).attr("title", intro.cscd);
                                        break;
                                    case "H":
                                        $(rsp).addClass("scolor-7").text("北大核心").attr("title", intro.pku);
                                        break;
                                    case "S":
                                        if (v) {
                                            let num = 0, sos = "";
                                            for (let k in v) {
                                                num++; sos += "20" + k + " " + rank.sos[v[k] - 1];
                                                if (num < Object.keys(v).length) sos += "、";
                                            }
                                            $(rsp).addClass("scolor-sos").html(warning_ico).attr("title", "《" + sos + "》" + intro.sos);
                                        }
                                        break;
                                }
                                $(srankDiv).append(rsp);
                            }
                        }
                    }
                    if ($(srankDiv).children().length) {
                        if (inner) {
                            $(node).append(srankDiv);
                        } else {
                            $(node).after(srankDiv);
                        }
                    }
                }
            }
        },
        updatePanel(k, value, rand) {
            if (value) {
                let sd = base.getV("sdata"), web_ico, web_title, pdf_ico, pdf_title;
                let svipTip = " \u4e3a\u0020\u0056\u0049\u0050\u0020\u4e13\u5c5e\uff0c\u70b9\u51fb\u4e86\u89e3\u0020\u0056\u0049\u0050\u0020\u529f\u80fd\uff01";
                switch (k) {
                    case "title":
                        if (value.length > 123) {
                            value = value.slice(0, 123);
                            value = value.slice(0, value.lastIndexOf(" "));
                            value += "...";
                        }
                        $(".seTitle").css({ "display": "inline-block" });
                        $(".sePaper").text(value);
                        break
                    case "doi" :
                        $(".seDOI a").attr("target", Target).attr("href", base.d(def.doi) + value).text(value);
                        $(".seDOI .sCopyIcon").attr("src", copy_ico).attr("copyid", value);
                        $(".seDOI").css({ "display": "flex" });
                        break;
                    case "pmid" :
                        $(".sePMID a").attr("target", Target).attr("href", base.d(def.pmid) + value).text(value);
                        $(".sePMID .sCopyIcon").attr("src", copy_ico).attr("copyid", value);
                        $(".sePMID").css({ "display": "flex" });
                        break;
                    case "pmcid":
                        $(".sePMCID a").attr("target", Target).attr("href", base.d(def.pmcid) + value).text(value);
                        $(".sePMCID .sCopyIcon").attr("src", copy_ico).attr("copyid", value);
                        $(".sePMCID").css({ "display": "flex" });
                        break;
                    case "type":
                        value = value.replace(/-/g, " ").replace("art", "Art").replace("cha", "Cha");
                        value = value.charAt(0).toUpperCase() + value.slice(1);
                        $(".scixValue.stype").text(value);
                        $(".seType").css({ "display": "flex" });
                        break;
                    case "jabb":
                        if (!$(".scixValue.sjournal").text()) $(".scixValue.sjournal").text(value);
                        if (!$(".scixValue.sjournal").attr("title")) $(".scixValue.sjournal").attr("title", value);
                        $(".seJourrnal").css({ "display": "flex" });
                        break;
                    case "journal":
                        if (/book|monograph/gi.test(sd.type)) {
                            $(".seJourrnal .scixName").text("bookTitle");
                        } else if (/proceeding/i.test(sd.type)) {
                            $(".seJourrnal .scixName").text("Conference");
                        }
                        $(".scixValue.sjournal").attr("title", value).text(value);
                        $(".seJourrnal").css({ "display": "flex" });
                        break;
                    case "issn":
                        $(".scixValue.sissn").text(value);
                        $(".seISSN").css({ "display": "flex" });
                        break;
                    case "info" :
                        for (let i in value) {
                            let v = value[i];
                            if (v) {
                                switch (i) {
                                    case "A":
                                        $(".sinfo.ccif").addClass("scolor-if").text("IF " + v.toFixed(1)).attr("title", intro.imf).css({ "display": "initial" });
                                        break;
                                    case "C":
                                        $(".sinfo.cjcr").addClass("scolor-" + v).text("JCR Q" + v).attr("title", intro.jcr).css({ "display": "initial" });
                                        break;
                                    case "CA":
                                        $(".sinfo.cbank").addClass("scolor-" + v).text(rank.bank[v - 1]).attr("title", intro.bank).css({ "display": "initial" });
                                        break;
                                    case "D":
                                        $(".sinfo.ccas").addClass("scolor-" + v % 10).text("中科院" + v % 10 + "区").attr("title", intro.cas).css({ "display": "initial" });
                                        break;
                                    case "E":
                                        $(".sinfo.ctop").addClass("scolor-1").text("Top").attr("title", intro.top).css({ "display": "initial" });
                                        break;
                                    case "F":
                                        $(".sinfo.ccei").addClass("scolor-5").text("EI").attr("title", intro.ei).css({ "display": "initial" });
                                        break;
                                    case "G":
                                        $(".sinfo.ccscd").addClass("scolor-6").text("CSCD" + rank.cscd[v - 1]).attr("title", intro.cscd).css({ "display": "initial" });
                                        break;
                                    case "H":
                                        $(".sinfo.cpku").addClass("scolor-7").text("北大核心").attr("title", intro.pku).css({ "display": "initial" });
                                        break;
                                    case "S": {
                                        let num = 0, sos = "";
                                        for (let k in v) {
                                            num++;
                                            sos += "20" + k + " " + rank.sos[v[k] - 1];
                                            if (num < Object.keys(v).length) sos += "、";
                                        }
                                        $(".sinfo.csos").addClass("scolor-sos").html(warning_ico).attr("title", "《" + sos + "》" + intro.sos).css({ "display": "initial" });
                                    } break;
                                }
                            }
                        }
                        if ($(".seInfo > .scixValue").find(".sinfo[title]").length) $(".seInfo").css({ "display": "flex" });
                        break;
                    case "author" : case "editor" :
                        try {
                            let au = value, author = "";
                            for (let i in au) {
                                author += au[i][1] ? au[i][1] + " " + au[i][0] : au[i][0];
                                if (i < au.length - 1) author += "; "
                            }
                            if (author.length > 100) {
                                author = author.slice(0, 99);
                                author = author.slice(0, author.lastIndexOf(";"));
                                author += ", et al."
                            }
                            if (k == "author" || (!sd.author && sd.editor)) $(".scixValue.sauthor").text(author);
                            $(".seAuthor").css({ "display": "flex" });
                            setTimeout(() => {
                                if (!sd.author && sd.editor) $(".seAuthor .scixName").text("Editor");
                            }, 1e3);
                        } catch (e) {}
                        break;
                    case "publisher":
                        $(".scixValue.spublisher").text(value);
                        $(".sePublisher").css({ "display": "flex" });
                        break;
                    case "year":
                        $(".scixValue.syear").text(value);
                        $(".seYear").css({ "display": "flex" });
                        break;
                    case "cited_crossref":
                        $(".scixValue.scited").text(value);
                        $(".seCited").css({ "display": "flex" });
                        break;
                    case "web_doi": case "web_scihub": case "web_libgen": case "web_crossref":
                    case "web_pmid": case "web_arxiv": case "web_semantic":
                        if (k == "web_doi") { web_ico = doi_ico; web_title = "DOI Website"; }
                        if (k == "web_scihub") { web_ico = pdf_scihub_ico; web_title = "SciHub Website"; }
                        if (k == "web_libgen") { web_ico = pdf_libgen_ico; web_title = "Libgen Website"; }
                        if (k == "web_semantic") { web_ico = pdf_semantic_ico; web_title = "Semantic Scholar Website"; }
                        if (k == "web_crossref") { web_ico = crossref_ico; web_title = "CrossRef Website"; }
                        if (k == "web_arxiv") { web_ico = arxiv_ico; web_title = "arXiv Website"; }
                        if (k == "web_pmid") { web_ico = pmid_ico; web_title = "PubMed Website"; }
                        if ($(".scixLink ." + k).length == 0) {
                            let web_html = `<a href="${value}" class="${k}" title="${web_title}" target="${Target}"><img class="weblink" src="${web_ico}"></a>`;
                            rand = rand ? ".scixLink.seWeb.TO" + rand : ".scixLink.seWeb";
                            $(rand).append(web_html);
                            $(".swcard.seWebsite").css({ "display": "flex" });
                        } break;
                    case "pdf_scihub": case "pdf_OA": case "pdf_libgen": case "pdf_semantic":
                    case "pdf_openalex": case "pdf_oabtn": case "pdf_core": case "pdf_oadoi":
                    case "pdf_pmcid": case "pdf_arxiv":
                        if (k == "pdf_scihub") { pdf_ico = pdf_scihub_ico; pdf_title = "Find PDF in Sci-Hub"; }
                        if (k == "pdf_OA") { pdf_ico = pdf_OA_ico; pdf_title = "Find PDF in OA Site"; }
                        if (k == "pdf_core") { pdf_ico = pdf_core_ico; pdf_title = "Find PDF in CORE"; }
                        if (k == "pdf_libgen") { pdf_ico = pdf_libgen_ico; pdf_title = "Find PDF in Libgen"; }
                        if (k == "pdf_semantic") { pdf_ico = pdf_semantic_ico; pdf_title = "Find PDF in Semantic Scholar"; }
                        if (k == "pdf_openalex") { pdf_ico = pdf_openalex_ico; pdf_title = "Find PDF in OpenAlex"; }
                        if (k == "pdf_oabtn") { pdf_ico = pdf_oabtn_ico; pdf_title = "Find PDF in OA Button"; }
                        if (k == "pdf_oadoi") { pdf_ico = pdf_oadoi_ico; pdf_title = "Find PDF in UnpayWall"; }
                        if (k == "pdf_pmcid") { pdf_ico = pmcid_ico; pdf_title = "Find PDF in PubMed"; }
                        if (k == "pdf_arxiv") { pdf_ico = arxiv_ico; pdf_title = "Find PDF in arXiv"; }
                        if ($(".scixLink ." + k).length == 0) {
                            if (k != "pdf_scihub" && k != "pdf_libgen" && k != "pdf_arxiv") {
                                value = tdata.sciinfo;
                                pdf_title = pdf_title + svipTip;
                            }
                            let pdf_html = `<a href="${value}" class="${k}" title="${pdf_title}" target="${Target}"><img class="pdflink" src="${pdf_ico}"></a>`;
                            rand = rand ? ".scixLink.sePDF.TO" + rand : ".scixLink.sePDF";
                            $(rand).append(pdf_html);
                            $(".swcard.seFile").css({ "display": "flex" });
                        } break;
                }
            }
        },
        getPID(url, node) {
            let matchDOI = /(com|org|full|doi|AID|(article|book|chapter)s?|\/abs(tract)?)(\/|=)(10\.\d{4,9}\/[-._;()<>/:0-9a-zA-Z]+)/i;
            let pid, pid_type, notDOI = /(unpaywall|oadoi|mailto|redirect|\/(share|login|sign|personalize))/i;
            if (/&dbid=\d+/i.test(url)) {
                pid = /&key=(.[^&]*)&(.[^&]*)/i.exec(url);
                if (def.mDOI.test(pid[1])) pid_type = "DOI";
                if (/\d{4,9}/i.test(pid[1]) && /^[0-9]*$/i.test(pid[1]) && pid[1].length < 10) pid_type = "PMID"; // 纯数字
                pid_type && start.addPinfoSpan(pid, pid_type, node);
            } else if (matchDOI.test(url) && !notDOI.test(url) ) {
                pid = def.msDOI.exec(url);
                start.addPinfoSpan(pid, "DOI", node);
            } else if (def.mDOI.test($(node).text())) {
                pid = def.msDOI.exec($(node).text());
                start.addPinfoSpan(pid, "DOI", node);
            } else if (def.mPMCIDURL.test(url)) {
                pid = /pmc(\d{4,9})(.*)/i.exec(url);
                pid[1] = "PMC" + pid[1];
                start.addPinfoSpan(pid, "PMCID", node);
            } else if (def.mPMIDURL.test(url)) {
                pid = /\/(\d{4,9})(.*)/i.exec(url);
                start.addPinfoSpan(pid, "PMID", node);
            } else if (/&db=PubMed/i.test(url)) {
                pid = /uids=(\d{4,9})(.*)/i.exec(url);
                start.addPinfoSpan(pid, "PMID", node);
            } else if (def.mSDIDURL.test(url)) {
                pid = /\/pii\/([0-9a-zA-Z]+)(.*)/i.exec(url);
                start.addPinfoSpan(pid, "SDID", node);
            } else if (def.mArXivURL.test(url)) {
                pid = /\/(\d{4}\.\d{4,5}[v\d+]*)(.*)/i.exec(url);
                start.addPinfoSpan(pid, "arXiv", node);
            }
        }
    };

    let main = {
        init() {
            if (navigator && /(Android|iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                base.message("SciHub CRX 不支持手机等移动设备，仅支持电脑等！");
            } else if ($("#scicrx_style").length) {
                base.message("温馨提示：您在多个脚本管理器中安装了 SciHub CRX，导致无法使用！请只保留一个即可！", "warning");
            } else {
                start.initSciCRX();
                if (!$.isEmptyObject(tdata)) {
                    let checkNum = 0;
                    start.addFloatIco();
                    start.addInfo();
                    setInterval(async () => {
                        checkNum++ < 3 && !rankSite && await utils.getRankSite();
                        start.addInfo();
                    }, 1.5e3);
                }
                load.registerMenu();
            }
        }
    };

    let start = {
        addLinkByID() {
            if (!/(docs?|mail|outlook)\./i.test(myHost)) {
                let body = document.body;
                if (body && body.innerText && (!originalBody || originalBody != body.innerText)) {
                    originalBody = body.innerText;
                    try {
                        start.replaceByElement(body, def.mDOI, (match) => {
                            let link = document.createElement("a");
                            link.href = base.d(def.doi) + match[0];
                            link.appendChild(document.createTextNode(match[0]));
                            return link;
                        });
                        start.replaceByElement(body, def.mPMCID, (match) => {
                            let link = document.createElement("a");
                            link.href = base.d(def.pmcid) + match[0];
                            link.appendChild(document.createTextNode(match[0]));
                            return link;
                        });
                        start.replaceByElement(body, def.mArXiv, (match) => {
                            let link = document.createElement("a");
                            link.href = base.d(def.arxiv) + match[0].replace("arXiv:", "");
                            link.appendChild(document.createTextNode(match[0]));
                            return link;
                        });
                    } catch (e) {}
                }
            }
        },
        replaceByElement(element, find, replace) {
            let unTags = ["A", "BUTTON", "INPUT", "SCRIPT", "SELECT", "STYLE", "TEXTAREA"];
            for (let i = element.childNodes.length - 1; i >= 0; i--) {
                let child = element.childNodes[i];
                if (child.nodeType === Node.ELEMENT_NODE) {
                    if (!unTags.includes(child.nodeName) && !$(child).is("#scicrx-info-panel")) {
                        start.replaceByElement(child, find, replace);
                    } else if (child.nodeName === "A") {
                        if (def.mDOIURL.test(child.href)) {
                            child.href = child.href.replace(def.mDOIURL, base.d(def.doi) + "$1");
                        }
                    }
                } else if (child.nodeType === Node.TEXT_NODE) {
                    start.replaceByText(child, find, replace);
                }
            }
        },
        replaceByText(text, find, replace) {
            let match, matches = [];
            while (match = find.exec(text.data)) {
                matches.push(match);
            }
            for (let i = matches.length; i-- > 0;) {
                match = matches[i];
                text.splitText(match.index);
                text.nextSibling.splitText(match[0].length);
                text.parentNode.replaceChild(replace(match), text.nextSibling);
            }
        },
        addFloatIco() {
            let pid = findDOI.head();
            if (pid) {
                let floatIco = document.createElement("div"), pid_type = pid.includes("10.") ? "DOI" : "PMID";
                floatIco.id = "scicrx-float-icon";
                floatIco.innerHTML = `<span class="scicrx-ico" title="点击查看详细信息 ${pid_type}: ${pid}" paper_id="${pid}" paper_id_type="${pid_type}"><img class="floatIco" src="${scibtn_ico}"></span>`;
                document.body.appendChild(floatIco);
                if (odata.float_open) $("body").append(sci_Panel);
                utils.getPaperInfo(pid, pid_type);
                let ver = base.getV("newVersion");
                if (ver && ver > def.version) {
                    let tip = ver > "8.9.9" ? tdata.oldup : tdata.newup;
                    base.message(tip, "info", true, false, true, 8e3, tdata.sciinfo, true, "查看更新");
                    base.delV("newVersion");
                }
            }
        },
        addRankInfo() {
            if (odata.rank_open) {
                let e, jt;
                switch (rankSite) {
                    case "aap":
                        e = [".al-citation-list > span > em", ".ww-citation-primary > em", ".ref-content > .citation > .source"]; utils.getRankInfo(e);
                        break;
                    case "oup":
                        e = [".al-citation-list > span > em", ".ww-citation-primary > em", ".ref-content > .citation > .source", ".featurePanelInner > p > em", ".secondaryContent > p > a[data-link-id]", ".widget-dynamic-journal-citation > em"]; utils.getRankInfo(e);
                        break;
                    case "aip":
                        e = [".pubslist > div > ul > li > a", ".pub-history-row > .ww-citation-primary > em", ".ref-content > .citation > .source", ".al-citation-list > span > em"]; utils.getRankInfo(e);
                        break;
                    case "aminer":
                        e = [".a-aminer-p-ranks-conf-c-conf-basic-title"]; utils.getRankInfo(e);
                        $("a.a-aminer-components-pops-venue-venue-link-name").each((i,e) => { jt = $(e).text().replace(/\d+/g,""); if (jt) utils.getRankInfo(e, jt) });
                        $("div.a-aminer-core-pub-c-reference-tree-sciInfo").each((i,e) => { jt = $(e).text().replace(/\d+/g,""); if (jt) utils.getRankInfo(e, jt, true) });
                        break;
                    case "annualreviews":
                        utils.getRankInfo("h1.item-meta-data__item-title", "", true, true);
                        e = [".popular .text > p > em", "article .text > p > em", ".journal-issue > p > strong", ".title > h1#journal-title", ".resultItem > div > h4.js-title > a", ".reference-source > .reference-italic", "#main-content-container > h1"]; utils.getRankInfo(e);
                        $(".text-container .title").each((i,e) => { jt = "Annual Review of " + $(e).text(); if (jt) utils.getRankInfo(e, jt) });
                        break;
                    case "apa":
                        e = [".citation-text > div > span > div > em", "journal > div > article > span > div > a", "breadcrumbs > div > ol.breadcrumb > li:nth-child(2) > a", "#topcontent > .bluebg > h1"]; utils.getRankInfo(e);
                        break;
                    case "biomedcentral":
                        e = [".c-listing__content > div > em", "article .c-article-info-details > a:first-child", "#journalTitle span.c-journal-title__text", "ol.c-collapse-at-lt-md > li > a", ".ctx-journal-list > .u-mb-24 li > a"]; utils.getRankInfo(e);
                        break;
                    case "bmj":
                        utils.getRankInfo("cite > div.highwire-cite-title", "", "", true);
                        e = [".css-5dblrh p > em", ".css-5dblrh > h1", "span.highwire-cite-metadata-journal", "cite abbr.cit-jnl-abbrev"]; utils.getRankInfo(e);
                        break;
                    case "cell":
                        utils.getRankInfo("article h1", "", true, true);
                        e = [".citation .citation-content em", ".brick_journal_list > ul > li > a", ".meta__details .publication_meta_journal", "li.ref > .ref__series > i", ".linked-article__details > span > i"]; utils.getRankInfo(e);
                        $("h1#journal-logo > img").each((i,e) => { jt = $(e).attr("alt"); if (jt) utils.getRankInfo(e, jt) });
                        break;
                    case "connectedpapers":
                        $(".search-result-meta.overflow-hidden").each((i,e) => { jt = $(e).text().replace(/\d+|\(?print\)/gi,""); if (jt) { utils.getRankInfo(e, jt, true)} });
                        $(".metadata.publication").each((i,e) => { jt = /\d{4}, (.*)\(?(\d{4})?/gi.exec($(e).text()); if (jt && jt[1] && jt[0] != $(e).attr("jt")) { $(e).attr("ranked","").attr("jt",jt[0]); utils.getRankInfo(e,jt[1].replace(/\d+/g,""),true) } });
                        break;
                    case "cqvip":
                        utils.getRankInfo(".detailtitle > h1 > a", "", "", true);
                        e = [".qkxq-content-qknr-xxjs-dbt > span", ".qkdq-lylb-neirzb-list-dbt > a", ".simple-list .from > a", ".article-detail > div.journal > span.from > a"]; utils.getRankInfo(e);
                        $("#cqvip_search_prolist tbody td > a:nth-child(1)").each((i,e) => { jt = /《(.*)》/i.exec($(e).text()); if (jt && jt[1]) { utils.getRankInfo(e, jt[1], true) } });
                        break;
                    case "dblp":
                        e = ["cite > a > span > span[itemprop='name']"]; utils.getRankInfo(e);
                        $("header#headline[data-stream] > h1").each((i,e) => { jt = /-?(.*)\(/i.exec($(e).text()); if (jt && jt[1]) { utils.getRankInfo(e, jt[1], true) } });
                        $("#browse-conf-output > div > ul > li > a").each((i,e) => { jt = /-?(.*)\(/i.exec($(e).text()); if (jt && jt[1]) { utils.getRankInfo(e, jt[1], true) } });
                        break;
                    case "doaj":
                        e = ["header h1.row > span", "header > h3.search-results__heading > a", ".hero > header > p.label > a"]; utils.getRankInfo(e);
                        $("article > div > header > p.label > a").each((i,e) => { jt = $(e).text().replace(/\((.*)\)/, ""); if (jt) utils.getRankInfo(e, jt) });
                        break;
                    case "engineeringvillage":
                        e = ["span.source-info", "span.ev__sourcetitle:nth-child(1)"]; utils.getRankInfo(e);
                        break;
                    case "frontiersin":
                        utils.getRankInfo("main .JournalAbstract > h1","",true,true);
                        e = ["div.source span:first-child", "#main-content h1.MainHeader__title", "h2.JournalCard__title > a", "p.ReferencesCopy1 > i"]; utils.getRankInfo(e);
                        break;
                    case "frontierspartnerships":
                        e = [".JournalBar__leftSection > a.JournalBar__journal > a", "h2 > a.card-journal__link > .card-journal__branding", ".References > p.ReferencesCopy1 > em"]; utils.getRankInfo(e);
                        break;
                    case "geoscienceworld":
                        e = [".al-article-box > div:nth-child(5) > a", ".widget > .homepage-list > li > a"]; utils.getRankInfo(e);
                        $(".journal-header_inner-row > .journal-logo_wrap > a > picture > img").each((i,e) => { jt = $(e).attr("alt"); if (jt) utils.getRankInfo(e, jt) });
                        break;
                    case "hindawi":
                        utils.getRankInfo(".articleHeader > h1.articleHeader__title","",true,true);
                        e = ["#searchContent .article-card-header li:first-child", ".sc-htpNat > div > h3", ".sc-eilVRo > p > em", ".ArticleReferences_orderedReferences__K1TM4 .referenceText > i"]; utils.getRankInfo(e, "", true);
                        break;
                    case "ieeexplore":
                        e = [".result-item .description > a", "section h1.text-2xl-md-lh", "h2 a.text-md-md-lh", "span.display-title", ".reference-container .col > div > em", ".reference-container > div > div > span > i"]; utils.getRankInfo(e);
                        $(".document-main h1.document-title > span:first-child").each((i,e) => { jt = $(".stats-document-abstract-publishedIn > a").text(); if (jt) utils.getRankInfo(e, jt) });
                        break;
                    case "iop":
                        e = [".publication-title > a", "#wd-iop-col-art-list .art-list-item-meta > em", "dl.journals-list-current > dd > a", "#references-wrapper cite > i"]; utils.getRankInfo(e);
                        $(".publication-title a img").each((i,e) => { jt = $(e).attr("alt"); if (jt) utils.getRankInfo(e, jt) });
                        break;
                    case "aps":
                        e = ["#header h2.title > a", ".article > h5.title"]; utils.getRankInfo(e);
                        $("p.placard-citation > a").each((i,e) => { jt = /(.*) \d+, \d+ \(/i.exec($(e).text()); if (jt && jt[1]) { utils.getRankInfo(e, jt[1], true) } });
                        $(".article h6.citation").each((i,e) => { jt = /(.*) \d+, \d+ \(/i.exec($(e).text()); if (jt && jt[1]) { utils.getRankInfo(e, jt[1], true) } });
                        $("#article-body ol.references > li > a").each((i,e) => { jt = /(.*)<b>/i.exec($(e).html()); if (jt && jt[1]) { utils.getRankInfo(e, jt[1]) } });
                        break;
                    case "physiology":
                        utils.getRankInfo("#pb-page-content .citation > h1", "", "", true);
                        e = ["#pb-page-content .journalpage-heading > h1", "#pb-page-content .meta__details > a.meta__serial", "li.references__item .references__source > strong"]; utils.getRankInfo(e);
                        break;
                    case "letpub":
                        e = ["#yxyz_content > .table_yjfx td:nth-child(2) > a", "#yxyz_content td:nth-child(2) > span:nth-child(1) > a", "#yxyz_content li:nth-child(1) tbody table tr > td > a", ".media-body .layui-col-md9 a", "#scopus_subcategory_journal_list_result > div > table > tbody > tr > td:nth-child(2) > a"]; utils.getRankInfo(e);
                        break;
                    case "mdpi":
                        e = ["div.journal__description > h1 > em", "#html-references_list .html-italic:nth-child(1)", "tr > td.journal-name-cell > a.lean > div"]; utils.getRankInfo(e);
                        $("div.article-icons").each((i,e) => {
                            jt = $(e).parent().find("div.color-grey-dark em:first-child").text();
                            if (jt) {
                                utils.getRankInfo(e, jt);
                            } else {
                                jt = $("div.content__container > a > img").attr("title");
                                if (jt) utils.getRankInfo(e, jt);
                            }
                        });
                        break;
                    case "wiley":
                        utils.getRankInfo("#article__content h1.citation__title", "", "", true);
                        e = [".meta__details > a.publication_meta_serial", ".journal-info-container h1#journal-banner-text", "#search-result h3.meta__title > a", "cite span.journalTitle", "ul.flexList > li > dl > dt > a > span"]; utils.getRankInfo(e);
                        e = [".row > .journal-info-container > .pb-rich-text > p > strong", ".creative-work > .parent-item > span > a", "ul.rlist > li > i", "#cited-by__content > ul > li > .seriesTitle"]; utils.getRankInfo(e);
                        break;
                    case "plos":
                        e = ["dd > p span:nth-child(3)", "#journals .elementor-text-editor > p > span > a"]; utils.getRankInfo(e);
                        $("#pagehdr #siteLogo").each((i,e) => { jt = $(e).attr("title"); if (jt) utils.getRankInfo(e, jt) });
                        break;
                    case "rsc":
                        utils.getRankInfo(".article-nav .list__item-label > h3", "", "", true);
                        e = [".page-head--jlp h1.page-head__title > span", ".text--small > span:nth-child(3) > i > strong", ".ref-list > ol > li > em", ".grey_box_relatedarticles i > strong"]; utils.getRankInfo(e);
                        $(".journal-list--content span.list__item-label").each((i,e) => { $("span.list__item-additional").remove(); jt = $(e).text(); if (jt) { utils.getRankInfo(e, jt)} });
                        break;
                    case "readpaper":
                        e = [".desc > div > div.block:nth-child(1)"]; utils.getRankInfo(e);
                        $(".ant-card-body li.paper-item > h3").each((i,e) => { jt = $(e).parent().find(".venues-wrap > span.block").text(); if (jt) utils.getRankInfo(e, jt, true) });
                        break;
                    case "royalsociety":
                        utils.getRankInfo(".article__content > div.citation > h1.citation__title","",true,true);
                        e = ["article.flipContent > p.noMargin > strong", ".meta__details > div.meta__details__row > a.meta__source-title", ".references__content > span.references__source > strong"]; utils.getRankInfo(e);
                        break;
                    case "nature":
                        e = [".c-card__section > div.u-text-bold", "header > p.c-article-info-details > a:first-child", "#breadcrumb1 > span[itemprop='name']", "p.c-article-references__text > i", "p.c-bibliographic-information__citation > i", "#journals-az div[id] > ul > li > a"]; utils.getRankInfo(e);
                        break;
                    case "scimagojr":
                        e = [".search_results span.jrnlname", ".journaldescription > h1", ".table_wrap tr > td.tit"]; utils.getRankInfo(e, "", true);
                        break;
                    case "science":
                        e = [".titles-results .card-meta > span:nth-child(2)", ".core-self-citation > div:first-child > span", "#bibliography .citation-content > em"]; utils.getRankInfo(e);
                        break;
                    case "sciencedirect":
                        setTimeout(() => {
                            e = [".publication-volume > h2", ".publication-brand h2", "h1 > a span.anchor-text", ".srctitle-date-fields span.anchor-text", ".meta-info span.anchor-text", "a.js-publication-title span.anchor-text", ".series h3.title"]; utils.getRankInfo(e);
                            $(".sub-heading .text-s").each((i,e) => { jt = /\d{4}, (.*)/i.exec($(e).text()); if (jt && jt[1]) utils.getRankInfo(e, jt[1], true) });
                            $(".bibliography-sec .host.u-font-sans").each((i,e) => { jt = /(.*)\(\d{4}/i.exec($(e).text()); if (jt && jt[1]) { jt = jt[1].replace(/\d+/gi, ""); utils.getRankInfo(e, jt, true) } });
                            $(".citing-articles .sub-heading > div").each((i,e) => { jt = /\d{4}, (.*)/i.exec($(e).text()); if (jt && jt[1]) utils.getRankInfo(e, jt[1], true) });
                            $(".sub-heading .text-s .source").each((i,e) => { jt = /(.*), V/i.exec($(e).text()); if (jt && jt[1]) utils.getRankInfo(e, jt[1], true) });
                            $("#journal-title > span > h1 > span").each((i,e) => { jt = $(e).attr("title"); if (jt) utils.getRankInfo(e, jt, true) });
                        }, 1.5e3);
                        break;
                    case "scirp":
                        utils.getRankInfo("#JournalInfor_div_paper > div.art_title", "", "", true);
                        e = ["section > .mediabox > ul > li > a", ".con_main > .column > .row > .column > div > h4", "ul.list_link > li > div.list_unit > a:nth-child(1) > i"]; utils.getRankInfo(e, "", true);
                        break;
                    case "justscience":
                        e = [".s-result-table a.name", ".b-related a.b-related-nav-item"]; utils.getRankInfo(e);
                        $(".result-app-container h4.font_24.font_b").each((i,e) => { jt = /(.*) (影响|期刊)/i.exec($(e).text()); if (jt && jt[1]) { utils.getRankInfo(e, jt[1], true) } });
                        break;
                    case "scopus":
                        e = ["[class^='Button-module'] > span > em", "[class^='Button-module'] > span > span", "[data-testid='results-list-item'] a span > span", "li[data-testid='results-list-item'] span em"]; utils.getRankInfo(e, "", true);
                        e = ["span[class^='Typography-module'] > strong > em > span", "[class^='TableItems-module'] > div > div > span:nth-child(1)", "[class^='TableItems-module'] > div > div > a > span:nth-child(1)", "#source-preview-flyout > span em"]; utils.getRankInfo(e, "", true);
                        e = ["tr.lightGreyBorderBottom > td > a", "#sourceResults tr > td > a", ".results-list-item .text-meta .text-meta", "#srchResultsList tr.searchArea > td:nth-child(5)", "[class^='Stack-module'] > h1"]; utils.getRankInfo(e, "", true);
                        e = ["#jourlSection h2.jnlTitle", "tr.searchArea > td > #sourceTitle", "#articleTitleInfo span:nth-child(1)", "#guestAccessSourceTitle", "#rankingTable > tbody > tr > td:nth-child(2)", "#referenceListRowId > td.refCont > em"]; utils.getRankInfo(e, "", true);
                        $(".recordPageBoxItem > ul > li > i").each((i,e) => { jt = $(e).text().replace(/\d{4}/, ""); if (jt) utils.getRankInfo(e, jt) });
                        $(".recordPageBoxItem > span.italicText").each((i,e) => { jt = $(e).text().replace(/\d{4}/, ""); if (jt) utils.getRankInfo(e, jt) });
                        break;
                    case "semanticscholar":
                        setTimeout(() => {
                            e = [".citation-list__citations .cl-paper-venue", "#related-papers .cl-paper-venue"]; utils.getRankInfo(e);
                            $("div.cl-paper-row").each((i,e) => {
                                if (!$(e).attr("ranked") && $(e).find("button[aria-label^='Cite']").length) {
                                    $(e).attr("ranked", "1"); // 防止点击 Cite 按钮后自动关闭
                                    $(e).find(".cl-paper-actions > div > button[aria-label^='Cite']").trigger("click"); //.click();
                                    $(".cite-modal__header > ul > .cite-modal__tab:nth-child(2) > button").trigger("click"); //.click();
                                    jt = $(".cite-modal__container > cite.formatted-citation > em").text();
                                    $("#app > .cl-overlay .cl-modal__close-section > button").trigger("click"); //.click();
                                    if (jt) { e = $(e).find('.link-button--show-visited'); utils.getRankInfo(e, jt); }
                                }
                            });
                            $(".fresh-paper-detail-page__header > h1").each((i,e) => {
                                if (!$(e).attr("ranked")) {
                                    $(".flex-paper-actions__item--hidden-when-narrow > button > span").trigger("click"); //.click();
                                    $(".cite-modal__header > ul > .cite-modal__tab:nth-child(2) > button").trigger("click"); //.click();
                                    jt = $(".cite-modal__container > cite.formatted-citation > em").text();
                                    $("#app > .cl-overlay .cl-modal__close-section > button").trigger("click"); //.click();
                                    if (jt) utils.getRankInfo(e, jt, true);
                                    $(e).attr("ranked", "1"); // 防止点击 Cite 按钮后自动关闭
                                }
                            });
                        }, 1.5e3);
                        break;
                    case "springer":
                        utils.getRankInfo(".app-article-masthead__info > h1.c-article-title", "", true, true);
                        e = ["article .c-article-info-details > a:first-child", "#journalTitle a", "li .c-article-references__text > i:nth-child(1)"]; utils.getRankInfo(e);
                        e = [".journal__content > h2 > a > span", ".c-card-open__authors > .c-author-list > a", "#results-list > li > .text > h2 > a.title"]; utils.getRankInfo(e);
                        e = [".col-md-12 > h2.journal-title", "#main-content li.c-atoz-list__item > a", "#journalList li.c-list-group__item > a"]; utils.getRankInfo(e);
                        e = [".app-journal-masthead__top-contents > a.app-journal-masthead__title-link", ".c-card-open__main > div > h3.c-card-open__heading > a"]; utils.getRankInfo(e);
                        $("#results-list a.publication-title").each((i,e) => { jt = $(e).attr("title"); if (jt) utils.getRankInfo(e, jt) });
                        break;
                    case "tandfonline":
                        utils.getRankInfo("h1 span.hlFld-title", "", "", true);
                        e = [".search-results .publication-meta > span > a", ".journalMetaTitle > h1 > span.title", ".references > li > span > i", ".widget-body > div.compact-nav > a.compact-nav--title"]; utils.getRankInfo(e);
                        break;
                    case "thelancet":
                        utils.getRankInfo("h1.article-header__title", "", "", true);
                        e = [".meta__details > .publication_meta_journal", "li.ref span.ref__series i"]; utils.getRankInfo(e);
                        break;
                    case "wanfangdata":
                        e = [".author-area > span.periodical-title", "#tabsConUpdate > div > dl > dd > div > h4 > a", ".container > .topic > h2 > span.lang-chn"]; utils.getRankInfo(e);
                        e = [".title-area > .ajust > span.title", "#info > div > .paperInfo > tbody > tr > span > td > span:nth-child(4)"]; utils.getRankInfo(e);
                        e = ["#content_div > div > div > ul.list_ul > li.greencolor > a:nth-child(2)", ".paperInfo > .paperInfoItem > tr > span > td > a:nth-child(4)", ".paperInfo > .paperInfoItem > tr > td:nth-child(3) > a:nth-child(4)"]; utils.getRankInfo(e);
                        $(".perio-right.main .wf-offset-1 > h1").each((i,e) => { jt = $(e).parent().parent().find("wf-place-holder img").attr("alt"); if (jt) utils.getRankInfo(e, jt, true) });
                        $(".downpadding > .btn_list > #title0").each((i,e) => { jt = $("#aspnetForm > .content_div > p > span > a:nth-child(3)").text(); if (jt) utils.getRankInfo(e, jt) });
                        $(".detailTitleCN > span:nth-child(1)").each((i,e) => { jt = $(".periodicalName a:nth-child(1)").text(); if (jt) utils.getRankInfo(e, jt) });
                        break;
                    case "webofscience":
                        e = ["mat-card > .mat-card-title", "span.summary-source-title", "#snJournalData .journal-info-source-title", ".cdk-column-journalName > span", ".row > .summary-tile > p.title", "mat-card-header > div > mat-card-title > div > strong"]; utils.getRankInfo(e, "", true);
                        e = ["#snAnalyzeResultsDataTable > table > tbody > tr > .mat-cell.cdk-cell", "app-full-record-mini-articles > .single-citing-article > div > div > span", ".search-results-text > p:nth-child(2) > a.button-journal", ".wos-jcr-sidenav-panel > div > h2"]; utils.getRankInfo(e, "", true);
                        $("a.summary-source-title-link").each((i,e) => { jt = $(e).find("span").length ? $(e).find("span:nth-child(1)").text() : $(e).text(); if (jt) utils.getRankInfo(e, jt) });
                        break;
                    case "worldscientific":
                        e = [".item__body > .meta__details > a", "#pb-page-content > div > main tr > td > a > b", ".article__breadcrumbs > nav > a:nth-child(1)", ".journal-home .meta__title > a", "span > .references__source > em"]; utils.getRankInfo(e);
                        break;
                    case "xmol":
                        e = ["em.it-blue", "a.itsmblue > em", ".ant-table-wrapper table > tbody > tr > td:nth-child(1) > button > span", ".ant-space.ant-space-horizontal > .ant-space-item:nth-child(1) > a > span", "section > .en-mol-journal-first-list > div > ul > li > a > .it-black"]; utils.getRankInfo(e);
                        e = [".en-journal-magazine-detail-content span > em.itsmblue > a", ".en-mol-inside-page-second-list > ul > li > a > .en-mol-inside-page-second-list-left", ".magazine-list-search-item > ul > li > a > .magazine-list-search-item-first", "[class^='magazine-journal'] a > .it-new-gary > em"]; utils.getRankInfo(e, "", true);
                        break;
                    case "baiduxueshu":
                        e = [".relative_content > div > ul > li > p.sc_message > a:last-child", ".journal_title > .ch_name > span.ch_name_title", ".classic_paper_list > div > ul > li > p > a:nth-child(4)", ".c-span-last > p > a.op-scholar-card-name"]; utils.getRankInfo(e);
                        $("#container .main-info > h3").each((i,e) => { jt = $(".container_right a.journal_title").text(); if (jt) utils.getRankInfo(e, jt, true) });
                        $(".in_conternt_reslist > div > .res_con > .res_info").each((i,e) => { jt = /《(.*)》/gi.exec($(e).text()); if (jt && jt[1]) utils.getRankInfo(e, jt[1]) });
                        $(".result h3.t a").each((i,e) => { jt = $(e).parent().parent().find(".sc_info > span:nth-child(2) > a").attr("title"); if (jt) utils.getRankInfo(e, jt, true) });
                        break;
                    case "cnki":
                        if (
                            $("#journal-summarize > .detail_journal_name__b1mas").length ||
                            $(".rightC > .mainContent > .searchResultContainer").length ||
                            $("#aspnetForm .content .searchResultListTable tr").length ||
                            $(".tjts_bctj > div > #arcontent > table > tbody > tr:nth-child(1) > td:nth-child(2)").length ||
                            $(".doc-top-scholar > .top-first > .top-tip-scholar > span:nth-child(2) > a").length ||
                            $(".container .doc ul.ebBd > li").length ||
                            $(".content .main-w1.fl p.baseinfo").length ||
                            $(".tjts_cont > #table_box > #datatable > tbody > tr.tm > td > a").length ||
                            $(".cnki-compont > h1.journaltitle").length
                        ) { // CNKI学术等
                            e = [".detail_journal_name__b1mas a", ".jounal-info > span.jounal-name > a", "#aspnetForm .searchResultListTable tr > td:nth-child(3) > a:nth-child(1)"]; utils.getRankInfo(e);
                            e = [".doc-top-scholar > .top-first > .top-tip-scholar > span:nth-child(2) > a", ".baseinfo > span:nth-child(2) a", ".logo > div > .cnki-compont > h1.journaltitle"]; utils.getRankInfo(e);
                            e = ["#datatable > tbody > tr.tm > td > a", "#arcontent > table > tbody > tr:nth-child(1) > td:nth-child(2)"]; utils.getRankInfo(e, "", true);
                        }
                        if ($("div[id*='kcms-'] ul.ebBd > li").length) { // CNKI
                            $("ul.ebBd > li").each((i,e) => { jt = /(?=\S\.)\S*$/i.exec($(e).text()); if (jt && jt[0]) { jt = jt[0].slice(2).replace(/\d+/gi, ""); utils.getRankInfo(e, jt, true) } });
                        }
                        if ($(".resault-cont > div > .filtrate-wrap > .filtrate > .ti").length) { // CNKI
                            $(".list-item > p.source > a:nth-child(2)").each((i,e) => { jt = $(e).find("span").attr("title"); if (jt) utils.getRankInfo(e, jt) });
                        }
                        if ($("#content > div > div > h1.xx_title").length) { // CNKI
                            $("#content > div > div > h1.xx_title").each((i,e) => { jt = /-《(.*)》/gi.exec($("title").text()); if (jt && jt[1]) utils.getRankInfo(e, jt[1]) });
                            $("#content table:nth-child(2) tr:nth-child(3) tr > td:nth-child(2)").each((i,e) => { jt = /\[J\];(.*);/gi.exec($(e).text()); if (jt && jt[1]) { utils.getRankInfo($(e).find("a"), jt[1]) } });
                        }
                        if ($("#gridTable table.result-table-list > thead").length) { // CNKI
                            $("td.name").each((i,e) => { jt = $(e).parent().find(".source").text(); if (jt) utils.getRankInfo(e, jt, true) });
                        }
                        if ($(".container .brief > div > h1").length) { // CNKI
                            $(".container .brief > div > h1").each((i,e) => { jt = /(.*)\./gi.exec($(".top-first > .top-tip > span").text()); if (jt && jt[1]) utils.getRankInfo(e, jt[1]) });
                        }
                        if ($("#divSearchResult > .s-result > .s-item > .fl > .s-single > h1.s-title").length) { // CNKI
                            $(".s-single > h1.s-title > a").each((i,e) => { jt = /来源：(.*)/gi.exec($(e).parent().parent().find(".s-gre > span.s-author:nth-child(2)").text()); if (jt && jt[1]) utils.getRankInfo(e, jt[1]) });
                        }
                        if ($("#title > h1#spanTitle > #chTitle").length) { // CNKI
                            $("#chTitle").each((i,e) => { jt = /-(.*)/gi.exec($(e).parent().parent().parent().find("#weibo > #hidtitle").attr("value")); if (jt && jt[1]) utils.getRankInfo(e, jt[1]) });
                        }
                        if ($(".result-detail-list .middle .baseinfo").length) { // CNKI
                            $(".baseinfo > span:nth-child(3) > a").each((i,e) => { jt = $(e).text().replace(/\d+/, ""); if (jt) utils.getRankInfo(e, jt) });
                            $(".baseinfo > span > a[href*='knavi/detail']").each((i,e) => { jt = $(e).text().replace(/\d+/, ""); if (jt) utils.getRankInfo(e, jt) });
                        }
                        if ($(".result-detail-list > dd > .middle > .baseinfo").length) { // CNKI
                            e = [".baseinfo > span > a[href*='/journals/']"]; utils.getRankInfo(e);
                        }
                        if ($("#qk > .bodymain > dl > dd > h3.titbox").length) { // CNKI
                            $(".bodymain > dl > dd > h3.titbox").each((i,e) => { jt = /(.*)<p>/gi.exec($(e).html()); if (jt && jt[1]) utils.getRankInfo(e, jt[1], true) });
                        }
                        if ($("#ctl00 table.GridTableContent > tbody > tr > td").length) { // CNKI
                            $(".GridTableContent > tbody > tr > td > a.fz14").each((i,e) => { jt = $(e).parent().parent().find("td:nth-child(4)").text(); if (jt) utils.getRankInfo(e, jt, true) });
                        }
                        if ($("#mainArea > .wxmain > .wxTitle > h2.title").length) { // CNKI
                            $(".wxTitle > h2.title").each((i,e) => { jt = $(".wxsour > .sourinfo > p.title").text(); if (jt) utils.getRankInfo(e, jt) });
                        } break;
                    case "pubmed":
                        var pmids = [];
                        e = [".fm-citation span[role='menubar'] > a", "#main-content [class*='breadcrumb'] > ul > li > .navlink", "form[action='/nlmcatalog'] .content > div > .rprt > .rslt > .title > a"]; utils.getRankInfo(e);
                        e = ["#mc > .journals-list > table > tbody > tr > td:nth-child(2) > a", ".back-ref-list > li[id] > span > .ref-journal", ".element-citation > span > span.ref-journal", ".bk_ref > span > span.ref-journal"]; utils.getRankInfo(e);
                        $("#heading h1.heading-title").each((i,e) => { // 文章页
                            jt = $("#full-view-journal-trigger > b > i").text(); if (!jt) jt = $("#full-view-journal-trigger").text(); if (jt) utils.getRankInfo(e, jt, true);
                            let poid = $("meta[name='citation_pmid']").attr("content"); if (poid && !$(e).attr("cited")) pubmed.getCite([poid],true);
                        });
                        $("ol.references-and-notes-list > li").each((i,e) => { jt = /(?=[.?]\s).{1,40}?(?=\s\d)/i.exec($(e).text()); if (jt && jt[0]) { utils.getRankInfo(e,jt[0],true) } }); //文献
                        $("form[action='/pmc'] .content > div > .rprt > .rslt > .title > a").each((i,e) => { jt = /(.*?) \d{4}(.*)?;/i.exec($(e).parent().parent().find("div.supp > div:nth-child(2)").text()); if (jt && jt[1]) utils.getRankInfo(e, jt[1]); }); // PMC搜索页
                        $("div.rprt.abstract > .nlmcat_entry > dl.nlmcat_dl").each((i,e) => { let abb = $(e).find("dt:contains('NLM Title Abbreviation')"); if(abb.length > 0) { let n = abb[0].nextSibling; utils.getRankInfo(n,$(n).text(),true); } });
                        $(".article-overview h1.heading-title").each((i,e) => { jt = $(e).parent().find("button.journal-actions-trigger").text(); if (jt) utils.getRankInfo(e, jt, true); });
                        $(".full-docsum a.docsum-title").each((i,e) => {
                            let pmif = "span.full-journal-citation > b > i", sanger = ".btn-click-journal";
                            let scopes = ".Scholarscope_Journal", full = "span.full-journal-citation";
                            let node = $(e).parent(), ppid = /\/(\d+)\//i.exec($(e).attr("href"));
                            node.find(".publication-type").remove();
                            if (node.find(pmif).length) {
                                jt = node.find(pmif).text();
                            } else if (node.find(sanger).length) {
                                jt = node.find(sanger).text();
                            } else if (node.find(scopes).length) {
                                jt = node.find(scopes).text();
                            } else {
                                jt = /(.*)\. \d{4}/i.exec(node.parent().find(full).text());
                                if (jt && jt[1]) jt = jt[1];
                            }
                            if (jt) utils.getRankInfo(e, jt);
                            if (ppid && ppid[1] && !$(e).attr("cited")) {
                                $(e).attr("data-ga-label", ppid[1]);
                                pmids.push(ppid[1]);
                            }
                        });
                        if (pmids.length) {
                            pubmed.getCite(pmids);
                            pubmed.getAbs(pmids);
                        }
                        if ($("#search-page #static-filters").length && $(".scicrx-filter").length == 0) {
                            $("#search-page #static-filters").prepend(scicrx_filter);
                            if (localStorage.scicrx_filter_show == 0) {
                                $(".scicrx-filter .hshow").text("显示");
                                $(".scicrx-filter form[id]").hide();
                            }
                        } break;
                    case "researchgate":
                        utils.getRankInfo("h1.research-detail-header-section__title", "", true, true);
                        e = ["#references .nova-legacy-v-publication-item__meta-right > ul > li:nth-child(2) > span > a", ".public-journal-detail-header .nova-legacy-l-flex__item > div h1"]; utils.getRankInfo(e);
                        e = [".chakra-stack > div > h1.chakra-heading", "#lite-page .publication-recommendation-item > .nova-legacy-e-text > span:nth-child(2)"]; utils.getRankInfo(e);
                        if (!$("h1.research-detail-header-section__title").length && $(".research-detail-header-section__metadata > div > ul > li:nth-child(2)").length) {
                            $(".research-detail-header-section__metadata > div:nth-child(1) > ul > li:nth-child(2)").each((i,e) => {
                                jt = $(e).text().replace(/ \d+(.*)/, "");
                                if (jt) utils.getRankInfo(e, jt);
                            });
                        }
                        $("div[class$='-item__stack-item'] > .nova-legacy-e-text > a").each((i,e) => {
                            if (!$(e).attr("ranked") && !$(e).attr("oadoi")) {
                                let node = $(e).parent().parent().parent();
                                let tt = /\d{4}/g.exec(node.find(".nova-legacy-v-publication-item__meta-right li:nth-child(1) span").text());
                                let sn = /\d{4}-\d{3}(X|\d+)/g.exec(node.find(".nova-legacy-v-publication-item__meta-right li:nth-child(3) span").text());
                                let yr = tt && tt[0] ? tt[0] : null, issn = sn && sn[0] ? [sn[0]] : "";
                                utils.getUnpayInfo(e, $(e).text(), "all", i, yr, "", issn);
                            }
                        });
                        break;
                    case "ggscholar":
                        if (/\/(scholar[?_]|google\.php)/i.test(myHref) || $("#gs_res_ccl_mid > .gs_r > .gs_ri").length) {
                            $(".gs_ri > h3 > [id]").each((i,e) => {
                                if (!$(e).attr("ranked") && !$(e).attr("oadoi")) {
                                    if (!$(e).parent().find(".gs_ct1").text().includes("图书")) {
                                        let jta, jtb, yr, ptitle = $(e).text(), node = $(e).parent().parent();
                                        if (node.find(".gs_a.gs_fma_p").length) {
                                            jta = node.find(".gs_a.gs_fma_p").text();
                                            jtb = /(.*?)?,?\s?(\d{4})/gi.exec(jta);
                                        } else {
                                            jta = node.find("div.gs_a").text();
                                            jtb = /(?:-\s)(.*?)?,?\s?(\d{4})(?:\s-)?/gi.exec(jta);
                                        }
                                        yr = jtb && jtb[2] ? jtb[2] : null;
                                        if (jtb && jtb[1] && !jtb[1].includes("…")) {
                                            utils.getRankInfo(e,jtb[1]);
                                            !$(e).parent().find(".scicrx-ico").length && utils.getUnpayInfo(e, ptitle, "doi", i);
                                        } else {
                                            if (jtb && jtb[1] && jtb[1].includes("…")) {
                                                let jtt = jtb[1].replace("…", "");
                                                utils.getUnpayInfo(e, ptitle, "all", i, yr, jtt);
                                            } else {
                                                utils.getUnpayInfo(e, ptitle, "all", i, yr);
                                            }
                                        }
                                    }
                                }
                            });
                        } else if (myHref.includes("/citation") || $("#gsc_bdy > .gsc_rsb").length || $("#gs_bdy #gsc_sb_ui").length || $("#gs_bdy #gs_hp_ra > #gs_ra_b").length) {
                            e = [".gsc_oci_value", "#gsc_mvt_table > tbody > tr > td.gsc_mvt_t", "#gs_hdr_md > h1"]; utils.getRankInfo(e, "", true);
                            $(".gs_ora_brief > h3.gs_ora_tt").each((i,e) => {
                                jt = $(e).parent().find(".gs_ora_pubvenue").text();
                                if (jt) utils.getRankInfo(e, jt, true);
                            });
                            $("tr.gsc_a_tr .gs_gray:last-child").each((i,e) => {
                                if ($(e).text().includes("(")) {
                                    jt = /(.*) \(/.exec($(e).text());
                                } else {
                                    jt = /(.*),/.exec($(e).text());
                                }
                                if (jt && jt[1]) {
                                    jt = jt[1].replace(/\d+/g,"");
                                    utils.getRankInfo(e, jt, true);
                                }
                            });
                            $("tr.gsc_a_tr .gsc_a_at").each((i,e) => {
                                if (!$(e).attr("ranked") && !$(e).attr("oadoi")) {
                                    let tt = /\d{4}/g.exec($(e).parent().parent().find(".gsc_a_y span").text());
                                    let yr = tt && tt[0] ? tt[0] : null;
                                    utils.getUnpayInfo(e, $(e).text(), "doi", i, yr);
                                }
                            });
                            $(".gsc_oci_title_link").each((i,e) => {
                                if (!$(e).attr("ranked") && !$(e).attr("oadoi")) {
                                    let tt = /\d{4}/g.exec($(".gs_scl:nth-child(2) > div.gsc_oci_value").text());
                                    let yr = tt && tt[0] ? tt[0] : null;
                                    utils.getUnpayInfo(e, $(e).text(), "doi", i, yr);
                                }
                            });
                        }
                        break;
                }
            }
        },
        addPinfoIco() {
            let url, pClink = $(".scicrxPanel a"), link = $("a");
            for (let i = link.length; i-- > 0;) {
                let conti = true, node = link[i], href = node.href;
                if (href) {
                    href = href.replace(/\/(metrics|cover|full\/html)/gi,"");
                    url = href.includes("%") ? base.deURL(href) : href;
                    if (url) {
                        for (let k in pClink) {
                            if (node == pClink[k]) {
                                conti = false;
                                break
                            }
                        }
                        if (conti && !$(node).attr("pcked")) {
                            $(node).attr("pcked", "1");
                            utils.getPID(url, node);
                        }
                    }
                }
            }
        },
        addPinfoSpan(pid, pid_type, node) {
            if (pid && pid[1]) {
                let conti = true;
                let rega = /#|&|\?|\/(figure|table|(c|j|d)\.cnki)/;
                let regb = /(\.|\/)(pdf|doc|xls|ppt|htm|txt|xml|csv|meta)/;
                for (let k = 1; k <= 2; k++) {
                    if (pid[k]) {
                        if (rega.test(pid[k]) || regb.test(pid[k].slice(-10))) conti = false;
                        if (/&key=/.test(pid[k])) conti = true;
                    }
                }
                if (conti) {
                    let regc = /(sciencedirect|semanticscholar)\./i;
                    let downSpan = document.createElement("span");
                    let downIco = document.createElement("img");
                    let ptitle = pid_type + ": " + pid[1];
                    $(downSpan).addClass("scicrx-ico").attr("title", ptitle).attr("paper_id", pid[1]).attr("paper_id_type", pid_type);
                    $(downIco).addClass("scicrx-btnimg").attr("src", scibtn_ico);
                    $(downSpan).append(downIco);
                    let tt = regc.test(myHost) ? 1e3 : 0;
                    setTimeout(() => {
                        $(node).after(downSpan);
                    }, tt);
                }
            }
        },
        addInfo() {
            start.addLinkByID();
            start.addPinfoIco();
            rankSite && start.addRankInfo();
        },
        initSciCRX() {
            load.initConfig();
            load.getBaseData();
            load.getRankData();
            load.addInitStyle();
            load.pageListener();
        }
    };
    main.init();
})();