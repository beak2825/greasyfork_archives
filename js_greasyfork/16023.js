// ==UserScript==
// @name        KAT Tech Crew - Achievement Assigner
// @namespace   Dr.YeTii
// @include     http*://kat.cr/community/show/do-you-think-you-are-missing-cheevo-place-post-them/*
// @include     http*://chew.kickass.to/community/show/test-thread-test-dummies/*
// @version     1
// @description Laziness solved
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16023/KAT%20Tech%20Crew%20-%20Achievement%20Assigner.user.js
// @updateURL https://update.greasyfork.org/scripts/16023/KAT%20Tech%20Crew%20-%20Achievement%20Assigner.meta.js
// ==/UserScript==


$('body').prepend('<style>.faded {opacity:0.5;}</style>');
var post_id = 0;
var button = ' <a class="kaButton smallButton normalText ka-grey assignAchievement_js" title="Assign achievement"><i class="ka ka-achievement"></i> Assign Achievement</a>';

$('.communityLayout .commentbody .rate.rated .ratemark[href^="/community/votes/post/"]').each(function() { // each post
	$(this).closest('div[id^="post"]').prev('.commentHeadLine').find('.floatleft .smallbuttonsline').append(button);
});
$(document).delegate('.assignAchievement_js', 'click', function() {
	$.fancybox.showActivity();
	post_id = $(this).closest('.commentHeadLine').next('div[id^="post"]').attr('id');
	$(this).attr('post-id', post_id);
	getIdhash($(this).closest('.commentHeadLine').next('div[id^="post"]').find('.badge .badgeUsernamejs a').text());
});
function getIdhash(username) {
	$.ajax({
		'type':'POST',
		'url':'/friend/get/',
		'data':{'nickname':username},
		'dataType':'json',
		success: function(data) {
			if (data.method == 'chat') {
				openAchivements(data.html);
			}else{
				$.fancybox.hideActivity();
				alert('An error occurred fetching '+username+'\'s ID hash');
				post_id = 0;
			}
		}
	});
}
function openAchivements(id_hash) {
	$('<a></a>').attr('href', '/moderator/assignachievement/'+id_hash+'/').fancybox().click();
	for (var i=0;i<20;i++) { // 5s or limited shit
		setTimeout(function() {
			if ($('#fancybox-content').html().length>0 && $('#fancybox-content .addAnotherCheevo_js').length == 0) {
				$('#fancybox-content form[action^="/moderator/assignachievement/"] div select').each(function() {
					$(this).after('<a style="position: absolute; text-decoration: none ! important; cursor: pointer ! important; margin: 5px;" class="ka16 ka-grey addAnotherCheevo_js">+</a>');
				});
				$('#fancybox-wrap').width(464);
				$('#fancybox-content').width(424);
				$('#fancybox-content button[type="submit"]').replaceWith('<a class="siteButton bigButton" id="addAchievement">Add</a>');
				$('#fancybox-content form[action^="/moderator/assignachievement/"]').append(generateLastAchievements());
				$('#fancybox-content form div.marginBot25px').last().removeClass('marginBot25px').addClass('botmarg5x');
			}
		}, ((i+1)*250));
	}
}
function generateLastAchievements() {
	var template = ' <span class="achBadge $typeAchBack $faded"><a class="quickAssignAchievement_js pointer" achievement-id="$id"><span class="$typeAchIcon"></span><span class="achTitle">$name</span></a></span>';
	if(typeof(Storage)!=='undefined') {
		if (localStorage.getItem('kat_last_achievements')!==null) {
			var html = '<div class="center"><h4>Latest assigned achievements</h4>'; var faded = false;
			var achievements = JSON.parse(localStorage.getItem('kat_last_achievements'));
			for(var i=0;i<achievements.length;i++) {
				faded = $('#fancybox-content form').find('select option[value="'+achievements[i].id+'"]').length==0;
				html += template.replace(/\$type/g, achievements[i].type.toLowerCase()).replace(/\$id/, achievements[i].id).replace(/\$faded/, faded?'faded':'').replace(/\$name/, achievements[i].name)
			}
			html += '</div>';
			return html;
		}else{
			return '<div class="bold center italic">Add achievements to see shortcuts to them here</div>';
		}
	}else{
		return '';
	}
}
function rememberTheseAchievements(form) {
	if(typeof(Storage)!=='undefined') {
		newAchievements = [];
		if (localStorage.getItem('kat_last_achievements')!==null) {
			newAchievements = JSON.parse(localStorage.getItem('kat_last_achievements'));
		}
		form.find('select').each(function() {
			if ($(this).val() != '0') {
				for(var i=newAchievements.length-1;i>=0;i--) {
					if (newAchievements[i].id == $(this).val()) {
						newAchievements.splice(i, 1);
					}
				}
				newAchievements.unshift({'name':$(this).find('option:selected').text(), 'id':$(this).val(), 'type':$(this).attr('class').replace(/^ach/i,'')});
			} 
		});
		for (var i=newAchievements.length-1;i>=0;i--) {
			if (newAchievements.length>10)
				newAchievements.splice(i, 1);
		}
		localStorage.setItem('kat_last_achievements', JSON.stringify(newAchievements));
		console.log(JSON.stringify(newAchievements));
	}
}
$(document).delegate('.addAnotherCheevo_js', 'click', function() {
	var parent = $(this).closest('div');
	var html = parent.clone().wrap('<sexy>').parent().html();
	parent.after(html);
	parent.next().find('a.addAnotherCheevo_js').removeClass('addAnotherCheevo_js').addClass('removeAnotherCheevo_js').html('-');
});
$(document).delegate('.removeAnotherCheevo_js', 'click', function() {
	var parent = $(this).closest('div');
	parent.fadeOut(200, function() {
		parent.remove()
	});
});
$(document).delegate('#addAchievement', 'click', function() {
	if ($(this).is('.disabledButton')) return false;
	$(this).addClass('disabledButton');
	var data = $(this).closest('form').serialize();
	rememberTheseAchievements($(this).closest('form'));
	var url = $(this).closest('form').attr('action');
	$.ajax({
		'type':'POST',
		'url':url+'?'+data,
		'dataType':'json',
		success: function(data) {
			if (data.method == 'ok') {
				$.fancybox.close();
				if (post_id) {
					$('[post-id="'+post_id+'"]').css('opacity', '0.5');
				}
			}else{
				alert('An error occurred when assigning the achievements.\n'+data.html);
			}
		}, error: function() {
			alert('An error occurred when assigning the achievements.');
		}
	})
});
$(document).delegate('.quickAssignAchievement_js', 'click', function() {
	if ($(this).parent().is('.faded')) return false;
	var btn = $(this); var url = btn.closest('form').attr('action'); var ach_id = btn.attr('achievement-id');
	if ($(this).closest('form').find('select option[value="'+ach_id+'"]').length==0) {
		btn.parent().addClass('faded');
		alert('User already has this achievement');
		return false;
	}
	$.ajax({
		'type':'POST',
		'url':url,
		'data':{'achievement[]':ach_id},
		'dataType':'json',
		success: function(data) {
			if (data.method=='ok') {
				btn.parent().addClass('faded');
			}else{
				alert('Error:\n'+data.html);
			}
		}
	});
});