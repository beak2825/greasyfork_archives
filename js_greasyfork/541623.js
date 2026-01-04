// ==UserScript==
// @name         BLACK | Скрипт для КФ (Перемещение тем на другие сервера)
// @namespace    https://forum.blackrussia.online
// @version      1.6
// @description   Скрипт для кф BLACK сервера (быстрое перемещение тем на сервера)
// @author       Z.Litvinenko
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon         https://i.postimg.cc/4dx4TnMh/IMG-20250425-052540.jpg
// @downloadURL https://update.greasyfork.org/scripts/541623/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%28%D0%9F%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%82%D0%B5%D0%BC%20%D0%BD%D0%B0%20%D0%B4%D1%80%D1%83%D0%B3%D0%B8%D0%B5%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541623/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%28%D0%9F%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%82%D0%B5%D0%BC%20%D0%BD%D0%B0%20%D0%B4%D1%80%D1%83%D0%B3%D0%B8%D0%B5%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%29.meta.js
// ==/UserScript==

(function () {
  'use strict';


  const COMMON_PREFIX_ID = 14;
  const BUTTON_CONFIGS = [
    {
      title: 'RED | №1',
      targetNodeId: 88
    },
    {
      title: 'GREEN | №2',
      targetNodeId: 119
    },
    {
      title: 'BLUE | №3',
      targetNodeId: 156
    },
    {
      title: 'YELLOW | №4',
      targetNodeId: 194
    },
    {
      title: 'ORANGE | №5',
      targetNodeId: 273
    },
    {
      title: 'PURPLE | №6',
      targetNodeId: 312
    },
    {
      title: 'LIME | №7',
      targetNodeId: 352
    },
    {
      title: 'PINK | №8',
      targetNodeId: 394
    },
    {
  title: 'CHERRY | №9',
  targetNodeId: 435
    },
    {
  title: 'BLACK | №10',
  targetNodeId: 470
    },
    {
  title: 'INDIGO | №11',
  targetNodeId: 519
    },
    {
  title: 'WHITE | №12',
  targetNodeId: 560
    },
    {
  title: 'MAGENTA | №13',
  targetNodeId: 599
    },
    {
  title: 'CRIMSON | №14',
  targetNodeId: 640
    },
    {
  title: 'GOLD | №15',
  targetNodeId: 682
    },
    {
  title: 'AZURE | №16',
  targetNodeId: 723
    },
    {
  title: 'PLATINUM | №17',
  targetNodeId: 785
    },
    {
  title: 'AQUA | №18',
  targetNodeId: 844
    },
    {
  title: 'GRAY | №19',
  targetNodeId: 885
    },
    {
  title: 'ICE | №20',
  targetNodeId: 954
    },
    {
  title: 'CHILI | №21',
  targetNodeId: 994
    },
    {
  title: 'CHOCO | №22',
  targetNodeId: 1036
    },
    {
  title: 'MOSCOW | №23',
  targetNodeId: 1082
    },
    {
  title: 'SPB | №24',
  targetNodeId: 1124
    },
    {
  title: 'UFA | №25',
  targetNodeId: 1167
    },
    {
  title: 'SOCHI | №26',
  targetNodeId: 1234
    },
    {
  title: 'KAZAN | №27',
  targetNodeId: 1276
    },
    {
  title: 'SAMARA | №28',
  targetNodeId: 1320
    },
    {
  title: 'ROSTOV | №29',
  targetNodeId: 1362
    },
    {
  title: 'ANAPA | №30',
  targetNodeId: 1402
    },
    {
  title: 'EKB | №31',
  targetNodeId: 1444
    },
    {
  title: 'KRASNODAR | №32',
  targetNodeId: 1488
    },
    {
  title: 'ARZAMAS | №33',
  targetNodeId: 1531
    },
    {
  title: 'NOVOSIBIRSK | №34',
  targetNodeId: 1572
    },
    {
  title: 'GROZNY | №35',
  targetNodeId: 1614
    },
    {
  title: 'SARATOV | №36',
  targetNodeId: 1656
    },
    {
  title: 'OMSK | №37',
  targetNodeId: 1698
    },
    {
  title: 'IRKUTSK | №38',
  targetNodeId: 1740
    },
    {
  title: 'VOLGOGRAD | №39',
  targetNodeId: 1786
    },
    {
  title: 'VORONEZH | №40',
  targetNodeId: 1828
    },
    {
  title: 'BELGOROD | №41',
  targetNodeId: 1870
    },
    {
  title: 'MAKHACHKALA | №42',
  targetNodeId: 1912
    },
    {
  title: 'VLADIKAVKAZ | №43',
  targetNodeId: 1954
    },
    {
  title: 'VLADIVOSTOK | №44',
  targetNodeId: 1996
    },
    {
  title: 'KALININGRAD | №45',
  targetNodeId: 2038
    },
    {
  title: 'CHELYABINSK | №46',
  targetNodeId: 2080
    },
    {
  title: 'KRASNOYARSK | №47',
  targetNodeId: 2122
    },
    {
  title: 'CHEBOKSARY | №48',
  targetNodeId: 2164
    },
    {
  title: 'KHABAROVSK | №49',
  targetNodeId: 2206
    },
    {
  title: 'PERM | №50',
  targetNodeId: 2248
    },
    {
  title: 'TULA | №51',
  targetNodeId: 2290
    },
    {
  title: 'RYAZAN | №52',
  targetNodeId: 2332
    },
    {
  title: 'MURMANSK | №53',
  targetNodeId: 2374
    },
    {
  title: 'PENZA | №54',
  targetNodeId: 2416
    },
    {
  title: 'KURSK | №55',
  targetNodeId: 2458
    },
    {
  title: 'ARKHANGELSK | №56',
  targetNodeId: 2500
    },
    {
  title: 'ORENBURG | №57',
  targetNodeId: 2545
    },
    {
  title: 'KIROV | №58',
  targetNodeId: 2584
    },
    {
  title: 'KEMEROVO | №59',
  targetNodeId: 2626
    },
    {
  title: 'TYUMEN | №60',
  targetNodeId: 2663
    },
    {
  title: 'TOLYATTI | №61',
  targetNodeId: 2702
    },
    {
  title: 'IVANOVO | №62',
  targetNodeId: 2735
    },
    {
  title: 'STAVROPOL | №63',
  targetNodeId: 2767
    },
    {
  title: 'SMOLENSK | №64',
  targetNodeId: 2799
    },
    {
  title: 'PSKOV | №65',
  targetNodeId: 2831
    },
    {
  title: 'BRYANSK | №66',
  targetNodeId: 2863
    },
    {
  title: 'OREL | №67',
  targetNodeId: 2895
    },
    {
  title: 'YAROSLAVL | №68',
  targetNodeId: 2927
    },
    {
  title: 'BARNAUL | №69',
  targetNodeId: 2959
    },
    {
  title: 'LIPETSK | №70',
  targetNodeId: 2991
    },
    {
  title: 'ULYANOVSK | №71',
  targetNodeId: 3023
    },
    {
  title: 'YAKUTSK | №72',
  targetNodeId: 3055
    },
    {
  title: 'TAMBOV | №73',
  targetNodeId: 3309
    },
    {
  title: 'BRATSK | №74',
  targetNodeId: 3344
    },
    {
  title: 'ASTRAKHAN | №75',
  targetNodeId: 3379
    },
    {
  title: 'CHITA | №76',
  targetNodeId: 3414
    },
    {
  title: 'KASTROMA | №77',
  targetNodeId: 3449
    },
    {
  title: 'VLADIMIR | №78',
  targetNodeId: 3484
    },
    {
  title: 'KALUGA | №79',
  targetNodeId: 3519
    },
    {
  title: 'N.NOVGOROD | №80',
  targetNodeId: 3555
    },
    {
  title: 'TAGANROG | №81',
  targetNodeId: 3590
    },
    {
  title: 'VOLOGDA | №82',
  targetNodeId: 3625
    },
    {
  title: 'TVER | №83',
  targetNodeId: 3666
    },
    {
  title: 'TOMSK | №84',
  targetNodeId: 3728
    },
    {
  title: 'IZHEVSK | №85',
  targetNodeId: 3767
    },
    {
  title: 'SURGUT | №86',
  targetNodeId: 3800
    },
    {
  title: 'PODOLSK | №87',
  targetNodeId: 3837
    },
    {
  title: 'MAGADAN | №88',
  targetNodeId: 3932
    },
    {
  title: 'CHEREPOVETS | №89',
  targetNodeId: 3967
    },

  ];


  function createPanel() {
    const panel = $('<div>', {
      id: 'move-panel',
      css: {
        position: 'fixed',
        top: '5%',
        right: '-300px',
        width: '300px',
        height: '100%',
        backgroundColor: '#222',
        color: '#fff',
        padding: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        transition: 'right 0.3s',
        overflowY: 'auto',
        zIndex: 1001
      }
    });

    const toggleButton = $('<button>', {
      text: '≡ Moving',
      css: {
        position: 'fixed',
        top: '14px',
        right: '10px',
        padding: '5px',
        backgroundColor: '#333',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        zIndex: 1001
      }
    });

    toggleButton.click(() => {
      const isOpen = panel.css('right') === '0px';
      panel.css('right', isOpen ? '-300px' : '0');
    });


    BUTTON_CONFIGS.forEach(config => {
      const button = $('<button>', {
        text: config.title,
        css: {
          display: 'block',
          width: '100%',
          padding: '10px',
          margin: '5px 0',
          backgroundColor: '#444',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }
      });

      button.click(() => {
        const threadId = getThreadId();
        moveThread(threadId, config.targetNodeId, COMMON_PREFIX_ID);
      });

      panel.append(button);
    });

    $('body').append(panel, toggleButton);
  }

  function moveThread(threadId, targetNodeId, prefixId) {
    const threadTitle = $('.p-title-value')[0].lastChild.textContent.trim();

    const moveData = {
      prefix_id: prefixId,
      title: threadTitle,
      target_node_id: targetNodeId,
      redirect_type: 'none',
      notify_watchers: 1,
      starter_alert: 1,
      starter_alert_reason: "",
      _xfToken: $('input[name="_xfToken"]').val(),
      _xfRequestUri: window.location.pathname,
      _xfWithData: 1,
      _xfResponseType: 'json'
    };

    fetch(`/threads/${threadId}/move`, {
      method: 'POST',
      body: getFormData(moveData)
    })
      .then(response => {
        if (!response.ok) throw new Error('Ошибка перемещения');
        alert(`Тема успешно перемещена ✅ (Нажмите "ОК")`);
        window.location.reload();
      })
      .catch(error => {
        console.error(error);
        alert('Ошибка при перемещении темы. Смотрите консоль.');
      });
  }


  function getThreadId() {
    return document.URL.split('/threads/')[1].split('/')[0];
  }

  function getFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    return formData;
  }


  $(document).ready(() => {
    createPanel();
  });
})();
