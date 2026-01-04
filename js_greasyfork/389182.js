// ==UserScript==
// @name         idle-战斗页改
// @version      1.00
// @namespace    ErQi
// @description  挂机无止境的辅助脚本
// @author       Dammu
// @run-at       document-start
// @include      https://www.idleinfinity.cn/Battle/Simulate*
// @include      https://www.idleinfinity.cn/Battle/InDungeon*
// @include      https://www.idleinfinity.cn/Battle/WithChar*
// @downloadURL https://update.greasyfork.org/scripts/389182/idle-%E6%88%98%E6%96%97%E9%A1%B5%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/389182/idle-%E6%88%98%E6%96%97%E9%A1%B5%E6%94%B9.meta.js
// ==/UserScript==


function BattlePageRE() {
	if (!$('.error').length) {
		let waitTime = $('#time');
		if (waitTime.length) {
			waitTime = waitTime.val();
		} else {
			$(document).ready(function () {
				$(".turn").battle({
					interval: 0,
					guaji: 0
				});
			});
		}
	}

	const battleResult = {};
	const addedDamageTypes = ['溅射', '触发了技能', '对方受到'];

	function getDamageType(plainText) {
		let ret = -1;
		addedDamageTypes.forEach((item, i) => {
			if (plainText.indexOf(item) >= 0) ret = i;
		});
		return ret;
	}

	$('.turn').each(function (index) {
		if (index > 0) {
			const line = $(this).children().eq(1);
			const hpData = $(this).children().first().data('hp');
			const id = line.children()[0].innerHTML;
			if (!hpData[1]) return;
			const firstTargetId = hpData[1].id;
			const skillLabel = line.children('.skill-name');
			const skill = skillLabel.length ? skillLabel.eq(0).text() : '普通攻击';
			const damageLabel = line.children('.damage');

			let damage = 0;
			let damageDetail = {base: 0};
			if (firstTargetId < 0) {
				damage = damageLabel.length ? damageLabel.eq(0).text() - 0 : 0;
				damageDetail = {base: damage};
				$(this).children().each(function (i) {
					if (i > 1) {
						const plainText = getPlainText($(this));
						if (getDamageType(plainText) >= 0) {
							const addedDamage = $(this).children('.damage').eq(0).text() - 0;
							const damageType = getDamageType(plainText);
							damage += addedDamage;
							const lastDamage = damageDetail[damageType];
							damageDetail[damageType] = lastDamage ? lastDamage + addedDamage : addedDamage;
						}
					}
				});
			}
			if (!battleResult[id]) battleResult[id] = {};
			if (!battleResult[id][skill]) battleResult[id][skill] = {
				turn: 0,
				damage: 0,
				damageDetail: {}
			};

			const skillData = battleResult[id][skill];
			skillData.turn += 1;
			skillData.damage += damage;
			Object.keys(damageDetail).forEach(type => {
				if (skillData.damageDetail[type]) {
					skillData.damageDetail[type] += damageDetail[type];
				} else {
					skillData.damageDetail[type] = damageDetail[type];
				}
			});
		}
	});

	const totalTurns = $('.turn').length - 1;
	let partyTotalDamage = 0;
	$('.battle-data tbody tr').each(function (index) {
		if (getCharId(index) > 0) {
			const dmg = $(this).children().eq(2).text() - 0;
			partyTotalDamage += dmg;
		}
	});

	$('.battle-data thead tr td').eq(2).after('<td class="text-center">友方伤害占比</td><td class="text-center">详情</td><td class="text-center">出手次数</td><td class="text-center">出手占比</td><td class="text-center">每回合伤害</td>');
	$('.battle-data tbody tr').each(function (index) {
		const id = getCharId(index);
		const actor = $(this).children().first().text();
		const turns = getActorTurns(actor);
		const turnsPercent = (turns / totalTurns * 100).toFixed(1) - 0;
		const damage = $(this).children().eq(2).text() - 0;
		const damagePercent = id > 0 ? `${(damage / partyTotalDamage * 100).toFixed(1) - 0}%` : '-';
		const avgDamage = turns > 0 ? Math.round(damage / turns) : '-';
		const link = battleResult[actor] ? `<a href="javascript: void(0);" class="link-detail" data-id="${actor}" data-actor="${actor}">查看</a>` : '-';
		const content = `<td class="text-center poison">${damagePercent}</td><td class="text-center">${link}</td><td class="text-center physical ddd">${turns}</td><td class="text-center poison">${turnsPercent}%</td><td class="text-center fire ee">${avgDamage}</td>`;
		$(this).children().eq(2).after(content);
	});

	$('.battle-data').css('overflow', 'auto');

	const modal = `
	<div class="modal fade" id="modalBattleDetail" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content model-inverse">
				<div class="modal-header">
					<span class="modal-title"><span id="idle-ui-char"></span> - 伤害详情</span>
				</div>
				<div class="modal-body">
					<table class="table table-condensed">
						<thead><tr><th class="text-center">技能</th><th class="text-center">总伤害</th><th class="text-center">伤害占比</th><th class="text-center">出手次数</th><th class="text-center">出手占比</th><th class="text-center">每回合伤害</th><th class="text-center">直接伤害</th><th class="text-center">溅射</th><th class="text-center">触发技能</th><th class="text-center">持续伤害及其他</th></tr></thead>
						<tbody id="idle-ui-battle-rows"></tbody>
					</table>
					<ul>
						<li>直接伤害：技能造成的实际直接伤害</li>
						<li>溅射：因溅射，对非主目标造成的溅射伤害之和</li>
						<li>触发技能：【装备自带技能】或【被击中触发】的技能等被触发后造成的伤害</li>
						<li>持续伤害及其他：技能造成的持续伤害，以及其他伤害  </li>
					</ul>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default btn-xs" data-dismiss="modal">关闭</button>
				</div>
			</div>
		</div>
	</div>
	`;

	$(document.body).append(modal);

	$('.link-detail').click(function () {
		const id = $(this).data('id');
		const data = battleResult[id];
		const actor = $(this).data('actor');
		$('#idle-ui-char').text(actor);
		let actorTotalTurns = 0;
		let actorTotalDamage = 0;
		Object.keys(data).forEach(skill => {
			actorTotalTurns += data[skill].turn;
			actorTotalDamage += data[skill].damage;
		});

		const content = Object.keys(data).map(skill => {
			const skillData = data[skill];
			const percent = (skillData.turn / actorTotalTurns * 100).toFixed(1) - 0;
			const damagePercent = (skillData.damage / actorTotalDamage * 100).toFixed(1) - 0;
			const avgDamage = skillData.turn > 0 ? Math.round(skillData.damage / skillData.turn) : '-';
			return `<tr><td class="text-center skill">${skill}</td><td class="text-center fire">${skillData.damage}</td><td class="text-center poison">${damagePercent}%</td><td class="text-center physical">${skillData.turn}</td><td class="text-center poison">${percent}%</td><td class="text-center fire">${avgDamage}</td><td class="text-center fire">${skillData.damageDetail.base}</td><td class="text-center fire">${skillData.damageDetail['0'] || 0}</td><td class="text-center fire">${skillData.damageDetail['1'] || 0}</td><td class="text-center fire">${skillData.damageDetail['2'] || 0}</td></tr>`;
		}).join('');
		$('#idle-ui-battle-rows').html(content);
		$('#modalBattleDetail').modal('show');
	});

	function getCharId(index) {
		const ary = $('.battle-char').eq(index).prop('id').split('_');
		return ary[ary.length - 1];
	}

	function getActorTurns(id) {
		let ret = 0;
		if (battleResult[id]) {
			Object.keys(battleResult[id]).forEach(skill => {
				ret += battleResult[id][skill].turn;
			});
		}
		return ret;
	}

	function getPlainText(element) {
            return element.clone()    //clone the element
                .children() //select all the children
                .remove()   //remove all the children
                .end()  //again go back to selected element
                .text();
            }
}

window.addEventListener('load', BattlePageRE, false);
