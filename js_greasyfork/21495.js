// ==UserScript==
// @name        Faceless' GW Mod
// @include     http://game.galaxywarfare.com*
// @description Moves the HG Panel to a More Convenient Location and adds both HB's GW Mod 1.0 and HB's Personal "Admin" Panel private modification to the HG Panel.
// @version     8
// @require     http://code.jquery.com/jquery-3.1.0.js
// @namespace   https://greasyfork.org/users/26728
// @downloadURL https://update.greasyfork.org/scripts/21495/Faceless%27%20GW%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/21495/Faceless%27%20GW%20Mod.meta.js
// ==/UserScript==

var HGPM1       = document.createElement ('div');
var menu = document.getElementById('navigation');
	menu.parentNode.insertBefore(HGPM1, menu);

HGPM1.innerHTML = '<div class="well well-small" id="HGPMdiv">'
+ '<a href="javascript:;" onclick="$(\'#HGPM1\').toggle(\'fast\');" class="medtext btn btn-block btn-warning">Access Panel</a>'
+ '<ul id="HGPM1" style="display:none" class="nav nav-tabs nav-stacked">'
+ '<br/>'
+ '<ul class="nav nav-tabs nav-stacked">'
+   '<li><a href="javascript:callWorkerForContentNoScroll(\'managereports\',\'\');"><i class="icon-chevron-right"></i> Reports</a></li>'
+ '</ul><ul class="nav nav-tabs nav-stacked">'
+   '<li><a href="javascript:storeItems(743991);"><i class="icon-chevron-right">     </i> My Base          </a></li>'
+   '<li><a href="javascript:storeItems(1646171);"><i class="icon-chevron-right">    </i> Bot Overflow     </a></li>'
+   '<li><a href="javascript:storeItems(743990);"><i class="icon-chevron-right">     </i> Di\'s Base       </a></li>'
+   '<li><a href="javascript:storeItems(976247);"><i class="icon-chevron-right">     </i> Oasis            </a></li>'
+ '</ul>'



+ '<div class="well well-small" id="HBAP1">'
+ '<a href="javascript:;" onclick="$(\'#HBAP\').toggle(\'fast\');" class="medtext btn btn-block btn-danger">Personal Panel</a>'
+ '<ul id="HBAP" style="display:none" class="nav nav-tabs nav-stacked">'

+ '</br>'

+ '<div class="well well-small" id="CoP1">'
+ '<a href="javascript:;" onclick="$(\'#CoP\').toggle(\'fast\');" class="medtext btn btn-block btn-primary">Construction</a>'
+ '<ul id="CoP" style="display:none; font-size: 11px !important;" class="nav nav-tabs nav-stacked">'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&buildgate=1\');"><i class="icon-chevron-right">  </i> Warp Gate     </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&buildtgate=1\');"><i class="icon-chevron-right"> </i> Tularian Gate </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&build=4\');"><i class="icon-chevron-right">      </i> Station       </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&buildarrow=1\');"><i class="icon-chevron-right"> </i> Arrow         </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&build=1\');"><i class="icon-chevron-right">      </i> Base          </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&build=2\');"><i class="icon-chevron-right">      </i> Nebula        </a></li>'
+ '</ul>'
+ '</div>'

+ '<div class="well well-small" id="ACCP1">'
+ '<a href="javascript:;" onclick="$(\'#ACCP\').toggle(\'fast\');" class="medtext btn btn-block btn-info">Access:</a>'
+ '<ul id="ACCP" style="display:none; font-size: 11px !important;" class="nav nav-tabs nav-stacked">'
+	'<li><a href="javascript:storeItems(23216);"><i class="icon-chevron-right">      </i> WZ Planet        </a></li>'
+	'<li><a href="javascript:storeItems(220784);"><i class="icon-chevron-right">     </i> Orgn. Planet    </a></li>'
+ '</ul>'
+ '</div>'


+ '<div class="well well-small" id="Auto1">'
+ '<a href="javascript:;" onclick="$(\'#Auto\').toggle(\'fast\');" class="medtext btn btn-block btn-success">Hacks</a>'
+ '<ul id="Auto" style="display:none; font-size: 11px !important;" class="nav nav-tabs nav-stacked">'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');"><i class="icon-chevron-right">   </i> (25) Scram R</a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');"><i class="icon-chevron-right">   </i> (25) Scram L</a></li>'
+	'<li><a href="javascript:javascript:callWorkerForContentNoScroll(\'universe\',\'&cdestroyobject=1\');"><i class="icon-chevron-right">                                                                                                                                                                                                                                                                                                                                                                              </i> (1) Kill Obj. </a></li>'
+	'<li><a href="javascript:attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();"><i class="icon-chevron-right"></i> (100) Nuke </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScroll(\'shop\',\'\');javascript:cpurchaseItem(\'31B32428-1998-61C8-F8CD-C5F4BC434A31\');javascript:cpurchaseItem(\'31B32428-1998-61C8-F8CD-C5F4BC434A31\');javascript:cpurchaseItem(\'31B32428-1998-61C8-F8CD-C5F4BC434A31\');javascript:cpurchaseItem(\'31B32428-1998-61C8-F8CD-C5F4BC434A31\');javascript:cpurchaseItem(\'31B32428-1998-61C8-F8CD-C5F4BC434A31\');javascript:callWorkerForContentNoScroll(\'universe\',\'\');"><i class="icon-chevron-right">    </i> (5) Fuel Cells  </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScroll(\'shop\',\'\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');javascript:callWorkerForContentNoScroll(\'universe\',\'\');"><i class="icon-chevron-right">  </i> (50) Hulls      </a></li>'
+ '</ul>'
+ '</div>'


+ '<div class="well well-small" id="TBP1">'
+ '<a href="javascript:;" onclick="$(\'#TBP\').toggle(\'fast\');" class="medtext btn btn-block btn-inverse">ToolBox</a>'
+ '<ul id="TBP" style="display:none; font-size: 11px !important;" class="nav nav-tabs nav-stacked">'
+	'<li><a href="javascript:repairObject();"><i class="icon-chevron-right">         </i> Repair </a></li>'
+	'<li><a href="javascript:attackObject();"><i class="icon-chevron-right">         </i> Attack </a></li>'
+	'<li><a href="javascript:claimObject();"><i class="icon-chevron-right">          </i> Claim  </a></li>'
+	'<li><a href="javascript:acquireObject();"><i class="icon-chevron-right">        </i> Acquire</a></li>'
+	'<li><a href="javascript:moveObject();"><i class="icon-chevron-right">           </i> Move   </a></li>'
+	'<li><a href="javascript:destroyObject();"><i class="icon-chevron-right">        </i> Destroy</a></li>'
+	'<li><a href="javascript:closeModal();"><i class="icon-chevron-right">           </i> Close  </a></li>'
+ '</ul>'
+ '</div>'

+ '</ul>'
+ '</div>'

+ '</ul>'
+ '</div>';