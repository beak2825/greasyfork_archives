// ==UserScript==
// @name         文献免费下载助手
// @version      0.2
// @author       未知
// @homepage     https://greasyfork.org/zh-CN/scripts/448015
// @namespace    http://eureka.mba/
// @description  👆👆👆👆👆 纯净好用的SCI文献免费下载助手，访问SCI文章网页时，在文献页面上添加 Sci-hub, libgen 等下载按钮，可以直接跳转到下载页面。
// @license      AGPL-3.0-or-later
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @compatible   firefox Violentmonkey
// @compatible   firefox Tampermonkey
// @compatible   chrome Violentmonkey
// @compatible   chrome Tampermonkey
// @compatible   edge Violentmonkey
// @compatible   edge Tampermonkey
// @connect      *://*
// @connect      http://eureka.mba/
// @require      https://unpkg.com/js-md5@0.7.3/build/md5.min.js
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require      https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.all.min.js
// @match        *://*.sbrnet.com/*
// @match        *://*.schattauer.de/*
// @match        *://*.scholar.google.com/*
// @match        *://*.sciencedirect.com/*
// @match        *://*.scientific.net/*
// @match        *://*.simplymap.com/*
// @match        *://*.site.ebrary.com/*
// @match        *://*.springer.com/*
// @match        *://*.springer.de/*
// @match        *://*.springer-ny.com/*
// @match        *://*.springerprotocols.com/*
// @match        *://*.standardandpoors.com/*
// @match        *://*.statpak.gov.pk/*
// @match        *://*.swissmedic.ch/*
// @match        *://*.technologyreview.com/*
// @match        *://*.telospress.com/*
// @match        *://*.theannals.com/*
// @match        *://*.thecochrane.com/*
// @match        *://*.thelancet.com/*
// @match        *://*.theses.com/*
// @match        *://*.ualberta.ca/*
// @match        *://*.ulrichsweb.com/*
// @match        *://*.unb.ca/*
// @match        *://*.unesp.br/*
// @match        *://*.uni.wroc.pl/*
// @match        *://*.victoriandatabase.com/*
// @match        *://*.victorianperiodicals.com/*
// @match        *://*.wanfangdata.com.cn/*
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
// @match        *://zhuanlan.zhihu.com/*
// @match        *://*.znaturforsch.com/*
// @match        *://*./doi/abs/*
// @match        *://*./doi/full/*
// @match        *://*.sciencedirect.com/*
// @match        *://*.wiley.com/*
// @match        *://*.acs.org/*
// @match        *://*.tandfonline.com/*
// @match        *://*.nature.com/*
// @match        *://*.accessible.com/*
// @match        *://*.aic.ca/*
// @match        *://*.ajas.info/*
// @match        *://*.adisonline.com/*
// @match        *://*.alexanderstreet.com/*
// @match        *://*.amsciepub.com/*
// @match        *://*.annee-philologique.com/*
// @match        *://*.anthrosource.net/*
// @match        *://*.appliedradiology.com/*
// @match        *://*.arch-anim-breed.net/*
// @match        *://*.aspresolver.com/*
// @match        *://*.atypon.com/*
// @match        *://*.aviationweek.com/*
// @match        *://*.hezibuluo.com/*
// @match        *://xueshu.baidu.com/*
// @match        *://*.bbsrc.ac.uk/*
// @match        *://*.begellhouse.com/*
// @match        *://*.bepress.com/*
// @match        *://*.bing.com/*
// @match        *://*.biomedcentral.com/*
// @match        *://*.bioon.com.cn/*
// @match        *://*.bioon.com/*
// @match        *://*.biotechniques.com/*
// @match        *://*.blackwell-synergy.com/*
// @match        *://*.bmj.com/*
// @match        *://*.britannica.com/*
// @match        *://*.businessweek.com/*
// @match        *://*.cambridgesoft.com/*
// @match        *://*.cawq.ca/*
// @match        *://*.cell.com/*
// @match        *://*.chadwyck.com/*
// @match        *://*.chemnetbase.com/*
// @match        *://*.china.eastview.com/*
// @match        *://*.chronicle.com/*
// @match        *://*.ci.nii.ac.jp/*
// @match        *://*.cindasdata.com/*
// @match        *://*.cjc-online.ca/*
// @match        *://*.cnki.com.cn/*
// @match        *://*.cnki.net/*
// @match        *://*.cn-ki.net/*
// @match        *://*.communicationencyclopedia.com/*
// @match        *://*.computerworld.com/*
// @match        *://*.contemporaryobgyn.net/*
// @match        *://*.corporateaffiliations.com/*
// @match        *://*.cqpress.com/*
// @match        *://*.cqvip.com/*
// @match        *://*.crcnetbase.com/*
// @match        *://*.csiro.au/*
// @match        *://*.csis.cn/*
// @match        *://*.datapages.com/*
// @match        *://*.db.chemsources.com/*
// @match        *://*.dccc.chemnetbase.com/*
// @match        *://*.dichtung-digital.de/*
// @match        *://*.discovermagazine.com/*
// @match        *://*.eastview.com/*
// @match        *://*.ebscohost.com/*
// @match        *://*.economist.com/*
// @match        *://*.edu.cn/*
// @match        *://*.edu/*
// @match        *://*.eenews.net/*
// @match        *://*.ejorel.com/*
// @match        *://*.els.net/*
// @match        *://*.emeraldinsight.com/*
// @match        *://*.engineeringvillage2.com/*
// @match        *://*.epnet.com/*
// @match        *://*.evolutionary-ecology.com/*
// @match        *://*.exacteditions.com/*
// @match        *://*.frymulti.com/*
// @match        *://*.cos.com/*
// @match        *://*.futuremedicine.com/*
// @match        *://*.fyesit.metapress.com/*
// @match        *://*.galegroup.com/*
// @match        *://*.gateway.proquest.com/*
// @match        *://*.genomebiology.com/*
// @match        *://*.global-sci.com/*
// @match        *://*.google.com.co.uk/*
// @match        *://*.google.com.hk/*
// @match        *://*.google.com/*
// @match        *://*.google.nl/*
// @match        *://*.gpoaccess.gov/*
// @match        *://*.gracescientific.com/*
// @match        *://*.groveart.com/*
// @match        *://*.grovemusic.com/*
// @match        *://*.gut.bmj.com/*
// @match        *://*.harpweek.com/*
// @match        *://*.heart.bmj.com/*
// @match        *://*.hh.um.es/*
// @match        *://*.hull.ac.uk/*
// @match        *://*.humankinetics.com/*
// @match        *://*.hwwilson.com/*
// @match        *://*.hwwilsonweb.com/*
// @match        *://*.ias.ac.in/*
// @match        *://*.ibisworld.com/*
// @match        *://*.icevirtual.com/*
// @match        *://*.icf.uab.es/*
// @match        *://*.ida.liu.se/*
// @match        *://*.ihserc.com/*
// @match        *://*.ihsglobalinsight.com/*
// @match        *://*.ijdb.ehu.es/*
// @match        *://*.ijee.ie/*
// @match        *://*.impublications.com/*
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
// @match        *://*.itn.is/*
// @match        *://*.iwaponline.com/*
// @match        *://*.john-libbey-eurotext.fr/*
// @match        *://*.journalofinfection.com/*
// @match        *://*.jove.com/*
// @match        *://*.jsad.com/*
// @match        *://*.jstage.jst.go.jp/*
// @match        *://*.karger.com/*
// @match        *://*.kluwerlawonline.com/*
// @match        *://*.kluweronline.com/*
// @match        *://*.knovel.com/*
// @match        *://*.la.rsm.com/*
// @match        *://*.labanimal.com/*
// @match        *://*.landesbioscience.com/*
// @match        *://*.lexisnexis.com/*
// @match        *://*.lexis-nexis.com/*
// @match        *://*.libraryissues.com/*
// @match        *://*.liebertonline.com/*
// @match        *://*.livestockscience.com/*
// @match        *://*.mapress.com/*
// @match        *://*.marquiswhoswho.com/*
// @match        *://*.math.ca/*
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
// @match        *://*.news.reseau-concept.net/*
// @match        *://*.newsbank.com/*
// @match        *://*.nlm.nih.gov/*
// @match        *://*.nonlin-processes-geophys.net/*
// @match        *://*.npprj.spci.se/*
// @match        *://*.nrcresearchpress.com/*
// @match        *://*.nv-med.com/*
// @match        *://*.nybooks.com/*
// @match        *://*.odyssi.com/*
// @match        *://*.oed.com/*
// @match        *://*.oldcitypublishing.com/*
// @match        *://*.onlinewiley.com/*
// @match        *://*.org/*
// @match        *://*.oup.com/*
// @match        *://*.ovidsp.ovid.com/*
// @match        *://*.oxfordlanguagedictionaries.com/*
// @match        *://*.oxfordmusiconline.com/*
// @match        *://*.pagekoreascience.or.kr/*
// @match        *://*.palgrave.com/*
// @match        *://*.paperpile.com/*
// @match        *://*.pasj.asj.or.jp/*
// @match        *://*.peanutscience.com/*
// @match        *://*.peerj.com/*
// @match        *://*.pepublishing.com/*
// @match        *://*.perceptionweb.com/*
// @match        *://*.pharmacists.ca/*
// @match        *://*.podiatrytoday.com/*
// @match        *://*.polymersdatabase.com/*
// @match        *://*.portal.euromonitor.com/*
// @match        *://*.pracademics.com/*
// @match        *://*.pressdisplay.com/*
// @match        *://*.priory.com/*
// @match        *://*.proquest.com/*
// @match        *://*.proquest.umi.com/*
// @match        *://*.publish.csiro.au/*
// @match        *://*.pubmed.cn/*
// @match        *://*.pubmed.com/*
// @match        *://*.pubmedcentral.nih.gov/*
// @match        *://*.pubmedcentralcanada.ca/*
// @match        *://*.pubservices.nrc-cnrc.ca/*
// @match        *://*.purl.access.gpo.gov/*
// @match        *://*.qjps.com/*
// @match        *://*.railwayage.com/*
// @match        *://*.rdsinc.com/*
// @match        *://*.redbooks.com/*
// @match        *://*.reference-global.com/*
// @match        *://*.referenceusa.com/*
// @match        *://*.researcherslinks.com/*
// @match        *://*.researchgate.net/*
// @match        *://*.revophth.com/*
// @match        *://*.riag.com/*
// @match        *://*.rsm.com/*
// @match        *://*.safaribooksonline.com/*
// @match        *://*.sagamorepub.com/*
// @match        *://*.sagepub.com/*
// @match        *://*.sanborn.umi.com/*


// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAB3RJTUUH5gcDDigU4UV2HAAAgABJREFUeNrtvXdgHMd59/+Z3bsDDh0gCBIgCPbeKVJUo3qxZVnuTY6L7LgmdhzbyZv3TZOTX+Im27Edy5aiJE4sx4otyZKs3ihSLKJIir2DJEgUorfrZXd+f+zu3d7hKioh4WuvcNydnZ2Z3XnmmacKpnDJQ0qZT3EFcAKFgBsoAsrNfzvMQ7X9FkAECJpHGAglHda1KKDn2hAhxEQP3RSyYOoNXWLIYbIL4pN6GjAdqAXqzGM6UAGUmWVKMSa/E4M4WIdq/gXQMCZ38hEGvIDH/DsA9AEXgTbz6AK6gX6zTEYCMUUULi1MvY0JRA6TvQioBGYCc4GFwGJgHlCPMdFLgALik3ncmo9BIHwYhOEicA44bR7nMAhELwZhSNvZKaIwcZga+XFGhkmvAlUYE30FsB5YDszGWNVLMVj2yQAdY9L3AK3ASWA/cBg4g8E1hFPdOEUMxhdToz3GyDLhp2NM8g0YE34ZxoSv4K35brwYXMEJ4CCwB4MotDFFECYEU6M7Rkgz8Ssw2PgNwNUYk34OUDzR7Z0ghDA4hEPATmA3BnHoJoUsYYoYjD6mRnQUkWbSTwfWAbcC1wCLMFj9KQyFB2jCIATPm39bmSIGY4apURwh0kz6GozV/VbgemAJhkBvCrkjgiFI3I5BDF4HWkgiBlOEYGSYGr1hIM2kLwLWAHcC78CY9O6JbutbBBEMzuAV4HEMzqAvudAUMcgfUyOWB1JMfIEhtb8FeC9wBYbabgpjBz+GAPFJ4GkMmUHEXmCKEOSOqZHKASkmvhvYBHwYg82fx/jr4acA7cBW4LfAFqa4grwxNToZkGLiVwE3AX8EXIdhaTeFiUcIQ6X4G+APQHNygSlCkBpTo5ICKSZ+A/Ae4KMYKjzXRLdxCimhY2wJHgF+BxwlyQJxihAkYmo0TKQR7M0BPgZ8EljK1HhNJrRgEIL/xDA2miIEKTA1CqSc/LMxVvtPY1jqTWHyohV4GPglcMR+YYoIvM0JQIqJX4cx8e8GVk50+6YwqmjGkBH8Ejhuv/B2JgRvy56nmPgVwIeALwFreZuOy9sE54B/B/4LY5sQw9uRELztepw0+V0Yarw/w7DYmyzedlMYOQ4AP8MQFg5YJ99uROBt09sUq/4ajIn/IQyf+im8/RAFXgK+h2FPEDMzfrsQgrd8L1NM/Brgj4EvYgj7pjCFHgzZwM8wtggxvNUJwVu6d0mTXwFuBv4a2PxW7/sUhoXDwL0Y24KAdfKtTATekj1LserPwmD3/5gpW/0pZEYIeBT4DgZBiOGtSAjecj1KmvwCeCfw98DlE922KUwqnAW+C/yKtzA38JbqTdLkn4ax6v8pU6v+FIaHEIYR0f8HNNovvFUIwVuiFylY/iuAb2G46b4l+jiFCcUhjO/pCYwQ6sBbgwhM+h4kTX438Fng/2CEzZ7CFEYLg8D9GELCTuvkZCcCk7r1SZO/HrgH+ART3npTGDu8CPwV8KZ1YjITgUnZ8hQs/9UYApurJ7ptU3hboBH4Gwx14aQ2Hpp0LU6a/E6MFf8epox6pjC+GAR+DPyASWxKPKlam0LK//8wHHimgm9OYSKgA78H/i9GOjRgchGBSdPSpMk/F0MY84GJbtcUpoARjuyrGKHLgclDBCZFK5Mm/zoM1mvzRLdrClOwoRH4OkZMwhgudUJwyUeyTZr8twAPMTX5p3DpYSHwIPA5jLyPQE4ZoCcUlzR5sg2eAO7CcNusm+h2TWEKGeDD0EjdyyQwIb40W0XC5FcwnHi+w5RJ7xQmByIY29R7MAgCcGkSgUuvRSRMfhX4MoYtdtlEt2sKU8gDGnAfhr3AIEwRgJxgm/xO4GsYnnxv1/TZU5jc0DHkAn+FmbXoUiMCl1RrbJO/APhLDD1/4US3awpTGAEkhkvxN4Bu6+SlQggujVYwZOX/f+YxZdM/hbcKfo3hnt5jnbgUiMAloQa0TX4Hhi71r5ia/FN4a+HjGFqsWD7JS0FFOOEEIEna/2Xg75hi+6fw1sTdwD9ji0I90URgQglAkp7/jzGk/UUTOiJTmMLYQQBfwAguckn4r0wYAUiifH+EoecvnegBmcIUxhgq8BVsMq6J5AImRAqR1OHbMVI1zZywUZjCFMYfQQxZ108wMxdPhFBw3J+YNPk3Ytj2Lx73nk9hChOPPgy518PWifEmAuP6tKTJvxBDP3rFuPZ4ClO4tNCMkYb+FevEeBKBiZIB1AA/YmryT2EKszH8BlZPxMPHjQDYVn838I/AHRPR4SlM4RLESgwiUA/jKxQcFwKQ1KEvYehDpzCFKcRxPYZ6sAjGjwiMOQFI6si7MOKnOceld1OYwuTCJzCyVgPjQwTGlAAkdWA5hq6/esx7NcnR3d3NgQP76e7umnBLsSmMK5wYC+Tt1omxfv+OcerYNIzJv3Kcnjep0XTuLD/71x8zrWoad773A2y8/HLc7kvCcGwKY49qjIhCTcAxMIjAWGkG1JFXkRpJQT3+BiNl16SClJLunm7OnjmDz+cFBIqioqrKmKpq+vr7+N+HH+bll17m0KHD+AMBampqKC8vvyQ8yKaQH3RNo7epiYHTp5G6jlpYiOLIuPbWYAgEn8MwGOJb3/rWmLRtTDiAJLblDgxjh0kHKSV79+7hF/f9FF3Tqa2tp2HOHBrmzGXu3LnU1dVRWVlJUVERBQUFKMro7KgqKiopLq2gf9DLnr17OXP2HK+//jof+chHuPbaa6mqqprooZlCHvB2d3PwgfuIbN9FSd0sSi5bT9mSJZQvWUJJ/WycJSWpCPu7MQTm34ax4wLGegswHyMu2qQM56UoCnW1dXi9fvbteQOBguJwUlDgpqq6mlmz6pg9ezZz5sxh4cKFzJ07l9raWsrKynC73bhcLlQ1fyarvLychQsX8pJDJRQK09HRwZNPPMnhQ0d47/vey/vf/z6WL19OYeGU0+RkwODFVgb3vkHR6ZOETp4gsGs7F8vLUOsbKF2zjmmXb6J67RpKamtxuN3WRFcwImLtBl6Ruj4mRGDUtwBJUX2+g02gMRlRUVGBx+Nl/4H9BMMhIuEoXq+Pzs5uzp5r4vDhw7zx+hts3bqVLVteZfv2HezZs5fjx4/T2tpCd3c3Ho+HUCiEphmZpYUQsSMVHA4HHR0dbN+xA5/fh5SgaTo9PX0cPnSEgwcO4Pf7qKqqoqysbFhEZgrjAyklrXt20/OHJ3B7fQghULQoDq8P2i8SOHqE7p076dq7h4GmcwR6egj7fGhRDcWhFitO53whxLNCCC9SjvpWYFQ5gCTW/y6MIAiTGoWFhXzgAx+ksbGRxx79HT6PB02RCKkbEzMq8Ub8eH0+2i92cPTIMZxOJ4WFBbiL3ZSVlVJVVcX06dOpra2lvr6eWbNmMXPmTKqrq5k2bVqMYygoKEBVVRRFYfHixdTV1dHZ2YlER6CiaRr9/f3s3LmT48eP8cILL/CRj3yEm2++mRkzZmTcgui6TltbG16vl4aGBoqKpryuxwPRUAhv40kKBjyImOW9AGEs8a5IGLo60Ls76X1zL11l5YiKKsSMmZStXsPcd9+xuXrF8m86Cgv/D0Joo80FjNUWYBVvoXh+s2fP5rOf/WNOnTzBnt27EEikriMF2JLDogO6DlooQijsp2+gj7Y2Y8VXVQWHw0FhYSHFxUWUlBRRWlrG9Ok11NXNYvbs2dTX11NbW0t5eTmNjY0gJQ5VIaLpSKGDkEggEoXOzk5efP4Fjh09xrat2/jwRz7Mpk2bKCtLvdvq6uri3u9/n2PHjvH5L3yB97znPTidU+YYYw1fdxfew4dxBkPpCwmBAiihII7OILKzg+ipE/S8sZto20WK//avP1c6u367lPLx0d4CjBoBSDL1/SsMZ5+3DJYvX86tt72To0eOEAh0I6Xpwwmk8qnSbdyQlBJNk2iaRigUYmCgHyHiq7WqqhQUFOJ2u2PEIRKJ0t3Vha7rGE+SsccIQKCgaRoXLlzgN7/5H/a9uZf3ve/9vOc972HJkiUUFBQktOfChQtseeUVjh87htPlZMWKFSxbtmyih/Utj2B/P/7OLgp0G3ecdhIL6/84AUfQT+jkcUI9PWWls+v/WgixF2gZTS5gVDaPKVj/v2T8bAzGBQ6Hg3A4zJYtr9Le2Zl28seZvKTzwhor84Q5n6UEXdeIhMP4/X76+/vp7Oyit7eHcDiMrkuwyQsEcRmCIgQSnXA4QkdHBwcOHuTo0aMEAgGqq6spKytDURSklGzbto3HHnuMQa+X7u4eHA4Hq1atoqSkhCmMHYSiEo5GCWsaOgJd15DRKELKnFxxZVkpNbfeRvGsWXVAFMNrUN5zzz2jIg8Y7Um6EGPyT2rWX9M0gsEgAwMD9PX10d/fz+DgIG+88QaDXk9sEguEjRDYKXzCnzQwWIhEQm7UIaVxaLFVQ5jPlInPEsZfIQRSCnp7e3np5Zc4dOgQW7du5UMf+hCbN29GVVV27txF/+AgCIW+/gH++79/RWFhIV/4wheora2d6CF/y6K4upqVn7ob/ztvx3f+AoOnTtF76AC+fQdQms6iRsPpbza5TBn/Rv4YeAl4cbTaN2I+Iimi74+ZZDr/SCRCIBDA4/HQ19dHR0cH58+f5+zZs5w5c4aLFy/S29eL1+tjcKCfQc8gkUjUnLwieQyMQc0wqqksO0XsP+nKCKxJb69bJPwyeEeJREqJy+Vi3tx53HLLLdTU1PDb3z3C6dNn0HUdPaqhS53amTV84Ytf4Atf+AIzZsyY6FdxySISDhMJ+JG6jrPQjbOwcNgsuB6NEhoYoG3rNpq++22Us42xl2on8gZ3KNEXLmb1v/6Mmg0brCq2AB/CDC8+0q3AaHIAN3GJS/11XScYDOLz+ejt7aW5uZmTJ09y6tQpLly4QEdHB93d3fT19eHz+YhEIuhSN/bh8cU49leS2k5bptjuSZmeMCQs7ulLJNQtBMS3lcYPRREIoSA1nXAoTGPjaZqbL+BwugiHw6iqaggv0ZBS0t7ezgMPPIAQgs9//vNTRCAFBjo7OPPSC3gOHkCParjnzqN6xSrKZ9fjLq/AWVyMs7AQJUdVrOJw4J42jeo1q2irqiByxtwKlJTgWr0WHE7Cba1E21qQXi+a1NETv5vrgE9ixNMYsW3AiAiAbeWrBL6JLeb5RMMQvGn4/X56enpoaWnh7NmznDp1ivPnz9Pc3MzFixfp7u6OTfahjhemvt6Q+5sVxy5ZJdISgqFtGs3+DT2n67ohe5DxrUEoHMIfCKCqAlVR0DTdkCtgEJC2tjZ+8YtfoOs6X/ziF6eIQBL6mps585uHKNq3H6cuCbjd9FRPR62fTcHMWgrq65i+eg21Gy+neMaMnCdjqLcXrb8vttKXbtzEom/9A47SUgIdHXTt2E7Tk48TKipCSTT4UoA/AZ7H9BUYCUaLA/g4cMOojnweiEQiRCJhAoEgfX19tLe309LcTNP5Js6eOUfjmUZaW1vp7e3F6/UaK7uuZZiQ8ZdoEIUUBY0wjgmTX4jEFdogIENXf5l9yc8NgkRWQCZyJZquIwQopmTZ0CgYWgcpJbppXXaxrY37f/ELpK7z5T/5E2pqasbx7V3amDZnLvNufzfeomLUlja0lhb0s2eQTeeIOhwEnC76plXTefPNLPvCF6lamF35JTWNgVMniHZ1oQoBQlB++eWUL12KEIKS+nqqVq5i2g034u/tpXRWfXIVC4CvAn8KREfCBQybANhWy0UYYY4nxBytubmZZ599mjONjXR0dtLc3Exbaxt9ff14vd6YBZ7JJCNEfAlPnJT2CZnb5HQ6HCxYuACHQ+X06dOEw+FYnXFLP2P/bgjqZIwYpHfztBqVB4EQYkhxYTsnEBh8pLFFUFRDMyAxuR4JHR0d/Pu/P0hJaSmf//zn09oTvN1QWl3Nmk9/luB730+kq4vBo0fofv55vHveQHR14Yj4kAE/vY/+jpMlpaz96ldxV2bOYh/x+fDsfxPh9QIgSkopWr4iYRKrBS5mrFqVqZqPAo8BL4ykf8MiAEkJPb7ABEb17ezs4OGHf8Mbu14nEo4Agoiux0QpQggQCkiJQWxNdZo5Ie3CNUv6Hr+WGYqqcsstt3D11Vfxd3/3t5w+3YiiJFJiqx5j8ksMiX6muvOY+DGlgJ0LEQl/h9QqdTTN4AQUoYBiGC8JodDZ1c2DDz5IdXU1H/3oR6d8DUw43W6cbjfU1lG5ajUzbn0H3fv20vX003i3vILW2YHb46HvxRfoecc7qN+0KWN9ngvn8b25DyVqmIY7FyygbPnyfJtVjuErsAvwDJcLGNaqfc8991g/L8PwVpqwhB7l5eVMm1aNx+Olu6ubYDAcl9ALYWPJRcLqHP9rEAFpsvT5DKKua4TDIaLRCEePHsPj8ZgyA/vzMteXySdguGxdMhGIjYWpIbAORbFsCYxxEkBfXy+nT59m+vTpLFy4cMpaMAlCCJxFRZQvWEjVlVdCYSGDRw8jfD70QjeVN9xA5fz5ae/XNY2WZ5+m//e/R0SjSCGofOft1L37zmwuwqnQAJwADsPwXIbzfmKSn/8XgAlVIhcXF/Oe97yHdevW8dhjj/HrXz3EiZMniIbDSAS6taILGWO9k1dga+W3s+q54ujRoxw7dpRoNGpI4c3zxtwXpiEOsf22XaU3VrBWA2kTBloQJlE0xkJH0yzip6CZW6Rjx4/x7W9/G13Xed/73jflN5AGBRUVlK5ejaiqQu/owFlSSlHVtIz3BPt66X9tG/j9AAi3m7I1a3AMj9sqwAgh9hzQOxwuYCQO7BuB943ecA4fqqoyb948vvSlL3HvD3/AJz7xCWbVz8KpKihIQDfEdTL1YUe2yT90MkmiUS3t1sFQzYFFXGJmvbbnpXvmSMNBpbs/rpq0bR0UgcvlRFEMAeHx48e4997v88QTT+A3P9YpJELqOsGebvRAECQoxcU4S4oz3jN4+hTBgwcR5tgr06dTsmTpSJpxJfDe4d6cFweQtPp/lkssvl9RURE33ngjy5cvp27WLH7+s5/S09VjmlKJOLlLZYwjclPT2amsNfmN+83tRpJxkKZpGSf5cJDKACmZ+CS3M2VfzEOYndc1DZAIRQEhOHbsOPfeey8Ad955J8XFmT/utxv0SAR/03noHzBP6BnLR0NBune+htZ+EWGaaDsWLqBo9uyRNMOBMRefBLrz5QKGywFsZARUZ6xRUVFBdXU1zgKXaUYpDfVYCo3eyH0qUu/hrUkfZ/3tR4bacmhQrsQkWzmJAqY5s5Q6kUgYLWpYOTpUB6qqcvToUb73ve/x+OOPT3ECSdBCIUIXL0IwAEKgebxEBjxpy/s6OujdtQNChvmvrioULV6Cq6Iy10emw+XAncO5MWcCkGTy+zkusdXfwsDAAI8++ii//s1D9PX3m1POUselRlw4mOpa5glu/E5Zq61sYn2ZMJLJna5uQ8YhbX/j5qZYQkvTfUlK09XZLKPrOkeOHOZHP/oRzz77LKFQBrfWtxn0aITwQB8yYkzo6MAAngsXkGk4gf5Txwk3NsY4LlFcQvmKlTiSPDezQeo6g+0X6W8+jx6NQpwLqIb8to7D4QA2Ae8Z++HNHx0dHTz44IP80z//Ewf2HyQcihgSbpuN/FAIVNUI9JmZSIgh/07UIsiYMFHGrivmEAvzr/F7pPbbqdqSqZyqqoaJsM0VUUrDzdiusbD6JAVEohrhSCTGwRw+fIgf//jHvPLKK0QikXF4m5MBAt3UogghwOel/9gxIik4JS0UYvDIIURPH9Z35pwxk4ph7P8Hms5y6B/+jiM/+B7+nm7r9LC4gJwIgG3iKBjJC6blct944vz589x333385Kc/5nTjaaKRKLqeWsiXak+uKErK1T4rGz3kusn6Sxl7fiK3MPTZqSZwPkQiXZ3xZ5uTXdhZEeOI0TDLSMgcB2n6QCiKgsPhRErJvn17+dEPf8jWrVsJh8M5t++tCsXpRCkvQ6oqSIkaCjB46CD+rq4hZSM+L/7jJxDBsOFHIgTueXMpznP/H/H7aXnsEYJPPIm2fQehjnbrkgMj41Yl5M4F5KsGXIaR3eeSgSGxPs59993HI48+Qk93lymMUxImXab7dV3POOEswUo6FWGy2s08m7LccJGrbCBVOV3XbPXIWOtM8QiKIpC6RSisrYBu3itwOByGX0EozGvbt5vETeeGG254W9sJqAUFuGbMQHM5UcNhVF0jcvIovQcPUtbQkOAg5G9vJ3TqlCH9FwLpdFKyYiXO8oqcn6eFw7S8+hLdjz6CGgwZ70/T7EU2YpjkP5ZrnfluAT6MmcDwUoCu6xw4cIDvfPc7PPQ/D9HV1YmuSaRuF76lR3yfK9G07OUhX+Oc7AK/fFd/q43GtkUdEgcwNYFKI6cwjX9UVcXhdBiOTTJxO6PrOtFoNHY+GAqyY8cOvve977Fly5a3NSegOp2ULliErKgAzPfZ1UX700/hbW2NlZO6Tt/Ro0SbW2PqJqWyisoNG1FyJKBaKETzqy9z7mc/RT/bhBQCpX42zmkJorgCDL+cQshtwcnKAdgqqQc+ONGDbkHXdfbt28f3v/99nn3uWSN6ri7j7Cz5qd7sDjvJq3mmCTmc/Xyukz7ddsSIMagihIhFGs5taxH3RTAVhOYPHVV1oOsWJ5AczkwzOALzvmAoyPbt2w3JhqJw3XXXvT05ASGoWrqMgjlz0FtbUQA1GsWzYzvNjz/Oors/g6u0hODgID07toPHA8IwTiucv4DSZbmZ/0aDQS5sfYWz//pjePMAqq4jCwoov/Jq3DVDvDdvxOAEXsul7nw4gHcDI7JYGC3ous7+/fv53ve+xzPPPE3A50ORlhw7s+47M9Ib5IyWHj+dDCIfCCESVmbrnJLEEdjDj1tRg6zNv/3xuq6ja1FMo2Dj3gQthm56TxrbAqEIwuEQO3bs4N7vf59t27a9bQWDxXWzKL1sPdECgwAqgNLbS8v//Ibzv/sdkUEP/Y1n8O7dhzCJte50ULJuPYU5eF2GPB7OPfMUZ3/0A8SeN1E1HaSkcOky6u94N86hFoQVwMfIcW5n5ABsH2lelY4lpJQcOnzYWPmffRafz49iSrLilra5Ta6E6Doi+drQ/b40HYoStQWJwTqGxP4jvWFGfPIOaVnG9lpuvVYbLf+DeKFka0Nhu18kbQkEOhKimqktSd0WY2ylqS4U6EAwGGTbtm1ouk4kEuGGG24YEoz0rQ6H2820yy6na8ajyPMXEULg0DXC589x7v778TVfIDDoQW++YLj+SolSWkbl+vWomcZKSgZbWjj32CP0/Oq/US5cMGU2EmXaNGZ95rOUL027Ht8B/CtwLJthUK5CwCswHH8mFFJKjh49yg/uvZenn34av99nusPLmCor1+Ac8UGRWcvYJ2qmyD6Z2p34zGH1fshvO32SYMQFSI4xKEWM3bf8HeJOhAYnIhCxkOPmDsrgBKx/WP4LpkGTwQgYzwpHQrz22jb8fj8ej4c77rjjbZXIVAjB9LXrab38SgIXn8ARMYizS4ugNZ3h4n8+iEBQEPCbzmkSR/V0SjM4DIV9ProO7ufcb36N//nncfb1xz++8nJmfOrT1N35nkxRiGZjCOuzBgzJhQAIDKu/CfcIaWxs5Mc//jFP/uEJfH5vTHdtCKvS2b2PZEtg1THycpl19ckhv7LLH4RQhnIpCTIMox5FCIRU0KWGNG3/XC4nrgIX0pTsh0JhNBmLMWoPMRg/YXE+Ml7Q4igi4Qhv7N7N/b/4BUuXLGHV6tXDHuvJiOKZM2l434c4efAg+ukzKObIqVJH8fuT+EUBlZUopoOVlBKpaWjhMMH+fvpOnqRzx2sMvPIS8uRJnOFIbPLLqmnUfPazzP3sH+MszeqAeyfwb0B/Ji4gLQGwfVjzgVsmepCbm5v52c9+xu8e+R2DHk+M04+z5Llbxln9S3U5E6EQws7iDw0Emq09+bQjc/vt+3q7O3PcnkHBVOWZfH2By8WsWbWsXbuGlauWM71mOoqq0tXdw/FjJ9n/5kHOnjtHOByKqQcTjJbMPAZSmtoSu++EEOiajtQ1PJ5BBgYGUBSB212EI38X10kHoSjMvPJq+j7ycS7+4j5cXd0JYdwTC4Ov/SKNjz9KWcNcwsEgwb5eIh3tBE41Ejx9CrW7C0coZGxtrQ+rsorpn/gk8+/+LIXTcjLCXYdhtPd8pkK5vJ1bgHkTOcBdXV088MAD/M///A8D/QPYZH0xlVUqZFcDpgrVNTxY92YK9zWaDkF6zNzU2v7ImCFPPMqo0bmGObN5953v5vbb38GiRfNxOB1Eo2EiUQ23uxiHs4CTp07zP7/+H576w5N0dnbE4iNg/yMEMtXWSUJpaSnvfMdt1M+ayR+e/D2HDx9h+YqVrFu3npkzZ1JcXExhYeFbNo+hq6SERXf9EXowSOev/gtHR2dKgZkCqK0tXPz5z2l3uNCjEUQ4hDMSQdU0CqzVOi7wQVRXU/O5LzDvk5/CPX16rk0qxuDcXyDDapR2iTQ/1mLgUeC2iRrYwcFB7r//fv7lRz/i4sWLtj2q2QGR1QkrI0aHAIzcxz9VO9Kz/7GSCScUIVCEamyHpMThcLB+/Xq+/o2vc+21m2ltbeXZZ5/mwMED9Pb0EgiGmDVrFjfedBO33nYLLmcBj//+ce772c84ffq0SWREbPW3+hnjAkzOQ0Fww/XX87Of/RhdavzZn/05b+zZQ3lFVTzt2ezZLFmyhOXLljFnzhyqqqpwu91vOYIQ7O+n8Xe/pfXf7sdx/jxKpo8qMYDkkGsScC1dSt3nv8Ss97yHgvzDtJ3BWMDPGY8Z+pyUHIBtpVqNwUZMCMLhME888QQPPPAA7e2GyaMg7l+fHIAz1xU2UZI/8lU5V1fifIONQH5hnyUSTY8iNcO6b+PGDXzrH+5h3WWXsWXLFn784x+ze/cbBANBq0WA4PkXX+S1Hdv4yle+ysfu+hgOh4t//qd/pLW1NWYuGI93MNSwqMhdyO23v5PZDbN56Ne/Zv+BgwSDYYIdHVy82M7evXtRHQ6Ki0uoqalh7pwGFi9ezKJFi1iwYAFz585lxowZlJaWTnp7gsKKCua/5730HdyH/2IrrlAG9Wi6ia/riKIiKm6+hdlf+jLT1l82nGhBYHDuNwEPpiuQrdZbMFSA4w5d19m2bRs//elPOXv2rBnEMh5gI5U0fjgTzMKwbovNfJmRCGSbwGnzBdhMme11JD4nzn0oRrICJJI5DbP50z/9ImvWruaRR37HD+79ISdPnoqFAsPinKRkoG+A3z78CC0XWvnbv/1b3v/+99HWeoGf/OQn+Hy+mN7AkCnYGy0QUmfp4sXccON1dPf18twLL9DX359g5SilJBqO0B/uo7+vj1MnTvDKSy/jLiqiorKCurpZLFq0iKVLl7Bs2TKWL19OfX09brd7xI5TEwFfRzuhjjbUSDR7Yesd6zooCmplJcWr11D97juZ8c7bcY8sQrMCvAP4byClyWYmAlAG3DwxQwgnT57kX378L+w/cCA2+RPHLLfJnkoLkEg87EYxGQSARmVDn5nD95nXKp4yWEk6K0ERj3Ngtl5IKHA6uO22W7nuumvZuWMnP/6Xn3DyxKmEuIhImbBxiYQjvLZtOz/9yU+4997v8YEPfIBXtrzCrl27EuUB1l0mxStyFXD77e9kwcIFPPbE4+zYuQtNkxgxReJqBSFAyLgqMhqNMjA4wMDgAOfPN7N79xsUFDgpLy9nwYIFrF+/nvXr17NixQrq6+upqKigcAQZecYLIY+HM888RWT/IQo1PRN1RzqcCLcbtagIR309xRsvp+bGm6hau5aCLJGF88AmDEH+iVTf4RACYPvAV2Kk+R53dHZ2cv/997N161aiSRZm6Zxx8kWqJCCpkPGDsyJpkp2DGC5nMtQWIT3hs7ZHlVVV3HDjjUSiER597Pc0nj5nGgtJmxWAJTgEUEEq6LrGli2v8uhjj/GpT32Sa665mn1vvkkgYEikpYxzGOYP5syby63vuI3evl4effQxurq6iWVNkjY1p+WSbREsEVc7SiS6HiUQiBIIBGhvb2fPG29QXl5O3axZzJs3j6VLl7J8+XLmzZtHbW0tlZWVlJWVXXJaBk9HB32vvYZz0JNx8ot5C5j+gQ9RvmoV7pkzKJw5k8Lqahwu12g3aRawGSN46BBkGr2bmAD23+v18pvf/IaH//dhvGbc9MSxy0/fb/fkM89Yd2T13rPfn3YCy8Q787E7SB2AJDMxSVmvbSIhob6+gSVLl3KhpYU9e/cRCkXMgKXWvYppEWCYpipCNf4tJYODHh5//EnuePe72HztZn7z8G8533TBjBqUSIScDgfXX38dy5Yv59nnn+P1XbuRmkxJSxNcopPfhOWhaOtaOBKhq7ubru5uDh06xLPPPktZaSlV06ZRV1vH/AXzWbNmDatXr6ahoYGqqipKSkomXKgY6OpAdLajxpUwyQOBVlFF/Vf+jIUf+fBYTPhkCOBW4JfAEIFEOgIwIey/1+vlf/7nf/jpv/6Uzs5OhJUWNY3uHRL93pMDdmYdmRwna+y6bXYKISgoKEBKnXA4PGTSZpNHZLJEtAspc4kdYHHlupQIFGpmzKS8ooKjx4/Q3d1l2i8oxDYNUgHz3wiJIhSEUEEzHH/ON53n/PnzzFswn7q6WoMAmHbWAkxuQDKzZjq3vuMdhKNRnnnmWXp6erGyFSWbOScLDnOgvQnjHwqF6AqF6eru5dTJRl7bvoOSkseYMaOGOXPmsGTJEtatW8eKFSuYPXv2hGwZdE3De+Y09Pdn7ItrxSpqb7xxPCa/hSswtgEnky8kEADbx7aMcWb/g8Egjz32GD/80Q84e/Ys6GAXcKVaiUf6cvNiy5OeVeR2s3TpMgJBP6dPnzYyBg+5ZbhCyeyxCRLOJTxToaSkBJfLRW9fH9FoGIdDmOa7imn2awUwVRHCYMsVoaMqAl1XCYc1+gcGTa9Dh+0pMpZDQBWCq668kvWXrWPL1ld5ZcurhjemUGJ7faGkH4OcNCdpaKQEotEI/f39DPT3c/r0abZt20pZeRm1M+tYtGgRq1atYu3atSxevJjp06dTUlIy5n4KYZ+X3gNvIry+tOy/ROCqq8VtuhCPE+qAq4GTyd9POg7gSszIIuMBS+L/k5/+hNOnTyN1ic2CPc7i5jWZUu/xcxH4pUOiIFDEgolkvGcUTJHz6ardl9/pcFBQ4MTvEEQjhl+AsfLb3KWlAHQ0XUNRVBRFpaKyihkza/H5Avh88fBW1hvRJcyYXs373vceFFXw1FNP0dHRgbnRNyMNpYp1IBLamXx2yAhZbHRsHbCZIVunJUhdEgyGCAW76Ozo4siRIzz33HNUV1fT0NDA/PnzWbx4MatWrWLx4sXU1NRQXFw86ipHT2srg0eP4UwM0pHYJVXFPXcuauG4Ok0pGHKAX2IurRZSEQAnBrUYN5w7d477H7ifQ4cPxmz6ba4po4R0m7LckHxnIBjg+PFj6LqOpmk5qPpEjjUPo22Wr465y+/q6WHQ42PuvIVUTZtOT0+/4clnF1iaN+nGDIpZEgohmTd/DvPmzafx1Gn6BwbivkBma1Vg1eqVbLj8Mg4fPMjrO3cZq7+RgpS4qbL1vNRjb3EHGUloKq2I7YdIUVbXNXw+Lz6fl/Pnz7Nz5y6KioqYMWMm8+cvYPHiRSxdahCEhQsXUlVVNWLuQNd1OvfuRTaeNfb/KfsioaqSio0bJ0JWsQGYDnTYuYAYAbBR5FoMO+JxQW9vL7/8r1+awSYT2eh8Weh4x8ZwtSU+mYMTHCE3dRgyndOnT3P4yFHWrVvN6jVrOXvmHFrUiEWnCN0yXSDBsk+XSBmhuLiEa66+imK3m8OHD9HT04NDdRgxA0xup6qqkjvefQelZWW88OKLtLS2kjzBE12tDQ1Csh/FsLiiZFpiFxPZfJaQloWoJKpF8Xg8eD1+zp27wGuv7aC42E1t7QyWL1/O6jWrWbN6NStXrmTmzJm4hrE393Z00Pb88zgHB9OW0aXEtWQJVfnnARwNzAOWAx32k6k4gNWMU9ivQCDAY489xkMPPcTA4EBO+0I7S50qVl8m5xrj/lyekVgmZa49E+mCcY4VUj072SKyvaOd17a9xpVXbuK973kvB/cf5OSJE+iabuQKl8a9uo0IWPdvuuJy7nj3HXR1dfHiiy/i83pQFSeKUIjoEUCybPkybr7lZlrbLrJjx04i4YgZARlb2+yejunHK9c+J94X3zSkek8kCCDjZYWQoGuEgn6CQT89vT0cO3GCp599htoZM1i3bi1XX30Na9asYf78+dTU1OREDCTQsnMH/n17Kc3QP93hoOzKqyiqnpCI+sUYW/st9pOpCMA1GLHFxhSaprF161Z+/oufc/7Ceaw01ZbuOFOIq3zSeSV+IPG/6a32cu9DuvYkEyR72UzIReKfSghqTTTjkk4kHOTll17illtv4opNV/DZz36Gf/3JTzl//jxSlyiqApolWDEyKTtUhbXr1vD5z/0xs+rqeOTR37F3z160qA6qhjWRSoqLeMft72BmbS3/+7//y6nTjeZkT2WfQew+Y8wza0UypUizBz+JQ0moN/ldJ6ZoB4tDsosVdE3H5/PTeKaRpqazvPTSS8yaVc+K5cu54sorueyyy5g7dy7Tpk1Lmy3Z19NN0zPP4uzrTf9xSYlSVUX15s0Tqaq8GiNeoGULPoQAFDNOtv/Hjx/nvp/fx+HDh+O6Y8mQFT1xDLOr+tJtAewfStzZKtFTOxvS2QSkmvCZ2jiSACGpJ8LQ6ydPnuT+n9/PN//iG3zwgx+gpKiI//rPX3L06FF8fr8RshxwOZ1Mr57G5Zs28unPfJrLLtvAnr1v8Mtf/hd9fX1m7EGQmoYA1qxdwztvfyd9fX08++zzDA54YmNrjWk8IaolV0gc3+EYc6XUfqTgABPLxOMixIg1lnVe3F1XmA5P0WiUvt5e+nt7OXXsGC+98AL1s2ezbPlyNlx2GRs3bWLJkiVUVVUlTOKOEyfxHXiTCl1HV0x1q2lpaUGXEsfCxZQvXpL3Ox9FrMLg7hutsXMkDX4dsHCsW9HX18evf/1rtm7dGo8lZ5P0ZwvjnSoxhj3pxXgi+cPLZ0uQbx63VFsQe58VxZh8um6Y2r700svoMsrXvvYV7rzz3axdvYYtW15lx44dtLS1UlxczKZNl3P1lVeyfPkyCovdbN++nZ/d93MOHjiIIhQcDgdSB02XlJQU8Y533Mbs2fU899xzvPHGHnOSk+AynKLlJEzCLGM2XBhqS2MrMjQnhEwIeWam8wBpEARhBk+xtE6artHb20tvby+njh7j1eefZ87cOWy44gpuuPkW1q5dy4wZM3A4nVw8fAi1szNOnAHd8tA0n6epKhXr1uEePRPf4aAGWAI0WieSOYAlGJLCMYPxYb7EI488wuDA4DBrSd4CJP7OFOsvsXzuvgT2O/IRM+bzcWfKLRBfRVNwFBDz2o3dISAYDPDSiy/R39fDXXd9nFtuvpXPf+GLfPwTf4THO4jL6aSivAJdi9LY2MhTDz3No4/9ntONZ9A1HUVRzTDrhhPQ4kVLuOnGm/F4vDz55FN0dXXHt1W2/9r7Y3AHyVmIxLCIQDbOB+KRoVIlbEHa4xlYzk1WnMP4QMe4eMM4knA0Sm9fH96BPs6dPsHWF19g4bIVrF63joZZs/A+9xxzQkGkEEN0VwYDItHLyqm84oqJNl0uANYCT1snkluzljHc/0spOXDgAP/24L9xrulc/IJNnTOcxSD3kF35uAwPcTUc8k9plUsSRGV7RmLd8TVp2H2Lqb+IGfZYG91wOMKuXW9w6tRZ/vCH57j++utZvHgBDqcgHArR3t7OsaPH2Pfmfo4fP4nHEze/1jQNqRlJUwpdBVx/3XUsXryUV1/bxs6du9FMwmCXrcS5FHvjDFWjFErCC44Hc8ls3JXN/DuxvnTbRDNmtO15CYJj+xsw/yFMfwnLNz8qwBsM4Dt31lAvbn2VkuISqoIB3i01VjocFJlEwJ6IOiol0eXLKV+9JoeXOeZYizHvY0kFLTgZY/Vfc3MzDzzwADt27ECLanH9dZ4q+lSuwMNBJmn+kLJDGhE3iU3ntptDT0bchyHttoSpsWAhIKWgu7uXF154iZ07XqektAjQTQecIIFAII0lI6jmMX9+A+98120EwgGefPIp2tu7sPINxvudYTVPtzXIwk7lI/BNLpMsL0kOGJuLUDnBmUkIolIidImQGrrfT8Dnp0fAf6oKa1wurnY6WaQquIkpWfG7Cqi67nrKRubaO1pYhpHarwMSCcA0xjDuv9fr5X//93954sknCAQCiYObYgUdFwu6POofjq9BlhpT/Dt/eUCsD8k+ODbGIi6Y1vF6PXi8A8RW5mQ3X+LcjSoEqgCHqnLrbbexev1adr2+h9e2vYYWjRoCPkUmBGRNp/2Ia3bs7be8E1Jbzg1HMJjqerITUuJ4S4MrSFAv2wTF5uepWb4WcbpqaFTMqjrQeSkY5kBE5+qCAm51qcxEoukSbXY9s6+/ZNKo1WPYBHRIKXHYBnkuhuvgqEPTNF599VV+9dCv6OrqymgIkpyVZjyRjX23S52dTicOh4NIJEIkEsmLkCQ+M+FqUtlMHqWJq1Ra4anEtAK0Jp99yRWkWoKN5yooiorUosyom8lNN9+MpgtefvlV2traUrQxHqDUPlb29g61CBxdDiibbCHlyh4bCWssdGPym82zy1TMvCixaxq64bAmBBiJk7io6TwRDXNBc3KnE6oKXEy79R3ULls24r6OEsqAFcDrkMgBLASyxhoeDk6fPs0DDzzAyRMn4ytVCmsuyL6yjnThzZZaO1saMCstl9vtxu124/P5EjL0ZMJYGwil1TaQYIqTaBKcdhIacnKny8V1N17P0uXLeGP3bl568QVCwQAixlZYE06mmGDx/XXq56Te72dTcY7G+KYiUPF2J+vyLUqQ3BNpGj4b14TUY4lT9wSiNEUEK6ur+cK69RReOrkSBMY2AEgkAIsZg8w/Xq+Xhx9+2FD5hSNJk50hC1CyZdd4cwHxdsQ/CCEEqqLGJo6qGHvfSDhi5s3LLgdI5xE39Fxufc7LK1JaOeyTuA8lqV0JlyW61GiYN5+PfOzDOBwKzz79BxpPnQRTZQYGWyyRRrAQk9Qkr8K6aSNgeSLG258pjUt2e4pcxyenMbT+O4QoSFKUIpEMAOhGhiWDGUDTFdojEB3o5/TZM4SCwUspYcoiwAWErQmvYhCAUYWUkt27d/P7x3+Px+MhFhUmZvQXz1dnmJIqCXvDZGT9zmX8SNeefAmKEILCAhcVFaWUlhbjdBi54MOhIF6vl1AolFGIJGXuk9+8Y0if8mlrhtFJsMyLN474kfRgqWs0zJ3DkqVLKK8oZ3bDbCrKS1GFZbIZb6/1PlO3JfX7TN/BkU3+4UII+2Akyg2MM7p5yPj3i/VNy1hiVet/uhT0Dwzw5BOPs2vXrlgi10sAczG2Aqj33HMPQDnwFUZZBtDa2sqPfvQjtr22jaglZY59C3HnEIFImPhCpFsdUz3Ffp/IUta6lv2DsifVLCh0UVVVgdPpIBwOE9WiRDUdzXSQSReoJHP9VttTX7MfEJ8nmbII5x+FKM3zzR2xBCKRCDNmzmTBggWsXLmKmuk19Pf1093dbcg+sNZ9xQwsMnTyx60B46rTXCf1eEz+WFpZuwejLYxZqvJGsIOhQ2jUYS5kwjAo6uzspLW1jYaGBurr64ekdJ8gPAp0WQRgNvCnmFRhNBAMBnn44Yf5r//+Jf39gwlE3cpeg+U/bhv8bI48SWdiv+wCuszGP/l9VJawSNM0olGNSCSKpmkG65t2dc8u6Bruhz3SCZEsKMuYllwIBgYG2bd3HxcuNLNw/iJuvukWNm3aRHFJGRfbLjLQ328yA9Y9iVuTRJv85HeSvyHWWMBagJS8iNJQM2N7Py2ZiJSgaTrNzc2cO3eOGTNm0NDQMNEGQU6MjEGnLQKwGvhj88KoYPfu3dx77/c5dfoUupa4i0qbNsmG1M5AyaXSr3wJaqYc2OhsK2s4FDJW/2jUtKMXw1r58yln9/JL9l8YrYmRtt8iTiS8Xi9HDh/l8MEjFLoLWbN2DTfddBOLFi1goL+Hro4OIywa8fwBRvh2ESOg+dhcDKcP9iPv+zEmf+73xvtlH8OhEass8atCNKrR0tJCY2MjtbW1zJs3byKdghzAbuANiwBcA3yIvMxx0qOjo4Of/exfeeHFFwiHEsORJ7+k9PbtQ5GJAxhaNj87gowrobXTM11oY/vCrERKZF9ls/Q3U5+H/cFnuS/2bccIj0FE29raeP31XZw9d5YZM2q46spNXH31FVRWltPT3UNvbx+arsfarAj7ZmJsMNyxHTIeiFg/s2eYtq/0qZ+pWNaEQomV1zSN9o52WppbmDdvHg0NDRO5HTgOvGARgHcySglAI5EIjz76KP/2b7+gr683roMSmT+80SIAw50UyW1IJiA2hVfs0ckytdRtNAqlI3zDaGXOfcinn6n6ELMWUOLnvD4vx48fZ/fuNwgEg6xavZLrb7ieDRs2EolGab5wAX8gmGCYZJf+j6zv6fuTrBXJd5sX9wbIxQ7FvtUc+l4VxZAPxMmfKTIUAqnrtLe309XVxbJly6itrR3VscgDF4DfWwTgI4ySG/CRI0e4997vc/jI4ZjLqTWMSrKWMcEWfKgENrsgMMsqNgxkCv5hf6Z98icL7FIh/i3FBZ0jR+LeMx9uKnMfE2S1NoMYw6FG1yVd3T3s27uPo0eP4i4qYv36jVx//fXU19fj9/vo7u4mFA7H3rFk/Kw78xpBa/LH9lvk0Mb4FjYpDoqNkAgEirGVEjK+AKISjUZoaWkhEAiwZs0aKsY3QKiFHuAR9Z577nECn8FmHDBc+P1+/uM//p1HH3uUYCCUaEllsjrGjsj6wBQUxYHqcIJUjPh0dnPUrCblGT7gEUywVCtIRin8MJ8xOhiecC25DVm3BcRlEBZTFwqHOHPmHDt37ebcuSbmL1jAzbfcyLXXbmZ6dTXNzecZGOi3WQCmUwfmvvfOqFLMrdO22szpau93JiF0ihYImyebSLrZ4nxE7ItXYoQ0EgnTfKEZl8vFunXr0gYbGUP4gN+q99xzTxnweaBhpDW++eab/OQnP+FCcxPCLnwzI9FiCltUVUVVHVRUTeOyDRu54fobjGCWXR05hfRKfCXW+dxUgMPFkAliaR1SfhbZOYKxJACprBtTTfB89s8JcyRpDvq8Po4cOcrevXsJh8OsWrWa666/jpUrVxCNRmi/eNHw/4jdk0ygxkHSb9urx/b8KcdHpBVZ2Cd9nENK4hgTeiNigxWfC+Z1KQkEgrS2tcXyGoyzPCACPKrec889NcAXMZyBhg2Px8MDD9zPM88+QzQaRVVUm0OaEluVHKqDivJyauvq2Ljpcj52113cccft9PR0cvDgfqLRzAkV0xGAxD3g6I1SrmG5Mrcze50jaGHG9mV7Xu7bhfT3G9yapKOjkz179nLq1CnKy8u55ppruGbzZhoaGujv76Ojo33YxjAj5eiSucVk9eSQMbP9z1q9hcnWJ2gdjDM27ZZN+5TifcS4AlPgONA/QP9AP+vXr6dm/L0Fn1HvueeeBuBuRmADIKXk1Vdf5ac//QkXL16MD4BMWpkxzGhnzapjxaoVhnrp2FG2bn2V3a/vpKenN03wx1QvNfP1eJnRQTbhZXImnPjY5FffMFqWZ/yBkZdLvMf+WyEYDHH69Gl2796Nz+tl8eJFXHfddWy8fANCwMWL7YZVqNn2XFf/kQ7XENmOJMPktx0iTuRif21CQDPRMgnrv8jcr7ghkUDXNbo6OygsLGTjxo3juRUQwEvqPffcsxj4BDBsQ+X29nbu/cG9bN/+GtGozTberrc2Rh9d1ygqclNcXMzhQ4c5dPAgp06epK+vj0TeK1HXmumlWr9TSdrtBkYjX0XSPyt+Ld96h98ma5xGr+3D1Z4k1iGlpL+/j71797L/wEEKCgpYvXo1N918IwsWLqC3t5fOzk6ikcg4MP+Z+xiT2tvGJvm6QEcFFCHNw4iRoNgOISx5qV3wbUvFantOzGvSvBgKh7h48WIsgck4bQUksFW95557VgAfw3AOyBuapvHMM8/wwL/dT3//gG3krGeAsElYJYZRTW9PD/39fUaoahQs88mYoGmYxjt2GBaHyfcMfekjfU52g6VMdQ9n1BNqGHbbs3tG5t8Hu5WhpmmcP9/Mjh07aLpwntkNDVxxxZVce+1mCpwO2lqb8ft8aLZ4AnF1cfzdjUS1G682rr4VCSx7molvHUKgIlEVw67BIACGWE9JWOxFbH8f0xCJeGwLh8NBogdlotZhcHCArq4u1qxZM16qQYFpCHQ58H4Mh6C8cf78eX7wwx/w5ptvJk4Ea1BSsFeaphlONLG0WvF9URyjYcCTeuW3YtiPF2s8kjIjRaatUi6ygnR2Dbn0y1R44vP5OHr0GK/vfgOv18uqVSu49ZZbWL58GZqm0dXVRTAYNCeYYvoLKKYazZKiK2nakUozINIcDCmnxBYdYt9gbG8vzEMBRQpjtbfZdCgx/weR0F9hfXSKkkAQrUVHUYwArkIxkrSC4ULc0d6OFo2yceNGSkpKxvjLQACHHBjCv2FN/nA4zIsvvciuXTvRorrx0kwXU2n5hqXQo0vM6Owm3yRiQSsyr/ypzEnThdge6pBiSyJhvye2D4zVPOS5mWLSpY/4m338Ri+0WdYn5VBH6v3wSGCxugLQojrHjhzjh+fPs+eN3XzlT7/MdTfeyOp163nmqWd4+ulnaGlpM6MLGRyArutEo9HYhJOQkKEobpNvWmnqmuGcpdsZ8cTJaazKOrqmo2tRdF1D06JENI1INIKVNEUhvlpLPYoa1XCYEcWlSZSsYCBSNerUohoI0IVCFIFm2j7opmelLjXiW1ujXaoQSEVB1yEYCPLMs89w40038YEPfGA8tgJVDqCKYRKAM2fO8Oijj9DT2xNj4WMfW5LxR8YPxQzRnFs67XyRNPlNVFRUsnLlSgYGBzh27LgZEy/3j38iYxWMJ4bTxRhhs7PEZkUej5fnnn2Bs2fP8dGPfYQ773wP733f+7jxplvo7+9H12WMXTYcsAytkDUZ9BQemFIazlrWkS1hq6bpRKMRgsEgoVCIUChEMBgkGAyavh5G8hBdSqKRCM3nz9O4Ywe1nR0sUBTcZnYlAUhFEFEE/YrgaGUl7vo5lE+rxuFyGSHaJYTDIULBELquo5pWguFwhFA4ZOZUBE2LEgyF0DSN1tYWwuHweAgEpzkYpvQ/HA7z6qtbOHBgP1LXUVWHSYVTr8iJH8jQMuliyGW6JxvszijJWLp0KX/xl3/B3r17aWpqYmDAk0e9l5Y12/gjm9bB/GsWNXmLBLXYiROn+P73fshr23byjW98nVtuuXVCPOSs92gRlYT4gebvlvPnefb//CXTdrzGDGnEAYxbghqcSX9xEVd+/OOs+cCHmTatGofDEfN61TTNcJ02wjbHCFYkEok9V9d1gkEjxsS0adPGaywqHAzTA/D8+fM899xz9Pf1m6u3hq6njoiTLctPKlvubPfmimT7AMuFt7m5mV/9139zobk5bqQyhnM6FccwHjKAXNs2FnXFFEHGv2y/DMIcDIQMbUA0e3blse57Js88JeBnWncn5ea/Y/yFYRlteIuWlbL0iqtYsWLlhPVlGChwMAz2PxwO89JLL/HGnt1EI5ZhR6KPea6x3PM9n1coLCxCM5R7aGtt5dHHHjX9+iXZoqGl0ibEn5HunsyEbKKRSkCYbWuTykQ7kzHU0K2dsTcoLi7lyis38bnP/TE33HDDRLrGZoQuJR1790JrK85U7t/SiGks5sxj5uIlk2nyA6jDIgAXLlzg6Weeoqenl7j2k5gKhxwmxHjAnjQy/mhpSpWJ7b/SIZ0/QuIzMj8/81ZoormA0bZITG/iqyCQwvhVWTWNj3zkQ3z5y19i6dKll+zkB/D39dG9/TXcPl/aJSKsqpStXkPVjJkT3dx8oThInSE4LaLRKNu2bePAwQOm77dp8WdJXGNRUoy/6ay9cl0dM+fay29VtSK0SDNDbKKLr8y7vlyfOVmQ3gpTJp3LsC2LWcrFx9tO5Opm1fHZz36Gz372s8yePXuiu5wVHcePET5wgBJTMJiq38HSUuauvaQi/+aK/AlAa2srz7/wPN3d3UhdR0rLYlqJ7YmsAJSJRGDowA1Xkj6c+xKSPSRcyPas0WlbuvMTzwVY7UhuW6r3IzNwPNYCIGI59cw7kNLQe8+bO48v/8mf8MlPfoLq6jFNQTkqCEcinN+5E9HZkZZN1iWIWfXMWL58srH/YBKAnJWN0WiU7du3s2fvG0Qi0SQhz1Ak6tZTE4HhYPj3ZWrf8GDfJuSi+UjXrsn37SSPg2XDoYM0DWUUNSblXrhgIX/2ta9x1113TZT/e97obWuje/t2ysLhtN95WEDBipVU1tdPdHOHAyWv1b+rq4sXX3qB9vZ2pI0lkrH4Uea/85hP2YSFo6lvt8fYy1Zlfua86Y2Q7O7Nk2g3kEZrkU1AGOcQLBWYIhSWLFvC1772NT7ykY9QWjomuWdGHbqUnN+3D/3EMZyp1y+klAQKCpm5eg2FxcUT3eRhwYFNq5EJUkoOHz7Mnj17iITCaeU9Y5W5JVsdw53Qo0tghrokJzrKpG7zpbj65239KEARcWMdy8x7zrx5fO1rX+OjH/3oeJi3jhqCfj/tO3fgHhgw4vulgC4lNMxh1oYNhoHP5IOuYAQGyAqv18trr22jpaXZZOtyY33HA7nOX7sMQGQhWOOxWo/UQ3F025LNMSh1Q+0rvRUNGAwiUFpWysc+9jHe//73T6rJD9B3/jz63j24M8QviCoq0665hhlLlkx0c4cLzUGOBOD8+fPs3LkTv8+PXXuWnIo5HUayyo7ETj2dvj67q/GwmzuJkMjbppr02cyz43YfRn26roOEggIXN9xwIx//+Mepqqqa6I7mBU3X6djzBq6mczjSfAhSSmR5OXXXXY97krL/5EoAIpEIu3fv5sSJE+i65VQR3++lk26D3dgkd8l4vI7klNyZ4wRm1skPrXv0MLrS/URCNUotzCi9t8OSvVjPz5B5OBYAQzHvMtTCqipYtmwZn/v851m8eNQzzo05vD09dL+2Daffn1b4p+kSR8McqleumOjmjgTRnLYAXV1dvPLKy/T09CClRe3T+2hLOfR3OpYym693/OMbGnEnvg1JbWuQWCYzxmIbk/256VxW86lj1FttPldmmPjEyujm+EqzraqiUlc3i09/+m42b958qaTByr33UtJ58ACR/fvTqv4koAkoWbWKksln/GNHwAEEspU6duwY+/btIxyJxAx9ksN92Qcw5aCNcHsw1gKz4XEE+W8jEh+T2zPz4SZGh2DkWonl5mokyRZAYXERt7/rdj7wwQ9SPMlY43AwSPuxo5z73e9QOztsATySei0l4YJCileuxDn+0XxHEwEH0I+hCUhJqv1+Pzt37aS1rdWIhKsoCd9Hrvb4uSKdhWAmOYA9L+BoqgxHOoHjdeTmaXQpqwvTj23cllJVHSxevIS77vo4dXV1E93kvNBz7hwnn3yc7pdeQhw/TlEkPWMclZJoeRklc+eNe0izUUa/A+gGNNIQgObmZnbu2EEw6MfhMCKzRKNxyWiuQkCrTH7n7f9Ko4wdBsZ0oiVFQoonPhkfpFM1jimkBEVQVlbKHe++g3Xr1k24ZigfDDQ3c/De7+N55incfj8OLFfmFIsNxp5ZVFZSPGPco/iONrodQK/ZpyFuwbquc+jQIY4dP4auG7HQpNTTrsLjgVwk0/m2JbWHW053ZhI/5D3vh3Id+foopw7plSnF1bAamqomCcuWLeVd73rXpFL5SV2ndcsr+F9+kRKfL54hOMs3phQWIlzDCqN5KaFHAQaAUKqrg4OD7Ny5k56ebiNCii0cUy4YugrIpCPd+XSOOZnlCLEQVFn064k2DJnLxDUdyd+ETXhpL5yr1DFD23I5n+sjsglJRwqr1rLyMt55++0sWzbiBFPjCi0cxtt4CofPm1uAWMAlBNH+fgZbWya6+SPqOjYCkFIQ2NjYyK7XdxEMhpFStWkAcsNocwVWMI/RrzN7GTvi0YszeBCOoTAuVXutsUnl1JO7p2M2iX2yJgeEInA4VFavXs073/lOioqKRqPj4wahKBQWFhoGTbEhyzBWwojjV9DRQfurWwl5vRPdheEiRgD6gSG9iEajvPnmm5w9e8b0m88WsHNiLdvsz7av7qPdnrTho5OOlPeSfR3OLCcxQ1sKkfDv9CrQdOa8CaVS9ytllam3fu6iIm6+5RaWLl06WsM8blBdLipXrMRRWYXM9rEIYYW6pSAcxvvaNvqbzk10F4aLENBlcQDdyVf7+/vZu3cvnkEPqqoaYYyzsNXmKCVYiI0Gsq3ScQ3BpSNBz5UoDO1rejVqOr188rlM+vu0r8Rua5FPRyU0NMzhmmuuwT35/OEBqLpsA8WrViMLXNn3jiYEIH1eIp7cY0leYvAC7QpGltCO5KsnTpxg7769Ropn7L79uWM47PoobKNzQkJ+NyFGn3OxAmOYwTEURaCqihUJfcJgja0QoCqCqspy5s+bTVlZMfH1zexADnU5HA7Wr18/6fb+dhRWT6dq/XrUklLIZeGSEl1A0ZIllDWMOKfuRKEf6LYsAVvtV0KhEDt37qTp3FmwhVyOrw9j/wnno6qz5+VLnQgkFWEfKnDMZcsQt0ocuq+2RkZRBKoijPRviuEXP21aFctXLGP27FkUFDiHeAkmH8Mbs3xuFLjdbm648Qa++KUvsHzFslhAJ5lHfaVlZWzatIlp00aUW3ZiICWBzk7aX3mJ0NkzRjjydByYEEghjJj/JaU4r7iSuXd/hpLxyeIzFugEPFY8gDb7le7ubl5//XU8Hm9Mj50w+UViHH/7ZB3pSprbxB+e+iqXOAD2crmqFEWKf8ds6NERqFRWVbHpik30dHexY+dOurt6YyHUs7UtF9Vn/uMs0JEEAn6kkCgOJUHrGI+glOiLYV2zMGfOHNatWzchIb1HCj0Soe3lF2n9z3+HpvNIv98Y5xQ6YekqQKmZSfnqNVRcdy3TN2+mbM4cFOXSjWeYBR2Az3prF7FZ2pw8eZITJ46h6xrxGJ/SjPeVWTI9npFvRmL5l0tbcnEVToiBav7QdSMSsXVelzrt7R3sf3M/mh4lGAjG77W1I04E4uOcz+TOdyzC4TBv7NlDc+t5Ll7sMJ6dzfTAds3hcLB06VLmzJkzrHcw0RCqiqu0FBnwo3s8mHHtU5ZVyquoese7mP/ZT1MyZw7iEg5kmiNaML0BAS4AQcAdDofZs2cPbW1tqIqRp03T9MRxkfasp4AtCGQ25GrTny78tN0xKLWjUT5BR0ZrLEXCH8MxRsbSS0skg4ODHNh/EISw2VLkNrlTCfnS5UTMlQhIKZG6zkD/IAMDg2ianjR0sTdMMlWw/lVYWMjy5cuprKwcrYEcVwhVpWrtOrpWrWKwuQXpD6ZlxUQkDOGwoS6c/JMfjDkfU/w2Y1gEMjg4yOHDh/D7/aZFq8yRHc9/D5r4e+gxPC2CGE27nKzI6IJMXK4uhOFnHo1q6LpMaWSUiosaDbuHZM9Lu9+EpmloUQ2py5zkEMLMkisQlJeVs2jRIgoKCsZugMcYBVVVFDfMNSd1+o9FH+ij68VnaXr6KSKTV/dvIQycgTgB6MKUA7S0tHK68RSWx5+eEDt/qOArW5LOkSDVypeuXHI7xhPpfOXtSSDtfvbxkNlyyGTPSeaQxxinmvyKothy1ae8y/ZXJPyyhJyKUKiqqqK+vn7SufzaITWdqMeLNLVdKQYQaVA9ZMBLaKAP3cxXOIkxAJyHeEhwD9Ck6/rGI0cOG2G/pETqua2e9smX68eZTyqwXJFd/pCvbf3w25A4+a3zqT0aR5NoZc5YHH9PRjIOu6wh0Wx4qBW3Uc5Y/Y2/NTU1VFdXj+l4jjXCfX34z54FMz1ZAkF2OFErK3HNnkPJsqUUrVxB9fU34JokgU0zoANohzgB0IDTPp+Pvfv20tvbh6bJjHMlfZx7mXPZTPeMBUb7OdmI3Vg5TWXjttIlVrXDnmE3UZZiW/WFbfUXCqoqcDocoEskCvX1syZNiO908F24QOD8BdD1IZ+7pghEWQWVm6+j7j134m6YjbO0bGINOUYH5zG4AIMAmCv3qba2NnngwH4RttghYYV5yPzh5iN8slvtZV6NR89TbSyRjuAltNw+YdMJmUYxlkE25JqkJBZnAXC5XJSWFFHgchAIBAGFurq6SWf7b4ceidB/7DiR7m4Uhi54Ihwh2NpC1+u70BWBa9YsypYuoXTuXFxlZSgFBZPK7dmG0xhyAIMAhMNhCgoKGk+dOuU9e+Zsqa7ZBEE2ib8d8Q8oLrCTMrWn4FCWdwy7ljZwoPXw4VSZO7eTugL7o9NM/mF1NnEFz9T+VO2NB/NM7pOZ6cHcIQhV4HQ5KCktQVUEgWAIRVWprKrE6RxWculLAhGvl8EjhxE+D6n0nwqSgqCf0L43uHjyOJSW4aito3jRYkoWLaJ08SLKFy2icEYNjskVGeiE9cMhhODYsWNUVlae37t3b3tfX39pckCLRAUQSQOVXkuQ2qgn1099WDM1/jdd9NCUkyDzs4Yb0SjVr1SqTXt/RzugRza5TKr+yxhhERiZlQW6LgkGg0Ye+3CYkpICSktKL+nEntnga2vDf/woIhJJqfawzqjRCPT3wkAfWlszAwf3M1BUjDJtOgULF1O+4TIq16yhZN5cCqsqcboLL2VVoQc4Yv3DAfDrX/+apUuX9j733HNng8HgIiFUkLoZ680cDCFsQiIY6s8/FOncVscMWf16x/DZDFcDIhP+DK1z+G1Jpxmx52VMxRUkljU0QeFwmL7+qGEHL3UURaHQXThpNQB6NErXm28SvnDBCP6Zm7QboWkILQChAPR1Ezh7Gv/2LXROq6Fg7jzcK1dRtnoVlSuWUVJXi7OoyAijd+mgFTgLxrt2APzzP/8zUkr/unXr3hRC3GZQfSWBpU+0flMSDHJyn1mpDHbGXjJvPS7Bas/eqlHYf0+2vWDG/iYZa+lSEo1G0bS445SqOigoKJx0/bYQ6O6ma8sr4PHkbiOeAooeBe8geAcJnj+Df9dr9EyrpnXefIpXrqJs1SpKFy2kpK4Wd1UV6sRHETqBzfs3JgTctGkTtbW1+86cORMdHPQ4jEwv9nGxTFokSIuiJRvz5BJ4Iq5jjk99mf0Os/Bwp6nlmWcZN432h5ucaSi1GjC3Oob37JFZBibfZ4eURtRYIaXp2QiqqlIweYVg9J04jv/gfhy6NvLKwPAiBNRICNneRqS9jd69b9BTXo6onYW6Yjlz7ryTuZs3TzQR2I8tFYAD4Pbbb+eqq65CVdVjBw8e7B4cHJwp06QMNIRDOoowVEIuVwEul4sCV4HBDppbB8PcNR6mS9Ml0ahONBo10oqbrqeapqNpUXRNRyeVf52pP7cRonx4hmSTlhjPMgrmtAnjImXSBJYJQrZUyU4zWVlmC76SK/LtTzoVo7SkglIipSEhnqz7/2goRM8bb0B3t61zw4ElJU39HSl6FPp6kH29DLZeoH3WLGZv2jSRBCAMHLCfcAA888wzfPOb32TmzJmtjz322JmmpqaZEokiwOl04na7KS8vo6qqiuppVZRXlFJaVkZVZSUV5ZWUlpVTWlKK212Ey+FElxqaFkWLRtH0KFLqRDWNUDhCIBgkGAjE/waCRAIh/P4APr9x3usP4PMF8Pn8BAM+wqEwoXCIcDhMNBqNJ58Ucf91PZ22ApvUQkrkENlF3ELPeqGZgoRml7gP/RDSZdkdqq/P/43GCUy6m4eGS8+JKNi0PAljZvl8yMm37bHg7+hgYP+biHCIEW0/BSAU1JIylKISorpGNOiHgB8RjYIGQlGQikApcFEyfdpEr/5d2DQAEDcEoqysjOXLlw/ecccdu6fXTL96zuxZLF+2hIY5c5k/fx5z5jZQWTUdt7sYxaEgFIGqOuKmpcI8TPdIS8Bk2L0bE09YiSMxvi9N09A1HWkeuq6h6xqarhEKhfB5vXg9XjyeQfp6e+nq7qa7u4fenl76+vrweQeM614PPp+fQCBAKBQmEo0S1XTsKi2DcxCowmFqNnSQBhGJkQFJXP1lf8nS7h6bTsEgbERE2BmWxM1OzGkqm49FduR2v50EWvcNXeVTZ/yN6y9jqkRdIpVM6cIuffQ3niLQeAqHlIgRdkFXHVA5naqrrqZw6WLC0TDh7m78587iazxNuKOTgATHvIXUrF030QTgKIbfT+x9xghAeXk59z/wAMXFxdvf9/73f2XRwrnORfPn43A6CUXCeH0eevsGaG65SE9PD339fQz0D9Df34/H4yHg9xOJ6sY0E/Z9vkAoCooicDgUHA4nBQUFuIuKcBcVUeAqwOlUcTmdFBW7KSstobKinPLyMiqryqirq8HpdKCqDhRFQUqIRqIEgiGCgSCBQACP18PgwCC9fb309PTQ1dnNxfZO2i920Nvbh2dwEL/fRzgUQmpRtEiYcFRHsyY2CnGbd8srLlE6bzcjTrQoTqQWCauitEhBnPAl1D2OyCemgEyyCBJJFFHqEinjKcAnE6LBIN179yI6Oo3JPwpUOODz4tU1Zm7cQPmSxQjVQdjnpf/sWS5sfY32k6eYfe1mpi2e8CzCO0kKABwjAHv27OHzn/scwAGPZ7D19dd3zf3vh35Da9tFLlw4T3vHRfp6+/D5/IRDQcLhCOFwxJQO6+aKIJCWf5FlRWiGwDJsyE0hoRAoqhEpR1GVmIeZqqqoDgfuwgJKSkooKyuluLiYkuISc8sxjapp06isqKK8opKyigoqqyqZUVvPvIVuHA4Vh2poKCKRKMFACK/HS29vH91d3XR3d9HX1UlbWzMtLa20XWynr28Qvz9IKBwhEgmh6UYbBYpl4oROolOEsLHFiTJSI0VWzJDG6rx1n5ToY7Typ9uyZK4nvRwkI0xiEtUmn1OMt6OdvgNvIiKRtNF/coIZ203oUVz93fS//CLH+weYcevNVF+2jpJZs5h52WVMW76cQH8/7opKXBObKs2PQQASECMAd911Fx/60IdwOBytTz/zzKFf/OIXc3e//gaRiCGkM9wF4n0fOnYixvwmxA80C8YXC2M7IKPxujKrwgVCGCu0qqioDicup4uCwkIKiwopKSkxuYUKqqoqqKioYNq0cmpra6irm8WMmloWLprL6jUrcTqcOBQH0WiE3r5eOjs7aG/voL29k87OLlqaL9DS0kJXZyf9fX34vD5CoSDhSBjNJmOwBJhG6+L+/wBCiZvPIkWC/CGhh2PMBCQHLUlfbnhenLquEwqFx0SjMpboO9NI+NQpXKPCvRgTQdGiFPR0EtryAucOH6BtwUKKlyyhbPlyajZeRvmCBSgTHzHpPMYWIAEJrTLNOsM33HDjjtd3vX5nKBRBCAdCqKZNgG3VG2IPZK16Q1cF69M3tsiJZq/SiDBG4k458U4pNaNmTSOqhQmF/Hi8ViPiE8uQRwgcTpXCwkKKi4upnj6dutp6amtnMWPmTKZVVVM1rYpp0yqonl7F2svWUlJSgkNVCQdDDA566OrsorW1jY72drq6Ouno7KCt7SItrW10dnbh9XqJhEPoUktg6WWMwRHopoO/3edBktDcSwrJQslskzoa1fD5fOi6PmmMgbRIhMFjR1C6u7NmQMg6XsJa8OJQoxGUiy1oHRfp3fsG7ZVVdF97Hcu/9EUqly4Zvp53dPAmZvBf+7tNIAD33Xcfzz//PJWVlbsOHNjvCYX6SjFj2hmsvekymXbJlvGPPMGpJLGMgQQD+RxsAmT6OmLP0dE0Q7UYCkYY6PfQ1trBoYPHEELF4XDicDhwuFRKy4qZNq2S2toZ1M+qp76+ntqZM6mtrWd69XRWr1tPobsQh6oiZZSAP0BHexctrW00NzfT1HSWlpYLtLe109XdzcBAP4GAH02TRnQdE4ppDyAtDsL21djjKo4l0ln7ZXJLTmshaGpkw+EI/X19RKPRSRMPMNDbg+fNN1GDodQFctUvC4GuqqBLok4HCFB1HTWqGYRF11ACPpRwkODhw/ibm6lYsniiOaXXsLPxJhLe3Je//GX+5m/+hsLCwiNut/t4X1/f5VJq5n7Y9uXKzGM1VM6VyOfH7VbiK7hM3lbEOAwlueYUf1O2IP5b6kipEQlHiEQEIgjewT7ami9w+AA4VAcOp5NCdyGlpeVUT69hZm0tM2fMpKZmOrUza5g1axYzZ9SyceNGrr/+eoSQhCNBBvs9tLW1cebsGU6eOEFT0zmam1vo6urG5/EaaktNI6pFhoyLTLvpGTmTMNou2MmcQSgcoqOzk1AoROEkcYTpP9NI4OhRFKmnHuAch0SaXGzUXYRYsgz3jBloXi+R1lZkdxeKz4eiR5AOF8X19ZTUz5poc+CLwI5UF4aQ7k984hMsWbKkb8WKFS93dHRcrmkaOgYLbjfFSx6rGHuf6aOzl7WfiRnJGOdi22VhGB3F7pLx6MR2h9vc3pu0tV8k1KJpGtGoRjAQoL+3j5bmC6iqA1VRcLqcuFwFlJaWUlNTQ0NDAwsWLmDe3LnU1NRQNa2KlWtXsfn6awmGQvi9Xnq6u7jQ1EzT2Qu0tDRzsa2FpvPnaG5upn9gkEAojK7Ht0qJMpXRMY0e1uRP4eYxVN5jbBUikSgtLS14PB7Ky8tH3N6xhtR1BhpPIbu6UDINrxgi3Ynrhm3aEaHp4HJSe/31zLnz3ei6jqepib5Dh/EcPUqwqQnF6WLGbbdQMm/eRHd/L4YL8BAuZAgB6OzsZO3atVRXV7/Y1NT0VZ/PV2xItzNTMGN1k2nYy9Qi6tQCpCSpoLDVEbskc54iqXTd9tUsOdAoGB+LJiPoQhCNRvB5vfT2dHO+6Rx797xBYaGb0tIyCt1uKqoq+NjHP8YnP/kpQqEQrRfbcaoqK9esZdOVm1EVgaaF6OrqpLGxkdNnznL27DlOnzpJy4UL9PX1EggEiIQjRC3ryVRjka5/WUvkgZQVxY2j7IhEIrS1tdHf3099ff1otWDMIKVE83ghEjb276ncuw0nB6QiEFEtPvETkjgYfxSpo3o99O9+nbIlS5h++Ubq5s2ndvNmQj09DJw4ScQzyIyrr0ad+IxJL5AmAfAQArB582a+9rWv4Xa7Dx45cuSYz+fbmCjGy+1zy+SDnvxiskfWid+bLvpwLvvaXNtqb4+u67bovkZjAoGAGdpbcKH5PEIRVFVW0dHeyTPPPEs4FKa6ejoza+uYv2AeSxcvZO7c2azbuJ5rrr8WXZf09/XR3tZG84ULNJ07x9EjR2lsbKS9o4v+gUFCoRB6kp16KleqsZMgmOrM2JjYny2RuqS7u4uurq4xa8FoQlFVypcvp23uHLQz51B1PcEISEoJJSUUbdiIWlqM7+xZwq2t4PUaHoCxMYi7nDsiEUK7d3Hy3FkuLF9B5WWXUbl8BSVzG6hYvRKHq4CCqqqJ7no7sDXdxZQzz+v1UlJSwrp1675z6NCh/6Np1hZAQBofgcTVNGlgk8rZr6We/NI26ZNVWiIvApAJyW2ORcCx2e0bFyw7h+ShE0h0HE4HM2bWEgqG6O3pM5gVRQUBLpeT0tJi6upmMm/+PBYuXMDCxYuYM3cetTNmUl5eToHTRTAQoKe7m+bmFk6fbuTkiROcOnmCltZm+vv68QX8RCLaGE74ZCg28+I4BxBbBiTU1tby/e/fy0c/+tFJoQkIeQY599zTdD75JOEjR5G9vRAOGzrqAhdlN9/Cgi/+Ce6ZM/C0ttB/8iSeY0fxHT1K+Px5ZH8/ajhsfDOWFkAaXjOaoiDdRahV03DMacC9ZjVzb7+DGevWT3RsgKeBDwLBVHMtpfj2yJEjbNiwgZkzZ75w6tSpP/H5fCXxV5+ZC8gkfBqagTZ55cX8d7xM6og16ZGLxVuiM07idsD+HDuBsm8S4ltl40w0EqW1udkcHQWJRDeNZALRMAG/h86Odg4dOIjD6aC4pITKadOoq6tj9uwG6mfVM2/uHBYuXMDy5cu56qqriYSCdHa2c/FiK+fOnuXY8WMcP3ma5tY2ent68Xg9RMK5GeLYt/aZ3p6d2NrzPSRYQBLXXng8Xs6ePUsoFJoUiUELSstYdOf7mXnZJvqOHGHg6BECF86jRcMUNTQw+113UrV6DYrDQXHDHGo2biIaCOBrv0j/saP07NvLwO7dRM6cQfF6UXQ95gXo0HXweZE+L6HWZvqaz1G6aBE1a9ZONAF4DiPnR0qkJABXXHEFn/zkJykqKtpXWFh4wOfzXWNcyZ39H4l6K1NAHzsSCMUotivV5DcqsD8rtTRUH8Ih2cSW0lCfhXv76Ovt49zps6iqA4fDQUGBi8qqCuYvWMjq1WtYsWIZ8+fNYf7CRazfcBkfFILe/gGaW5o5e+YMx44e5eSJU1xoOk9HRxeDPm+C+jGpyQlWFqlCutjzAVi2C/Hxjqsy44RBEAwGOXbsGH19fZOCAACoBQVUzJ9P+dy5aLfeSjQQQJc6zkI3Drc7YRFQHA5cpaW4SkupWLiIWbfcyuD583Tufp2+XbsIHD1CtL0d4fejaBqKtZjoOopQKCgvn+jJfwF4MVOBtJtvawLMmTPnm83Nzd/Xs1hOJdrAy7jraFIZ+4qbbaUuLy+nsnIaA/39DAwOmKy4btv/pjU2GDYSc+EZH7puui+bD01ZPitnYhSO9z9paioIhCIMfYvDQWlJMdOrq6mvn8WK5ctYsXIF8xbMZdasWZSXlYEOPq+P9vaLHD9+nP0HDtB45oxhl9DVzeDgIJFIJHUAFHvbYybaVvesrY55PokICARSSPMVK6xZvYp//dd/5aqrrhqV8Z8M0DWN0OAgnvNN9O7fz8D+/fhOHCPafhEtECBcUED5TTez7ht/QXnDnIls6n8CnwO0tBGk0925ZcsWvvKVr+B0OleeOHHihUAgkFMaVJH017Ksj/8rNzgcDq66+mreedu72LVrFy+++DyhYMCYiMMP4JLY1pSuuvHWJ0/uVJNcURSEEBhyksz1pyIWwjzvUAyHKE3qRKJR05LQ6KfD4aS4uIiKaeXUz65n6ZKlrFixkiWLl1BfX09ZaTEIDa/Xy8WL7Zw7c44jhw9z5Mhhzp07T09vH35/IJbh2RJoCUWJcSbxtyPRpc2nUdgvqgYREzpSN2qqmV7D//dP/8jdd989aeMDjAS6rhP2DOJtaWHgTCPeixdBVZm58XKmr1g5kSbAQeDDwB8gvWVnRvH7n/zJn/De977Xcffdd/9Xa2vrXbmy9S6nA5fLSSAQMlfP/OFwOLj1ttv4whe+wNatW3ng/vvxZkjJNJxtR/I9qqoOkQvYd/6puKB8hI/pXoKCwOl0UlJcjKZr+AM+ohHNIAIx5j1ugakoDkpKSpk2rYpZdbOYM7eeFauWsn79OubOmUtpSQmRcIT+vl6aW1ppbDzL0aPHOHrkCE3nmhjo7ycSiRA1OTQFgaoo5vOI5YCVFgUy+2/tdxESpBHspKCggE99+pP80z/90+RMET6KkFKiRyKGf4DLNdGWf28AtwM9kP7by0iym5qaeOWVV/QFCxbQ2dn53nA4HCNnmTo3e/YsVq1aSV9fH4F0Zpdp6rFPKE2LEtHCHDp8iPPnmsi2DcmlbZngcDhiRMFY2VPZC5DyXK7PTKkFkQYnUVFejupQCAaDSGmqHxWBIowDm1lxOBSmv7+f5uYLHD16hF2v7+K113bwxu49HDp0mM6uToqKS5i3YAHrL9vI5s3XcvXV17Dp8k0sW7aMqqpp6FIaMRg0zeQOzP8NCZwSF/7aA48IBJpuxHHYuHEjDQ0Nwxr3twqEECiqimJ+RxOMXwDPW+1Kh4z8SWdnJ9/97ncpKyvbdu7cuYNer/fy7IMAJaUlzJhRg8OZP/tjZ7ebzjXx618/RDQSJRLJ3fV0uAJIi403xBc25yebHcLQ/qY+lyk9V7KaUQojolE4GjEmpNSNa6rVBIMnF1LGVumYFMHcDvk8ARo952g8dQ5FEbjdhcycOYO58+exdNkyVq9ezZLFi7ls0+Vcd+MNhEJB2toucurUKY4cOszRo0c509hIe0c7/kAQLWWsPJuvByb7KCVnGs/w6quvsn79+kkjDHyLox2T9c+GrGTK+mDXrVv3F0ePHv1eOF0SRRvKykopKy2ls6uLcDiSsWxmtSGxD9zSPcdbbbLGo+ZMY1cDmpILge2DHzpUuQo0k/s79MnGfrzAVYCua0SiYYYq7GQ8R4NtAhqMgUDThRHHP2YkbW0aJKpTpbi4hPr6WSxYsJBly5excuVKli9fzswZM1GFYKCvn6amJg4dOsShw4c4fPgQTU1NeDxeG9FJMWYYHphXX3M1P/rRj1i/fv0ovY8pjAC/xBD+RbNxIlmlNhs2bCAYDFJVVdXV3t7+Lr/fX5ntnlAozKDHY1NLDY8dEkKgCMx4PdanLUCJBxqxZ7wdLiw34jibK1BVM3turPn59yE5HXemXH7Gs6QZUDVuc261QVp7cCEM5yxhaA0syiiEEcPRMscWdiKmS0LBIF2dXZw+fZq9e/ayZcurbN/+GmfPnmXQM0hBQQFz587j8is2ceONN3L1VdewePFCautmUFFehqIIQqEw0aidM4gbbgz0D1BZWclll102qdOFvwXgAf4GaAT41re+lbFwTl/1M888wzvf+U7mzZv3wwsXLvy5ruuxIB3GyqdneUT+q7Q9mpDT6UDXdDS7QDGBJTB98PXhcwOxMN4CCgsLWLpsKZqmcfL4SSKRsK2vBnIxSLKXzZadx04g7LKO2HMsIiQwA43EdfpS6gjFUlmaw23bxycIKk22xrqmOhyUlpRQW1vL0mVLWbt2HevWrmf+/IVUVJQhFJ2BgV4aG8+we/ce3nxzP2fPNNLa2obX64u1QVFU1qxezXe//z1uvPHGSWEZ+BbFM8CHMCIAZZVF5KS3ueqqq/jSl75EVVVVb19f33vD4XAxgKooo+uMkgIOpxN3URHhSMSI/CvjH74FKcmqFkwlbBy6KhsVFbrd3HTTTcyaNYuTJ08SMgWZ2ST+qepMlwbdjnSTJUEjEVPMGay9QGBm7aKwsICqqiqiUd0mK5EkSQuG/AbD8SkYDNLd3c2pU6d4/fXdvPzyK7y2fSenTp9mcHCQ0rJSFi5axKYrNnHTjTdy/Q03MH/+PCOISjiMrkt0TTLQbzg2rb/sMiorszKKUxh9RIB/xAj+kZMgMicO4JVXXqGpqYm7777bsXjx4v9sbGz8IyklqqKYgTqlsTqPQXALRVFwOBxGPgGZ2jkFLNuj1BPPGoxczgE4nA7mzZ8PUnLu7Dmi0ewCyHSDnZ4AxF2g7YlV7bkEhkbeFVizXphuGQ5VYeXqFVx55ZVs2bKVEydOGlo6UvsVKrEApZn8KQBUVFWlpMRN/ew6li5dymWXXca6detYsHARZaUlDPT3c6bxDEeOHGH7tu28uW8vxUVF/PXf/z0fu+uuSRMo5C2E3cAdmJl/Ro0AAHzmM59h+/btNDQ03PT6668/5vV6yxQhcDhUkwBImwQ/VfWJLrfDwZDVOkVXUuW8G66jkOX9lw1OpwNFEYSTbPMzCzgV2297e+NtzUXIqCgKc+c2MG/eXI4cOUZHR2fMciBnl2n7OEmLOFjtswgTuN1F5lZhGRs2buCqK69k5YoVlJQU09rSypaXX+ZMYyPX3Xgj73jn7bgmPg3W2wk68FXgZ5CHWjrX2j0eD1/72teYMWNG4X/+53/+uqOj4/26rqMqxoplRDwx9qClpWWsXLkKz6CH06dPEY6EkVIzY/uNDHZJfbr4/Jl086PNpbjdhSxfvpRgMMTJk6eIRrWh3oQpnm9n++1cjZTkbO+Q2O+RWUdahr5gEQCrD3a5R7x8QUEBs2fPZu3atVxxxSbWrFlFXV09ZWVlVFZWUTyxEXDfjngTeBeGCjBnApCz7ea3v/1t5syZw/PPPx8tKyvr9/l8741EIgVII7y3KXdCEQ6u3Xwt3/nOd7j22ms4eeok7e2tQ3zbxwPDNcaw9AG5wOVyUl5exuCgl4GBgVgN6eIexBOImEx6bPIbSVXiiVfHfbAMC0D7tiHNIAgMm4ne3l6OHTvG9u072LFjB6cbGwmGQrjdhRQVFU3q3IGTDDrwz8AWyO+7z2uT1tDQQHV1NatXr9763e9+95lAIPARK9il6RmJw6miS422tmZ0XUNRJLoeHfFHnT7ASCbPwWRrttFHIBDg2PHjSN1Io23t6VMhURsgY8JLIQQlJaUsXLiQgYF+zp07OzFEQCaOWMpxxdgcWKJJicTv93Py5CkaG8/w/HPPs3DhAjZt2sS1117H2rVrqauro6ioaPz78/bBAeDR4dyYl/fG7t27KSsr46WXXtLmzZvX29nZ+d5IJFJoCLAEQqjomk5vTw+v79rJM888zanTp4lE7DkFUlnO5fb83M1t014ZzhhlfVayD32qtqayAzDOGTr9yy+/nK9//Rv09/Vy7PjR0XJuzGqDYDXcridQhApCSVUszh4lsUkCw5oxGAhwsa2NgwcOsP217ezZu5empib8fj8ulwu32z0lHBxd6MA/MYzVH/IkAAD/+7//S3l5OR/4wAdaX3755ZUej2elcUWaLKwgGo3S199Lf/8AUpckOpwOH/l0LnXR1H4HI2vTSOo3d95CMHPmTNzuIrZte5Xu7i7L9yZd1aMKa1sihMChqjiTTLiTCUjMQhJLi0HcPssspmkaHs8g55vOsW/vXra99hp79+6jp6eHwkJji+CaeIeZtwL2Yhj++CC74U8yhjX6f/RHf8Tu3buprq6+5vDhw7/3er3VRmUKCMX8KMygGuaXog9xMMkf+Zncpu7uaLPWmQiA1Wb733iwkcTyBQUFOJ1OAgG/EfPASrVmaVaMm0e17VYLDMtHQUVFOfPmzSMQ8NN4polQKBxrcxzJId/i4yDs5wTE5JwSJAqKUCkvL2Px4kVcceWV3HDDDaxfv56amhorKc0U8kME+AKG3z8wDhwAwO9//3vcbjf/8R//0fLLX/6yYWBg4PJEKzk9/hEz8olvhz1yTbZyKc4Oa5AS601cCdM9I/u9iSbMmumRJ2z1pk6oklvbcilrmVcLReB0Oqirq2XlyuVEo1HaWi8SiUZTbCHi/P/QWI2pOQPLkQkkwWCAttZWDh48wK5dr3P8+HE8Hg+lpaWUlZVNWRDmh5eBb2FG/B3Odz3smfDlL3+Z48ePU1lZuXzr1q1P9fT0zDM+FNWMGjs2Uv/kwEO5lMvU3eFwBOnsETJ5DdrPpws+Gg/JJWNBSI3DJKKjKBewj4hQDKvO4uIiSktL8Xg8DHp8aJqe0hU6eewSDYhsAlhhe4aI/zUEpkZ3HE4X02uqufKKK/nQhz7Eddddx4wZM6a2BtnhBT4GPAUj03gNGwMDA5SXl3PVVVf91b59+/45FAoJVVVjefGIfdDmxzLCDzhXtj4fIWCuNv3pLfrSscTp3YTtVouGE1J80iSaVhv+DbG0YqOwBUiwlkyKERjLgZFwMpUgItEnIpEAJKo57VAsq0cwU4wbHReKgtPpZE5DA7feeisf+tCH2LBhw5TmIDN+heHxN+zVH4a5BbCwevVqamtrWbly5emzZ89uHhgYqNd1PeaRFhNkCZHZXyhHZFv9s0q7h/VMkdO5VG1K73+goFhSdkmyQD2Bd44TnuFO/uQ2pCk2pO2JfYo5S5FMbFOPTzJXYP22VMYocTNohEDqOv39fRw5coTDhw8hhEJDQ8OUQVFqtAJ/BrTACLe0o9GaoqIirr/++g+99tpr/+XxeFJEhEg0K03ZkBwEfKns/5PrMK/k3PZUdeTj6ZccNCR7eSMXoaKoRCJRwwfAiviDwY5bvgEx9n+IT8DQcUl9eeh4DBnDDMOV74eVHOwkU7stIai1QAgMDgEEDoeThjlzueuuu/j0pz/1to80lAL3YOz9gZERgBFHcTx8+DBz587lox/96NlXXnllcW9v76rEEqlXjuEgm8Q9fdnM5exls/ntp05llt3n37rf7i8hpZEUVdh0fsak0WPbhGwBUzKr97PZXMSjLORaRzoz63xCo9kdniwDZCsmg8OhoigqgUCAM2fP4vF6aJg9m8rKyikBoYE9wF9i+P2PmOMdMQH4+c9/zrx58/jd734XXbBgwZn29vZ3BgKBiqElL00CkPre1EY7qZBvTEDjHpDoIOJyEuzakqT4AblwRqkenxjUNJ1vQu5jkupcJg/LfLZkscxLUqCqKqrDgRbVOXe2icbG01RUVDBr1qy3uxGRD/gmRsDPS0dQKqWMRexdv379N1wul0ZcCjRqhxBDj1Rl0pVNdyTeL2JHuvO5Xk9X1nToNw8hUeKHUDLcl2VcspcTWcYu92emK597m80+primKIoscBXIstIKWVlRLauqquRVV18pH3nkdzIQCMi3MR6UUrpkli1hPhiVQO7f+ta3WLVqlRlWau6J5ubmdT6fb+GotNCG1KvcUNuAka7+uZyXabQCchgcgSEIzMaMJ3fYppEXSZcycAT5yCrGA6kcr6SU6JpGNBImEgkRiYS42NZGY+MZ6utnM3/+/LdjDoJjGO6+nTB672pU3/iiRYtQVZXq6uqrDh069Mjg4GBOyUSGNErko9obHaRS38m0qr/sBCDT+ZR9NjtphUJLdZ+pZSOuZpdDKsmUV3HoOCeWGU7chNGAqphu0FLY+ifj1oXS0JyoDpUrr7qKe751D9dcc83biQgEMFR+v7ZOjBYBGNUR/OY3v8lNN93Ez372s+aFCxdqAwMDN2uaZkpuUtH63DBWkz/RcGXocxKFg9mvZVMDZu+n3SYgBcGJScwTDXlkijpye176/o0XhJ2NsawTLStJIUkQ++nQ3n6Rzu4uFi9eTG1t7aWzDx5bPAj8ENCMMRu9Po8qAXj55ZdZuXIlVVVVLFmy5GhTU9PyQCCwzLouTD+BROTWmdF+0UMna7rnDu/acNqdqmh8NTa1DdjtCeINsOwLEtN6W/dlbn++Qzu8V5FJsGpN+FT7Fsw4BQah03Sd5gvNDAwMsGLlCqqrq4fTmMmEPRisf2/imI0ORp2H2r59OzNnzuTw4cPh0tLSE4FA4JZwOFxlNF5ipcJMpaPOhtHofDrudjTGNR/tQbbrQ82EDTVZqohHcfMHGyuSQ3/Gd/FMr5GwwqMlh1CXZghUa7NjSAwl0WiU5uZmEILVq1dTUlIynh0ZT/QCXwH2WSfy9fbLhjHZRC1dupSbb76Z3//+9x2LFi3q93g874hGo6a7l0AIx7ASho70g81lTzwy5KYqs87nGipcWjkCk+oaapAkUlj2ZOYA7OOSyqBoLFjsRNlItufZg6SaHobCyD3R3NxMSUkJy5Yto7CwcNTbOcGQwPeBf08/NiPHmBCAM2fOUFlZyerVq7nzzjuPt7S0TOvt7d0Ui3WXYFY6PIFT4j5Z2I7hYXTGNjez4Vy4BPvkT2aVk+8zHe2MLD1IG6eQuk32Pk9M9LF0wVGS5R7p5RRCEfj8fi6cP8+MmTNZvHjxW81G4FngrzAEgGMm6xgzMeqpU6eYMWMGjY2N2tq1a/e3tbWt83g8842rw5/4w8Fo7tOz1JRT3fm67Vp1x/fsQxRnZhxficupMnt2HU6nA68/MGpjOJpjk+gJmYkgDvW0tO5RFCO+gGdwkIsX21iyZAkNDQ1vFaHgSeBLQJN1YrRZfwtjqkc5d+4cn//85wmFQr5FixYd7e7uvikQCFTFS4xs1c4Vuax0Y8kB5LripzsnYwFEhiJ5ezGtqpzbbrvFEJa1tI3eIELWLUtmbkMkTXx72aGcjbDrO5PenSKMOAoOpxMpJV2dXUSjEdauW0d5efmo9nkC0I/h6POqfTzGCmNqXC2E4Je//CX79+/n6aef3jdjxox/KCoq8sdLWM6nI+9gpjEaTzY3vZAx2SbAfgwt43K5mD17ts381XIKso9XkisyUFhczKyGBlxud1qPyfRjaNcoDCVaRsr0dCbRRgsSBHnmNSOFoWH0mEgE0ngWmu7kyZoOs1Qs7amqCjNnYZDnn3+BJ598Ep/PN2bvdhygAT8AHh8yJmOEMbekePTRR5k3bx4ul4vrr7/+2Llz54q8Xu/Vuq4PVQgOo7PJFoDDHa/R4gCG2gukk/In3gfEhH1ghAhbvnw5dXV1dHR0EAqFiDsepTfW0ZH4/D7OnG1icNCT4rnZV+l4W4ZeSxZCxo9kjkXgcDooLyvB7S4kGo2i22QSlv+DcZ+SUKeiKDhUB0Io6EkyEPtYxcZBQsDvp6enl6VLl07mrcBvMeL7jcjHPx+MiynV448/Tk1NDSdPntTnzp37ZkdHx/JgMLgkden8OIJcxyhVYMt868jhKSmfm73dIknfH4+7393djdfrNfMq2IWnqZ8dCodpabnI4EDqyZ/Jyi+bb38mLUQy4VBVlYqKCupnzQLA6/OZCU8sImYnljbjH0Whuno6C+bPJxKNEAikkmMYY2CFnQNhRKPu60VKydq1ayfjVmAP8GWgI927GAuMmy1lU1MTbreb5ubmYGFh4Zuapl0RiURmJZays3y58e35jFN8pYrfO7rjnMhCD5Xip2t36v1wKBTC5/OhaVqs3vTjksrsOPu+PN2/kye+lQMy+Vpyf6yyqqricjoJBcP09/UTDodtbVGSnhW3C1FVlfpZs9iwYUOMAMafi63/JsExf0spiYQjdHZ2MWNGDStXrpxMgUbPAJ8HDlsnxkrol4xxNaZesWIFR44coaysrGf+/Pn7Q6HQZr/fP926nhB1JkfpRPye+JG7Q8/YEIB4/cMJ4jF+SBXDIJWQLp3NwlDHJ2lbyVU0Tcfv9xOJRGKpyePh0GSCcZO1hZDm/j8cDtPR2W7u6RMDjSQScWFzowafz4/f74slJJkE6AL+BCPA55CxH2uMKwG4cOECN954Iw8++CB///d/37Zx48bGgYGBm4PBYInRcaukjQBk8V5LPjKVTX3efExagVk+LyPVKnzpIR8jpFy5hPg5I86hqjqMZCG6ji7tuYjjBKLA5UIxHXrs4xUOh+np7sbn9yH1xHtj4zvkwzC4Cl2XDPQPUFlVyfr16ygoKJjo4c4EH0Zwj9+kGt/xwLi7U507d46GhgauvPJKHnrooTMLFizo8Xg8N0Wj0QJrABRh5qkTlvV7HLZ13rietGIZxqOpV7Vk5GofkB+nkJpNn0ihVG5jkX3FT3d/gkEStvdjRT2KnTQ4gJLiYq655hqm10ynv7/PEBCaRmIG0ZBoUStcmnE20fDLBvOZipmVRGBsBfx+P8uXL2POnDmXqkAwCnwH+AlmrLyJaOeE+FNu2bKFhoYGli5dyoMPPnjoySefDPp8vms1TYuZCytCMaayTVhkn1rCGjC7PbyIf2yKmXIrlWlp8pFJdZe4/8wddqOdZPVathV4uPWnLzv0mXbbgly2AfbnJr2FBJmKdd5w7zWDgNqtPqVk2ZKlfOc736GouJjXdrxGKGgX9JksvUiuP6mfQ96ZjBmYSikZ9HhwOp2sX7+e0tLSEY31GEAHfs4IY/qPBibMofrw4cM0NDTwwgsvyLvvvnvv2bNndZ/Pd3U4HI7ZcyrE93epBkgRihFE0/pgrMkqU69o6SZgLhPTvmfPvG0YciZlfSPZIjidDpO1lTnJEbIFLLH33dL1pyMKcduF+PYoUZhqqP8qp1XhKnAZwj+behNpmCpXVJRzqvEUR44eIRoOk2mvlxyzIJ29gpFZ2WhjKBSmt7ePOXPmsGzZ0kstdsC/A/8HI7b/hHIoEzoqjY2NLFq0iM7OTv3//t//u3vPnj2O/v7+q6LRaEwEGFsIYtEwklZ9ywDFXp7s+u6xCjCZKwFIbk+uH0FJSTF33PEurr/+etra2oz8i3mq9pLbGR/SuBA2s5NOas5AYOjv5y1YyKc+82lm1ddz8sRxIuFQrJAAAgE/e/e+wYmTx4lEwgji+RLsz8q1XwnjF0ulJvH5/ESjUS67bP2l5Db8EPANDIs/YPwk/qkw4WFWn376aYqKivi3f/u38G233fbt+vr6+4qKinSwrVZWYSmwhD1GItJ482PxMrCry9IdQ41e7MfIEN9WJEbnkQw3WpAdZWXlvOtdd/D+97+furq6Iaq5THv3xDJWbAG7nMVg2FOtxtZzEvtlHzernEAoggK3m+LSkljiE4s1B4miKkQiYYIBP3pUG/aYp9rWSNu1SCTC66+/zu9//ziDg4MjfK+jgkcwJn+vvQ8TiUuCL9q3bx9LliwhGAxGNm7cuL2goKCkr6/v8kAgEFP2Wmm0BZLCwgJKSkrQNGnoyIXFARj+cAanEP9gIZFFtevoYx6Ko4RM5rTJZTKdS3dvJBKhvf0iu3fv5tChIzFDmVwt/BJNdQ1CoJhWe4UFLlQ1no3IbnWX+IyhBlVxomIEiD19+jTnzpyhu6sLXdNj+npFKDidDmNLpcffW6oxy2VyxAlT4mIhTSIcDAbp7+9lxYoVzJ07dyIn3B+APwXa8+nfWOOSIAAAnZ2dNDQ0UFhYGP6Hf/iH7UePHi3q7OzcGAqFYil0BMb+9x233cott97G6TPn8HgGk9hXBYNiyLSqPctQxcJYqOwSX25mrUA+HoOapnHhQjNnz54laBOeZWKb0xEAUGIUsqyshKVLl1BeXobX6yES1dLUMzSqUwJhMMT4BPw+/F4fkUjEILJms1RVwaEaNgJD1St2ucJQ0+NU8ouU79j2W9clPp+P0tISNm3aNFFxA36PMflbh47ZxGLCtwAWenp6+O1vf8ucOXN4+umnvd/97nf/eu3atd93u90Rq4w02cfS0lIQEImESBBIyaGDmvyBSAkOh2PM89PbHX5SfaTZiE7qiWzl10s4m5aAZDLewRZBVCJxuQqYPXs2c+bMobg4dU4+q0+WoC2+HbDqMbJCa5pGJBwmFAyha9ImoTEmZCgcIRrV0HWBbiUKlam3YhbBtgsnrS2HnjBEdhuBxDHz+31s3foqhw8fZgLwMIZrb4v93VwquGQ4AAvPP/88W7ZsYefOndHNmzfvOHbsmBoIBK6IRqMqGIYlzS2tHD50iP7B3ni0HLvFgDA+6lRSeyEECxYs4OabbyYcDtPZ2TliDiDdZMvVzsBeR7J6L1FCbxy2nW5GCX+mEOXJlojGdkhjcHCQnp4egqFIbCIOtaBMpzeNyxOs7ZUkURiSeK+9L6R8hp0ApHy2SHMk9FMyOOihpKSEDRs24Ha7GQdI4JfAn2NY+6V9FxOJS44AfOtb3+Kll17ioYceorGxMXrZZZftCAQCgcHBwSsjkYjL2tcFgwHb/l3EyL4pw06rVFIUhc2bN/P1r3+drq4uDhw4kNZeP1dk3n/nU0/Cv5KvxmwbpJ6uTG7tS96eGHH2InT39NLd3UMwGIpndM6jr/YydoFcquuGDUc+o5zCQ9EagWQPRds2wrovGo0yMNDPihUrWbBgwVhPRA24H8PKry+fsRtvXHIEAAwicOjQIerr65FSas8///zrDz/8cK/f778yHA67gRgbaI+BJ3IMM+ZwOIhGo+zdu5eWlpaElW44Rjqj82JFRgIQ43GkPal3ZjVZ9r7I2H8lpgWeSVRziWswrF5mMDJK28o0HIRlkyQQOFUH7sLCOOFK4AKMsfV6vRQXF3PVVVeNJRcQBH5mprXkAAASx0lEQVQE/C0QUz1cipN/UuCb3/wm3/jGN5BSsnz58o9UVlY2ieR0VJl1fkMOp9MpS0pKpMvlSpviK5/6RI6pvMSQlFwiRR1WuXh9QgipKKosdhfJ0uISqSpqQn328vkc+fRxtA8xjPRqCYf53hUhZGFBoVy5fIW84/Z3yYbZDQnlFEWRiqIYv4WQK1eulC+99JLUdX0sUnf1SCm/ak/fdSn7hMAlygHYsXPnTjZt2sRzzz3HU089dXTz5s17/H7/Kp/PN2u4dUopiUQiMTfbkSJX1ZXdZNbuAZf6nkQJuKo6mD27nhk1NfT29Sa5CKd/Zjo5QKJNQv79HCtks49IuG423uFwUFJaCkLQ3t6O3+9P3V4p8Xm9VFZWjoVGoAkjfv8vMRN4jNeYvS3w4Q9/mJ/+9Kc4nU7uuOOORdXV1c8qijJkBWECV7Nsq2xuK/ZQDgCQqqrKJYsXyis2bZDuwgJbnYp55PL8VCt/blzBaHINmerKm0MxY40JRZGqQ5Ui6ZtIPhQUedlll8kdO3aM5sq/T0p5zWRZ9e245DkAC0ePHuWLX/wiv/71r3E4HL0NDQ0v+/3+skgkslrX9Vg/4paAmVfGeOnUZwtcLoqK3Oi6hm7TNyUa0STdl0EdN9QswLCYszs02XqQsl1RLYrX68Xn86HrccGlTLojP6FmZllC4lDlZqyUbVyyGS0NHTuRrjCW7CTniSfA6/UwY8YMNm7ciMvlynGcUkJiGPh8CXgz33GZwjBw6tQpAFavXs1Xv/rVwiVLlny1uLi4gyEriZJhFRESFPMQSeeRDlWVV2zcKD/3x5+RcxrqpWJbuRVFkaqqGvtKRMbVK/3+VUgFIR2qQyrmqiXMvap9z2pvvxBCqoqQipJ4DiPd0thzOlYa8xFwXLnLSnKTWQxHniGEkKqqyKuuvkq+8cYbI1n1fVLK70opqybjym/hkjEEyhWLFy9GSklRURFNTU3BkydP/mTRokWfKCsrO5S4fzT9y1NSY+tFCYRQMRiheDlVVVmxahXXXXcD5RUVpgGOQFUUVFtkXJmG0FsfQvoPQsb+KikCidrbneyzoOsyfXVjiJSjOEYf/HDrTbZ4TF03aJrk2NGjPPvsM3i93uE8qhkjis9fcwnZ9b/t8Bd/8Rd873vfw+FwcO211y6ZOXPmYy6XSyPVKjFkNVAkOCQ4pBAOWVlZJRvmzJFut1uqiiIXLlggr928WVZWlktFIB0C6XIo0uV0SqfDKRVFSbkipluphp5DqqqxGilq4uqvpOEGFJFG4zHaHEC6FXWMZCwjkQmk4hLS32NwfkIYXNzmzZvlwYMH8135d0gpr57Mq74dk0YGkAo7d+7k6quv5pVXXqGqqqrn5ptvft7j8QTC4fDqcDgcs2e1rMmSYVHsoiI3f/RHH+czd99Na1srzc3N9Pb10dLSTCAQMj4d4wbDFl4RppUbCatvLjpuIQROpxPVoRrhruyWjCKTWS9DLNxiv5WklOEp6slrdRoil8gP+Tr15CoTyPVa+nuM84ZZsWFQtmDBAlavXp1LvIAA8B8YSTuO5Nq3Sx2TbguQjHvuuYfHH3+cwsJCurq6+o8ePfr/rV+//uM1NTVvWLnipJToMtnrT5rbBI3S0mKuu+5abrzhBhYvWhzLOKNpesyiTRegS8NQRtM0Y+JncCRM92E4nQ4WL1nEmrWrKSgsMI2Z9LTuyHH2nxixsZvxplMDjmhlsvtWD+v2RKFppvHI1F771idbf+wCQ1VV0xD8OF3TdUlvby8vvPC8kWk4M85ghOz+Mwz2P6c+TQZMag7AwsMPP0xzczP79+/n2LFjPPHEE2fe9a53Pd/W1lYRCARWSSkzEjpFUXA4HJw7d45t27Zx8eJFZJKbsN3tNW4mm3qyQvoJWFxcwvXXX8ey5Us5dfIUXq8/vthm9ApMPUFiZ/Oc8Fk/3hFyAbk8y9KAiKEXcjY5TuY2FEXB5XIihDA8DoeUN38j0XQNj2eAJUuWsnz5ilREQwOexJj8z/MW1O+/ZdKpWi/k5z//OW1tbZw8ebLZ5XJ9paysbJ/X6/3LSCTSkO5er9fL7377OwpcTvyBEFrUSmARn1RSGoJAYbob60ImSQGlzbs1/WRUVZWCAheqIlAdxgenW3uJFCtnPB5/oqowThdkxuelQ1YOQc+foKSrM6NaUkqkRWxs3TTFqHkxIdIMN+ZyOYhqmpmLwDaewhC+OISCQKDJKB0dXbzwwovceONNyWHE24F/wYjdN2XSO5nw53/+55SXlzPLzEpTVFR0FbCDLMIoBSFFTD2opBY4KcImDBNJasTswi632y3XrFkl165bJYtKClMK8BJNgJWUQq34vyfWpHdoe9Jfz1hHTKVpPxKNp5KfZTf3tf8uKiqQhW5nktm1ISwVipBOh0MWOF1SVY13vGjRQvnUU09Z5sFRKeWzyYK+yS7se1ti6dKlLFu2jJKSEoCZQoj/J4S4QLqPNDahU0ws8+MRipAFhQXSVeAyiMEwJoqqqlJRhUQxPnwh4jYJlp1BJj34aNn05zNhx8PKUohsR25jIBSkomQg9IoiHQ6HtCxJi4qK5N/93d9Jr9d7Vkr5NSllxdtl4r8lZADp0N3dTXd3N+FwGCGEV0r5mtvt3qKqqhNYIKVMbwxuDzAEqIqKqqqsXr2aT3/602zatInBgcGE1FW5QiZ4MlpRdkQsjgE5Cr1S/c4FIsc9drY67OnCMrUv9zozjVnq+lM+P9vrEBCLJ2nYd0Srq6v/sHHjxi/t37//8fnz5wdH0o8pXIJwOByoqorb7WbevHnO2tram0tLS59RVTVCmtVIUURMR68KRVZVVspf/OIXMhAISI/HI7/97W/L8rIy0zPNZNtJ752YyLbbthExljfZMjEbm52/FdxwLOdS/VtRFOl0Ooe9JUge62xHtnalqzPldSGkoqpSVVXpcrmaioqK/p/b7a71eDy88MILb/lV3463jBAwG6LRKABFRUWEw+FId3f3S0uWLNnT39//YY/H8yWv17vO7h0Yy3ePsVpousRVUMCMGTMoLDTSXbvdboQSl9JbYTFjdeSyFA0pk/keS6BWXz8LVVW5cKE5weMv08eb74edyZbAUJNqKa/nyjob5SV24V/6solcQLb6M8UzMGNC9iqK8iTwoN/v311fXx8tLS1FUZRRDxR7KeMtvQVIhUAgwFe+8hW2bdtGdXV16MyZM2/eeOONf4hGo926rs+PRCKV9o8rFvdOgKbrsbTXp06d4te/fogTJ0+i6/qQ8B15ryE5+uQAOF1OPvrRj7Jq9SoOHTxAJGIQt9FgV+OqtXiSDfu10VwdhTB5JywnLsy4zqkzOo2kf5Z9gMPh8LpcricVRfl/0Wj0F2VlZWcDgYBuhQ1/O63+b3s89NBDSCm54YYbALj55puX1tTU3FtYWNiSmsUUsqioWC5atFguXrxYlpQUJTjnjNehOlR5w403yFvfcassKHSNsiDO6OPSZcvl7IaGnASdyQK6VNdTajswgnSoClIVSNUU3qmK6fiUIqhH3g5IpmDV4XAEXC7Xc8XFxe8pLy8vqaqqmkzpw6cwVpBS8i//8i80NTVx5ZVXIqVk1apVq6qrq39YUFDQmumDM2z5Rfq95lgcprzA4XJKp8s56s8WQsji4mK5+bpr5Qc//EE5b/4c6XAqsefE9uUIqSqqrKubKWfPrpMupzPzBE3TTlVRpNOhSIdDkQ5zPBXzsE/+fAiAUOKqQafTGXK73dvcbvddBQUF5cXFxZSVlU30Z3fJYErEaaKjo4NPf/rT1NXVsW3bNk6dOiUWLVq0qq+v7zN+v/+DoVBoVn57wzx4+nxqtcUAsOQOQEZDwOGw7ouXLOLrX/8aiiL49re/w7mzF2K9MuoTFBcX8+EPf4CSkiIefvi3dHf3xHqckwwAM9KxkcwRPRam3JSfWOLUJGSr29zje5xO56uqqj4spXxJVdXOYDBIKBQa9a3MZMbbRgiYDTNmzACMj+vqq6/mgx/8oAyFQoe6u7v/fMOGDQ9evHjxw11dXR+PRqPzc/t4xuYDswv8xhINDQ1suGwDIKmuns65sxdsxMZogxaNcqaxEXdRIZFIJOFaTrACeQhA2lKMCTuBGxrhNx3MPX67w+F4oaio6FcVFRU7Ozo6/LquMzAwkD60+NsYUwQgCfYP7ZZbbuGDH/yg9Hq9R9ra2o5UVlY+FA6H3yuEeH8oFFofiUQmZBOpCCt9ug6CITECLP189rgE6aFFNY4fP8HpxtO0trQaJhHmKm1NzlA4xO433kAICIejmd0R0jBEUkqkbiV2kSimr4W9eLL2IXkFN305zlZVVT1cUVHx26qqqqPHjx+PhsNhvv71r7N161a2bNnytpLu54qpLUAOWLlyJUuWLGHLli309vZy0003TTt27Ng7BwYGPhUOh6/UNK14PFcVVRipzSRG4g1dl0PClkF+Ez95kpWXlzO9Zjq9PT309/UTX5PNX9K6L74lSHSQym0LZDkyq6pKcUkxSEnA50fXdTSpI20OP7quJ0x+RVECTqfzkMPheLywsPD33d3dJ+fOnYvL5aK8vJwzZ87Q29ubtQ1vZ0wRgDxw2223cfvtt/PII4+wb98+pk2bVtrf33+FlPIOIcR1mqYtCYVChaMVbTgdFAyVlpX/UNeN5B6jQYQs3by9Kmsqx7YAKed29vwD9mfEtjJmwpNFixdx92fuxuvx8NB//4qWCy3o6KajUJyYqaqqOxyO80KIVwsLCx+ZPn36rlOnTvVNnz6d6dOn43a72bdv35iO/xTe5li3bh0A06dPj0mUr7/++prrr7/+3WvXrv33urq6MyUlJVFVVcdEE2DEw1ekqqjSoTpivgMZ78nRf0Aw1IJuLDQN9n8rQpUf/MCHZGtrq9y/f7+85uprEuItCiFkQUFB5/Tp05+YPXv2Z5ctW7bgve99r1pWVsb8+fOZP38+P/jBDyb6s5iUeNsZAo0G2tuNDM9+v5+GhgZUVaW6utrX3t5+6siRI0+dP3/+yYqKin0lJSV+oEzX9XIppRjNPWhsJ56n00q2AB2xjF0iHhLAyqmYL3K9R1EdVE2bRllZKXv27OHlV17G5/Phdrs7y8rKthUVFf2iurr6H//8z//8vkceeWRPVVVVX3t7u6ypqeHEiRP09fXxwgsvjNrYvp0wRQBGiN7eXvx+P01NTVy8eJFAICCPHTvWv2vXrsPHjh178pVXXvmDz+c7WlRUFKmoqHC6XK6iaDTqyLZNGJ7DTi5BNIxyKSPwWNdtsUBGW7SROnCnpL+/j4MHD+rHjx9vDYfDr5aXl99XX1//j7fffvt9W7dufa2srKy9qqpK27dvHw8++CA///nP6ejoGN3GvQ0xpQUYJSQL0T7/+c/zq1/9SguHw426rjdec801/1lSUjKzr69vxfnz56/2+/1XDgwMLO/v758RDAaVZO4g//28Zb6rk0n4Zqzm6a/HJn62AvYKcxgTq0/J/VJV1asoyvlgMPjm+fPnt65YseK1+++/v+nqq68Ol5aW0tVlJNb93Oc+x9/+7d8C8L73vW8Eb2oKdkwJAccBmqZx4403MnfuXJqamti6dSv79u0reuSRR+a8+eabG86dO3el1+tdHQgE5oVCoWmRSKRA07Q81VaWRX3MFCfvdlosfyzFqllFbM4mRCJN+GO6N2cmBqqqaoqi9AOtQojjTqdzv9vt3qUoyskVK1Z07dixQ9+wYQOf+tSn+MpXvsITTzzBO97xjnF9V283TBGAcUQ0GuXs2bMsWrSIp556ii1btvDEE09w5swZvvSlL5U2NzfX9ff3L/T7/avD4fCagYGBJX19fbXhcLhS0zSXHosinB4jtXKztgFJcvvEsF7W9RST3oqvKISIKIriVVW10+FwnFNV9VB5efm+wsLCU16vt/Wqq67qffjhh7XKykpcLlcsWrKiKJw/f36iX9XbBlNbgHGEFaXYwgMPPMAPf/hD7rrrLjwejwc4OTAwcPLw4cNPSynVv//7vy/ftm1bbWtr69zBwcFlwCIp5WyXyzU7EAhMCwaDpeFwuEAI4dTNaMUjVQWmXsgTDYoEAoeqIoTQVFUNq6rqnzZtWndxcfGFqqqqs263u9Hv9zfqut7idDpbN2zY0PejH/0oGI1GmTlzJgAtLS0A1NTUcPLkyYl+NW9bTHEAlxjuu+8+otEoy5YtY8uWLWzfvp3Tp08bkYql5LHHHitsbGysPHPmTM3x48dr+/v766uqquaEQqHZxcXF9aFQqKavr2/a4OBgZSgUKgyHw8Lv96c11U0XWUgIQXl5OUVFRdLtdocikchgMBjsjUQiA4WFha1FRUVnSkpKLkgpL5SXl3fffvvtLZ/+9Kd7ampqfEII5s6dS11dHQ6Hg8WLF7Nv3z7279+fZ97CKYw1/n/lzHnzh/I/iAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wNy0wM1QxNDo0MDoxMiswMDowMPdgeR4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDctMDNUMTQ6NDA6MTIrMDA6MDCGPcGiAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/448015/%E6%96%87%E7%8C%AE%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/448015/%E6%96%87%E7%8C%AE%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let site = document.URL.toString();
    let link, sciHubLink, sciHubLinkIMG, paper_link, paper_id, request = {}, ins = {}, progress = {}, idm = {}, resData = {}, doc = $(document),
        unpaywall_url = 'https://unpaywall.org/',
        requestApi = 'https://www.yuque.com/eureka007/ziyuan';

    var scihub_ico = "data:image/png;base64,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";
    var libgen_ico = "data:image/png;base64,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";
    var unpaywall_ico = "data:image/png;base64,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";
    var fish_ico = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfeBgkLODFcvD71AAACn0lEQVRYw+2WT0iTcRjHP5vzX7Upmlos1kEwD9FIhh46hFZoUkGXBMMOCQkh2CGKjkoEdoroFEiUHiRYeeggBUsMlaLZH5IQtITpCMxmk2azzbfDfN/9Xufe7fUd1GHP7/Y8/D7f5/fneX4/yFrW/nszpYibacdFdMuZAdx4jafQRhgpyfDTRYFRgRxuJxWQWOMuO41K2PmoIRGhG4tRiRsaAhJBThoVqGdVU8JNbvIdTscqadXcBjsOLCyyulWwgv2UpRDo1cw/NsK8oQt74uQHzPOBO9QkgZdwlUAaAhIS60zRQaEacI6fSEgs0E3RJriZ03iIpomXL+4gVSLEQp8SHGCPECnn5oa43vEWlyhxVMA8wrrhdTGyLXhsTFEXFyjgqRKI0ksOJlqY1YmcY5gR4bQmORCXaCOiBJZpppOgTvwQ1eSQzwmh6t3YZIEq/KoW9ksn3ss+LBynBjijzI7SJQuU8t7AfkvcAi4RYpZqbHgV/zROMwAhAmlVdDILA0UUsot8Iqwp/ip5DTsYNbSCUYqx0koTUM+yEJmOCexl2pBAhHuUA3B4U6pPYgI1LAnOMT7plljHy3368am8M3LBXRGcIZpwMm5oRTKpLYa34hHcw1gBBw/5Ywj/m2tyi28U7r2PI8gHf51v28av0ENeDJRHv+JepEV1/ep4tq11fOV8/IG6yMqGe4LGhH+SjQuM6WrYAfo4JCKeM88XXtBJRZIyKqWDcSUNrcvqY4AG9eNqwoGZKEuENGu1GCenaKAy4VGCCEF8vMPDBHNEjLSEEmq5zJwq7++042R3yk9o2pbLS5XAoPFvl9psvBbwnzmYWTzU8kPB+2nONB56BPzZzOPLlEY4ybF0Jug9oChDvAJ8PGYm8/lnLWv/xP4C54UGs0hQL5AAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMTEtMTJUMTA6NTM6MTcrMDg6MDBm9dR5AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE0LTA2LTA5VDExOjU2OjQ5KzA4OjAw/5T2jgAAAE10RVh0c29mdHdhcmUASW1hZ2VNYWdpY2sgNy4wLjEtNiBRMTYgeDg2XzY0IDIwMTYtMDktMTcgaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmfd2aVOAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAGHRFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAA1MTKPjVOBAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADUxMhx8A9wAAAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTQwMjI4NjIwOZntnxAAAAASdEVYdFRodW1iOjpTaXplADcuMzNLQhmSqU0AAABfdEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL3d3d3Jvb3Qvc2l0ZS93d3cuZWFzeWljb24ubmV0L2Nkbi1pbWcuZWFzeWljb24uY24vc3JjLzExNjkwLzExNjkwODQucG5nM8JenwAAAABJRU5ErkJggg==";
    var pdf_ico = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAUhSURBVFhHtZdZiBxVFIZ7eq2u6VnijDOZsWcLyGDAJUgEFxTR4IsLOmrENRF8cceAGygoiBBFQY1roiQiIUFRcHkYNFEEHUENKCERXGIIbomGyYPOYvfx+2/X7VSPzmIsC3666tatc/77n+XeTs12VUd6AxsID9pgs9nAkeHe1ux2TBVrFue+RsAGsD6G1y4JM3Ztc9auAhcUMw4Xg2t4vg7o/YU8C5dzrzHhjpacVfub3TzsjJVSqTZ+57w2Ak22bFPKVgQZu6GUtVMLaTcmnM3YyjBrJ+UPjw1n07ZCBHDen2mqj6dBpS+0VTUC1rQAEuuAm7wo3WQTfDzaVbBdvUV7pD3vVipJt3YWbO8xRXvr6IJlmfvZ4oDn0N7pCpxS3kYnNuIEhPlINBAYL4fWze9qDOyFhGTdw6/ed7NSkZHs23G8dlHejRVQztvwBKIQ1DEXiTqBdj7+mVV+0aPVFd0qRlBgH/d+zk/c39qStVdR5ACOdkNOueHfi4Axfv0MAhHGQCdouBoUOIQCa0ikoWwtrjL0Y0TgIhxJgeNzaRvrDuyh9pyFrF4h8TZEYLxcdKo9f1TenothQ0fBtnTktjCv4WogcAACy/OHV7QSBSbJ6k+J+Z5o9Rr/nOd7WnP1eR4i8AvzKGNHtgFDJSqk+D7zGq4XgftYGdzPynOxmAqKs1fEI5gxx0Nq7BeB/tAmCUUcIjFRDkaZ13AtA6tjWLU0k74bySovINvT4DGS7XHwFJCUkvYJ7tcB3cexGZn/iJwJSsj5CPztqp4YdlYHwoo3Mi/iHTO6H6VK3qBkHZlIDY0viMBET+5Y+kHlzxj72aC+odKVEzmQMsJWnKuhLaN5qaIq0ftECei9HJ9Pdagy7m/L2ZOEoZVEbAO9UYf01ZMogSkgg3KoXLmTijgOEkpYOVdCY8ohT8LuoywVnsQIyPmbyMx020jiqcSkhsLxA5KreamVn0wIShD4hL6RGAFl9iFQjiT+RqvDuVRxsQaao/1DlXNmIWPfJ6mAVv8uGxZTHTZ15J3x+PuXUUXSG03Mk0ssB2ToYyRlqoP2kB10Rk9C7+8iJ5SMslGNfZcIgWlQYWXaqJju0EU4tlH7IiFHb0f58W0UHn2XGAFBsVaTuTK267Hluq4pR8JSquJq3seVSYyAoJXJqJJNfYBPHXR6GuedNi896+zgSSVKQFA4nGF+n6Ef+E1rkJDsRP73cD7I2K/qlklVwT9BZSci6gNrqX8lIKbsdXLhJYjdTFu2of+RgMqsGoVEjvZD5EacYs7lxaOQ+hpFqIjkCGjVfo7yQQeR3T1F+0hdLyKiRoRJd3jRISYRAlqt3imu+lVsN9F4dJA9hyM8JuwySnRKivDuDI74OuR8hwKQ/m8EXEfD6Aes8iwMD5P9O1i1zpEncK+tdyBKRP1JsSUle5izo543Uy3VwSMgIKceaq33se0qyZ4luU5hs1En1ElIfUCnZXXJZlbckk7ZNCpIGcy6+f+KgFqoq/V6cpXcnxam2C0cTqcZ28Xq9XwaajwIMd2fRxiEc8GlhELENL6TuZy0FkaA1VZ+I8brYa1udzoObkPSJcgrZyLkTzk6G/KZXUEDeiAiMRP6/6iknFpQGS7ODavBSH5l9pcw138A/QPqQO6vXH+vtVcXFkh8iOw3oYr2fa10DVmvHFlOiG5nXNu3cuf3crAtcjP7Ve0LeibLwUHVtet00Ur1p0XQs09KDxciqRKbHw+f7xETfcErNS+p1F9b1z/MoMKQ6AAAAABJRU5ErkJggg==";
    var epub_ico = "data:image/png;base64,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";

    const scriptInfo = GM_info.script;
    const version = scriptInfo.version;
    const author = scriptInfo.author;
    const name = scriptInfo.name;
    const Open_Type = {
        1: "当前窗口打开",
        2: "新窗口打开"
    };
    var definitions = {
        matchDOI: /\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)\b/ig,
        matchURL: /^(?:https?\:\/\/)(?:dx\.)?doi\.org\/(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)$/ig,
        doiRes: "https://doi.org/"
    };

    const message = {
        success: (text) => { toast.fire({title: text, icon: 'success'});},
        error: (text) => { toast.fire({title: text, icon: 'error'});},
        warning: (text) => { toast.fire({title: text, icon: 'warning'});},
        info: (text) => { toast.fire({title: text, icon: 'info'});},
        question: (text) => { toast.fire({title: text, icon: 'question'});}
    };
    let toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    let base = {
        clog(c) {
            console.group(`[${name}]`);
            console.log(c);
            console.groupEnd();
        },
        d(str) {
            return decodeURIComponent(escape(atob(str)));
        },
        e(str) {
            return btoa(unescape(encodeURIComponent(str)));
        },
        isType(obj) {
            return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
        },
        setValue(name, value) {
            GM_setValue(name, value);
        },
        getValue(name) {
            return GM_getValue(name);
        },

        get(url, headers, type, extra) {
            return new Promise((resolve, reject) => {
                let requestObj = GM_xmlhttpRequest({
                    method: "GET", url, headers,
                    responseType: type || 'json',
                    onload: (res) => {
                        if (res.status === 204) {
                            requestObj.abort();
                            idm[extra.index] = true;
                        } else {
                            resolve(res.response || res.responseText);
                        }
                    },
                    onprogress: (res) => {
                        if (extra && extra.filename && extra.index) {
                            res.total > 0 ? progress[extra.index] = (res.loaded * 100 / res.total).toFixed(2) : progress[extra.index] = 0.00;
                        }
                    },
                    onloadstart() {
                        extra && extra.filename && extra.index && (request[extra.index] = requestObj);
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },

        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            doc.getElementsByTagName('head')[0].appendChild(style);
        },

        initDefaultConfig() {
            let value = [{
                name: 'setting_scihub_url',
                value: '1'
            }, {
                name: 'setting_libgen_url',
                value: '1'
            }, {
                name: 'setting_open_type',
                value: '2'
            }];

            value.forEach((v) => {
                base.getValue(v.name) === undefined && base.setValue(v.name, v.value);
            });
        },

        async getSciHubURL(){
            if( base.getValue('setting_date') === undefined || new Date().getTime() - base.getValue('setting_date') > 86400000 ){
                resData = await base.get (requestApi + `&cid=scihub_pro`);
                base.setValue('setting_date', new Date().getTime());
                base.setValue('setting_scihub_json', resData.other.scihub);
                base.setValue('setting_libgen_json', resData.other.libgen);
            }
        },
        showSetting() {
            let dom = '';
            const SciHub_URL = base.getValue( 'setting_scihub_json' );
            const Libgen_URL = base.getValue( 'setting_libgen_json' );

            dom += `<label class="pl-setting-label"><div class="pl-label">Sci-Hub</div><select class="pl-input listener-scihub">`;
            Object.keys(SciHub_URL).forEach(k => {
                dom += `<option value="${k}" ${base.getValue('setting_scihub_url') === k ? 'selected' : ''}>${SciHub_URL[k]}</option>`;
            });
            dom += `</select></label>`;
            dom += `<label class="pl-setting-label"><div class="pl-label">Libgen</div><select class="pl-input listener-libgen">`;
            Object.keys(Libgen_URL).forEach(k => {
                dom += `<option value="${k}" ${base.getValue('setting_libgen_url') === k ? 'selected' : ''}>${Libgen_URL[k]}</option>`;
            });
            dom += `</select></label>`;
            dom += `<label class="pl-setting-label"><div class="pl-label">打开方式</div><select class="pl-input listener-open-type">`;
            Object.keys(Open_Type).forEach(k => {
                dom += `<option value="${k}" ${base.getValue('setting_open_type') === k ? 'selected' : ''}>${Open_Type[k]}</option>`;
            });
            dom += `</select></label>`;
            dom = '<div>' + dom + '</div>';

            Swal.fire({
                title: '插件配置',
                html: dom,
                icon: 'info',
                showCloseButton: true,
                showConfirmButton: false,
                footer: '<div class="swal2-footer-left"><img src="https://tucdn.wpon.cn/2023/12/15/27d944ac4a185.png" width="100" height="100"></div><div class="swal2-footer-right"><p>点击查看 <a href="https://lin64850.github.io/" target="_blank">电子书搜索</a> 下载更多内容！</p><p>点击查看 <a href="http://eureka.mba/" target="_blank">各种资源教程</a> 获取更多免费内容！</p><p>关闭界面，即可保存设置</p></div>'
            }).then(() => {
                message.success('设置成功！');
                history.go(0);
            });

            doc.on('change', '.listener-scihub', async (e) => {
                base.setValue('setting_scihub_url', e.target.value);
            });
            doc.on('change', '.listener-libgen', async (e) => {
                base.setValue('setting_libgen_url', e.target.value);
            });
            doc.on('change', '.listener-open-type', async (e) => {
                base.setValue('setting_open_type', e.target.value);
            });
        },

        registerMenuCommand() {
            GM_registerMenuCommand('选项设置', () => {
                this.showSetting();
            });
        },

        addinitSciHubStyle() {
           let css = `
                 .swal2-popup { font-size: 16px !important;}
                 .swal2-footer p{ font-size: 12px!important;justify-content: flex-start!important; margin: 0 0 10px!important; padding: 5px 0 0!important }
                 .swal2-footer p a{ color: #ca2015!important; }
                 .swal2-footer-right { margin-left: 20px;font-weight: bold!important;}
                 .pl-setting-label { display: flex; margin:0px!important; font-size: 14px!important; align-items: center;justify-content: space-between; padding-top: 10px; }
                 .pl-label { flex: 0 0 100px;text-align:left; }
                 .pl-input { flex: 1; margin-bottom:0px!important; height: 36px!important; padding: 8px 10px; border: 1px solid #c2c2c2; border-radius: 5px; font-size: 14px }
                 .swal2-container { z-index:100000!important; }
                 body.swal2-height-auto { height: inherit!important; }
            `;
            this.addStyle('pandown-style', 'style', css);
        },
    };

    let start = {
        // 1 判断网页，增加浮动图标下载按钮
        addFloatDown() {
            var SciHub_url = base.getValue( 'setting_scihub_json' )[ base.getValue('setting_scihub_url') ] + '/';
            if ( !site.startsWith( SciHub_url ) ) {
                var sciHubUrl = start.getSciHubLink( site );
                var libgenUrl = start.getDownLink( site, 'libgen' );
                var unpaywallUrl = start.getDownLink( site, 'unpaywall' );
                if ( sciHubUrl.trim().length > 0 ) { start.addFloatDownBtn( sciHubUrl, scihub_ico ); }
                if ( libgenUrl.trim().length > 0 ) { start.addFloatDownBtn( libgenUrl, libgen_ico ); }
                if ( unpaywallUrl.trim().length > 0 ) { start.addFloatDownBtn( unpaywallUrl, unpaywall_ico ); }
            }
        },
        addFloatDownBtn( floatDownLink, ico ) {
            var box = document.createElement('div');
            box.id = 'downBtnStyle';
            start.addBtnStyle( '#downBtnStyle{ position: fixed; top: 220px; right: 60px; max-width: 400px; z-index: 999 }' );
            box.innerHTML = "<a href=\"" + floatDownLink + "\" title=\"点击打开链接搜索此文章\"; target=\"_blank\"><img id=\"imgCheck\" src=\"" + ico + "\" style=\"height: 50px !important; width: 50px !important; margin: 3px !important; display: inline-block;\"></a>";
            document.body.appendChild(box);
        },
        addBtnStyle(css) {
            var head, style;
            head = document.getElementsByTagName('head')[0];
            if (!head) { return; }
            style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;
            head.appendChild(style);
        },
        // 2 将DOI号加上DOI链接
        addLinkByDOI() {
            try {
                start.replaceByElement(document.body, definitions.matchDOI, function (match) {
                    var link = document.createElement('a');
                    link.href = definitions.doiRes + match[0];
                    link.appendChild(document.createTextNode(match[0]));
                    return link;
                });
            } catch (ex) {
                console.log("DOI autolink encountered an exception", ex);
            }
        },
        replaceByElement( element, find, replace ) {
            // iterate over child nodes in reverse, as replacement may increase length of child node list.  don't touch these elements
            var forbiddenTags = ["A", "BUTTON", "INPUT", "SCRIPT", "SELECT", "STYLE", "TEXTAREA"];
            for (var i = element.childNodes.length - 1; i >= 0; i--) {
                var child = element.childNodes[i];
                if (child.nodeType === Node.ELEMENT_NODE) {
                    if (forbiddenTags.indexOf(child.nodeName) < 0 ) {
                        start.replaceByElement(child, find, replace);
                    } else if (child.nodeName === "A") {
                        if (definitions.matchURL.test(child.href)) {
                            child.href = child.href.replace(definitions.matchURL, definitions.doiRes + "$1");
                        }
                    }
                } else if (child.nodeType === Node.TEXT_NODE) {
                    start.replaceByText(child, find, replace);
                }
            }
        },
        replaceByText( text, find, replace ) {
            var match;
            var matches = [];
            while ( match = find.exec(text.data) ) {
                matches.push(match);
            }
            for ( var i = matches.length; i-- > 0; ) {
                match = matches[i];
                text.splitText(match.index);
                text.nextSibling.splitText(match[0].length);
                text.parentNode.replaceChild(replace(match), text.nextSibling);
            }
        },
        // 3 让连接可用
        linkClickable() {
            if (/^https?:\/\/xueshu\.baidu\.com\/u\/paperhelp/i.test( site )) {
                var able_link = document.getElementsByTagName("span");
                for (var i = able_link.length; i-- > 0; ) {
                    able_link[i].innerHTML = able_link[i].innerHTML.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim, "<a href='$1'>$1</a>");
                    able_link[i].innerHTML = able_link[i].innerHTML.replace(/(^|[^\/])(www\.[\S]+(\b|$))/gim, '$1<a href="http://$2" target="_blank">$2</a>');
                }
            }
        },
        // 4 修改添加下载链接和图标
        addDownURL() {
            'use strict';
            var SciHub_url = base.getValue( 'setting_scihub_json' )[ base.getValue('setting_scihub_url') ] + '/';
            if (document.title.trim().includes(" - Google 学术搜索") || document.title.trim().includes(" - Google Scholar") || site.includes("://scholar.google.")) {
                link = document.getElementsByClassName('gs_rt');
                for (var i = link.length; i-- > 0; ) {
                    try {
                        paper_link = link[i].getElementsByTagName("a")[0].href;
                        if ((paper_link !== undefined) &&
                            (paper_link.search("patents.google") == -1) &&
                            (paper_link.search("books.google") == -1) &&
                            (paper_link.search("scholar.google.com/citations") == -1)&&
                            (paper_link.search("biorxiv.org") == -1)&&
                            (paper_link.search("arxiv.org") == -1)&&
                            (paper_link.search("researchgate.net") == -1)) {
                            link[i].getElementsByTagName("a")[0].className = "sci_article";
                        }
                    } catch (e) {}
                }
            }
            // add button after link
            link = document.getElementsByTagName("a");
            for (i = link.length; i-- > 0; ) {
                if (/^https?:\/\/xueshu\.baidu\.com\/s\?wd=paperuri.+sc_vurl=([^&]+)/i.test(link[i].href)) {
                    link[i].href = decodeURIComponent(/sc_vurl=([^&]+)/i.exec(link[i].href)[1]);
                }
                paper_link = link[i].href;
                paper_link = paper_link.replace("/metrics", "");
                if ( site != paper_link && !paper_link.startsWith(SciHub_url) ) {
                    try {
                        paper_link = decodeURIComponent( paper_link ).replace("://www.plosone.org/article/info:doi/", "://journals.plos.org/plosone/article?id=");
                    } catch (e) {}

                    //add sciHub Url and ico
                    var sciHubUrl = start.getSciHubLink( paper_link );
                    if ( sciHubUrl.trim().length > 0 ) {
                        start.addDownIco( sciHubUrl, link[i], scihub_ico );
                    } else if (link[i].className == "sci_article") {
                        start.addDownIco( SciHub_url + paper_link, link[i], scihub_ico );
                    }
                    //add libgen Url and ico
                    var libgenUrl = start.getDownLink( paper_link, 'libgen' );
                    if ( libgenUrl.trim().length > 0 ) {
                        start.addDownIco( libgenUrl, link[i], libgen_ico );
                    }
                    //add unpaywall Url and ico
                    var unpaywallUrl = start.getDownLink( paper_link, 'unpaywall' );
                    if ( unpaywallUrl.trim().length > 0 ) {
                        start.addDownIco( unpaywallUrl, link[i], unpaywall_ico );
                    }

                    // 检查原始链接是否可以直接下载
                    if (/^https?:\/\/(\w+\.)?biomedcentral\.com\/(track|content)\/pdf\/[^#]+$/i.test( paper_link ) ||
                        /^https?:\/\/(\w+\.)?bmj\.com\/(track|content)\/[^#]+\.full\.pdf$/i.test( paper_link ) ||
                        /^https?:\/\/(\w+\.)?cnki\.net\/[^#]+\.pdf$/i.test( paper_link ) ||
                        /^https?:\/\/patentimages\.storage\.googleapis\.com\/[^#]+\.pdf$/i.test( paper_link ) ||
                        /^https?:\/\/\w+\.asm\.org\/content\/[^#]+\.full-text\.pdf$/i.test( paper_link ) ||
                        /^https?:\/\/media\.nature\.com\/original\/[^#]+\.pdf$/i.test( paper_link )
                    ) {
                        start.addDownIco(paper_link, link[i], pdf_ico);
                    }
                    else if (/^https?:\/\/(dx\.)?doi\.org\/10/i.test( paper_link )) {
                        var paper_id = /.org\/([^&#]+)/i.exec( paper_link )[1];
                        if (/^https?:\/\/(dx\.)?doi\.org\/10\.1371/i.test( paper_link )) {
                            start.addDownIco("http://journals.plos.org/plosone/article/file?id=" + paper_id + "&type=printable", link[i], pdf_ico);
                        } else if (/^https?:\/\/(dx\.)?doi\.org\/10\.1186/i.test( paper_link )) {
                            start.addDownIco("https://www.biomedcentral.com/track/pdf/" + paper_id + ".pdf", link[i], pdf_ico);
                        } else if(/^https?:\/\/(dx\.)?doi\.org\/10\.3389/i.test( paper_link )){
                            start.addDownIco("https://www.frontiersin.org/articles/" + paper_id + "/epub", link[i], epub_ico);
                            start.addDownIco("https://www.frontiersin.org/articles/" + paper_id + "/pdf", link[i], pdf_ico);
                        } else if(/^https?:\/\/(dx\.)?doi\.org\/10\.1038\/s/i.test( paper_link )){
                            start.addDownIco("https://www.nature.com/articles/" + paper_id.replace("10.1038/","").replace(".pdf","") + ".pdf", link[i], pdf_ico);
                        }
                    }

                    // 开放获取期刊提供直接下载链接
                    else if (/^https?:\/\/(\w+\.)?biomedcentral\.com\/\d+-\d+\/\d+\/\d+(\/abstract)?(\?fmt_view=\w+)?$/i.test( paper_link )) {
                        paper_id = /com\/([\/-\d+]+\d)/i.exec( paper_link )[1];
                        paper_id = paper_id.replace(/\//g, "-");
                        start.addDownIco("https://www.biomedcentral.com/track/pdf/10.1186/" + paper_id + ".pdf", link[i], pdf_ico);
                    }
                    else if (/^https?:\/\/(\w+\.)?biomedcentral\.com\/articles\/[^#]+$/i.test( paper_link )) {

                        paper_id = /articles\/([^&]+)$/i.exec( paper_link )[1];
                        start.addDownIco("https://www.biomedcentral.com/track/pdf/" + paper_id + ".pdf", link[i], pdf_ico);
                    }
                    else if (/^https?:\/\/(\w+\.)?plos\.org\/\w+\/article\?id=[^#]+$/i.test( paper_link )) {

                        paper_id = /article\?id=([^&]+)/i.exec( paper_link )[1];
                        start.addDownIco( paper_link.replace("article?id=", "article/file?id=") + "&type=printable", link[i], pdf_ico);
                    }
                    else if (/\.plosjournals\.org\/plosonline\/\?request=get-document&doi=/i.test( paper_link )) {

                        paper_id = /doi=([^&]+)/i.exec( paper_link )[1];
                        start.addDownIco("http://journals.plos.org/plosone/article/file?id=" + paper_id + "&type=printable", link[i], pdf_ico);
                    }
                    else if (/^https?:\/\/(\w+\.)?frontiersin\.org\/articles\/[^#]*?(\/)?(full|pdf|epub|abstract)?$/i.test( paper_link )) {

                        paper_id = /articles\/([^#]*?)(\/)?(full|pdf|epub|abstract)?$/i.exec( paper_link )[1];
                        start.addDownIco("https://www.frontiersin.org/articles/" + paper_id + "/pdf", link[i], pdf_ico);
                        start.addDownIco("https://www.frontiersin.org/articles/" + paper_id + "/epub", link[i], epub_ico);
                    }
                    else if (/^https?:\/\/(www\.)?aasv\.org\/shap\/issues\/(v\d\d?n\d)\/\2p\d+\.html/i.test( paper_link )) {

                        start.addDownIco( paper_link.replace(".html", ".pdf"), link[i], pdf_ico);
                    }
                    else if (/^https?:\/\/(www\.)?mdpi\.com\/\d+-\d+\/\d+\/\d+\/\d+\/htm$/i.test( paper_link )) {

                        start.addDownIco( paper_link.replace("/htm", "/pdf"), link[i], pdf_ico);
                    }
                    else if (/^https?:\/\/(www\.)?nature\.com\/articles\/srep\d+(\.pdf)?(\?origin=\w+)?$/i.test( paper_link )||
                            /^https?:\/\/(www\.)?nature\.com\/articles\/s41586-\d+-\d+-\w$/i.test( paper_link )||
                            /^https?:\/\/(www\.)?nature\.com\/articles\/s41598-\d+-\d+-\w$/i.test( paper_link )||
                            /^https?:\/\/(www\.)?nature\.com\/articles\/d41586-\d+-\d+-\w$/i.test( paper_link )||
                            /^https?:\/\/(www\.)?nature\.com\/articles\/s41591-\d+-\d+-\w$/i.test( paper_link )) {

                        start.addDownIco( paper_link.replace(".pdf","") + ".pdf", link[i], pdf_ico);
                    }
                    else if (/^https?:\/\/(www\.)?biorxiv\.org\/content\/.*(\d|(\.(abstract|pdf)))+$/i.test( paper_link )) {

                        start.addDownIco( paper_link.replace(/(\.[\w-]+)+$/i,"")+".full.pdf", link[i], pdf_ico);
                    }
                    else if (/^https?:\/\/(www\.)?arxiv\.org\/(abs|pdf)\/([\w-]+\/)?[\d\.]+(\.pdf.*)?$/i.test( paper_link )) {

                        start.addDownIco( paper_link.replace("/abs/","/pdf/"), link[i], pdf_ico);
                    }
                    else if(/^https?:\/\/\w+\.asm\.org\/content\/\d+\/\d+\/e\d+-\d+(\?.*)?$/i.test( paper_link )){

                        start.addDownIco( paper_link.replace(/^(https?:\/\/(\w{1,4})\w*\.asm\.org\/content\/)(\d+\/\d+\/e\d+-\d+)/i,"$1$2/$3")+".full-text.pdf", link[i], pdf_ico);
                    }
                    else if (/^https?:\/\/journals\.aps\.org\/\w+\/abstract\/10\.\d+\//i.test( paper_link )) {

                        var paper = /org\/(\w+)\/abstract/i.exec( paper_link )[1];
                        paper_id = /10\.\d+\/.*/i.exec( paper_link )[0];
                        start.addDownIco("https://journals.aps.org/"+paper+"/pdf/" + paper_id , link[i], pdf_ico);
                    }
                    else if (/\/ch\/reader\/view_abstract\.aspx\?/i.test( paper_link )) {
                        start.addDownIco( paper_link.replace("view_abstract","create_pdf"), link[i], pdf_ico);
                    }
                }
            }
        },

        addDownIco( sciHubUrl, documentId, ico ) {
            sciHubLink = document.createElement('a');
            sciHubLink.href = sciHubUrl;
            if( base.getValue('setting_open_type') == 2 ){ sciHubLink.target = "_blank"; }
            documentId.parentNode.insertBefore(sciHubLink, documentId.nextSibling);
            sciHubLinkIMG = document.createElement('img');
            sciHubLinkIMG.setAttribute("id", "imgCheck");
            sciHubLinkIMG.setAttribute("src", ico );
            sciHubLinkIMG.setAttribute("style", "height: 16px !important;width: 16px !important; margin-left: 3px !important; display: inline-block;");
            sciHubLink.appendChild(sciHubLinkIMG);
        },

        getSciHubLink( paper_link ) {
            var link_type;
            var SciHub_url = base.getValue( 'setting_scihub_json' )[ base.getValue('setting_scihub_url') ] + '/';
            var Pubmed_url = "https://pubmed.ncbi.nlm.nih.gov/";
            // 适配doi链接
            if (/^https?:\/\/(dx\.)?doi\.org\/10/i.test( paper_link )||
                /^https?:\/\/doi\.ieeecomputersociety\.org\//i.test( paper_link )) {
                paper_id = /.org\/([^&]+)/i.exec( paper_link )[1];
                return SciHub_url + paper_id;
            }
            // 网址包含 pubmed
            else if (/^https?:\/\/(\w+\.)?biomedcentral\.com\/pubmed\/\d+$/i.test( paper_link )) {
                paper_id = /\/pubmed\/(\d+)/i.exec( paper_link )[1];
                return SciHub_url + Pubmed_url + paper_id;
            } else if (/^https?:\/\/(www\.)?pnas\.org\/lookup\/external-ref\?/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?bmj\.com\/(lookup\/)?external-ref\?/i.test( paper_link ) ||
                       /^https?:\/\/([-\w]+\.)?oxfordjournals\.org\/(lookup\/)?external-ref\?/i.test( paper_link )) {
                paper_id = /access_num=([^&]+)/i.exec( paper_link )[1];
                link_type = /link_type=([^&]+)/i.exec( paper_link )[1];
                if (link_type == "MED") {
                    return SciHub_url + Pubmed_url + paper_id;
                } else {
                    return SciHub_url + paper_id;
                }
            } else if (/^https?:\/\/(\w+\.)?wiley\.com\/resolve\/reference\/\w+\?id=/i.test( paper_link )) {
                paper_id = /\?id=([^&]+)/i.exec( paper_link )[1];
                link_type = /reference\/([^&]+)\?id=/i.exec( paper_link )[1];
                if (link_type == "PMED") {
                    return SciHub_url + Pubmed_url + paper_id;
                } else {
                    return SciHub_url + paper_id;
                }
            }
            // 网址包含doi
            else if (/\/doi(\/abs|full|pdf|ref)?\/([^#&]+)$/i.test( paper_link )) {
                paper_id = /doi(\/abs|full|pdf|ref)?\/([^#&\?]+)/i.exec( paper_link )[2];
                return SciHub_url + paper_id;
            } else if (/\/servlet\/linkout\?suffix=/i.test( paper_link )) {
                paper_id = /doi=([^&]+)/i.exec( paper_link )[1];
                return SciHub_url + paper_id;
            } else if (/^https?:\/\/www\.springerlink\.com\/content\/fulltext\.pdf\?id=doi:/i.test( paper_link )) {
                paper_id = /doi:([^&]+)/i.exec( paper_link )[1];
                return SciHub_url + paper_id;
            } else if (/^https:\/\/doi\.org\/openurl\?/i.test( paper_link )) {
                paper_id = /rft_id=info:doi\/([^&]+)/i.exec( paper_link )[1];
                return SciHub_url + paper_id;
            } else if (/^https:\/\/journals\.aps\.org\/\w+\/abstract\//i.test( paper_link )) {
                paper_id = /(10\..*)$/i.exec( paper_link )[0];
                return SciHub_url + paper_id;
            }
            // 网址包含pmid
            else if (/^https?:\/\/(\w+\.)?ncbi\.nlm\.nih\.gov\/pmc\/articles\/pmid\/\d+\/?$/i.test( paper_link )) {
                paper_id = /pmid\/(\d+)/i.exec( paper_link )[1];
                return SciHub_url + Pubmed_url + paper_id;
            } else if (/^https?:\/\/(pubmed\.)?ncbi\.nlm\.nih\.gov\/\d+([?\/][^#]+)?/i.test( paper_link )) {
                paper_id = /ncbi\.nlm\.nih\.gov\/(\d+)/i.exec( paper_link )[1];
                return SciHub_url + Pubmed_url + paper_id;
            } else if (/^https?:\/\/(\w+\.)?pubmed\.com\//i.test( paper_link )) {
                paper_id = /pubmed\.com\/(\d+)/i.exec( paper_link )[1];
                return SciHub_url + Pubmed_url + paper_id;
            } else if (/^https?:\/\/(\w+\.)?europepmc\.org\/abstract\/med\/\d+/i.test( paper_link )) {
                paper_id = /med\/(\d+)/i.exec( paper_link )[1];
                return SciHub_url + Pubmed_url + paper_id;
            } else if (/^https?:\/\/(\w+\.)?sciencemag\.org\/cgi\/pmidlookup\?/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?bmj\.com\/cgi\/pmidlookup\?/i.test( paper_link )) {
                paper_id = /pmid=([^&]+)/i.exec( paper_link )[1];
                return SciHub_url + Pubmed_url + paper_id;
            } else if (/^https?:\/\/med\.wanfangdata\.com\.cn\/Paper\/Detail\/PeriodicalPaper_PM\d+$/i.test( paper_link )) {
                paper_id = /PeriodicalPaper_PM([^&#]+)/i.exec( paper_link )[1];
                return SciHub_url + Pubmed_url + paper_id;
            } else if (/^https?:\/\/(\w+\.)?ncbi\.nlm\.nih\.gov\/[\w\.\/]+\?cmd=Retrieve[^#]+$/i.test( paper_link )) {
                paper_id = /list_uids=([^&]+)/i.exec( paper_link )[1];
                return SciHub_url + Pubmed_url + paper_id;
            } else if (/^https?:\/\/(\w+\.)?pubmed.cn\/\d+$/i.test( paper_link )) {
                paper_id = /\/(\d+)/i.exec( paper_link )[1];
                return SciHub_url + Pubmed_url + paper_id;
            }
            // 网址包含PMCid
            else if (/^https?:\/\/(www\.)?ncbi\.nlm\.nih\.gov\/pmc\/articles\/PMC\d+\/?$/i.test( paper_link ) ||
                     /^https?:\/\/(www\.)?europepmc\.org\/(articles|abstract)\/PMC\d+\/?$/i.test( paper_link ) ||
                     /^https?:\/\/(www\.)?pubmedcentralcanada\.ca\/pmcc\/articles\/PMC\d+\/?$/i.test( paper_link ) ||
                     /^https?:\/\/(www\.)?pubmedcentralcanada\.ca\/articlerender\.cgi\?accid=PMC[^#]+$/i.test( paper_link )) {
                paper_id = /(PMC\d+)/i.exec( paper_link )[1];
                return SciHub_url + "https://www.ncbi.nlm.nih.gov/pmc/articles/" + paper_id;
            } else if (/^https?:\/\/(\w+\.)?pubmedcentral\.nih\.gov\/picrender\.fcgi\?/i.test( paper_link )) {
                paper_id = /artid=([^&]+)/i.exec( paper_link )[1];
                return SciHub_url + "https://www.ncbi.nlm.nih.gov/pmc/articles/" + paper_id;
            } else if (/^https?:\/\/(www\.)?ajas\.info\/journal\/view.php\?number=\d+$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?bmj\.com\/content\/.*\d((\.short)|(\?.*))$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?cabdirect\.org\/[^#]+.html$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?cambridge\.org\/(article|abstract)[^#]+$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?cambridge\.org\/core\/journals\/[^#]+$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?europepmc\.org\/abstract\/[^#\?]+$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?ieee\.org\/xpls\/abs_all\.jsp\?arnumber=\d+\/?$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?ieee\.org\/document\/\d+\/?$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?ieee\.org\/abstract\/document\/\d+\/?$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?jstor\.org\/stable\/[^#]+$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?nature\.com\/\w+\/journal\/[^#]+[^(index)].html$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?nature\.com\/articles\/[\w\.-]+(\.pdf)?(\?origin=\w+)?\/?$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?onlinelibrary\.wiley\.com\/doi\/[^#]+$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?pnas\.org\/content\/\d+\/\d+\/\w+\d+(\.full)?\/?$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?pnas\.org\/content\/(early\/)?\d+\/\d+\/\d+\/?\d+?(\.short)?$/i.test("") ||
                       /^https?:\/\/(\w+\.)?sciencedirect\.com\/science\/article\/[^#]+$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?sciencemag\.org\/content\/\d+\/\d+\/\w+\d+\/?$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?springer\.com\/(article|chapter|content|book)\/[^#]+$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?springer\.com\/10\.[^#]+$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?thelancet\.com\/journals\/\w+\/article.*\/fulltext\/?$/i.test( paper_link ) ||
                       /^https?:\/\/(\w+\.)?wiley\.com\/doi\/[^#]+$/i.test( paper_link ) ||
                       /^https?:\/\/(www\.)?ncbi\.nlm\.nih\.gov\/pubmed\/\d+([?\/][^#]+)?$/i.test( paper_link ) ||
                       /^https?:\/\/dl\.acm\.org\/citation\.cfm\?id=[^#]+$/i.test( paper_link )) {
                return SciHub_url + paper_link;
            } else if (/^https?:\/\/(\w+\.)?cell\.com\/\w+\/(abstract|fulltext|retrieve|pdf)\/[^#]+$/i.test( paper_link )) {
                return SciHub_url + paper_link.replace(".pdf","").replace("pdf","fulltext");
            }
            return "";
        },

        getDownLink( paper_link, dl_type ) {
            var down_url;
            switch ( dl_type ) {
                case 'libgen':
                    down_url = base.getValue( 'setting_libgen_json' )[ base.getValue('setting_libgen_url') ] + '/ads.php?doi='; break;
                case 'unpaywall':
                    down_url = unpaywall_url; break;
            }
            // 适配doi链接
            if (/^https?:\/\/(dx\.)?doi\.org\/10/i.test( paper_link )||
                /^https?:\/\/doi\.ieeecomputersociety\.org\//i.test( paper_link )) {
                paper_id = /.org\/([^&]+)/i.exec( paper_link )[1];
                return down_url + paper_id;
            }
            // 网址包含doi
            else if (/\/doi\/(abs|full|pdf|ref)\/([^#&]+)$/i.test( paper_link )) {
                paper_id = /doi\/(abs|full|pdf|ref)\/([^#&\?]+)/i.exec( paper_link )[2];
                return down_url + paper_id;
            } else if (/\/servlet\/linkout\?suffix=/i.test( paper_link )) {
                paper_id = /doi=([^&]+)/i.exec( paper_link )[1];
                return down_url + paper_id;
            } else if (/^https?:\/\/www\.springerlink\.com\/content\/fulltext\.pdf\?id=doi:/i.test( paper_link )) {
                paper_id = /doi:([^&]+)/i.exec( paper_link )[1];
                return down_url + paper_id;
            } else if (/^https:\/\/doi\.org\/openurl\?/i.test( paper_link )) {
                paper_id = /rft_id=info:doi\/([^&]+)/i.exec( paper_link )[1];
                return down_url + paper_id;
            } else if (/^https:\/\/journals\.aps\.org\/\w+\/abstract\//i.test( paper_link )) {
                paper_id = /(10\..*)$/i.exec( paper_link )[0];
                return down_url + paper_id;
            }
            return "";
        },
        async initSciHub() {
            base.getSciHubURL();
            base.initDefaultConfig();
            base.addinitSciHubStyle();
            base.registerMenuCommand();
        }
    };

    let main = {
        init() {
            start.initSciHub();
            window.addEventListener('load', start.addFloatDown);
            window.addEventListener('load', start.addLinkByDOI);
            window.addEventListener('load', start.linkClickable);
            window.addEventListener('load', start.addDownURL);
        }
    };
    main.init();
})();