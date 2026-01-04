// ==UserScript==
// @name        百度统计自动登录
// @namespace   http://www.dfer.site
// @version     1.0.6
// @description 百度统计一键自动登录
// @author      dfer
// @license     Copyright Dfer.Site
// @supportURL  df_business@qq.com
// @match       http://tongji.baidu.com/*
// @match       https://tongji.baidu.com/*
// @exclude     http://tongji.baidu.com/main/*
// @exclude     https://tongji.baidu.com/main/*
// @icon        data:image/x-icon;base64,AAABAAUAICAAAAEAIAAoEQAAVgAAACAgAAABACAAKBEAAH4RAAAgIAAAAQAgACgRAACmIgAAICAAAAEAIAAoEQAAzjMAABAQAAABACAAaAQAAPZEAAAoAAAAIAAAAEAAAAABACAAAAAAAAAAAAATCwAAEwsAAAAAAAAAAAAAAAAAAP+AAAIAAAAAAAAAAPaJGDbyihmH8Y0Xye2IC//tiQz/7IsL/+uMC//rjQr/6o8K/+qQCf/pkgn/6JMI/+iUB//nlgn/5pcI/+aZB//lmgf/5JsG/+SdBv/jngb/458E/+alDsnlphGH56oONgAAAAAAAAAA/4AAAgAAAAD/gAACAAAAAOqAFQz1hhCc84cP//+ODf/3iw3/7YgM/+2JC//siwv/64wL/+uNCv/qjwr/6pAJ/+mSCf/okwj/6JQH/+eWCf/mlwj/5pkH/+WaB//kmwb/5J0G/+OeBf/joAX/6qcE//GtA//lpgT/5agFnNWVFQwAAAAA/4AAAgAAAADoixcL9YUQxP+OD//vhQ3+7oUN++6GDf3tiAz/7YkL/+yLC//rjAv/640K/+qPCv/qkAn/6ZIJ/+iTCP/olAf/55YJ/+aXCP/mmQf/5ZoH/+SbBv/knQb/454G/+OgBf/ioQT94qME++GkAv7zswL/4qkExOiiAAsAAAAAAAAAAPSCEJ3/jQ//74MO+e+FDf7vhQ3/7ocN/+2IDP/tiQz/7IsN/+uMDf/rjgz/6o8M/+qQC//pkgv/6JMK/+iVCf/nlgv/5pgL/+aZCf/lmgn/5JwI/+SdCP/jngb/46AF/+KhBP/hogT/4aQC/uClAvnztAL/4qkFnQAAAAD2hBg29IMQ//CCDv7whA7+74QN/+6FDf/uhgz/7YkR/+2MI//sjSP/7I4h/+uPIf/qkSH/6pIh/+mTIf/plSD/6JYg/+eYIf/nmSH/5pog/+WbIP/lnR//5J4h/+OgIP/joAv/4qED/+GiBP/hpAL/4aYC/uCmAv7jqQT/46oJNvSEGYf/iQ//8IEO+++DDv/vhA3/7oUK/+6IFf/thwn/7H0A/+uAAP/qggD/6oQA/+mGAP/phwD/6IgA/+eLAP/njAD/5o0A/+WPAP/lkQD/5JIA/+OUAP/ilQD/4ZYA/+OfAv/iog//4aIB/+GkA//gpQL/4KYC+++zA//hrA+H9YQYyfmFDv/wgg7974MO/++EDP/vhhX/7YMA/+6LAP/1xqP/+N3J//jcx//43cf/+N3H//jdx//43sf/997H//ffx//338f/99/H//fgx//24Mf/9uDH//biyf/wz6L/5KIA/+GfAP/iow7/4aQC/+ClAv/gpQP96K0C/+OtCsnxfw7/8IAP//CCDv/vgw7/74UR/+6FFP/uhwD/+uLO///////////////////////////////////////////////////////////////////////////////////////3587/4qEA/+GiDf/hpAf/4KUC/+CmA//fpwP/36gA//F/D//wgA7/8IIO/++DDv/vhyD/7XsA//S2iP////////////758//53sj/+NvD//jcxP/33MT/99zE//fdw//33cP/9t3D//bew//238P/9t7C//fiyP/++vP////////////sxIf/4JsA/+GlG//gpQL/4KYD/9+nA//fqAD/8X8P//CADv/wgg7/74MO/++HJv/tdwD/9seq/////////fr/8rWB/+p8AP/qhQD/6YUA/+mHAP/oiAD/54wA/+eOAP/mjgD/5Y8A/+WSAP/kkwD/4pAA/+zAgf/+/fr///////DSqv/fmQD/4aYi/+ClAv/gpgP/36cD/9+oAP/xfw//8IAO//CCDv/vgw7/74cl/+13AP/2xqf///////zu4v/sigD/64wf/+uQJv/qkSP/6pIi/+mUKP/ojwD/5osA/+eVE//nmy//5psi/+WcJf/kmx7/5J0A//vx4f//////8NGn/9+ZAP/hpiH/4KUC/+CmA//fpwP/36gA//F/D//wgA7/8IIO/++DDv/vhyX/7XcA//bGp////////Ozf/+2QIP/rjBX/644Q/+qPDP/qkRj/6I0A/+61ev/007H/6qNA/+WNAP/mmyL/5ZsZ/+SbBv/loAD/+u/d///////w0af/35kA/+GmIf/gpQL/4KYD/9+nA//fqAD/8X8P//CADv/wgg7/74MO/++HJf/teAD/9sWm///////87d//7IQA/+uHAP/rkSb/6pAT/+qQEf/pkAD/++3d///////89er/78GK/+WSAP/klwD/5Z0i/+WgAP/88+T///////DQpf/fmQD/4aYh/+ClAv/gpgP/36cD/9+oAP/xfw//8IAO//CCDv/vgw7/74cm/+13AP/2ya7///////769//30bP/7ZYr/+mCAP/qjxb/6pId/+qVEf/88OT/////////////////9t/E/+ilN//jkwD/5JwA/+/Lmf////v/8dWw/9+YAP/hpiP/4KUC/+CmA//fpwP/36gA//F/D//wgA7/8IIO/++DDv/vhyH/7nsA//S4jv////v////////////99Or/9Mad/+uRAP/ohQD/6pUd//zw5P////////36/////////////fXr/+7Di//ilgD/4JEA/+q7cP/rwHz/4J0A/+GlFP/gpQL/4KYD/9+nA//fqAD/8X8P//CADv/wgg7/74MO/++EDf/vhhf/7oMA//Gpbf/649H/////////////////++7g//G7iP/pkQD/++/i///////01K//9de3//////////////////bhxP/mqj//4JIA/+GdAP/ioxH/4aMA/+ClAv/gpgP/36cD/9+oAP/xfw//8IAO//CCDv/vgw7/74QL/++GFP/uhQD/63QA/+yCAP/yuIf//O3f//////////////////nn0v/99u7///////LJnv/khQD/78GJ//z06P////////////336//txov/4qAA/+GjEP/hpAT/4KUC/+CmA//fpwP/36gA//F/D//wgA7/8IIO/++DDv/vhh7/7nsA//S6kP/1xaD/7YcA/+t/AP/sjwD/9Meg//317P/////////////+/v//////8syi/+WPAP/lkgD/56Ir//Xdvv////3////////////tyZX/4JoA/+GlHv/gpQL/4KYD/9+nA//fqAD/8X8P//CADv/wgg7/74MO/++HJ//tdgD/9smu///////428L/7IwA/+uLGf/pggD/7Js4//bVtv/++/X////////////yzKP/5Y0A/+edMP/klwD/45IA/+3Chv/9+fL///////DTrP/fmQD/4aYi/+ClAv/gpgP/36cD/9+oAP/xfw//8IAO//CCDv/vgw7/74cl/+14AP/2xab///////zw5P/tjgT/64sL/+uRJv/qjAD/6IUA/+2pXf/44cv/+/Dh/+yvZ//mkgD/5poW/+WbF//knB7/5JkA//rv3f//////8NCm/9+ZAP/hpiH/4KUC/+CmA//fpwP/36gA//F/D//wgA7/8IIO/++DDv/vhyX/7XcA//bGp///////++ve/+2OCf/rjBH/644T/+qRGP/qkyb/6IsA/+iPAP/plwD/55IA/+eYFv/mmQv/5ZsS/+SbD//lohj/++/f///////w0af/35kA/+GmIf/gpQL/4KYD/9+nA//fqAD/8X8P//CADv/wgg7/74MO/++HJv/tdwD/9sao///////88OT/7IoA/+uIAP/rjRT/6o4M/+qPC//pkhv/6JMc/+eTC//nlhb/5pcJ/+aYCv/lmhL/5JkA/+SdAP/78uP///////DRqP/fmQD/4aYi/+ClAv/gpgP/36cD/9+oAP/xfw//8IAO//CCDv/vgw7/74cl/+13AP/2xqf////////+/f/0w53/7IoA/+uQAP/rkQD/6pIA/+mTAP/plQD/6JcA/+iXAP/nmQD/55sA/+acAP/lmgD/8MqY///+/P//////8NGn/9+ZAP/hpiH/4KUC/+CmA//fpwP/36gA//F/D//wgA7/8IIO/++DDv/vhhz/7n0A//Krc/////7////////+/f/87+L/++zc//vt3f/77N3/++zd//vt3f/77d3/++3d//vt3f/67t3/+u7c//vw4f///vz//////////v/qvHH/4J0A/+GlF//gpQL/4KYD/9+nA//fqAD/8X8O//CAD//wgg7/74MO/++FDv/vhxz/7YAA//fOr/////7///////////////////////////////////////////////////////////////////////////////7/8tav/+GcAP/ioxf/4aQE/+ClAv/gpgP/36cD/9+oAP/1hBjJ+YUO//CCDv3vgw7/74QN/++GD//uhhD/7IEA//Gscf/1yKf/9cio//TJp//zyaf/88qn//PKp//zy6f/88yn//LMp//yzaf/8s6n//HOp//xzqj/8c+m/+q6cP/imwD/4qEI/+GjBv/hpAL/4KUC/+ClA/3orQL/460JyfSEGYf/iQ//8IEO+++DDv/vhA3/7oUM/+6HD//tiRz/7IEA/+t+AP/qfwD/6YEA/+mCAP/ohAD/6IUA/+eHAP/miQD/5YsA/+WNAP/kjgD/448A/+KRAP/ikwD/4pgA/+OgGP/ioQf/4aID/+GkA//gpQL/4KYC+++zA//hrA+H9oQYNvSDEP/wgg7+8IQO/u+E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Av/gpgP+5KoB/+GqCuPygA7/8IEO//CCDv/vgw7/74UU/+6EAP/vjSL//O7i///////////////////////////////////////////////////////////////////////////////////////68eL/46Yd/+GhAP/hpAz/4KUC/+CmAv/fpwP/36gA//GAD//wgQ7/8IIO/++DDv/vhyX/7XgA//XCof////////7///748v/42sP/99e9//bYvv/22L7/9ti9//bZvf/22b3/9tm9//Xavf/12r7/9Nq9//Xewv/9+fL////////////vzqD/35kA/+GlIf/gpQL/4KYD/9+nA//epwD/8YAP//CBDv/wgg7/74MN/++HKP/tdgD/99G7///////++/j/8Ktv/+p6AP/qgwD/6YMA/+iFAP/nhgD/54oA/+eNAP/mjQD/5Y0A/+SPAP/kkgD/4o0A/+q3bv/+/Pj///////LZuv/fmAD/4qYk/+ClAf/gpgP/36cD/9+oAP/xgA//8IEO//CCDv/vgw3/74co/+12AP/3z7j///////vr3v/rhQD/7I8u/+uQJv/qkSX/6pMk/+mUKv/ojwD/5ooA/+eVCf/nnDT/5psk/+acJf/lni3/45kA//nu3v//////8ti4/9+YAP/ipiT/4KUB/+CmA//fpwP/36gA//GAD//wgQ7/8IIO/++DDf/vhyj/7XYA//fPuf//////++rd/+yMAP/sjR//640K/+qPCv/qkRn/6IwA/++5hP/12L3/6qZN/+SMAP/mmyP/5pwY/+WbFf/knAD/+e3b///////y2Lj/35gA/+KmJP/gpQH/4KYD/9+nA//fqAD/8YAP//CBDv/wgg7/74MN/++HJ//tdgD/98+3///////76t3/630A/+uJAP/rkSf/6pAQ/+qQFv/pjwD//PHn///////9+PH/8MWX/+WSAP/klwD/5Z4u/+SbAP/78eP///////HXtv/fmAD/4qYk/+ClAf/gpgP/36cD/9+oAP/xgA//8IEO//CCDv/vgw3/74go/+11AP/307////////769//30rb/7ZQq/+mBAP/qjxj/6pIi/+mTAP/88un/////////////////+OXP/+inRf/jkgD/45sA/+7Hkv////7/893B/9+XAP/ipiX/4KUB/+CmA//fpwP/36gA//GAD//wgQ7/8IIO/++DDv/vhyP/7XoA//XBoP/////////////////99e7/9Mah/+qPAP/ohQD/6ZQW//zy6f////////37/////////////fny/+/Il//jlwD/4JAA/+m2av/rw4f/4J0A/+GkFf/gpQL/4KYD/9+nA//fqAD/8YAP//CBDv/wgg7/74MO/++EDf/uhhj/7oMA//KteP/76Nr//////////////////O/k//G7jP/pjgD/+/Dm///////01bH/9di6//////////////////flz//nrU3/4JIA/+GcAP/ioxP/4aMA/+ClAv/gpgL/36cD/9+oAP/xgA//8IEO//CCDv/vgw7/74QK/+6GFv/uhAD/63MA/+yEAP/zvZP//PHn//////////////////nn1v/99vD///////LLo//jggD/7sCL//z16/////////////368//uypj/4qAA/+KiEP/hpAX/4KUC/+CmAv/fpwP/36gA//GAD//wgQ7/8IIO/++DDf/vhh//7XsA//XBn//1wZ3/7IMA/+t/AP/sjwD/9cyr//758v/////////////+/f//////8sym/+WPAP/lkgD/56Eh//Xdwv/////////////////v0Kb/4JoA/+GlIf/gpQL/4KYD/9+nA//fqAD/8YAP//CBDv/wgg7/74MN/++IKf/tdQD/99O////////42MD/7IkA/+uMHf/pgAD/7J1E//fZwf///vv////////////zzqj/5YwA/+eeM//lmAD/45EA/+3AhP/9+fL///////Lavf/fmAD/4qYl/+ClAf/gpgP/36cD/9+oAP/xgA//8IEO//CCDv/vgw3/74cn/+12AP/3zrf///////zu4//siQD/640d/+uRKP/piwD/6IQA/+2saP/55tT//fXs/+yycf/lkQD/5poZ/+WbE//lnSv/4pUA//ns2v//////8ti3/9+YAP/ipiT/4KUB/+CmA//fpwP/36gA//GAD//wgQ7/8IIO/++DDf/vhyj/7XYA//fPuP//////++nc/+yKAP/rjRz/644L/+qQF//qkyf/6IoA/+iOAP/omAD/5pIA/+eYFP/mmQf/5ZsK/+WcGf/kngD/+e7d///////y2Lj/35gA/+KmJP/gpQH/4KYD/9+nA//fqAD/8YAP//CBDv/wgg7/74MN/++HKP/tdgD/98+5///////77OD/64QA/+uMIP/rjh7/6pAb/+qRGv/plCf/6JQn/+eUG//nlyP/5pgZ/+aZG//lmxz/5Jsh/+OYAP/679////////LYuP/fmAD/4qYk/+ClAf/gpgP/36cD/9+oAP/xgA//8IEO//CCDv/vgw3/74go/+12AP/30Ln////////9+//zu5D/64QA/+uLAP/qjAD/6Y0A/+mOAP/okAD/55IA/+eTAP/mlQD/5pYA/+WZAP/jlQD/7cKK//79+v//////8tm5/9+YAP/ipiT/4KUB/+CmA//fpwP/36gA//GAD//wgQ7/8IIO/++DDv/vhyL/7XoA//S4jv/////////////9+//769//+unb//rq3P/66tz/+urc//rr3P/669z/+uvc//rr3P/67Nz/+evb//rt3v/+/fr////////////sxY3/4JoA/+GlHv/gpQL/4KYD/9+nA//epwD/8oAO//CBDv/wgg7/74MO/++ED//uhhr/7oMA//nbx///////////////////////////////////////////////////////////////////////////////////////9uHG/+KeAP/iohX/4aQF/+ClAv/gpgL/36cD/9+oAP/zghXj9oMN//CCDv7vgw7/74QM/+6GE//uhQD/7YQA//O4jP/20bn/9tG5//XRuP/10rj/9dK4//XTuP/007j/9NS4//TUuP/01bj/89W4//PVuP/z1rj/89e4/+3DjP/inQD/4qAA/+KjC//howL/4KUC/+CmA/7kqgL/4aoJ4/OFG6v/iA7/8IIO+++DDv/vhA3/7oUL/+6HEv/tiRr/634A/+p8AP/qfgD/6YAA/+iCAP/ogwD/54QA/+aGAP/miAD/5YoA/+SMAP/kjgD/448A/+KQAP/ikgD/4ZYA/+OgFv/ioQv/4qIB/+GjA//gpQL/4KYD++2xAf/hqw+r84QXV/+JEP/wgg368IMO/++EDf/uhQ3/7ocM/+2IDv/tjCH/7I4n/+yPJ//rkCf/6pIm/+qTJv/plCb/6ZYm/+iXJv/nmSb/55om/+abJv/mnSX/5Z4l/+SfJf/koB//46AH/+KhBP/iogT/4aMC/+GlAv/fpQL67rIE/+KtCVcAAAAA8oMQyf+KD//whA3474QN/+6FDf/uhw3/7YgM/+2JC//siwv/64wK/+uNCf/qjwn/6pAJ/+mRCP/okwj/6JQH/+eWCP/mlwf/5pkH/+WaBv/lmwX/5J0G/+OeBv/jnwX/4qEE/+KiBP/hpAL/4aUC+O6wAv/iqQXJAAAAAAAAAADwgw8h84QP7P6LDv/vhAz674UN++6HDf7tiAz/7YkL/+yLC//rjAv/640K/+qPCv/qkAn/6ZEI/+iTCP/olAf/55YI/+aXCP/mmQf/5ZoG/+WbBv/knQb/454G/+OgBf/ioQT+4qME++CjAvrurwL/4qcD7OCqCCEAAAAA/6oAAwAAAADwgxch8YUPyf+ND//9jQz/84kM/+2IDP/tiQv/7IsL/+uMC//rjQr/6o8K/+qQCf/pkQj/6JMI/+iUB//nlgj/5pcI/+aZB//lmgb/5ZsG/+SdBv/jngb/458F/+ekA//vrAL/8K8E/+KmBMngqgghAAAAAP+qAAMAAAAA/6oAAwAAAAAAAAAA84oVV/KLGavviRTj7ogL/+2KDP7siwv/64wL/+uNCv/qjwr/6pAJ/+mRCP/okwj/6JQH/+eWCP/mlwj/5pkH/+WaBv/lmwb/5J0G/+SfBv7joAT/5KMM4+SmE6vlpwxXAAAAAAAAAAD/qgADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAIAAAAEAAAAABACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+AAAQAAAAA/79ABPOJFmrwiRi874oU6+6IC//siQz/7IsL/+yMC//rjQr/6o8K/+qQCf/pkQj/6JMI/+iUB//nlgn/5pcI/+aZB//lmgb/5JwG/+SdBv/jngb/46AE/+SjC+vkpRC85aYKav+/QAQAAAAAv78ABAAAAAD/gAAEAAAAAPWHFTHxhA/c/48O//qMDP/yiQz/7YgM/+2JC//siwv/64wL/+uNCv/qjwr/6pAJ/+mRCP/okwj/6JQH/+eWCf/mlwj/5pkH/+WaBv/knAb/5J0G/+OeBv/jnwX/5qMD/+2qAv/ysAP/4qYD3OWsBTEAAAAAv78ABAAAAAD1hxUx8YIP/fqJDv/vhAz57oYN/O6HDf7tiAz/7IkM/+yLC//rjAv/640K/+qPCv/qkAn/6ZEJ/+iTCP/olQf/55YJ/+aXCP/mmQf/5ZoG/+ScBv/knQb/454G/+OfBf/ioQT+4qIE/OGjAvnqrAL/4aYD/eWsBTEAAAAA/79ABPGCENz6hw7/8IMN+e+FDf/uhQ3/7ocN/+2IDP/tiQv/7IsM/+yMDP/rjQv/6o8L/+qQCv/pkQr/6JMJ/+iVCf/nlgr/5pcJ/+aZCf/lmgj/5JwH/+SdB//jngX/458F/+KhBP/hogT/4aQD/+GlAvnqrQL/4agF3P+/AATzhBZq/4sQ//CCDvnwgw7/74QN/+6FDv/uhwr/7YkY/+2MJv/sjB3/7I0b/+uOG//qkBv/6pEb/+mSG//olBr/6JUa/+eXG//nmBr/5poa/+WbGv/lnBn/5J4a/+SgJP/joBT/4qEB/+KiBP/howP/4aUC/+CmAvnxtAT/4qsKavOEGrz9hw3/8IIO/O+DDv/vhA3/7oUI/+6IHP/thAD/630A/+uFAP/rhwD/6ogA/+qKAP/piwD/6IwA/+iOAP/nkAD/5pEA/+aTAP/llQD/5JYA/+SXAP/jmQD/4ZUA/+KcAP/iohj/4aIA/+GjA//gpQL/4KYD/OuvAv/hqw688oIV6/SDDf/wgg7+74MO/++EC//uhxz/7YAA/++ZS//42cP/++vh//vq4P/76uD/+uvg//rr4P/66+D/+uvg//rr4P/67OD/+uzg//ns4P/57OD/+ezg//nt4f/03sL/5qxJ/+GcAP/ioxf/4aMB/+GlAv/gpgP+46kC/+CpCOvygA7/8IEO//CCDv/vgw7/74UW/+6CAP/vkjn//fPq///////////////////////////////////////////////////////////////////////////////////////89er/5Kk2/+GgAP/hpA//4aUC/+CmAv/fpwP/36gA//GAD//wgQ7/8IIO/++DDf/vhyb/7XcA//bIq/////////7///328P/31r7/9tS5//bVuv/21br/9tW5//XWuf/117n/9de5//TXuf/02Lr/9Ni5//Tbvv/89/D///7////////w0qr/35kA/+GlIv/hpQL/4KYC/+CnA//fpwD/8YAP//CBDv/wgg7/74MN/++IKP/tdgD/+NXD///////++vb/76Zk/+p5AP/qggD/6YMA/+iEAP/nhgD/54kA/+aMAP/ljAD/5Y0A/+SPAP/jkQD/4o0A/+mzZP/++/b///////Pdwv/fmAD/4aUk/+GlAf/gpgL/36cD/9+oAP/xgA//8IEO//CCDv/vgw3/74go/+12AP/41MD///////vp3P/rgwD/7JAx/+uQJv/qkib/6pMk/+mVK//ojgD/5osA/+eVAv/nnDT/5psl/+acJP/lnjD/45gA//ns2///////89u//9+YAP/hpST/4aUB/+CmAv/gpwP/36gA//GAD//wgQ7/8IIO/++DDf/viCj/7XYA//jUwP//////++nb/+yKAP/sjiL/640J/+qPCv/qkRr/6IwA/++6iP/22sH/6qdT/+SMAP/mmiL/5ZwZ/+ScGP/kmwD/+evZ///////z28D/35gA/+KlJP/hpQH/4KYC/9+nA//fqAD/8YAP//CBDv/wgg7/74MN/++IKP/tdgD/+NO////////76Nr/6nsA/+uKCP/rkSf/6pAQ/+qQFP/pkAD//PLp///////++vT/8Mic/+WSAP/klgD/5Z8w/+OZAP/68OD///////Lavv/fmQD/4qUk/+GlAf/gpgL/4KcD/9+oAP/xgA//8IEO//CCDv/vgw3/74go/+12AP/42Mf///////769//20bb/7ZQp/+mBAP/qjxn/6pIh/+mUEP/88+z/////////////////+ObT/+ipTP/jkgD/45sA/+3Ejf////3/9ODJ/9+XAP/ipiX/4aUB/+CmAv/gpwP/36gA//GAD//wgQ7/8IIO/++DDf/vhyT/7XoA//bFqP/////////////////99e7/9Mai/+qPAP/ohQD/6ZUf//zz7P////////37/////////////vr0/+/KnP/jmAD/4I8A/+i0Zf/sxIz/4J0A/+GkFf/hpQH/4KYC/+CnA//fqAD/8YAP//CBDv/wgg7/74MO/++EDf/uhhf/7oMA//Kvff/76t3//////////////////O/k//G7jP/pjwD/+/Lp///////01bP/9Ne6//////////////////jn0v/nrlT/4JIA/+GcAP/ioxP/4aMA/+GlAv/gpgL/4KcD/9+oAP/xgA//8IEO//CCDv/vgw7/74QK/+6GF//ugwD/63MA/+yFAP/zvpf//PPq//////////////////no1//99vH///////LMpv/jggD/7r+K//z16/////////////779f/vzJ3/4qAA/+KiDv/howX/4aUC/+CmAv/gpwP/36gA//GAD//wgQ7/8IIO/++DDf/vhh//7XsA//XEpP/0v5r/7IIA/+t+AP/skRL/9c2v//759P/////////////+/f//////8s2o/+WPAP/lkgD/5qAe//Xdwf/////////////////w1K7/4JkA/+GlIf/hpQH/4KYC/+CnA//fqAD/8YAP//CBDv/wgg7/74MN/++IKf/tdQD/+NjH///////31bz/7IgA/+uMHP/pgAD/7J9K//fbxP////z////////////zz6v/5IwA/+eeM//lmAD/4pEA/+y/g//9+PH///////Pexf/fmAD/4qYl/+GlAf/gpgL/4KcD/9+oAP/xgA//8IEO//CCDv/vgw3/74gn/+13AP/407////////vs4P/shgD/7I0g/+uRKP/qiwD/6IQA/+6ubf/559f//ffv/+2zdf/lkQD/5poa/+WbEv/lni3/4pMA//nq2P//////89u//9+YAP/ipST/4aUB/+CmAv/gpwP/36gA//GAD//wgQ7/8IIO/++DDf/viCj/7XYA//jUwP//////+ufZ/+yIAP/sjR7/644J/+qQF//qkyf/6IkA/+iPAP/pmRD/5pIA/+aYFP/mmQb/5ZoJ/+WcG//knAD/+ezb///////z28D/35gA/+KlJP/hpQH/4KYC/9+nA//fqAD/8YAP//CBDv/wgg7/74MN/++IKP/tdgD/+NTA///////76t7/64IA/+yNJ//rjx//6pAe/+qRHf/plCr/6JUo/+eUHP/nmCX/5pgc/+aaHv/lmx7/5Z0n/+OWAP/57dz///////PbwP/fmAD/4qUk/+GlAf/gpgL/4KcD/9+oAP/xgA//8IEO//CCDv/vgw3/74go/+12AP/41cH////////9+v/ytof/6oIA/+uKAP/qigD/6YsA/+iNAP/ojwD/55EA/+aSAP/mkwD/5ZUA/+WXAP/jlAD/7L6B//78+f//////89zB/9+YAP/hpST/4aUB/+CmAv/fpwP/36gA//GAD//wgQ7/8IIO/++DDv/vhyT/7XkA//S+mf////////7///78+v/76dz/+ujZ//ro2v/66dn/+unZ//rp2f/56dn/+enZ//nq2f/56tn/+erZ//nr2//+/Pn////////////typj/4JoA/+GlIP/hpQL/4KYC/+CnA//fpwD/8YAO//CBDv/wgg7/74MO/++FEf/uhRT/7oYA//rh0f//////////////////////////////////////////////////////////////////////////////////////9+bQ/+KgAP/hog7/4aQH/+GlAv/gpgL/36cD/9+oAP/yghXr9IMN//CCDv7vgw7/74QM/+6GFf/uhAD/7YcA//S+mP/31sH/99XA//bWwP/21sD/9tbA//bXwP/118D/9djA//XYwP/12MD/9NnA//TZwP/02sD/9NvA/+7Il//jnwD/4p8A/+KjDv/howL/4aUC/+CmA/7jqQL/4KkH6/OEGrz8hw3/8IIO/O+DDv/vhA3/7oUK/+6IFf/tiBT/630A/+p9AP/qfgD/6YAA/+mCAP/ogwD/54UA/+eHAP/miAD/5YoA/+SMAP/kjgD/448A/+KRAP/ikgD/4ZUA/+OfEP/ioQ//4aIB/+GjA//gpQL/4KYD/OuvAv/hqw6884QWav+LEP/wgg758IMO/++EDf/uhQ3/7ocM/+2JEP/tjCP/7I4n/+yPJ//rkCf/6pIn/+qTJv/plCb/6ZYm/+iXJv/nmSb/55om/+abJv/mnCX/5Z4l/+SfJv/koCH/46AK/+KhA//iogT/4aMD/+GlAv/gpgL58bQE/+KrCmr/v0AE8YIQ3PqHDv/wgw3574UN/+6FDf/uhw3/7YgM/+2JC//siwr/7IwK/+uNCf/qjwn/6pAI/+mRCP/okwf/6JQG/+eWCP/mlwf/5pkH/+WaBf/kmwX/5J0F/+OeBv/jnwX/4qEE/+GiBP/hpAP/4aUC+eqtAv/hqAXc/78ABAAAAAD1hxUx8YIP/fqJDv/vhAz57oYN/O6HDf7tiAz/7IkL/+yLC//rjAv/640K/+qPCv/qkAn/6ZEJ/+iTCP/olQf/55YJ/+aXCP/mmQf/5ZoG/+ScBv/knQb/454G/+OfBf/ioQT+4qIE/OGjAvnqrAL/4aYD/eWsCjEAAAAA/4AABAAAAAD1hxUx8YQP3P+PDv/6jAz/8okM/+2IDP/tiQv/7IsL/+uMC//rjQr/6o8K/+qQCf/pkQj/6JMI/+iUB//nlgn/5pcI/+aZB//lmgb/5JwG/+SdBv/jngb/458F/+ajA//tqgL/8rAD/+KmA9zlrAUxAAAAAL+/AAQAAAAA/4AABAAAAAD/v0AE84kWavCJGLzviRLr7ogL/+yJDP/siwv/7IwL/+uNCv/qjwr/6pAJ/+mRCP/okwj/6JQH/+eWCf/mlwj/5pkH/+WaBv/knAb/5J0G/+OeBv/joAT/46ML6+SlELzlpgxq/79ABAAAAAC/vwAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAIAAAAEAAAAABACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANuSJAfzixhA8I0YiO+JDPXuigv/7IsL/+yMC//rjQr/6o8K/+qQCf/pkgj/6JMI/+iVB//nlgn/5pgI/+aZB//lmgf/5ZwG/+SdBv/knwX/5KIH9eWnEYjnpxBA27YkBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADuhRFL84cPzPKHD//1iw3/7ogM/+2JDP/siwv/7IwL/+uNCv/qjwr/6pAJ/+mSCP/okwj/6JUH/+eWCf/mmAj/5pkH/+WaB//lnAb/5J0G/+OfBf/koAX/6aUG/+WlBv/kqAXM4KcDSwAAAAAAAAAAAAAAAAAAAAAAAAAA8YQQbvKEDfz1hw3/74UN/+6HDf/tiAz/7YkM/+yLC//sjAv/640K/+qPCv/qkAn/6ZII/+iTCP/olQf/55YJ/+aYCP/mmQf/5ZoH/+WcBv/knQb/458F/+OgBf/ioQT/4aID/+aoAf/jpwH84acHbgAAAAAAAAAAAAAAAPGFFUnzgw388oQN/++EDf/vhQ3/7ocN/+2IDP/tiQz/7IsL/+yMC//rjQr/6o8K/+qQCf/pkgj/6JMI/+iVB//nlgn/5pgI/+aZB//lmgf/5ZwG/+SdBv/jnwX/46AF/+KhBP/hogP/4aQC/+KnAv/jqAD84KgHSQAAAAD/nyAI8YEOz/aEDv/wgw7/74QN/++FDf/uhw3/7YgM/+2JDP/siwv/7IwL/+uNCv/qjwr/6pAJ/+mSCP/okwj/6JUH/+eWCf/mmAj/5pkH/+WaB//lnAb/5J0G/+OfBf/joAX/4qEE/+GiA//hpAL/4KUC/+WqA//gqALP358gCPKGGT30ghD/8IIO//CDDv/vhA3/74UN/+6HDf/tiAz/7IUA/+uFAP/rhgD/6ogA/+qKAP/pigD/6IwA/+ePAP/nkQD/5pEA/+aTAP/mlQD/5JYA/+SXAP/jmQD/4p0A/+OgBf/ioQT/4aID/+GkAv/gpQL/4KYC/+KqA//iqxE98IQYifeEEP/wgg7/8IMO/++EDf/vhQ3/7oYK/+2HBP/yq1//9siZ//bMn//2zJ//9syf//XNn//1zp//9M+f//TPn//0z5//89Cf//PRn//z0p//89Of//LRmP/rul7/458A/+KhAv/hogP/4aQC/+ClAv/gpgL/5qwC/+GrD4nwgA/28oAP//CCDv/wgw7/74QN/++FDf/uhQL/9seX///+/f/////////////////////////////////////////////////////////////////////////////+/f/y0pb/4p8A/+GiA//hpAL/4KUC/+CmAv/gqAH/36cE9vJ/D//xgA//8IIO//CDDv/vhA3/74IC//GdRv///fn////////+/f/76tf/+uTK//rly//65cv/+ubL//rmy//65sv/+ubL//nmy//558v/+ebK//rt1////v3///////79+f/nskT/4aEA/+GkAv/gpQL/4KYC/9+nAf/gqQD/8X8P//GAD//wgg7/8IMO/++EDf/ugAD/869s/////////v7/9cOO/+yMBf/rjAL/6o8E/+qQA//pkgL/6JMC/+iVAf/nlgP/5pgC/+aZAv/lmQD/5ZwB//HNjv////7//////+zAa//hnwD/4aQC/+ClAv/gpgL/36cB/9+oAP/xfw//8YAP//CCDv/wgw7/74QN/+6AAP/zr23///////338P/uli3/64kA/+uNCv/qjwb/6pAG/+mSCP/nkQD/55EA/+eUAv/mmAj/5pkF/+WaB//kmQD/5qcs//358P//////7MBs/+GfAP/hpAL/4KUC/+CmAv/fpwH/36gA//F/D//xgA//8IIO//CDDv/vhA3/7oAA//Ovbf///////fbs/+6WLP/rigP/640K/+qPCv/qkAn/6ZAB/+6sUf/yxIT/6qAp/+aUAP/mmQf/5ZoH/+SaAP/mpyr//ffs///////swGz/4Z8A/+GkAv/gpQL/4KYC/9+nAf/fqAD/8X8P//GAD//wgg7/8IMO/++EDf/ugAD/869t///////99uz/7ZMj/+uIAP/rjQr/6o8K/+qQBv/pkgr/+urV///////7793/7rdj/+aXAP/lmAD/5JoA/+anK//9+fH//////+zAbP/hnwD/4aQC/+ClAv/gpgL/36cB/9+oAP/xfw//8YAP//CCDv/wgw7/74QN/+6AAP/zsG/////////9+//3z6X/7pgu/+qJAP/qjgT/6pAG/+qUFP/77t///////////////fz/9dam/+eiJP/jlwD/5J4M//LVn////vz/7cJw/+GfAP/hpAL/4KUC/+CmAv/fpwH/36gA//F/D//xgA//8IIO//CDDv/vhA3/7oEA//KlWP/++vT////////////98+j/9cOK/+uVHv/piwD/6pMS//vu3v////////79////////////+/Dd/+y6Y//jmgD/4psA/+y+Zv/ptk//4aEA/+GkAv/gpQL/4KYC/9+nAf/fqAD/8X8P//GAD//wgg7/8IMO/++EDf/vhQ3/7oYF//GfR//52rn///79/////////////O3b//G5c//qlhj//O7d///////106H/9tqw//////////////78//TXpv/mpiP/4ZoA/+KgAP/hogP/4aQC/+ClAv/gpgL/36cB/9+oAP/xfw//8YAP//CCDv/wgw7/74QN/++FDf/uhw3/7IEA/+yGAP/yrWH/+ubQ//////////////////rnzv/99u7///////HEgf/mkgD/7791//z05/////////////rx3f/rvWP/4qEA/+GiA//hpAL/4KUC/+CmAv/fpwH/36gA//F/D//xgA//8IIO//CDDv/vhA3/7oEA//KoXf/2x5b/7pAg/+uFAP/sjhL/87x8//zw4v//////////////////////8sSE/+aTAP/mlQD/6KYz//bctP////7////////++//qulv/4aAA/+GkAv/gpQL/4KYC/9+nAf/fqAD/8X8P//GAD//wgg7/8IMO/++EDf/ugAD/87Bv///////75tH/7ZEg/+uKA//qiQD/7Jgl//XLl//9+PD////////////yxIT/5pMA/+aZB//kmAD/5JkA/+7DeP/+/Pf//////+zBbv/hnwD/4aQC/+ClAv/gpgL/36cB/9+oAP/xfw//8YAP//CCDv/wgw7/74QN/+6AAP/zr23///////338P/uly//64oD/+uNCv/qjQL/6YsA/+yiPf/22LD/+unR/+uqRv/mlgD/5pkH/+WaB//kmgD/5qQi//336///////7MBs/+GfAP/hpAL/4KUC/+CmAv/fpwH/36gA//F/D//xgA//8IIO//CDDv/vhA3/7oAA//Ovbf///////fbs/+6VLP/rigP/640K/+qPCv/qkAn/6I8A/+iSAP/olwn/55QC/+aYCP/mmQf/5ZoH/+SaAP/mpyr//ffr///////swGz/4Z8A/+GkAv/gpQL/4KYC/9+nAf/fqAD/8X8P//GAD//wgg7/8IMO/++EDf/ugAD/869u///////++fL/75gy/+uHAP/rjAX/6o0E/+qOBP/pkQP/6JIA/+iTAP/nlQT/5pcD/+aYAv/lmQL/45gA/+aoLv/9+fH//////+zAbf/hnwD/4aQC/+ClAv/gpgL/36cB/9+oAP/xfw//8YAP//CCDv/wgw7/74QN/+6AAP/zrWj////////////30Kj/7pgu/+2XKf/smSr/65oq/+qbKP/qnSr/6p8o/+qgKf/poSn/6aIp/+ejJ//npSv/89ak////////////675n/+GfAP/hpAL/4KUC/+CmAv/fpwH/36gA//J/D//xgA//8IIO//CDDv/vhA3/74MG/++WNP/99u7////////////9+PD//fXq//316//99ev//fbr//326//99uv//fbr//326//99uv//fXq//358P////////////347v/mrDL/4aEA/+GkAv/gpQL/4KYC/9+nAf/gqQD/8IAP9vKAD//wgg7/8IMO/++EDf/vhQ3/7YQA//Oxbv/99Ov////////////////////////////////////////////////////////////////////////////99ur/7MFs/+GeAP/hogP/4aQC/+ClAv/gpgL/4KgB/9+nAfbwhBiJ94QQ//CCDv/wgw7/74QN/++FDf/uhw3/7YUA/++XM//yr2f/8rJt//Kzbf/xtW3/8bVt//C2bf/vt23/77lt/++5bf/uum3/7rtt/+68bf/uvWz/7Lxm/+arMv/inQD/4qEE/+GiA//hpAL/4KUC/+CmAv/mrAL/4asPifKGGT30ghD/8IIO//CDDv/vhA3/74UN/+6HDf/tiAz/7YcE/+uGAP/rhwD/6okA/+qLAP/piwD/6I0A/+ePAP/nkQD/5pIA/+aUAP/mlgD/5JYA/+SYAP/jmgD/4p0A/+OgBf/ioQT/4aID/+GkAv/gpQL/4KYC/+KqA//isBE9/58gCPGBDs/2hA7/8IMO/++EDf/vhQ3/7ocN/+2IDP/tiQz/7IsL/+yMC//rjQr/6o8K/+qQCf/pkgj/6JMI/+iVB//nlgn/5pgI/+aZB//lmgf/5ZwG/+SdBv/jnwX/46AF/+KhBP/hogP/4aQC/+ClAv/lqQP/4KgCz9+fIAgAAAAA8YUVSfODDfzyhA3/74QN/++FDf/uhw3/7YgM/+2JDP/siwv/7IwL/+uNCv/qjwr/6pAJ/+mSCP/okwj/6JUH/+eWCf/mmAj/5pkH/+WaB//lnAb/5J0G/+OfBf/joAX/4qEE/+GiA//hpAL/4qcC/+OoAPzgqAdJAAAAAAAAAAAAAAAA8YQQbvOGDfv1hw3/74UN/+6HDf/tiAz/7YkM/+yLC//sjAv/640K/+qPCv/qkAn/6ZII/+iTCP/olQf/55YJ/+aYCP/mmQf/5ZoH/+WcBv/knQb/458F/+OgBf/ioQT/4aID/+aoAf/jpwH74acHbgAAAAAAAAAAAAAAAAAAAAAAAAAA7oURS/OHD8zyhw//9YsN/+6IDP/tiQz/7IsL/+yMC//rjQr/6o8K/+qQCf/pkgj/6JMI/+iVB//nlgn/5pgI/+aZB//lmgf/5ZwG/+SdBv/jnwX/5KAF/+mlBv/lpQb/5KgFzOCnA0sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA25IkB/OLGEDwjRiI7ogM9e6KC//siwv/7IwL/+uNCv/qjwr/6pAJ/+mSCP/okwj/6JUH/+eWCf/mmAj/5pkH/+WaB//lnAb/5J0G/+SgBf/joQT15aMTiOenEEDbtiQHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAEAAAACAAAAABACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADuhhY78osNq/CMDf/sjAr/6o8K/+mSCP/nlQf/5pgI/+WbBv/noQf/5qQHq+WkDTsAAAAAAAAAAAAAAADxhA5+84cN+/OKDv/tigv/64wK/+qPCv/pkgj/55UH/+aYCP/lmwb/454G/+ekBv/lpgL74aYEfgAAAADxgA428oQN/fGFDf/uhgf/7IUA/+qIAP/pigD/6I4A/+aRAP/mlAD/5JcA/+KbAP/ioAD/46UC/+KpBP3jqg428IAQrvaFD//vgwj/744h//bGl//42bn/+Nm4//fbuP/23Lj/9t25//bduf/x0Jb/5KYc/+GjAP/lqgP/3akErvWCD//wgg7/738A//a9if/+/Pn/99Co//bNoP/1z5//9M+e//TSoP/016j//v35/+/Lif/goAD/4KYC/+KrAP/xgA//8IIO/+9+AP/3y6T/+dq6/+qDAP/pigD/6ZQP/+mcI//lkAD/45MA//bhv//y16P/4KAA/+CmAv/fqAD/8YAP//CCDv/vfgD/98yl//vlz//skBX/6IYA//K/f//99+//8cSC/+OWAP/y0p3/8tWg/+CgAP/gpgL/36gA//GAD//wgg7/74EC//KlWf/87t///O/h//C0a//zxY///fbs//327P/35MX/6bFG/+aqLv/howD/4KYC/9+oAP/xgA//8IIO/++DCP/wmT//75w///bHl//99/D//vv2//ffv//ppDD/9+LD//326//qvGD/4aIA/+CmAv/fqAD/8YAP//CCDv/vfgD/98uk//jSrP/qgwD/7Z86//fZs//0z5z/5pMA/+SYAP/45cf/8tek/+CgAP/gpgL/36gA//GAD//wgg7/734A//fLpP/63cD/6oQA/+mJAP/niwD/5pEA/+aUAP/jlAD/9uC8//LXo//goAD/4KYC/9+oAP/1gg//8IIO/+9/AP/1uID///37//ncvf/32bb/99q3//bbtv/23Lb/9uC8//79+v/uyH//4KAA/+CmAv/iqwD/8IAQrvaFD//vhAr/7ooX//S6f//2zKL/9s6i//XPov/00KL/9NKi//PTov/uxn7/46MQ/+GjAP/lqgP/3akHrvGADjbyhA398YUN/+6GCv/shQD/6ocA/+mKAP/ojgD/5pEA/+aUAP/klgD/4psA/+KgAv/jpQL/4qkE/eOqDjYAAAAA8YQOfvOHDfvzig7/7YoL/+uMCv/qjwr/6ZII/+eVB//mmAj/5ZsG/+OeBv/npAb/5aYC++GmBH4AAAAAAAAAAAAAAADuhhY78osNq/CMDf/sjAr/6o8K/+mSCP/nlQf/5pgI/+WbBv/noQf/5qQHq+WkDTsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
// @grant       none
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/519616/%E7%99%BE%E5%BA%A6%E7%BB%9F%E8%AE%A1%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/519616/%E7%99%BE%E5%BA%A6%E7%BB%9F%E8%AE%A1%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ////////////////////////////////////////////////// 代码区 START //////////////////////////////////////////////////

    // dom加载完成
    document.addEventListener('DOMContentLoaded', function() {
        // 你的代码逻辑
        console.log(`
        ********************** dfer.site START **********************
        DOM 已加载完成
        jQuery版本：${jQuery.fn.jquery}
        **********************  dfer.site END  **********************
        `);
        init();
    });

    function init() {

        const html_code = `
       <!---------------------------------------------------------- dfer.site START ---------------------------------------------------------->
       <div id="auto-login-button" style="
                   position: fixed;
                   top: 13px;
                   right: 300px;
                   padding: 10px 20px;
                   background-color: #4CAF50;
                   color: white;
                   border: none;
                   border-radius: 5px;
                   cursor: pointer;
                   z-index: 9999;
               ">
           自动登录
       </div>

       <div id="loading" style="
               position: fixed;
               left: 0;
               top: 0;
               width: 100%;
               height: 100%;
               background: rgba(0, 0, 0, 0.5);
               display: flex;
               align-items: center;
               justify-content: center;
               color: white;
               font-size: 24px;
               font-weight: bold;
               z-index: 99999;
               visibility: hidden;
               opacity: 0;
               transition: visibility 0s 0.5s, opacity 0.5s ease-in-out;
           ">
               脚本运行中...
           </div>

       <!----------------------------------------------------------  dfer.site END  ---------------------------------------------------------->
    `;

        // 将悬浮按钮添加到页面中
        document.body.insertAdjacentHTML('beforeend', html_code);

        // 获取悬浮按钮的DOM元素
        const autoLoginButton = document.getElementById('auto-login-button');

        // 为悬浮按钮添加点击事件监听器
        autoLoginButton.addEventListener('click', function() {
            showLoading();
            const obj_rules = ['.login', '.passport-account', 'input[name=userName]',
                'input[name=password]', '.pass-button-submit'
            ];
            clickSequentially(obj_rules)
                .finally(() => {
                    // 所有点击操作都已成功完成
                    showText('全部操作已完成');
                    // 在这里添加您的回调逻辑
                    hideLoading()
                }).catch(error => {
                    // 如果有任何错误发生，它会被捕获在这里
                    console.error('出错:', error);
                });
        });
    }

    /**
     * 按顺序点击
     * @param {Object} obj_rules
     * @param {Object} delay
     */
    async function clickSequentially(obj_rules) {
        for (const obj_rule of obj_rules) {
            if (await checkObj(obj_rule)) {
                let obj = $(obj_rule)
                obj.click();
                // console.log(`点击:`, obj);
                showText(`点击:"${obj_rule}"`);
            }
        }
    }

    function checkObj(obj_rule) {
        return new Promise((resolve, reject) => {
            let obj_timer = setInterval(function() {
                const obj = $(obj_rule);
                if (obj && obj.length > 0) {
                    console.log(`找到:"${obj_rule}"`);
                    clearInterval(obj_timer);
                    clearTimeout(timeout);
                    resolve(true);
                }
            }, 500);
            // 设置超时时间（毫秒）
            const delay = 9000;
            // 设定一个超时，以防元素永远不出现
            const timeout = setTimeout(() => {
                clearInterval(obj_timer);
                console.log(`未能在指定时间内找到元素:"${obj_rule}"`);
                resolve(false);
            }, delay);
        });
    }

    // 显示加载指示器
    function showLoading() {
        $('#loading').css({
            visibility: 'visible',
            opacity: 1,
            transition: 'opacity 0.5s ease-in-out'
        });
    }

    // 隐藏加载指示器
    function hideLoading() {
        $('#loading').css({
            visibility: 'hidden',
            opacity: 0,
            transition: 'visibility 0s 0.5s, opacity 0.5s ease-in-out'
        });
    }

    function showText(text) {
        $('#loading').html(text);
    }
    //////////////////////////////////////////////////  代码区 END  //////////////////////////////////////////////////

})();
