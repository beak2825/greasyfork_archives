// ==UserScript==
// @name         Время для героя - БОТ
// @namespace    https://www.timetobehero.ru/
// @version      1.8
// @description  Скрипт берёт на себя часть геймплея
// @author       Yes I`m
// @match        https://*/*
// @downloadURL https://update.greasyfork.org/scripts/373989/%D0%92%D1%80%D0%B5%D0%BC%D1%8F%20%D0%B4%D0%BB%D1%8F%20%D0%B3%D0%B5%D1%80%D0%BE%D1%8F%20-%20%D0%91%D0%9E%D0%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/373989/%D0%92%D1%80%D0%B5%D0%BC%D1%8F%20%D0%B4%D0%BB%D1%8F%20%D0%B3%D0%B5%D1%80%D0%BE%D1%8F%20-%20%D0%91%D0%9E%D0%A2.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Инициализация скрипта
  // Проверяем URL
  if (/https:\/\/www.timetobehero.ru/.test(window.location.href)) { // Если нужный нам, то
    // Системные
    let max_wait = 30, // Кол-во итераций ожидание, после которых произойдёт перезагрузка
      repeat_flag = false, // Флаг для отсечения повторных вызовов
      dens_flag = true // Флаг доступа к логовам

    // Локации
    const city = `img[src="https://satimetobehero.cdnvideo.ru/ds1/locations/cradle/fort_wide.jpg"]`, // Город
      dens = `img[src="https://satimetobehero.cdnvideo.ru/ds1/locations/cradle/fort_near_wide.jpg"]`, // Логова
      fighting = `div.x-container.x-box-item.x-container-exgods.x-abs-layout-ct.x-skin`, // Бой
      choice = `li[data-qtip="Нормальная сложность 1 этап"]`, // Выбор оружия
      boxes = `[style *= 'background-image: url("https://satimetobehero.cdnvideo.ru/ds1/chests/bg.jpg");']` // Комната с сундуками

    // Кнопки
    const dens_btn = `[style="height: 100%; width: 100%; background-color: black; opacity: 0; position: absolute; top:0; left: 0px;"]`, // Логова
      fight_btn = `div.timedtimer-btn a:not(.x-item-disabled)`, // В бой
      fight_btn2 = `div.timedtimerbuy-btn a`, // В бой (при покупке свитков)
      bay_scrolls = `a.x-btn.no_border_double.x-unselectable.x-box-item.x-toolbar-item.x-btn-txt`, // Покупка свитков
      dens_backward_btn = `div.x-panel-body.x-panel-body-exgods.x-panel-body-exgods[style="height: 30px; left: 0px; top: 0px; width: 581px;"] a`, // Назад к логовам
      city_backward_btn = `div.x-container.location-object.location-object-button.x-abs-layout-item.x-container-exgods.qh-object[style="z-index:1;left:748px;top:365px;width:92px;height:46px;"] a`, // Назад в город
      box_btn = `div.x-component.header-button.qh-object.x-component-exgods.x-border-box`,
      bot_attack = `a.x-btn.qh-object.double_text_btn.x-btn-txt-red.x-unselectable.x-btn-txt.do-attack-bot`, // Атаковать бота
      bot_banish = `a.x-btn.qh-object.double_text_btn.double_text.x-unselectable.x-btn-txt.do-banish-bot`, // Изгнать бота
      login_btn = `button#login-button`, // Кнопка входа
      login_vk_btn = `a.social-vk` // Кнопка входа через вк


    // Элементы
    const loader = '#loader_blik', // Начальный загрузчик
      pig_den = `a[style*='background-image: url("https://satimetobehero.cdnvideo.ru/ds1/locations/cradle/rooms/fort_near/den_boars.png");']`, // Логово кабанов
      weapon_1 = `li[data-qtip="Нормальная сложность 1 этап"]`, // Оружие 1
      scrolls = `span.big_counter_mid`, // Свитки
      crystals = `span#user-finance-crystal`, // Кристаллы
      my_mana = `div#tech-info-innerCt div.x-progress-text.x-progress-text-back` // Мана персонажа

    const bots = `div.image.qh-object[data-qh_otype="bot_any"]`, // Боты
      bot_w = `div.x-panel-body.x-panel-body-exgods.x-abs-layout-ct.x-panel-body-exgods[data-ref="body"][role="presentation"] span.userinfo span.name`, // Окно с ботом
      bot_name = `div.x-panel-body.x-panel-body-exgods.x-abs-layout-ct.x-panel-body-exgods[data-ref="body"][role="presentation"] span.userinfo span.name` // Имя бота

    const box_1 = `[style *= 'background-image: url("https://satimetobehero.cdnvideo.ru/ds1/chests/chest_top_l.png");']`,
      box_2 = `[style *= 'background-image: url("https://satimetobehero.cdnvideo.ru/ds1/chests/chest_top_c.png");']`,
      box_3 = `[style *= 'background-image: url("https://satimetobehero.cdnvideo.ru/ds1/chests/chest_bottom_r.png");']`,
      box_4 = `[style *= 'background-image: url("https://satimetobehero.cdnvideo.ru/ds1/chests/chest_bottom_l.png");']`,
      key_1 = `[style="background-image:url(https://satimetobehero.cdnvideo.ru/ds1/items/keys/Chest_1_key_60_no_bgrnd.png)"] span`, // Ключ №1
      key_2 = `[style="background-image:url(https://satimetobehero.cdnvideo.ru/ds1/items/keys/Chest_2_key_60_no_bgrnd.png)"] span`, // Ключ №2
      key_3 = `[style="background-image:url(https://satimetobehero.cdnvideo.ru/ds1/items/keys/Chest_5_key_60_no_bgrnd.png)"] span`, // Ключ №3
      key_4 = `[style="background-image:url(https://satimetobehero.cdnvideo.ru/ds1/items/keys/Chest_3_key_60_no_bgrnd.png)"] span` // Ключ №4

    const slots = `div.wrap div.slot`, // Слоты с действиями в бою
      elem_damage = `div.label.ellipsis`, // Дамаг действия
      elem_mana = `div.cost.ellipsis span span span`, // Мана действия
      elem_type = `img[src="http://satimetobehero.cdnvideo.ru/ds1/icons/stats/ico_injury16.png"]`, // Тип действия "атака"
      wild_indicator = `span.name[data-qtip="Дикая стая"]`, // Индикатор дикой стаи
      auth_info = `div.auth-info` // Информация о пользователе


    // Проверяем URL
    if (/https:\/\/www.timetobehero.ru\/main.pl/.test(window.location.href)) { // Если мы в игре, то
      // Начинаем геймплей
      loading_wait();
    } else { // Иначе
      console.log(`Пытаемся войти в игру`);

      // Пытаемся перезайти
      auto_enter();
    }


    // Автоматический возврат в игру при вылете
    function auto_enter() {
      // Ждём появления кнопки
      waiter(true, [{
        have: true,
        selector: login_btn,
        number: 0
      }], 500, 'Ждём кнопки входа', () => {
        if (document.querySelector(auth_info) !== null) { // Если пользователь авторизован
          console.log('Возвращаемся в игру!');

          // Нажать "В бой"
          document.querySelector(login_btn).click();
        } else { // Иначе
          if (document.querySelectorAll(login_vk_btn).length) { // Если есть кнопка авторизации через вк
            console.log('Входим в игру!');

            // Кликаем по кнопке
            document.querySelectorAll(login_vk_btn)[0].click();
          } else { // Иначе
            console.log('Ничего нет...')
          }
        }
      });
    }

    // Загрузка скрипта
    function loading_wait() {
      waiter(true, [{
        have: false,
        selector: loader,
        number: 0
      }], 5000, 'Ждём загрузки игры', () => {
        if (document.querySelector(city) !== null && document.querySelector(`div.x-component.level.x-abs-layout-item.x-component-exgods img`).getAttribute('alt') === '1' && !document.querySelector(`div.x-container.location-object.location-object-button.x-abs-layout-item.x-container-exgods.qh-object`)) { // Если находимся в городе, 1 уровень и нет доступа к логовам
          console.log('Логова ещё не доступны!')

          if (document.querySelector('span[data-qtip="Бурый медведь"]') !== null) { // Если мы только-что победили бурого медведя
            // Запускаем обработчик 2 части 3 задания
            task_3_2()
          } else { // Иначе
            // Запускаем обработчик 1 задания
            task_1()
          }

        } else {
          // Если находимся в сундуках
          if (document.querySelector(boxes) !== null) {
            box_window()
          } else {
            // Если находимся в окне бота
            if (document.querySelector(bot_w) !== null) {
              bot_window();
            } else {
              // Если находимся в городе
              if (document.querySelector(city) !== null) {
                city_wait();
              } else {
                // Если находисмя в логовах
                if (document.querySelectorAll(dens)[0] !== undefined && document.querySelectorAll(choice)[0] === undefined) {
                  dens_wait();
                } else {
                  // Если в логове
                  if (document.querySelectorAll(choice)[0] !== undefined && document.querySelectorAll(weapon_1)[0] !== undefined) {
                    weapon_wait();
                  } else {
                    // Если в бою
                    if (document.querySelectorAll(fighting)[0] !== undefined) {
                      fight();
                    } else {
                      console.log(`Неизвестная страница!`);
                    }
                  }
                }
              }
            }
          }
        }
      });
    }


    // Оброботчик прохождения 1 задания
    function task_1() {
      // Нажимаем на задание
      document.querySelector('div.quest-giver-image[style *= "https://satimetobehero.cdnvideo.ru/ds1/npc/human/healer_small.jpg"]').click()

      // Ждём окна с заданием
      waiter(true, [{
          have: true,
          selector: 'span[data-qtip="Получить дом"]',
          number: 0
        },
        {
          have: true,
          selector: 'a[class="x-btn qh-object world-quest-action no_border x-unselectable x-btn-txt x-border-box qh-on"]',
          number: 0
        }
      ], 500, 'Ждём окна с заданием', () => {
        // Берём задание
        document.querySelector('a[class="x-btn qh-object world-quest-action no_border x-unselectable x-btn-txt x-border-box qh-on"]').click()

        // Ждём появления дома
        waiter(true, [{
          have: true,
          selector: 'a[style *= "https://satimetobehero.cdnvideo.ru/ds1/locations/cradle/rooms/fort/inn_new.png"]',
          number: 0
        }], 500, 'Ждём появления дома', () => {
          // Кликаем по дому
          document.querySelector('a[style *= "https://satimetobehero.cdnvideo.ru/ds1/locations/cradle/rooms/fort/inn_new.png"]').click()

          // Ждём появления Кнопки
          waiter(true, [{
            have: true,
            selector: 'a.x-btn.no_border.qh-object.x-unselectable.x-box-item.x-toolbar-item.x-btn-txt',
            number: 0
          }], 500, 'Ждём появления Кнопки', () => {
            // Кликаем по кнопке
            document.querySelector(`a.x-btn.no_border.qh-object.x-unselectable.x-box-item.x-toolbar-item.x-btn-txt`).click()

            // Ждём обработку
            setTimeout(() => {
              // Кликаем по дому
              document.querySelector('a[style *= "https://satimetobehero.cdnvideo.ru/ds1/locations/cradle/rooms/fort/inn_new.png"]').click()
            }, 5000)

            // Ждём открытия дома
            waiter(true, [{
              have: true,
              selector: 'a.x-btn.qh-object.x-btn-txt-green.x-unselectable.x-btn-txt[data-qh_otype="room_mask"]',
              number: 0
            }], 2000, 'Ждём открытия дома', () => {
              // Жмём надеть
              document.querySelector('a.x-btn.qh-object.x-btn-txt-green.x-unselectable.x-btn-txt[data-qh_otype="room_mask"]').click()

              // Ждём модального окна
              waiter(true, [{
                have: true,
                selector: 'div[id *= "confirmdialog"] a',
                number: 0
              }], 500, 'Ждём модального окна', () => {
                // Жмём "Да"
                document.querySelectorAll('div[id *= "confirmdialog"] a')[0].click()

                // Ждём закрытия модального окна
                setTimeout(() => {
                  // Жмём В город
                  document.querySelector('a.x-btn.qh-object.x-btn-txt-green.x-unselectable.x-btn-txt').click()

                  // Ждём закрытия дома
                  waiter(true, [{
                    have: false,
                    selector: 'a.x-btn.get_all_masks_btn.x-unselectable.x-abs-layout-item.x-btn-txt',
                    number: 0
                  }], 500, 'Ждём закрытия дома', () => {
                    // Открываем задания
                    document.querySelector(`div.quest-giver-image[style *= "https://satimetobehero.cdnvideo.ru/ds1/npc/human/healer_small.jpg"]`).click()

                    // Ждём открытия задания
                    waiter(true, [{
                        have: true,
                        selector: 'span[data-qtip="Получить дом"]',
                        number: 0
                      },
                      {
                        have: true,
                        selector: 'a[class="x-btn qh-object world-quest-action no_border x-unselectable x-btn-txt x-border-box qh-on"]',
                        number: 0
                      }
                    ], 500, 'Ждём открытия задания', () => {
                      // Жмём забрать награду
                      document.querySelector('a[class="x-btn qh-object world-quest-action no_border x-unselectable x-btn-txt x-border-box qh-on"]').click()

                      console.log('1 Задание выполнено!')

                      // Ждём "На всякий пожарный"
                      setTimeout(() => {
                        // Запускаем обработчик 2 задания
                        task_2()
                      }, 3000);
                    })
                  });
                }, 8000)
              });
            })
          })
        })
      })
    }

    // Обработчик прохождения 2 задания
    function task_2() {
      // Ждём появления след. задания
      waiter(true, [{
        have: true,
        selector: 'div.quest-giver-sign[style *= "https://satimetobehero.cdnvideo.ru/ds1/quests/icon_quest_exclamation_yellow.png"]',
        number: 0
      }], 500, 'Ждём появления след. задания', () => {
        // Кликаем по заданию
        document.querySelector('div.quest-giver-sign[style *= "https://satimetobehero.cdnvideo.ru/ds1/quests/icon_quest_exclamation_yellow.png"]').click()

        // Ждём открытия задания
        waiter(true, [{
            have: true,
            selector: 'span[data-qtip="Начать изучение умения Оружие"]',
            number: 0
          },
          {
            have: true,
            selector: 'a[class="x-btn qh-object world-quest-action no_border x-unselectable x-btn-txt x-border-box qh-on"]',
            number: 0
          }
        ], 500, 'Ждём открытия задания', () => {
          // Жмём взять задание
          document.querySelector('a[class="x-btn qh-object world-quest-action no_border x-unselectable x-btn-txt x-border-box qh-on"]').click()

          // Ждём обработки задания
          setTimeout(() => {
            // Переходим в умения
            document.querySelector('span#mainmenu-combos-and-features-button-btnWrap').click()

            // Ждём открытия умений
            waiter(true, [{
              have: true,
              selector: 'div[style *= "https://satimetobehero.cdnvideo.ru/ds1/icons/skills/base_weapons_dis.jpg"]',
              number: 0
            }], 500, 'Ждём открытия умений', () => {
              // Ждём прогрузки
              setTimeout(() => {
                // Кликаем по умению
                document.querySelector('div[style *= "https://satimetobehero.cdnvideo.ru/ds1/icons/skills/base_weapons_dis.jpg"]').click()

                // Ждём появления модального окна
                waiter(true, [{
                  have: true,
                  selector: 'a[class = "x-btn qh-object no_border x-unselectable x-toolbar-item x-btn-txt"]',
                  number: 0
                }], 500, 'Ждём появления модального окна', () => {
                  // Жмём изучить
                  document.querySelector('a[class = "x-btn qh-object no_border x-unselectable x-toolbar-item x-btn-txt"]').click()

                  // Ждём появления модального окна
                  waiter(true, [{
                    have: true,
                    selector: 'a.x-btn.qh-object.no_border.x-unselectable.x-toolbar-item.x-btn-txt',
                    number: 1
                  }], 500, 'Ждём появления модального окна', () => {
                    // Жмём да
                    document.querySelectorAll('a.x-btn.qh-object.no_border.x-unselectable.x-toolbar-item.x-btn-txt')[1].click()

                    // Ждём изучения
                    setTimeout(() => {
                      // Жмём готово
                      document.querySelector('a.x-btn.qh-object.x-btn-txt-green.x-unselectable.x-btn-txt').click()

                      // Ждём обработки клика
                      setTimeout(() => {
                        // Кликаем по умению
                        document.querySelector('div[style *= "https://satimetobehero.cdnvideo.ru/ds1/icons/skills/base_weapons_dis.jpg"]').click()

                        // Ждём появления модального окна
                        waiter(true, [{
                          have: true,
                          selector: 'a.x-btn.qh-object.no_border.x-unselectable.x-toolbar-item.x-btn-txt',
                          number: 0
                        }], 500, 'Ждём появления модального окна', () => {
                          // Жмём изучить
                          document.querySelector('a.x-btn.qh-object.no_border.x-unselectable.x-toolbar-item.x-btn-txt').click()

                          // Ждём появления модального окна
                          waiter(true, [{
                            have: true,
                            selector: 'a.x-btn.qh-object.no_border.x-unselectable.x-toolbar-item.x-btn-txt',
                            number: 1
                          }], 500, 'Ждём появления модального окна', () => {
                            // Жмём да
                            document.querySelectorAll('a.x-btn.qh-object.no_border.x-unselectable.x-toolbar-item.x-btn-txt')[1].click()

                            // Ждём обработки
                            setTimeout(() => {
                              // Открываем задание
                              document.querySelector(`div.quest-giver-image[style *= "https://satimetobehero.cdnvideo.ru/ds1/npc/human/fort_head_small.jpg"]`).click()

                              // Ждём открытия задания
                              waiter(true, [{
                                have: true,
                                selector: 'a.x-btn.qh-object.world-quest-action.no_border.x-unselectable.x-btn-txt.x-border-box.qh-on',
                                number: 0
                              }], 500, 'Ждём открытия задания', () => {
                                // Жмём забрать награду
                                document.querySelector('a.x-btn.qh-object.world-quest-action.no_border.x-unselectable.x-btn-txt.x-border-box.qh-on').click()

                                console.log('2 задание выполнено!')

                                // Ждём "На всякий пожарный"
                                setTimeout(() => {
                                  // Запускаем обработчик 2 задания
                                  task_3_1()
                                }, 3000);
                              });
                            }, 5000);
                          });
                        });
                      }, 5000)
                    }, (1000 * 60 + 5000));
                  });
                });
              }, 5000);
            });
          }, 5000);
        });
      });
    }

    // Обработчик прохождения 3 задания (часть 1)
    function task_3_1() {
      // Ждём появления след. задания
      waiter(true, [{
        have: true,
        selector: 'div[style *= "https://satimetobehero.cdnvideo.ru/ds1/quests/icon_quest_exclamation_yellow.png"]',
        number: 0
      }], 500, 'Ждём появления след. задания', () => {
        // Кликаем по заданию
        document.querySelector('div[style *= "https://satimetobehero.cdnvideo.ru/ds1/quests/icon_quest_exclamation_yellow.png"]').click()

        // Ждём открытия задания
        waiter(true, [{
            have: true,
            selector: 'span[data-qtip="Убить Медведя"]',
            number: 0
          },
          {
            have: true,
            selector: 'a[class="x-btn qh-object world-quest-action no_border x-unselectable x-btn-txt x-border-box qh-on"]',
            number: 0
          }
        ], 500, 'Ждём открытия задания', () => {
          // Жмём взять задание
          document.querySelector('a[class="x-btn qh-object world-quest-action no_border x-unselectable x-btn-txt x-border-box qh-on"]').click()

          // Ждём появления медведя
          waiter(true, [{
            have: true,
            selector: 'img[src = "https://satimetobehero.cdnvideo.ru/ds1/characters/monsters/monster_bear01_small.jpg"]',
            number: 0
          }], 500, 'Ждём появления медведя', () => {
            // Нажимаем на медведя
            document.querySelector('img[src="https://satimetobehero.cdnvideo.ru/ds1/characters/monsters/monster_bear01_small.jpg"]').click()

            // Запускаем обработчик окна с ботом
            waiter(true, [{
              have: true,
              selector: bot_w,
              number: 0
            }], 500, 'Ждём окна с ботом', () => {
              console.log(`Нападаем`);

              // Нажимаем "Напасть"
              document.querySelector(bot_attack).click();

              // Ждём появления модального окна
              waiter(true, [{
                have: true,
                selector: 'a.x-btn.qh-object.no_border.x-unselectable.x-toolbar-item.x-btn-txt',
                number: 0
              }], 500, 'Ждём появления модального окна', () => {
                // Жмём да
                document.querySelector('a.x-btn.qh-object.no_border.x-unselectable.x-toolbar-item.x-btn-txt').click()

                // Ждём боя
                waiter(true, [{
                  have: true,
                  selector: fighting,
                  number: 0
                }], 1000, 'Ждём загрузки боя', () => {
                  // Боёвка
                  fight();
                });
              })
            });
          });
        });
      });
    }

    // Обработчик прохождения 3 задания (часть 2)
    function task_3_2() {
      // Ждём обработки
      setTimeout(() => {
        // Открываем задание
        document.querySelector(`div.quest-giver-image[style *= "https://satimetobehero.cdnvideo.ru/ds1/npc/human/fort_head_small.jpg"]`).click()

        // Ждём открытия задания
        waiter(true, [{
            have: true,
            selector: 'span[data-qtip="Убить Медведя"]',
            number: 0
          },
          {
            have: true,
            selector: 'a[class="x-btn qh-object world-quest-action no_border x-unselectable x-btn-txt x-border-box qh-on"]',
            number: 0
          }
        ], 500, 'Ждём открытия задания', () => {
          // Жмём забрать награду
          document.querySelector('a[class="x-btn qh-object world-quest-action no_border x-unselectable x-btn-txt x-border-box qh-on"]').click()

          console.log('3 задание выполнено!')

          // Ждём "на всякий случай"
          setTimeout(() => {
            // Запускаем обработчик 4 задания
            task_4()
          }, 3000);
        });
      }, 5000);
    }

    // Обработчик прохождения 4 задания
    function task_4() {
      // Ждём появления след. задания
      waiter(true, [{
        have: true,
        selector: 'div[style *= "https://satimetobehero.cdnvideo.ru/ds1/quests/icon_quest_exclamation_yellow.png"]',
        number: 0
      }], 500, 'Ждём появления след. задания', () => {
        // Кликаем по заданию
        document.querySelector('div[style *= "https://satimetobehero.cdnvideo.ru/ds1/quests/icon_quest_exclamation_yellow.png"]').click()

        // Ждём открытия задания
        waiter(true, [{
            have: true,
            selector: 'span[data-qtip="Изгнать животных"]',
            number: 0
          },
          {
            have: true,
            selector: 'a[class="x-btn qh-object world-quest-action no_border x-unselectable x-btn-txt x-border-box qh-on"]',
            number: 0
          }
        ], 500, 'Ждём открытия задания', () => {
          // Жмём взять задание
          document.querySelector('a[class="x-btn qh-object world-quest-action no_border x-unselectable x-btn-txt x-border-box qh-on"]').click()

          // Ждём обработки клика
          setTimeout(() => {
            // Нажимаем на первого зверя
            document.querySelectorAll(bots)[0].click();

            waiter(true, [{
              have: true,
              selector: bot_w,
              number: 0
            }], 500, 'Ждём окна с ботом', () => {
              console.log(`Изгоняем`);

              // Нажимаем "изгнать"
              document.querySelector(bot_banish).click();

              // Ждём завершения изгнания
              setTimeout(() => {
                // Нажимаем на первого зверя
                document.querySelectorAll(bots)[0].click();

                waiter(true, [{
                  have: true,
                  selector: bot_w,
                  number: 0
                }], 500, 'Ждём окна с ботом', () => {
                  console.log(`Изгоняем`);

                  // Нажимаем "изгнать"
                  document.querySelector(bot_banish).click();

                  // Ждём завершения изгнания
                  setTimeout(() => {
                    // Нажимаем на первого зверя
                    document.querySelectorAll(bots)[0].click();

                    waiter(true, [{
                      have: true,
                      selector: bot_w,
                      number: 0
                    }], 500, 'Ждём окна с ботом', () => {
                      console.log(`Изгоняем`);

                      // Нажимаем "изгнать"
                      document.querySelector(bot_banish).click();

                      // Ждём завершения изгнания
                      setTimeout(() => {
                        // Открываем задание
                        document.querySelector(`div.quest-giver-image[style *= "https://satimetobehero.cdnvideo.ru/ds1/npc/human/fort_head_small.jpg"]`).click()

                        // Ждём открытия задания
                        waiter(true, [{
                            have: true,
                            selector: 'span[data-qtip="Изгнать животных"]',
                            number: 0
                          },
                          {
                            have: true,
                            selector: 'a[class="x-btn qh-object world-quest-action no_border x-unselectable x-btn-txt x-border-box qh-on"]',
                            number: 0
                          }
                        ], 500, 'Ждём открытия задания', () => {
                          // Жмём забрать награду
                          document.querySelector('a[class="x-btn qh-object world-quest-action no_border x-unselectable x-btn-txt x-border-box qh-on"]').click()

                          console.log('4 задание выполнено!')

                          // Ждём "на всякий случай"
                          setTimeout(() => {
                            // Запускаем обработчик 5 задания
                            task_5();
                          }, 3000);
                        });
                      }, 3000);
                    });
                  }, 3000);
                });
              }, 3000);
            });
          }, 3000);
        });
      });
    }

    // Обработчик прохождения 5 задания
    function task_5() {
      // Ждём появления след. задания
      waiter(true, [{
        have: true,
        selector: 'div[style *= "https://satimetobehero.cdnvideo.ru/ds1/quests/icon_quest_exclamation_yellow.png"]',
        number: 0
      }], 500, 'Ждём появления след. задания', () => {
        // Кликаем по заданию
        document.querySelector('div[style *= "https://satimetobehero.cdnvideo.ru/ds1/quests/icon_quest_exclamation_yellow.png"]').click()

        // Ждём открытия задания
        waiter(true, [{
            have: true,
            selector: 'span[data-qtip="Купить в Магазине Корзину с Зельями щита"]',
            number: 0
          },
          {
            have: true,
            selector: 'a[class="x-btn qh-object world-quest-action no_border x-unselectable x-btn-txt x-border-box qh-on"]',
            number: 0
          }
        ], 500, 'Ждём открытия задания', () => {
          // Жмём взять задание
          document.querySelector('a[class="x-btn qh-object world-quest-action no_border x-unselectable x-btn-txt x-border-box qh-on"]').click()

          // Ждём появления магазина
          waiter(true, [{
            have: true,
            selector: 'a[style *= "https://satimetobehero.cdnvideo.ru/ds1/locations/cradle/rooms/fort/shop_new.png"]',
            number: 0
          }], 500, 'Ждём появления магазина', () => {
            // Кликаем по магазину
            document.querySelector('a[style *= "https://satimetobehero.cdnvideo.ru/ds1/locations/cradle/rooms/fort/shop_new.png"]').click()

            // Ждём загрузки магазина
            waiter(true, [{
              have: true,
              selector: 'div[style *= "https://satimetobehero.cdnvideo.ru/ds1/items/quests/1_shield_potions.jpg"]',
              number: 0
            }], 500, 'Ждём загрузки магазина', () => {
              // Кликаем "купить" зелье для щита
              document.querySelector('div[style *= "https://satimetobehero.cdnvideo.ru/ds1/items/quests/1_shield_potions.jpg"]').parentElement.parentElement.querySelector('a').click()

              // Ждём обработки покупки
              setTimeout(() => {
                // Переходим в рюкзак
                document.querySelector('span[id="mainmenu-inventory-button-btnWrap"]').click()

                // Ждём октрытия рюкзака
                setTimeout(() => {
                  // Кликаем по залью
                  document.querySelector('div[style *= "https://satimetobehero.cdnvideo.ru/ds1/items/potions/2_shield_grey_60_60.jpg"]').click()

                  // Ждём появления модального окна
                  waiter(true, [{
                    have: true,
                    selector: 'a[class="x-btn qh-object no_border_double x-unselectable x-box-item x-toolbar-item x-btn-txt"]',
                    number: 0
                  }], 500, 'Ждём появления модального окна', () => {
                    // Кликаем надеть
                    document.querySelector('a[class="x-btn qh-object no_border_double x-unselectable x-box-item x-toolbar-item x-btn-txt"]').click()

                    // Ждём обработки клика
                    setTimeout(() => {
                      // Кликаем по дому
                      document.querySelector('a[style *= "https://satimetobehero.cdnvideo.ru/ds1/locations/cradle/rooms/fort/inn_new.png"]').click()

                      // Ждём открытия дома
                      waiter(true, [{
                        have: true,
                        selector: 'div[class="exg-tape-top"]',
                        number: 0
                      }], 500, 'Ждём открытия дома', () => {
                        // Кликаем по новой маске
                        document.querySelector('div[class="exg-tape-top"]').click()

                        // Ждём обработки клика
                        waiter(true, [{
                          have: true,
                          selector: 'a.x-btn.qh-object.x-btn-txt-green.x-unselectable.x-btn-txt[data-qh_otype="room_mask"]',
                          number: 0
                        }], 500, 'Ждём обработки клика', () => {
                          // Жмём надеть
                          document.querySelector('a.x-btn.qh-object.x-btn-txt-green.x-unselectable.x-btn-txt[data-qh_otype="room_mask"]').click()

                          // Ждём модального окна
                          waiter(true, [{
                            have: true,
                            selector: 'div[id *= "confirmdialog"] a',
                            number: 0
                          }], 500, 'Ждём модального окна', () => {
                            // Жмём "Да"
                            document.querySelectorAll('div[id *= "confirmdialog"] a')[0].click()

                            // Ждём закрытия модального окна
                            setTimeout(() => {
                              // Жмём В город
                              document.querySelector('a.x-btn.qh-object.x-btn-txt-green.x-unselectable.x-btn-txt').click()

                              // Ждём закрытия дома
                              waiter(true, [{
                                have: false,
                                selector: 'a.x-btn.get_all_masks_btn.x-unselectable.x-abs-layout-item.x-btn-txt',
                                number: 0
                              }], 500, 'Ждём закрытия дома', () => {
                                // Запускаем обработчик города
                                city_wait()
                              });
                            }, 5000);
                          });
                        });
                      });
                    }, 5000);
                  });
                }, 8000);
              }, 5000);
            });
          });
        });
      });
    }



    // Ожидание города
    function city_wait() {
      waiter(true, [{
        have: true,
        selector: city,
        number: 0
      }], 500, 'Ждём города', () => {
        setTimeout(() => { // Ждём подгрузки всех данных
          if (Number(document.querySelectorAll(box_btn)[0].querySelector(`div.counter`).innerText) > 0 && document.querySelectorAll(box_btn)[0].querySelector(`div.counter`).className != "counter  hidden") { // Если есть ключи
            // Нажимаем на сундук
            document.querySelectorAll(box_btn)[0].click();

            // Запускаем обработчик
            box_window();
          } else { // Иначе
            console.log(`Сундуков нет!`);

            if (document.querySelectorAll(bots).length) { // Если есть боты
              if (!repeat_flag) { // Если не повторный вызов, то
                // Нажимаем на первого зверя
                document.querySelectorAll(bots)[0].click();

                // Устанавливаем флаг повтора, для отсечения последующих вызовов
                repeat_flag = true;

                // Запускаем обработчик
                bot_window();
              }
            } else { // Иначе
              console.log(`Ботов нет...`);

              if (dens_flag) { // Если есть доступ к логовам
                if (document.querySelector(dens_btn) !== null) { // Если есть кнопка к логовам
                  // Переходим в логова
                  document.querySelector(dens_btn).click();

                  // Запускаем обработчик
                  dens_wait();
                } else { // Иначе
                  console.log(`На этом мои полномочия как-бы всё...`);
                }
              } else { // Иначе
                console.log(`Ждём доступа`);

                // Ждём доступа
                setTimeout(() => {
                  // Перезапускаем обработчик города
                  city_wait();
                }, (1000 * 60 * 1));
              }
            }
          }
        }, 1000);
      });
    }

    // Обработчик сундуков
    function box_window() {
      waiter(true, [{
          have: true,
          selector: boxes,
          number: 0
        },
        {
          have: true,
          selector: box_1,
          number: 0
        },
        {
          have: true,
          selector: box_2,
          number: 0
        },
        {
          have: true,
          selector: box_3,
          number: 0
        },
        {
          have: true,
          selector: box_4,
          number: 0
        }
      ], 500, 'Ждём окна с сундуками', () => {
        if (document.querySelector(box_1).querySelector(key_1) && Number(document.querySelector(box_1).querySelector(key_1).innerText) > 0) {
          console.log(`Открываем Сундук № 1`);

          // Запускаем обработчик открытия сундука
          open_box(box_1);
        } else {
          if (document.querySelector(box_2).querySelector(key_2) && Number(document.querySelector(box_2).querySelector(key_2).innerText) > 0) {
            console.log(`Открываем Сундук № 2`);

            // Запускаем обработчик открытия сундука
            open_box(box_2);
          } else {
            if (document.querySelector(box_3).querySelector(key_3) && Number(document.querySelector(box_3).querySelector(key_3).innerText) > 0) {
              console.log(`Открываем Сундук № 3`);

              // Запускаем обработчик открытия сундука
              open_box(box_3);
            } else {
              if (document.querySelector(box_4).querySelector(key_4) && Number(document.querySelector(box_4).querySelector(key_4).innerText) > 0) {
                console.log(`Открываем Сундук № 4`);

                // Запускаем обработчик открытия сундука
                open_box(box_4);
              } else {
                // Возвращаемся в город
                document.querySelector(city_backward_btn).click();

                waiter(true, [{
                  have: false,
                  selector: boxes,
                  number: 0
                }], 500, 'Ждём закрытия окна с сундуками', () => {
                  // Запускаем обработчик
                  loading_wait();
                });
              }
            }
          }
        }
      });
    }

    // Функция открытия сундуков
    function open_box(selector) {
      // Нажимаем открыть
      document.querySelector(`${selector} a`).click();

      setTimeout(() => { // Ждём открытия сундука
        console.log(`Открыли!`);

        // Нажимаем забрать
        document.querySelector(`${selector} a`).click();

        setTimeout(() => { // Ждём
          // Продолжаем
          box_window();
        }, 5000);
      }, 5000);
    }

    // Обработчик битья ботов
    function bot_window() {
      waiter(true, [{
        have: true,
        selector: bot_w,
        number: 0
      }], 500, 'Ждём окна с ботом', () => {
        // Если не Вервольф, то
        if (document.querySelectorAll(bot_name)[0].innerText !== `Вервольф`) {
          console.log(`Нападаем`);

          // Нажимаем "Напасть"
          document.querySelector(bot_attack).click();

          // Ждём боя
          waiter(true, [{
            have: true,
            selector: fighting,
            number: 0
          }], 1000, 'Ждём загрузки боя', () => {
            // Боёвка
            fight(city_wait);

            // Обнуляем флаг повтора
            repeat_flag = false;
          });
        } else { // Иначе
          console.log(`Изгоняем`);

          // Нажимаем "изгнать"
          document.querySelector(bot_banish).click();

          // Ждём завершения изгнания
          setTimeout(() => {
            // Запускаем обработчик
            city_wait();
          }, 8000);
        }
      });
    }

    // Ожидание логов
    function dens_wait() {
      waiter(true, [{
          have: true,
          selector: dens,
          number: 0
        },
        {
          have: true,
          selector: pig_den,
          number: 0
        },
        {
          have: false,
          selector: choice,
          number: 0
        },
      ], 500, 'Ждём страницы с логовами', () => {
        // Выбираем логово кабанов
        document.querySelectorAll(pig_den)[0].click();

        weapon_wait();
      });
    }

    // Ожидание выбора оружия
    function weapon_wait() {
      waiter(true, [{
          have: true,
          selector: choice,
          number: 0
        },
        {
          have: true,
          selector: weapon_1,
          number: 0
        }
      ], 1000, 'Ждём страницы выбора оружия', () => {
        // Выбираем 1 оружие
        document.querySelectorAll(weapon_1)[0].click();

        // Если хватает "свитков", то начинаем бой
        if (document.querySelector(scrolls).innerHTML !== '0/10') {
          to_fight();
        } else {
          reload();
        }
      });
    }

    // В бой
    function to_fight() {
      waiter(true, [{
        have: true,
        selector: fight_btn,
        number: 0
      }], 200, 'Ждём загрузки кнопки "В бой"', () => {
        // Нажимаем В бой
        document.querySelector(fight_btn).click();

        // Ждём боя
        waiter(true, [{
          have: true,
          selector: fighting,
          number: 0
        }], 1000, 'Ждём загрузки боя', () => {

          // Боёвка
          fight(dens_wait);
        });
      });
    }

    // Боёвка
    function fight(callback) {

      // Ждём выбора действия
      waiter(true, [{
        have: false,
        selector: `div.timer div.blocked`,
        number: 0
      }], 1000, 'Ждём выбора действия', () => {

        let slot_block = document.querySelectorAll(slots);
        let slot = 0;
        let damage = 0;
        let mana = Number(document.querySelectorAll(my_mana)[1].innerText.split(' / ')[0]);

        // Выбираем лучшее действие
        slot_block.forEach((element, i) => {
          let this_damage = Number(element.querySelector(elem_damage).innerText.split('-')[0]);
          let this_mana = element.querySelector(elem_mana)
          if (mana > 30) { // Если мана позволяет, то выбираем самое мощное
            if (element.querySelector(elem_type) && this_damage > damage) {
              slot = i;
              damage = this_damage;
            }
          } else { // Иначе, выбираем самое мощное из доступного
            console.log(`Мало маны!`);
            if (element.querySelector(elem_type) && this_damage > damage && this_mana === null) {
              slot = i;
              damage = this_damage;
            }
          }

          if (i === slot_block.length - 1) { // Если уже просмотрели все варианты
            console.log(`Выбрали: ${slot + 1} | ${damage}`)

            // Выбираем оптимальный вариант
            slot_block[slot].querySelector(`div`).click();

            // Продолжаем бой
            fight(callback);
          }
        });


        if (!document.querySelector(fighting)) { // Если уже не в бою
          // Если коллбэк был передан
          if (callback) {
            console.log(`Запускаю переданный колбек`);
            // Включаем переданный коллбэк
            callback();
          } else { // Иначе
            console.log(`Подождите, я определяю локацию...`);
            // Запускаем стартовый обработчик
            setTimeout(() => {
              loading_wait();
            }, 5000);
          }
        }
      });
    }

    // Обработчик дикой стаи
    function wild_fight() {
      alert(`Дикая стая!`);
    }

    // Покупка свитков
    function reload() {
      if (document.querySelector(crystals).innerHTML.split('<')[0] > 0) {
        // Нажимаем "В бой"
        document.querySelector(fight_btn2).click();

        waiter(true, [{
          have: true,
          selector: bay_scrolls,
          number: 0
        }], 500, 'Ждём загрузки окошка', () => {
          // Покупаем "свитки"
          document.querySelector(bay_scrolls).click();

          // Продолжаем бой
          // to_fight();

          // Выходим в город
          away();
        });
      } else {
        console.log('Недостаточно кристаллов!');

        // Запрещаем переход в логова
        dens_flag = false;

        // Выходим в город
        away();

        // Запускаем таймер на возвращение доступа к логовами
        setTimeout(() => {
          dens_flag = true;
        }, (1000 * 60 * 10));
      }
    }

    // Возвращение в город из выбора оружия
    function away() {
      // Возвращаемся к логовам
      document.querySelector(dens_backward_btn).click()

      waiter(true, [{
          have: true,
          selector: dens,
          number: 0
        },
        {
          have: true,
          selector: city_backward_btn,
          number: 0
        },
        {
          have: false,
          selector: choice,
          number: 0
        }
      ], 1000, 'Ждём страницы с логовами', () => {
        // Возвращаемся в город
        document.querySelector(city_backward_btn).click()

        // Запускаем обработчик города
        city_wait();
      });
    }


    // Функция ожидания появления элементов
    function waiter(type, selectors, time, waitMessage, callback) {
      let count = 0; // Счётчик для отслеживания долгих ожиданий

      // Создаём цикличную задачу
      let timeID = setInterval(() => {
        // Если дикая стая
        if (document.querySelector(wild_indicator) !== null && waitMessage === 'Ждём выбора действия') {
          // Удаляем цикличную ф-ю
          clearInterval(timeID);

          // Вызываем обработчик дикой стаи
          wild_fight();
        } else { // Иначе

          let flag = (type) ? true : false; // Флаг результата
          let element; // Для оптимизации работы с селекторами

          // Для всех переданных селекторов
          selectors.forEach((key, i) => {
            // Получаем элемент страницы по переданным параметрам
            element = document.querySelectorAll(key.selector)[key.number];
            // Проверяем условие
            if ((key.have) ? (element === undefined) : (element !== undefined)) {
              flag = (type) ? false : true;
            }

            // После проверки всех условий
            if (i == selectors.length - 1) {
              // Если они выполнены
              if (flag) {
                // Удаляем цикличную ф-ю
                clearInterval(timeID);

                // Передаём управление дальше
                callback();
              } else { // Иначе
                console.log(waitMessage);

                // Если ждём долго, то
                if (count++ > max_wait) {
                  // Удаляем цикличную ф-ю
                  clearInterval(timeID);

                  // Перезапускаем скрипт
                  loading_wait();
                }
              }
            }
          });
        }
      }, time);
    }
  }
})();

// // Ждём
// waiter(true, [{
//   have: true,
//   selector: '',
//   number: 0
// }], 500, '', () => {
//
// });

// // Ждём
// setTimeout(() => {
//
// }, 3000);