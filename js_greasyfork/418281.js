// ==UserScript==
// @name         JD VMS Integration
// @namespace    com.jd.vms
// @version      1.0.4
// @description  Auto fill vms form fields
// @author       tinymins
// @match        http://vms.jd.com/Integration/Apply
// @icon         http://vms.jd.com/assets/img/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418281/JD%20VMS%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/418281/JD%20VMS%20Integration.meta.js
// ==/UserScript==

const getConfig = () => {
  let config = {};
  try {
    config = JSON.parse(window.localStorage['com.derzh.jd.vms.integration.apply.preset']);
  } catch (error) {}
  if (typeof config !== 'object') {
    config = {};
  }
  return Object.assign({
    apply_type: '4',
    version_server: '0',
    test_content: '无',
    module_id: '73',
    self_test: '0',
    modification_explanation: '无',
    affect_range: '无',
    interface_name: '无',
    test_data: '无',
    test_address: 'http://beta-ace.jd.com/launch/',
    code_branch: 'prod',
    review_result: '1',
    request_memo: '无',
    code_review_operator: '',
    product_operator: '',
    test_operator: '',
  }, config);
};

$('#cancel-apply-request').after('<button type="button" class="btn btn-default pull-right">存为预设</button>').next().click(() => {
  window.localStorage['com.derzh.jd.vms.integration.apply.preset'] = JSON.stringify({
    apply_type: $('#apply_type').val(),
    version_server: $('#version_server').val(),
    test_content: $('#test_content').val(),
    module_id: $('#module_id').val(),
    self_test: $('#self_test').val(),
    modification_explanation: $('#modification_explanation').val(),
    affect_range: $('#affect_range').val(),
    interface_name: $('#interface_name').val(),
    test_data: $('#test_data').val(),
    test_address: $('#test_address').val(),
    code_branch: $('#code_branch').val(),
    review_result: $('#review_result').val(),
    request_memo: $('#request-memo').val(),
    code_review_operator: $('#code-review-operator').val(),
    product_operator: $('#product-operator').val(),
    test_operator: $('#test-operator').val(),
  });
});

$('#jacp_card_id').after('<button style="margin: 5px; height: 30px; transform: translateY(2px);">行云</button>').next().click(() => {
  if ($('#jacp_card_id').val() === '-1') {
    return alert('请先选择卡片');
  }
  window.open(`http://jagile.jd.com/teamspace/cardlist/tf_project/carddetail?cardId=${$('#jacp_card_id').val()}`);
});

$('#jacp_card_id').after('<button style="margin: 5px; height: 30px; transform: translateY(2px);">FILL</button>').next().click(() => {
  if ($('#jacp_card_id').val() === '-1') {
    return alert('请先选择卡片');
  }
  const config = getConfig();
  $('#apply_type').val(config.apply_type).change();
  const dateNextMonth = new Date();
  dateNextMonth.setTime(dateNextMonth.getTime() + 86400e3 * 30);
  $('#expect_online_date').val(
    [dateNextMonth.getFullYear(), dateNextMonth.getMonth() + 1, dateNextMonth.getDate()]
      .map(a => (a < 10 ? `0${a}` : a))
      .join('-'),
  );
  $('#version_server').val(config.version_server);
  $('#test_content').val(config.test_content);
  $('#module_id').val(config.module_id).change();
  $('#self_test').val(config.self_test);
  $('#modification_explanation').val(config.modification_explanation);
  $('#affect_range').val(config.affect_range);
  $('[name="degrade_switch_apply"][value="0"]+ins').click();
  $('[name="pressure_test"][value="0"]+ins').click();
  $('#interface_name').val(config.interface_name);
  $('#test_data').val(config.test_data);
  $('#test_address').val(config.test_address);
  $('#code_branch').val(config.code_branch);
  $('#review_result').val(config.review_result).change();
  $('#request-memo').val(config.request_memo);
  const fetch = (url) => {
    const xml = new XMLHttpRequest();
    xml.open('GET', url, false);
    xml.withCredentials = true;
    xml.send();
    return xml.responseText;
  };
  const fill_erp_tags = async (elid, erps) => {
    const data = await Promise.all(
      erps
        .split(',')
        .map(s => s.trim())
        .filter(_ => _)
        .map(
          erp => $.ajax(`http://vms.jd.com/user/get_user_base_info?keyword=${erp}`)
            .then(res => res.info.data.find(({ user_name }) => user_name === erp)),
        )
        .filter(_ => _),
    );
    const jqEl = $(`#${elid}`);
    jqEl.tagsinput('removeAll');
    data.filter(_ => _).forEach(v => jqEl.tagsinput('add', v));
  };
  const card = JSON.parse(fetch(`http://jagile.jd.com/jacp/api/v1/bizSpaceCard/cardDetail?id=${jacp_card_dom.val()}`));
  const roles = JSON.parse(fetch(`http://jagile.jd.com/jacp/api/v1/bizConfig/space/kv/${card.data.spaceId}`))
    .data.reduce((a, b) => {
      if (String(b.name + b.group).match(/测试/u)) {
        a[b.code] = 1;
      }
      return a;
    }, {});
  fill_erp_tags('code-review-operator', config.code_review_operator);
  fill_erp_tags('product-operator', card.data.creator.erp || config.product_operator);
  fill_erp_tags('test-operator', card.data.personHours.find(a => roles[a.roleCode])?.erp || config.test_operator);
});
