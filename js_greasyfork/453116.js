// ==UserScript==
// @name         [LWAF] Retrieve TC Products
// @namespace    SUD
// @license MIT
// @include https://thrivecart.com/livewellandfully*
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @version 10
// @grant GM_addStyle
// @author       macheteYeti
// @license MIT
// @description  Monitors ThriveCart products and permits opening all in tabs
// @downloadURL https://update.greasyfork.org/scripts/453116/%5BLWAF%5D%20Retrieve%20TC%20Products.user.js
// @updateURL https://update.greasyfork.org/scripts/453116/%5BLWAF%5D%20Retrieve%20TC%20Products.meta.js
// ==/UserScript==

$(document).ready(function(){


	function getID(){
	
		var urlparts=window.location.href.split('/');
		urlparts.reverse();
		var id=0;
		for(i in urlparts){
		
			if(!isNaN(urlparts[i])){
			
				id=urlparts[i];
				break;
			}
		}
		return id;
	}
	
	// $(document).on('click','.ui-icon-clone',
	if(window.location.href.indexOf('/behavior')>-1){
		
			prod=getID();
			autoing='list';
			autos=[];
			
			$(document).arrive('.ui-product-settings-tab-customers-options-wrapper+.pure-controls',function(){
			
				outputSave();
			});
			function outputSave(){
			
				$(this).find('.ui-ctrl-btn-nav.ui-ctrl-btn-save.pure-button.button-primary').css('display','none').attr('id','tcSave');
				console.log('adding button');
				if($('#saveAutos').length==0)$('<button id="saveAutos">Save Automation Data</button>').insertBefore($('.ui-ctrl-btn-nav.ui-ctrl-btn-save.pure-button.button-primary'));
			}
			setTimeout(()=>{
			
				outputSave();
			},1000);
			$(document).on('click','#saveAutos',function(e){
			// $(document).on('click','.ui-ctrl-btn-nav.ui-ctrl-btn-save.button-primary',function(){
			
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				
				console.log('do we have this?');
				$('.ui-autoresponder-block').each(function(){
				
					if($(this).attr('data-subtype')=='automation'&&$.inArray($(this).attr('data-action'),['bump','purchase'])>-1){
					
						autos.push({auto:$(this).find('.generic-list-aside').text(),action:$(this).attr('data-action')});
					}
				});
				console.log(autos);
				$(this).fadeOut();
				if(typeof autos!=typeof undefined){
				
					if(autos.length>0){
					
						$.ajax({type:'POST',crossDomain:true,cache:false,dataType:'json',url:"https://livewellandfully.com/sud/grabProduct.php",data:{type:'autos',prod:prod,autos:autos},success:function(d){
						
							if(d.success)$('.ui-product-settings-tab-customers-options-wrapper+.pure-controls').find('.ui-ctrl-btn-nav.ui-ctrl-btn-save.pure-button.button-primary').fadeIn();
							else alert('could not find automation by name, please try again');
						}
						});
						autos=[];
						editIndex=0;
					}
				}
				else $('#tcSave').fadeIn();
				
				return false;
			});
		}
	function doIt(){
	
		prod=getID();
		var urlparts=window.location.href.split('/');
		urlparts.reverse();
		console.log(urlparts);
		
		if(urlparts.length>6){
		
			if(window.location.href.indexOf('orders')>-1)doOrders();
			else if(window.location.href.indexOf('products')>-1){
				console.log('getting label');
				var id=getID();
				$.ajax({type:'POST',crossDomain:true,cache:false,dataType:'json',url:"https://livewellandfully.com/sud/grabProduct.php",data:{type:'lab',id:id},success:function(d){$('title').html(d.tit);setTimeout(()=>{if(!$('#tcTit').length)$('#body').prepend('<h2 id="tcTit">'+d.tit+'</h2>');},1000);}});
			}
		}
		else{
		
			if(window.location.href=="https://thrivecart.com/livewellandfully/#/products"){
			
				console.log('gathering product data');
				//gather product information
				$(document).arrive(".box-list-product-row",function(){ dat[$(this).attr('data-asset-id')]=$(this).attr('data-product'); });
				
				//pass to server
				setTimeout(()=>{ $.ajax({type:'POST',crossDomain:true,cache:false,async:false,dataType:'json',url:"https://livewellandfully.com/sud/grabProduct.php",data:{type:'check',dat:dat}});
				
					if($('#side').length==0){$('#body').prepend("<div id='side' style='display:none'><fieldset><label for='openLive'><input type='checkbox' id='openLive' checked value='2'> Live</label><label for='openTest'><input type='checkbox' id='openTest' value='1'> Test</label><label for='openDisabled'><input type='checkbox' id='openDisabled' value='3'> Disabled</label></fieldset><fieldset><label for='openBehavior'><input type='radio' checked name='type' id='openBehavior' value='/behavior/'> Behavior</label><label for='openProduct'><input type='radio' name='type' id='openProduct' value='/'> Product</label><label for='openCustomize'><input type='radio' name='type' value='/customize/' id='openCustomize'> Checkout</label></fieldset><a id='opener' class='pure-button button-primary button-small'>Open in Tabs</a></div>");$('#side').fadeIn('slow');}
					
					else{$('#side').fadeIn('slow');}
				},500);
			}
			else doOrders();
		}
	}
	function doOrders(){
	
		$('#side').fadeOut();
		
		if(window.location.href.indexOf('orders')>-1){
		
			console.log('found transactions page');
			$.ajax({type:'POST',crossDomain:true,cache:false,dataType:'json',url:"https://livewellandfully.com/sud/grabProduct.php",data:{type:'labs'},success:function(d){
			
				console.log(d);
				$(document).arrive('.order-list-purchase',function(){
				
					console.log('checking '+$(this).find('.order-row-customer-name').text()+" "+$(this).find('.ui.order-invoice').length);
					console.log('checking '+$(this).find('.ui-order-invoice').attr('data-product-id'));
					if($(this).find('.prod-link').length==1)return true;
					
					if($(this).find('.ui-order-invoice').length>0)var id=$(this).find('.ui-order-invoice').attr('data-product-id');
					else var id=$.parseJSON($(this).find('.ui-subscription-manage').attr('data-subscription-opts')).product_idx;
					
					var em=$(this).find('.order-row-purchase-name span em').text();
					$(this).find('.order-row-purchase-name span em').remove();
					$(this).find('.order-row-purchase-name span').html('<a href="https://thrivecart.com/livewellandfully/#/products/'+id+'">'+$(this).find('.order-row-purchase-name span').text()+'</a> <em>'+em+'</em>').addClass('prod-link');
				});
			}});
			
		}
	}
	$(document).arrive('#core-view-list-products',function(){
	
		doIt();
	});
	window.onpopstate=function(e){
	
		console.log('popstate');
		
		doIt();
	}
	doIt();
	dat=[];
	wins=[];
	$(document).arrive('.box-list-product-row',function(){
	
		console.log('revealing product url');
		if($(this).hasClass('.urled'))return false;
		
		var dets=$.parseJSON($(this).attr('data-product'));
		var url=dets['_link_upsell'].split("/upsell")[0];
		$('<span class="list-product-url"><a target="_blank" href="'+url+'">'+url.split('/').pop()+'</a></span>').insertAfter($(this).find('.list-product-date'));
		
		$(this).addClass('urled');
	});
	$(document).on('click','#opener',function(){
	
		if($(this).text()=='Open in Tabs'){
		
			var stati=[];
			$('#side fieldset').first().find('input').each(function(){
			
				if($(this).prop('checked')==true)stati.push($(this).val());
			});
			var type=$('#side input[name="type"]:checked').val();
			
			console.log("Opening "+type+" for "+stati.join(", ")+" products");
			$(dat).each(function(k,v){
			
				if(typeof v==typeof undefined)return true;
				v=$.parseJSON(v);
				console.log('checking '+v.status+" for "+v.idx);
				if($.inArray(v.status,stati)>-1)wins.push(window.open("https://thrivecart.com/livewellandfully/#/products/"+v.idx+type.slice(0,-1)));
				$('#opener').text('Close Tabs');
			});
		}
		else{
		
			for(i in wins)wins[i].close();
			$('#opener').text('Open in Tabs');
		}
	});
});

GM_addStyle( `
    #side{width:350px;height:189px;border:1px solid #ccc;position:absolute;left:-350px;font-size:1.3em;line-height:2;padding-top:1em}
	#side fieldset{margin-left:0;padding-left:1em;display:flex;justify-content:space-between}
	#opener{margin:1em;width:91%}
	.view-order-details-wrap .order-row-purchase-name-block{padding-bottom:.25em !important}
	.list-product-url{float:right;margin-bottom:5px;margin-top:-9px}
	.list-product-url a{color:#4591A9}
` );