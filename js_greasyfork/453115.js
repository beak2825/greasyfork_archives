// ==UserScript==
// @name         [LWAF] Open Saved Searches & Hide
// @namespace    LWAF
// @license MIT
// @include https://livewellandfully.activehosted.com/app/contacts*
// @include https://livewellandfully.activehosted.com/admin/*
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @author       macheteYeti
// @description  Opens AC saved searches & hide recently active
// @grant       GM_addStyle
// @version 7
// @downloadURL https://update.greasyfork.org/scripts/453115/%5BLWAF%5D%20Open%20Saved%20Searches%20%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/453115/%5BLWAF%5D%20Open%20Saved%20Searches%20%20Hide.meta.js
// ==/UserScript==
//don't forget to update mary's

GM_addStyle( `

	#listWarning{background-color: rgb(255, 0, 0); color: rgb(255, 255, 255); font-weight: bold; float: left; height: 100%; width: 60%; padding: 10px;display:block
	webkit-animation: blinkred 1s infinite;  /* Safari 4+ */
-moz-animation: blinkred 1s infinite;  /* Fx 5+ */
-o-animation: blinkred 1s infinite;  /* Opera 12+ */
animation: blinkred 1s infinite;  /* IE 10+, Fx 29+ */
	}
	
	@-webkit-keyframes blinkred {
	  0%, 49% {
		background-color:#f00;
	  }
	  50%, 100% {
		background-color: #fff;
		color:#000
	  }
	}
	.modal-body .ac_lists table,.modal-body .ac_lists tr,.modal-body .ac_lists td,.modal-body .ac_lists a,.modal-body .ac_lists tbody{max-width:470px}
	.hideInactive{opacity:0.4;background-color:#999}
	.hideInactive td{padding-top:0;padding-bottom:0;}
	
	.components_segments_saved-searches-modal camp-button{padding:3px 5px}
	#btns{display:flex;justify-content:space-between;align-items:center}
` );

jQuery.fn.selText = function() {
    var obj = this[0];
    
        var selection = obj.ownerDocument.defaultView.getSelection();
        var range = obj.ownerDocument.createRange();
        range.selectNodeContents(obj);
        selection.removeAllRanges();
        selection.addRange(range);
   
    return this;
}

$(document).ready(function(){
	
	$(document).on('keyup','input[placeholder="Enter new search name here"]',function(){
	
		var nam=$(this).val();
		$.ajax({type:'POST',crossDomain:true,cache:false,dataType:'json',url:"https://fitaf570.com/sud/grabSearch.php",data:{type:'nam',nam:nam,seg:new URLSearchParams(window.location.search).get('segmentid')}});
	});
	wins=[];
	if($('#formModal.add-list').length){
	
		console.log('adding warning');
		$('#formModal.add-list .modal-footer').prepend('<a id="listWarning" href="https://www.wrike.com/open.htm?id=839860076" target="_blank">Barbara - remember to follow the process so you don\'t break unsubscribe.</a>');
	}
	$(document).arrive(".modal-wrap",function(){
	
		// console.log('found saved search list');
		
		if(!$('.modal-wrap').hasClass('openers')){
		
			$('#openSavedSearches').remove();
			$('#selectAll').remove();
			$('.modal-body').prepend("<div id='btns'></div>");
			$('#btns').append('<camp-button id="openSavedSearches"><span class="create">Open All</span></camp-button>');
			$('#btns').append('<camp-button id="openSavedSearchesMatches" data-matches="1"><span class="create">Open Matches</span></camp-button>');
			$('#btns').append('<camp-button id="openSavedSearchesMatchesHide" data-matches="1" data-hide="1"><span class="create">Open Matches &amp; Hide</span></camp-button>');
			$('#btns').append('<camp-button id="openSavedSearchesHide" data-hide="1"><span class="create">Open All &amp; Hide</span></camp-button>');
			$('#btns').append("<select id='catSelector' style='height:38px;font-size:16px;padding:5px'><option value='nono'>Select a type</option>");
			$('#btns').append('<camp-button id="hideSavedSearches" data-type="0"><span class="create" style="background-color:#f00">Hide Selected</span></camp-button>');
			$.ajax({
			
				type:'POST',crossDomain:true,cache:false,dataType:'json',url:"https://fitaf570.com/sud/grabSearch.php",data:{type:'check'},
				success:function(d){
				
					var cats=[];
					var embers={};
					$('.modal-wrap tr').each(function(i){
					
						if(i>0){
						
							embers[$(this).find('a').first().text()]=$(this).find('span').last().attr('id').substring(5);
							$(this).remove();
						}
					});
					
					var vals=Object.values(d);
					var keys=Object.keys(d);
					$.each(keys,function(i,v){
					
							var cat=keys[i].split('-')[0];
							if(keys[i] in embers)var nextIns='<tr><td class="text_left"><input type="checkbox" class="selector" style="margin-right:10px;width:17px;height:17px;float:left" data-id="'+vals[i]+'" data-cat="'+cat+'"><a class="missing" data-id="'+vals[i]+'" href="#">'+keys[i]+'</a></td><td><button class="ac_button fright xsmall" data-ember-action="" data-ember-action-'+(embers[keys[i]]-1.0)+'="'+(embers[keys[i]]-1.0)+'"><span id="ember'+embers[keys[i]]+'" class="icon left ember-view"><svg style=""><use xlink:href="#circle-x" fill="" class="icon-circle-x"></use></svg></span> Delete</button></td></tr>';
							else var nextIns='<tr style="background-color:#ccc"><td class="text_left"><input type="checkbox" class="selector" style="margin-right:10px;width:17px;height:17px;float:left" data-id="'+vals[i]+'" data-cat="'+cat+'"><a class="missing" data-id="'+vals[i]+'" href="#">'+keys[i]+'</a></td><td>&nbsp;</button></td></tr>';
							$('.modal-wrap tbody').append(nextIns);
						
						if(!isNaN(cat)&&$.inArray(cat,cats)==-1){
						
							cats.push(cat);
							$('#catSelector').append('<option value="'+cat+'">'+cat+'</option>');
						}
					});
				}
			});
			$('.modal-wrap').addClass('openers');
		}
	});
	
	$(document).on('click','.missing',function(){
	
		var url="https://livewellandfully.activehosted.com/app/contacts?limit=100&segmentid="+$(this).attr('data-id');
		window.open(url,"_blank");
	});
	
	$(document).on('change','#catSelector',function(){
	
		if($(this).val()!='nono')$('.modal-body .ac_lists').find('input[type="checkbox"][data-cat="'+$(this).val()+'"]').prop('checked',true);
	});
	
	$(document).on('click','#hideSavedSearches',function(){
	
		var ids=[];
		$('.selector:checked').each(function(){
		
			ids.push($(this).attr('data-id'));
		});
		
		$.ajax({type:'POST',crossDomain:true,cache:false,dataType:'json',url:'https://fitaf570.com/sud/grabSearch.php',data:{type:'hide',ids:ids.join(",")}});
	});
	$("#openSavedSearches").unbind('click');
	$(document).on('click','#btns camp-button',function(e){
	
		var btn=$(this);
		e.stopImmediatePropagation();
		var ids=[];
		$('.selector:checked').each(function(){
		
			ids.push($(this).attr('data-id'));
		});
		ids.reverse();
		$(ids).each(function(k,v){
		
			var url="https://livewellandfully.activehosted.com/app/contacts?limit=100&segmentid="+v;
			if(typeof btn.attr('data-matches')!=typeof undefined){
			
				url+="&matches=1";
				$.ajax({type:'POST',crossDomain:true,cache:false,dataType:'json',url:'https://fitaf570.com/sud/grabSearch.php',data:{type:'matches',id:v,val:null}});
			}
			if(typeof btn.attr('data-hide')!=typeof undefined){
			
				url+="&hide=1";
			}
			wins[k]=window.open(url,"_blank");
			
			/* if(typeof btn.attr('data-matches')!=typeof undefined){
			
				if(wins[k]){
				
					wins[k].onload=function(){
					
						console.log('window loaded, checking for matches');
						$(document).arrive('.camp-Text--heading1',function(){
						
							consle.log('found camp text');
							if($(this).text().indexOf("no contacts that match your search conditions")>-1)wins[k].close();
						});
					}
				}
			} */
		});
		e.preventDefault();
		e.stopPropagation();
		return false;
	});
	
	$(document).on('click','.modal-wrap .ac_lists a',function(e){
	
		e.preventDefault();
		e.stopPropagation()
		e.stopImmediatePropagation();
		var nam=$(this).text();
		var seg=e.target.baseURI;
		$.ajax({type:'POST',crossDomain:true,cache:false,dataType:'json',url:"https://fitaf570.com/sud/grabSearch.php",data:{type:'nam',nam:nam,seg:seg}});
		return false;
	});
	
	var urlParams = new URLSearchParams(window.location.search);
	
	if(typeof urlParams.get('segmentid')!=typeof undefined&&urlParams.get('segmentid')!=null&&urlParams.get('segmentid').length>1){
	
		console.log('found segment');
		var seg=urlParams.get('segmentid');
		// console.log('getting tit');
		if(typeof urlParams.get('hide')!=typeof undefined&&urlParams.get('hide')!=null&&urlParams.get('hide').length>0){
		
			console.log('found hide - checking');
			var ids=[];
			var i=0;
			$(document).arrive('table[data-testid=c-table] tbody tr',function(){
			
				var id=$(this).attr('id').split('_').pop();
				// console.log('adding '+id);
				ids.push(id);
				if(i==99||i==($('h2[data-testid=contacts-page-header] span').text().replace('(','').replace(')','')-1)){
				
					console.log('sending '+ids);
					$.ajax({type:'POST',crossDomain:true,cache:false,dataType:'json',url:"https://livewellandfully.com/sud/checkActivity.php",data:{type:'checkActivity',ids:ids},success:function(d){
					
						$.each(d.ids,function(i,v){
						
							$('#contactrow_'+v).addClass('hideInactive');
						});
					}});
				}
				i++;
			});
			
		}
		
		$.ajax({type:'POST',crossDomain:true,cache:false,dataType:'json',url:"https://fitaf570.com/sud/grabSearch.php",data:{type:'tit',seg:seg},success:function(d){
		
			// console.log(d.tit);
			$('title').html(d.tit);
			/* if(d.tit.indexOf('B4')>-1){
			
				// $(document).arrive('.c-Input-field',function(){
				
					// console.log('found conditions search');
					var days=d.tit.split(" B4")[0];
					days=days.replace(" days","").split(" for ")[1];
					days=parseInt(days)+1;
					console.log('setting back '+days+' days');
					
					var today=new Date();
					var dateOffset=(24*60*60*1000)*days;
					today.setTime(today.getTime()-dateOffset);
					console.log(today);
					
					console.log($.format.date(today,"MM/dd/yyyy"));
					setTimeout(()=>{
					
						console.log('clicking in search box');
						$('#textInput-1').trigger('click');
						
						$(document).arrive('.components_segments_input-date__current',function(){
						
							// $(this).find('span').text($.format.date(today,"MM/dd/yyyy"));
							$(this).parent().parent().next().find('span').first().trigger('click');
							setTimeout(()=>{$('.pika-title').prepend($('<span class="pika-label">'+$.format.date(today,"M/d/yyyy")+'</span>'));},1000);
							// $('.pika-prev').trigger('click');
							// $('.pika-select-month').prop('selectedIndex',parseInt($.format.date(today,"M"))-1).trigger('change');
							// $('.pika-select-year').val($.format.date(today,"yyyy")).trigger('change');
							// $('.ember-pikaday-input').val($.format.date(today,"MM/dd/yyyy"));
							
							// $('td').removeClass('is-selected');
							// $('.pika-row').first().prepend($('<td data-day="2" class="is-selected" aria-selected="false"><button class="pika-button pika-day" type="button" data-pika-year="'+$.format.date(today,"yyyy")+'" data-pika-month="'+(parseInt($.format.date(today,"M"))-1)+'" data-pika-day="'+$.format.date(today,"d")+'">'+$.format.date(today,"M/d")+'</button></td>'));
							// $('.pika-day[data-pika-day="'+$.format.date(today,"d")+'"]').parent().addClass('is-selected');
							// setTimeout(()=>{$('.t-SegmentSearch-action').trigger('click');},1500);
						});
					},5000);
					
				// });
			} */
			setTimeout(()=>{if($('#searchTitle').length==0)$('<h3 id="searchTitle">'+d.tit+'</h3>').insertAfter($('div[id*=ember] h2').first());},3000);
			
		}});
		
		$(document).arrive('camp-text',function(){
		
			// console.log('found camp text'+$(this).text());
			if($(this).text().indexOf("no contacts that match your search conditions")==-1){
			
				// console.log('adding  contact opener');
				// $(document).arrive('h3',function(){
				
					if($('.contactsOpener').length==0){
					
						addResub();
						list=25;
						$('<camp-button class="contacts_index_subheader_add-contact ml10 contactsOpener"><span class="create">Open All</span></camp-button>').insertAfter($('.edit-all'));
						$('<camp-button class="contacts_index_subheader_add-contact ml10 contactsOpener" data-exclude="1"><span class="create">Open Non-Excluded</span></camp-button>').insertAfter($('.edit-all'));
					}
				// });
			}
		});
		
		
		$(document).on('click','.contactsOpener',function(){
		
			var exclude=0;
			if($(this).attr('data-exclude')==1)exclude=1
			$('.contacts_index_contact-row').each(function(){
			
				if($(this).hasClass('hideInactive')&&exclude)return true;
				window.open("https://livewellandfully.activehosted.com"+$(this).find('a').first().attr('href'));
			});
		});
	}
	if(typeof urlParams.get('matches')!=typeof undefined&&urlParams.get('matches')!=null&&urlParams.get('matches').length>0){
	
		$(document).arrive('camp-text',function(){
		
			// console.log('found camp text'+$(this).text());
			if($(this).text().indexOf("no contacts that match your search conditions")>-1)window.close();
		});
	}
	
	
	function addResub(){
	
		var urlParams = new URLSearchParams(window.location.search);
		if(typeof urlParams.get('listid')!=typeof undefined&&urlParams.get('listid')!=null&&urlParams.get('listid').length>0){
		
			console.log('adding resub');
			list=urlParams.get('listid');
			if($('.resubscribe').length==0){
			
				var after='.edit-all';
				if($('.contactsOpener').length)after='.contactsOpener';
				$('<camp-button class="contacts_index_subheader_add-contact ml10 resubscribe" data-exclude="1"><span class="create">Resubscribe Visible</span></camp-button>').insertAfter($(after).last());
			}
		}
		else $('.resubscribe').hide();
	}
	addResub();
	
	$(document).arrive('table[data-testid=c-table] tbody tr',function(){
	
		console.log('row arrived, seeing if we should add resub button');
		addResub();
	});
	
	$(document).on('click','.resubscribe',function(){
	
		var studs=[];
		$('.contacts_index_contact-row').each(function(){
		
			if($(this).find('td[data-testid="c-table__cell--full-name"]').find('a').length>0)studs.push($(this).find('td[data-testid="c-table__cell--full-name"]').find('a').attr('href').split('/').pop());
		});
		
		$.ajax({type:'POST',crossDomain:true,cache:false,dataType:'json',url:"https://livewellandfully.com/sud/resubscribe.php",data:{studs:studs,list:list},success:function(d){
		
			setTimeout(()=>{$('#searchTitle').next().find('a')[0].click();
			},studs.length*100);
		}});
	});
});