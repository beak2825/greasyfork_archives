// ==UserScript==
// @name         DouyinWebcastProtoJson
// @namespace    Douyin Webcast Proto Json
// @author       Dong <dong@freshoo.cn>
// @description  Proto
// @version      1.0
// @match        *://*/*
// @license      MIT 
// ==/UserScript==

const DouyinWebcastProtoJson = {
  douyin: {
    nested: {
      Response: {
        fields: {
          messagesList: {
            rule: "repeated",
            type: "Message",
            id: 1
          },
          cursor: {
            type: "string",
            id: 2
          },
          fetchInterval: {
            type: "uint64",
            id: 3
          },
          now: {
            type: "uint64",
            id: 4
          },
          internalExt: {
            type: "string",
            id: 5
          },
          fetchType: {
            type: "uint32",
            id: 6
          },
          routeParams: {
            keyType: "string",
            type: "string",
            id: 7
          },
          heartbeatDuration: {
            type: "uint64",
            id: 8
          },
          needAck: {
            type: "bool",
            id: 9
          },
          pushServer: {
            type: "string",
            id: 10
          },
          liveCursor: {
            type: "string",
            id: 11
          },
          historyNoMore: {
            type: "bool",
            id: 12
          }
        }
      },
      Message: {
        fields: {
          method: {
            type: "string",
            id: 1
          },
          payload: {
            type: "bytes",
            id: 2
          },
          msgId: {
            type: "int64",
            id: 3
          },
          msgType: {
            type: "int32",
            id: 4
          },
          offset: {
            type: "int64",
            id: 5
          },
          needWrdsStore: {
            type: "bool",
            id: 6
          },
          wrdsVersion: {
            type: "int64",
            id: 7
          },
          wrdsSubKey: {
            type: "string",
            id: 8
          }
        }
      },
      EmojiChatMessage: {
        fields: {
          common: {
            type: "Common",
            id: 1
          },
          user: {
            type: "User",
            id: 2
          },
          emojiId: {
            type: "int64",
            id: 3
          },
          emojiContent: {
            type: "Text",
            id: 4
          },
          defaultContent: {
            type: "string",
            id: 5
          },
          backgroundImage: {
            type: "Image",
            id: 6
          },
          fromIntercom: {
            type: "bool",
            id: 7
          },
          intercomHideUserCard: {
            type: "bool",
            id: 8
          }
        }
      },
      ChatMessage: {
        fields: {
          common: {
            type: "Common",
            id: 1
          },
          user: {
            type: "User",
            id: 2
          },
          content: {
            type: "string",
            id: 3
          },
          visibleToSender: {
            type: "bool",
            id: 4
          },
          backgroundImage: {
            type: "Image",
            id: 5
          },
          fullScreenTextColor: {
            type: "string",
            id: 6
          },
          backgroundImageV2: {
            type: "Image",
            id: 7
          },
          publicAreaCommon: {
            type: "PublicAreaCommon",
            id: 9
          },
          giftImage: {
            type: "Image",
            id: 10
          },
          agreeMsgId: {
            type: "uint64",
            id: 11
          },
          priorityLevel: {
            type: "uint32",
            id: 12
          },
          landscapeAreaCommon: {
            type: "LandscapeAreaCommon",
            id: 13
          },
          eventTime: {
            type: "uint64",
            id: 15
          },
          sendReview: {
            type: "bool",
            id: 16
          },
          fromIntercom: {
            type: "bool",
            id: 17
          },
          intercomHideUserCard: {
            type: "bool",
            id: 18
          },
          chatBy: {
            type: "string",
            id: 20
          },
          individualChatPriority: {
            type: "uint32",
            id: 21
          },
          rtfContent: {
            type: "Text",
            id: 22
          }
        }
      },
      LandscapeAreaCommon: {
        fields: {
          showHead: {
            type: "bool",
            id: 1
          },
          showNickname: {
            type: "bool",
            id: 2
          },
          showFontColor: {
            type: "bool",
            id: 3
          },
          colorValueList: {
            rule: "repeated",
            type: "string",
            id: 4
          },
          commentTypeTagsList: {
            rule: "repeated",
            type: "CommentTypeTag",
            id: 5
          }
        }
      },
      RoomUserSeqMessage: {
        fields: {
          common: {
            type: "Common",
            id: 1
          },
          ranksList: {
            rule: "repeated",
            type: "RoomUserSeqMessageContributor",
            id: 2
          },
          total: {
            type: "int64",
            id: 3
          },
          popStr: {
            type: "string",
            id: 4
          },
          seatsList: {
            rule: "repeated",
            type: "RoomUserSeqMessageContributor",
            id: 5
          },
          popularity: {
            type: "int64",
            id: 6
          },
          totalUser: {
            type: "int64",
            id: 7
          },
          totalUserStr: {
            type: "string",
            id: 8
          },
          totalStr: {
            type: "string",
            id: 9
          },
          onlineUserForAnchor: {
            type: "string",
            id: 10
          },
          totalPvForAnchor: {
            type: "string",
            id: 11
          },
          upRightStatsStr: {
            type: "string",
            id: 12
          },
          upRightStatsStrComplete: {
            type: "string",
            id: 13
          }
        }
      },
      CommonTextMessage: {
        fields: {
          common: {
            type: "Common",
            id: 1
          },
          user: {
            type: "User",
            id: 2
          },
          scene: {
            type: "string",
            id: 3
          }
        }
      },
      UpdateFanTicketMessage: {
        fields: {
          common: {
            type: "Common",
            id: 1
          },
          roomFanTicketCountText: {
            type: "string",
            id: 2
          },
          roomFanTicketCount: {
            type: "uint64",
            id: 3
          },
          forceUpdate: {
            type: "bool",
            id: 4
          }
        }
      },
      RoomUserSeqMessageContributor: {
        fields: {
          score: {
            type: "uint64",
            id: 1
          },
          user: {
            type: "User",
            id: 2
          },
          rank: {
            type: "uint64",
            id: 3
          },
          delta: {
            type: "uint64",
            id: 4
          },
          isHidden: {
            type: "bool",
            id: 5
          },
          scoreDescription: {
            type: "string",
            id: 6
          },
          exactlyScore: {
            type: "string",
            id: 7
          }
        }
      },
      GiftMessage: {
        fields: {
          common: {
            type: "Common",
            id: 1
          },
          giftId: {
            type: "uint64",
            id: 2
          },
          fanTicketCount: {
            type: "uint64",
            id: 3
          },
          groupCount: {
            type: "uint64",
            id: 4
          },
          repeatCount: {
            type: "uint64",
            id: 5
          },
          comboCount: {
            type: "uint64",
            id: 6
          },
          user: {
            type: "User",
            id: 7
          },
          toUser: {
            type: "User",
            id: 8
          },
          repeatEnd: {
            type: "uint32",
            id: 9
          },
          textEffect: {
            type: "TextEffect",
            id: 10
          },
          groupId: {
            type: "uint64",
            id: 11
          },
          incomeTaskgifts: {
            type: "uint64",
            id: 12
          },
          roomFanTicketCount: {
            type: "uint64",
            id: 13
          },
          priority: {
            type: "GiftIMPriority",
            id: 14
          },
          gift: {
            type: "GiftStruct",
            id: 15
          },
          logId: {
            type: "string",
            id: 16
          },
          sendType: {
            type: "uint64",
            id: 17
          },
          publicAreaCommon: {
            type: "PublicAreaCommon",
            id: 18
          },
          trayDisplayText: {
            type: "Text",
            id: 19
          },
          bannedDisplayEffects: {
            type: "uint64",
            id: 20
          },
          displayForSelf: {
            type: "bool",
            id: 25
          },
          interactGiftInfo: {
            type: "string",
            id: 26
          },
          diyItemInfo: {
            type: "string",
            id: 27
          },
          minAssetSetList: {
            rule: "repeated",
            type: "uint64",
            id: 28
          },
          totalCount: {
            type: "uint64",
            id: 29
          },
          clientGiftSource: {
            type: "uint32",
            id: 30
          },
          toUserIdsList: {
            rule: "repeated",
            type: "uint64",
            id: 32
          },
          sendTime: {
            type: "uint64",
            id: 33
          },
          forceDisplayEffects: {
            type: "uint64",
            id: 34
          },
          traceId: {
            type: "string",
            id: 35
          },
          effectDisplayTs: {
            type: "uint64",
            id: 36
          }
        }
      },
      GiftStruct: {
        fields: {
          image: {
            type: "Image",
            id: 1
          },
          describe: {
            type: "string",
            id: 2
          },
          notify: {
            type: "bool",
            id: 3
          },
          duration: {
            type: "uint64",
            id: 4
          },
          id: {
            type: "uint64",
            id: 5
          },
          forLinkmic: {
            type: "bool",
            id: 7
          },
          doodle: {
            type: "bool",
            id: 8
          },
          forFansclub: {
            type: "bool",
            id: 9
          },
          combo: {
            type: "bool",
            id: 10
          },
          type: {
            type: "uint32",
            id: 11
          },
          diamondCount: {
            type: "uint32",
            id: 12
          },
          isDisplayedOnPanel: {
            type: "bool",
            id: 13
          },
          primaryEffectId: {
            type: "uint64",
            id: 14
          },
          giftLabelIcon: {
            type: "Image",
            id: 15
          },
          name: {
            type: "string",
            id: 16
          },
          region: {
            type: "string",
            id: 17
          },
          manual: {
            type: "string",
            id: 18
          },
          forCustom: {
            type: "bool",
            id: 19
          },
          icon: {
            type: "Image",
            id: 21
          },
          actionType: {
            type: "uint32",
            id: 22
          }
        }
      },
      GiftIMPriority: {
        fields: {
          queueSizesList: {
            rule: "repeated",
            type: "uint64",
            id: 1
          },
          selfQueuePriority: {
            type: "uint64",
            id: 2
          },
          priority: {
            type: "uint64",
            id: 3
          }
        }
      },
      TextEffect: {
        fields: {
          portrait: {
            type: "TextEffectDetail",
            id: 1
          },
          landscape: {
            type: "TextEffectDetail",
            id: 2
          }
        }
      },
      TextEffectDetail: {
        fields: {
          text: {
            type: "Text",
            id: 1
          },
          textFontSize: {
            type: "uint32",
            id: 2
          },
          background: {
            type: "Image",
            id: 3
          },
          start: {
            type: "uint32",
            id: 4
          },
          duration: {
            type: "uint32",
            id: 5
          },
          x: {
            type: "uint32",
            id: 6
          },
          y: {
            type: "uint32",
            id: 7
          },
          width: {
            type: "uint32",
            id: 8
          },
          height: {
            type: "uint32",
            id: 9
          },
          shadowDx: {
            type: "uint32",
            id: 10
          },
          shadowDy: {
            type: "uint32",
            id: 11
          },
          shadowRadius: {
            type: "uint32",
            id: 12
          },
          shadowColor: {
            type: "string",
            id: 13
          },
          strokeColor: {
            type: "string",
            id: 14
          },
          strokeWidth: {
            type: "uint32",
            id: 15
          }
        }
      },
      MemberMessage: {
        fields: {
          common: {
            type: "Common",
            id: 1
          },
          user: {
            type: "User",
            id: 2
          },
          memberCount: {
            type: "uint64",
            id: 3
          },
          operator: {
            type: "User",
            id: 4
          },
          isSetToAdmin: {
            type: "bool",
            id: 5
          },
          isTopUser: {
            type: "bool",
            id: 6
          },
          rankScore: {
            type: "uint64",
            id: 7
          },
          topUserNo: {
            type: "uint64",
            id: 8
          },
          enterType: {
            type: "uint64",
            id: 9
          },
          action: {
            type: "uint64",
            id: 10
          },
          actionDescription: {
            type: "string",
            id: 11
          },
          userId: {
            type: "uint64",
            id: 12
          },
          effectConfig: {
            type: "EffectConfig",
            id: 13
          },
          popStr: {
            type: "string",
            id: 14
          },
          enterEffectConfig: {
            type: "EffectConfig",
            id: 15
          },
          backgroundImage: {
            type: "Image",
            id: 16
          },
          backgroundImageV2: {
            type: "Image",
            id: 17
          },
          anchorDisplayText: {
            type: "Text",
            id: 18
          },
          publicAreaCommon: {
            type: "PublicAreaCommon",
            id: 19
          },
          userEnterTipType: {
            type: "uint64",
            id: 20
          },
          anchorEnterTipType: {
            type: "uint64",
            id: 21
          }
        }
      },
      PublicAreaCommon: {
        fields: {
          userLabel: {
            type: "Image",
            id: 1
          },
          userConsumeInRoom: {
            type: "uint64",
            id: 2
          },
          userSendGiftCntInRoom: {
            type: "uint64",
            id: 3
          }
        }
      },
      EffectConfig: {
        fields: {
          type: {
            type: "uint64",
            id: 1
          },
          icon: {
            type: "Image",
            id: 2
          },
          avatarPos: {
            type: "uint64",
            id: 3
          },
          text: {
            type: "Text",
            id: 4
          },
          textIcon: {
            type: "Image",
            id: 5
          },
          stayTime: {
            type: "uint32",
            id: 6
          },
          animAssetId: {
            type: "uint64",
            id: 7
          },
          badge: {
            type: "Image",
            id: 8
          },
          flexSettingArrayList: {
            rule: "repeated",
            type: "uint64",
            id: 9
          },
          textIconOverlay: {
            type: "Image",
            id: 10
          },
          animatedBadge: {
            type: "Image",
            id: 11
          },
          hasSweepLight: {
            type: "bool",
            id: 12
          },
          textFlexSettingArrayList: {
            rule: "repeated",
            type: "uint64",
            id: 13
          },
          centerAnimAssetId: {
            type: "uint64",
            id: 14
          },
          dynamicImage: {
            type: "Image",
            id: 15
          },
          extraMap: {
            keyType: "string",
            type: "string",
            id: 16
          },
          mp4AnimAssetId: {
            type: "uint64",
            id: 17
          },
          priority: {
            type: "uint64",
            id: 18
          },
          maxWaitTime: {
            type: "uint64",
            id: 19
          },
          dressId: {
            type: "string",
            id: 20
          },
          alignment: {
            type: "uint64",
            id: 21
          },
          alignmentOffset: {
            type: "uint64",
            id: 22
          }
        }
      },
      Text: {
        fields: {
          key: {
            type: "string",
            id: 1
          },
          defaultPatter: {
            type: "string",
            id: 2
          },
          defaultFormat: {
            type: "TextFormat",
            id: 3
          },
          piecesList: {
            rule: "repeated",
            type: "TextPiece",
            id: 4
          }
        }
      },
      TextPiece: {
        fields: {
          type: {
            type: "bool",
            id: 1
          },
          format: {
            type: "TextFormat",
            id: 2
          },
          stringValue: {
            type: "string",
            id: 3
          },
          userValue: {
            type: "TextPieceUser",
            id: 4
          },
          giftValue: {
            type: "TextPieceGift",
            id: 5
          },
          heartValue: {
            type: "TextPieceHeart",
            id: 6
          },
          patternRefValue: {
            type: "TextPiecePatternRef",
            id: 7
          },
          imageValue: {
            type: "TextPieceImage",
            id: 8
          }
        }
      },
      TextPieceImage: {
        fields: {
          image: {
            type: "Image",
            id: 1
          },
          scalingRate: {
            type: "float",
            id: 2
          }
        }
      },
      TextPiecePatternRef: {
        fields: {
          key: {
            type: "string",
            id: 1
          },
          defaultPattern: {
            type: "string",
            id: 2
          }
        }
      },
      TextPieceHeart: {
        fields: {
          color: {
            type: "string",
            id: 1
          }
        }
      },
      TextPieceGift: {
        fields: {
          giftId: {
            type: "uint64",
            id: 1
          },
          nameRef: {
            type: "PatternRef",
            id: 2
          }
        }
      },
      PatternRef: {
        fields: {
          key: {
            type: "string",
            id: 1
          },
          defaultPattern: {
            type: "string",
            id: 2
          }
        }
      },
      TextPieceUser: {
        fields: {
          user: {
            type: "User",
            id: 1
          },
          withColon: {
            type: "bool",
            id: 2
          }
        }
      },
      TextFormat: {
        fields: {
          color: {
            type: "string",
            id: 1
          },
          bold: {
            type: "bool",
            id: 2
          },
          italic: {
            type: "bool",
            id: 3
          },
          weight: {
            type: "uint32",
            id: 4
          },
          italicAngle: {
            type: "uint32",
            id: 5
          },
          fontSize: {
            type: "uint32",
            id: 6
          },
          useHeighLightColor: {
            type: "bool",
            id: 7
          },
          useRemoteClor: {
            type: "bool",
            id: 8
          }
        }
      },
      LikeMessage: {
        fields: {
          common: {
            type: "Common",
            id: 1
          },
          count: {
            type: "uint64",
            id: 2
          },
          total: {
            type: "uint64",
            id: 3
          },
          color: {
            type: "uint64",
            id: 4
          },
          user: {
            type: "User",
            id: 5
          },
          icon: {
            type: "string",
            id: 6
          },
          doubleLikeDetail: {
            type: "DoubleLikeDetail",
            id: 7
          },
          displayControlInfo: {
            type: "DisplayControlInfo",
            id: 8
          },
          linkmicGuestUid: {
            type: "uint64",
            id: 9
          },
          scene: {
            type: "string",
            id: 10
          },
          picoDisplayInfo: {
            type: "PicoDisplayInfo",
            id: 11
          }
        }
      },
      SocialMessage: {
        fields: {
          common: {
            type: "Common",
            id: 1
          },
          user: {
            type: "User",
            id: 2
          },
          shareType: {
            type: "uint64",
            id: 3
          },
          action: {
            type: "uint64",
            id: 4
          },
          shareTarget: {
            type: "string",
            id: 5
          },
          followCount: {
            type: "uint64",
            id: 6
          },
          publicAreaCommon: {
            type: "PublicAreaCommon",
            id: 7
          }
        }
      },
      PicoDisplayInfo: {
        fields: {
          comboSumCount: {
            type: "uint64",
            id: 1
          },
          emoji: {
            type: "string",
            id: 2
          },
          emojiIcon: {
            type: "Image",
            id: 3
          },
          emojiText: {
            type: "string",
            id: 4
          }
        }
      },
      DoubleLikeDetail: {
        fields: {
          doubleFlag: {
            type: "bool",
            id: 1
          },
          seqId: {
            type: "uint32",
            id: 2
          },
          renewalsNum: {
            type: "uint32",
            id: 3
          },
          triggersNum: {
            type: "uint32",
            id: 4
          }
        }
      },
      DisplayControlInfo: {
        fields: {
          showText: {
            type: "bool",
            id: 1
          },
          showIcons: {
            type: "bool",
            id: 2
          }
        }
      },
      EpisodeChatMessage: {
        fields: {
          common: {
            type: "Message",
            id: 1
          },
          user: {
            type: "User",
            id: 2
          },
          content: {
            type: "string",
            id: 3
          },
          visibleToSende: {
            type: "bool",
            id: 4
          },
          giftImage: {
            type: "Image",
            id: 7
          },
          agreeMsgId: {
            type: "uint64",
            id: 8
          },
          colorValueList: {
            rule: "repeated",
            type: "string",
            id: 9
          }
        }
      },
      MatchAgainstScoreMessage: {
        fields: {
          common: {
            type: "Common",
            id: 1
          },
          against: {
            type: "Against",
            id: 2
          },
          matchStatus: {
            type: "uint32",
            id: 3
          },
          displayStatus: {
            type: "uint32",
            id: 4
          }
        }
      },
      Against: {
        fields: {
          leftName: {
            type: "string",
            id: 1
          },
          leftLogo: {
            type: "Image",
            id: 2
          },
          leftGoal: {
            type: "string",
            id: 3
          },
          rightName: {
            type: "string",
            id: 6
          },
          rightLogo: {
            type: "Image",
            id: 7
          },
          rightGoal: {
            type: "string",
            id: 8
          },
          timestamp: {
            type: "uint64",
            id: 11
          },
          version: {
            type: "uint64",
            id: 12
          },
          leftTeamId: {
            type: "uint64",
            id: 13
          },
          rightTeamId: {
            type: "uint64",
            id: 14
          },
          diffSei2absSecond: {
            type: "uint64",
            id: 15
          },
          finalGoalStage: {
            type: "uint32",
            id: 16
          },
          currentGoalStage: {
            type: "uint32",
            id: 17
          },
          leftScoreAddition: {
            type: "uint32",
            id: 18
          },
          rightScoreAddition: {
            type: "uint32",
            id: 19
          },
          leftGoalInt: {
            type: "uint64",
            id: 20
          },
          rightGoalInt: {
            type: "uint64",
            id: 21
          }
        }
      },
      Common: {
        fields: {
          method: {
            type: "string",
            id: 1
          },
          msgId: {
            type: "uint64",
            id: 2
          },
          roomId: {
            type: "uint64",
            id: 3
          },
          createTime: {
            type: "uint64",
            id: 4
          },
          monitor: {
            type: "uint32",
            id: 5
          },
          isShowMsg: {
            type: "bool",
            id: 6
          },
          describe: {
            type: "string",
            id: 7
          },
          foldType: {
            type: "uint64",
            id: 9
          },
          anchorFoldType: {
            type: "uint64",
            id: 10
          },
          priorityScore: {
            type: "uint64",
            id: 11
          },
          logId: {
            type: "string",
            id: 12
          },
          msgProcessFilterK: {
            type: "string",
            id: 13
          },
          msgProcessFilterV: {
            type: "string",
            id: 14
          },
          user: {
            type: "User",
            id: 15
          },
          anchorFoldTypeV2: {
            type: "uint64",
            id: 17
          },
          processAtSeiTimeMs: {
            type: "uint64",
            id: 18
          },
          randomDispatchMs: {
            type: "uint64",
            id: 19
          },
          isDispatch: {
            type: "bool",
            id: 20
          },
          channelId: {
            type: "uint64",
            id: 21
          },
          diffSei2absSecond: {
            type: "uint64",
            id: 22
          },
          anchorFoldDuration: {
            type: "uint64",
            id: 23
          }
        }
      },
      User: {
        fields: {
          uid: {
            type: "uint64",
            id: 1
          },
          shortId: {
            type: "uint64",
            id: 2
          },
          nickName: {
            type: "string",
            id: 3
          },
          gender: {
            type: "uint32",
            id: 4
          },
          Signature: {
            type: "string",
            id: 5
          },
          Level: {
            type: "uint32",
            id: 6
          },
          Birthday: {
            type: "uint64",
            id: 7
          },
          Telephone: {
            type: "string",
            id: 8
          },
          AvatarThumb: {
            type: "Image",
            id: 9
          },
          AvatarMedium: {
            type: "Image",
            id: 10
          },
          AvatarLarge: {
            type: "Image",
            id: 11
          },
          Verified: {
            type: "bool",
            id: 12
          },
          Experience: {
            type: "uint32",
            id: 13
          },
          city: {
            type: "string",
            id: 14
          },
          Status: {
            type: "int32",
            id: 15
          },
          CreateTime: {
            type: "uint64",
            id: 16
          },
          ModifyTime: {
            type: "uint64",
            id: 17
          },
          Secret: {
            type: "uint32",
            id: 18
          },
          ShareQrcodeUri: {
            type: "string",
            id: 19
          },
          IncomeSharePercent: {
            type: "uint32",
            id: 20
          },
          BadgeImageList: {
            rule: "repeated",
            type: "Image",
            id: 21
          },
          FollowInfo: {
            type: "FollowInfo",
            id: 22
          },
          PayGrade: {
            type: "PayGrade",
            id: 23
          },
          FansClub: {
            type: "FansClub",
            id: 24
          },
          SpecialId: {
            type: "string",
            id: 26
          },
          AvatarBorder: {
            type: "Image",
            id: 27
          },
          Medal: {
            type: "Image",
            id: 28
          },
          RealTimeIconsList: {
            rule: "repeated",
            type: "Image",
            id: 29
          },
          uniqueId: {
            type: "string",
            id: 38
          },
          secUid: {
            type: "string",
            id: 46
          },
          fanTicketCount: {
            type: "uint64",
            id: 1022
          },
          idStr: {
            type: "string",
            id: 1028
          },
          ageRange: {
            type: "uint32",
            id: 1045
          }
        }
      },
      PayGrade: {
        fields: {
          totalDiamondCount: {
            type: "int64",
            id: 1
          },
          diamondIcon: {
            type: "Image",
            id: 2
          },
          name: {
            type: "string",
            id: 3
          },
          icon: {
            type: "Image",
            id: 4
          },
          nextName: {
            type: "string",
            id: 5
          },
          level: {
            type: "int64",
            id: 6
          },
          nextIcon: {
            type: "Image",
            id: 7
          },
          nextDiamond: {
            type: "int64",
            id: 8
          },
          nowDiamond: {
            type: "int64",
            id: 9
          },
          thisGradeMinDiamond: {
            type: "int64",
            id: 10
          },
          thisGradeMaxDiamond: {
            type: "int64",
            id: 11
          },
          payDiamondBak: {
            type: "int64",
            id: 12
          },
          gradeDescribe: {
            type: "string",
            id: 13
          },
          gradeIconList: {
            rule: "repeated",
            type: "GradeIcon",
            id: 14
          },
          screenChatType: {
            type: "int64",
            id: 15
          },
          imIcon: {
            type: "Image",
            id: 16
          },
          imIconWithLevel: {
            type: "Image",
            id: 17
          },
          liveIcon: {
            type: "Image",
            id: 18
          },
          newImIconWithLevel: {
            type: "Image",
            id: 19
          },
          newLiveIcon: {
            type: "Image",
            id: 20
          },
          upgradeNeedConsume: {
            type: "int64",
            id: 21
          },
          nextPrivileges: {
            type: "string",
            id: 22
          },
          background: {
            type: "Image",
            id: 23
          },
          backgroundBack: {
            type: "Image",
            id: 24
          },
          score: {
            type: "int64",
            id: 25
          },
          buffInfo: {
            type: "GradeBuffInfo",
            id: 26
          },
          gradeBanner: {
            type: "string",
            id: 1001
          },
          profileDialogBg: {
            type: "Image",
            id: 1002
          },
          profileDialogBgBack: {
            type: "Image",
            id: 1003
          }
        }
      },
      FansClub: {
        fields: {
          data: {
            type: "FansClubData",
            id: 1
          },
          preferData: {
            keyType: "int32",
            type: "FansClubData",
            id: 2
          }
        }
      },
      FansClubData: {
        fields: {
          clubName: {
            type: "string",
            id: 1
          },
          level: {
            type: "int32",
            id: 2
          },
          userFansClubStatus: {
            type: "int32",
            id: 3
          },
          badge: {
            type: "UserBadge",
            id: 4
          },
          availableGiftIds: {
            rule: "repeated",
            type: "int64",
            id: 5
          },
          anchorId: {
            type: "int64",
            id: 6
          }
        }
      },
      UserBadge: {
        fields: {
          icons: {
            keyType: "int32",
            type: "Image",
            id: 1
          },
          title: {
            type: "string",
            id: 2
          }
        }
      },
      GradeBuffInfo: {
        fields: {}
      },
      Border: {
        fields: {}
      },
      GradeIcon: {
        fields: {
          icon: {
            type: "Image",
            id: 1
          },
          iconDiamond: {
            type: "int64",
            id: 2
          },
          level: {
            type: "int64",
            id: 3
          },
          levelStr: {
            type: "string",
            id: 4
          }
        }
      },
      FollowInfo: {
        fields: {
          followingCount: {
            type: "uint64",
            id: 1
          },
          followerCount: {
            type: "uint64",
            id: 2
          },
          followStatus: {
            type: "uint64",
            id: 3
          },
          pushStatus: {
            type: "uint64",
            id: 4
          },
          remarkName: {
            type: "string",
            id: 5
          },
          followerCountStr: {
            type: "string",
            id: 6
          },
          followingCountStr: {
            type: "string",
            id: 7
          }
        }
      },
      Image: {
        fields: {
          urlListList: {
            rule: "repeated",
            type: "string",
            id: 1
          },
          uri: {
            type: "string",
            id: 2
          },
          height: {
            type: "uint64",
            id: 3
          },
          width: {
            type: "uint64",
            id: 4
          },
          avgColor: {
            type: "string",
            id: 5
          },
          imageType: {
            type: "uint32",
            id: 6
          },
          openWebUrl: {
            type: "string",
            id: 7
          },
          content: {
            type: "ImageContent",
            id: 8
          },
          isAnimated: {
            type: "bool",
            id: 9
          },
          FlexSettingList: {
            type: "NinePatchSetting",
            id: 10
          },
          TextSettingList: {
            type: "NinePatchSetting",
            id: 11
          }
        }
      },
      NinePatchSetting: {
        fields: {
          settingListList: {
            rule: "repeated",
            type: "string",
            id: 1
          }
        }
      },
      ImageContent: {
        fields: {
          name: {
            type: "string",
            id: 1
          },
          fontColor: {
            type: "string",
            id: 2
          },
          level: {
            type: "uint64",
            id: 3
          },
          alternativeText: {
            type: "string",
            id: 4
          }
        }
      },
      PushFrame: {
        fields: {
          seqId: {
            type: "uint64",
            id: 1
          },
          logId: {
            type: "uint64",
            id: 2
          },
          service: {
            type: "uint64",
            id: 3
          },
          method: {
            type: "uint64",
            id: 4
          },
          headersList: {
            rule: "repeated",
            type: "HeadersList",
            id: 5
          },
          payloadEncoding: {
            type: "string",
            id: 6
          },
          payloadType: {
            type: "string",
            id: 7
          },
          payload: {
            type: "bytes",
            id: 8
          }
        }
      },
      kk: {
        fields: {
          k: {
            type: "uint32",
            id: 14
          }
        }
      },
      SendMessageBody: {
        fields: {
          conversationId: {
            type: "string",
            id: 1
          },
          conversationType: {
            type: "uint32",
            id: 2
          },
          conversationShortId: {
            type: "uint64",
            id: 3
          },
          content: {
            type: "string",
            id: 4
          },
          ext: {
            rule: "repeated",
            type: "ExtList",
            id: 5
          },
          messageType: {
            type: "uint32",
            id: 6
          },
          ticket: {
            type: "string",
            id: 7
          },
          clientMessageId: {
            type: "string",
            id: 8
          }
        }
      },
      ExtList: {
        fields: {
          key: {
            type: "string",
            id: 1
          },
          value: {
            type: "string",
            id: 2
          }
        }
      },
      Rsp: {
        fields: {
          a: {
            type: "int32",
            id: 1
          },
          b: {
            type: "int32",
            id: 2
          },
          c: {
            type: "int32",
            id: 3
          },
          d: {
            type: "string",
            id: 4
          },
          e: {
            type: "int32",
            id: 5
          },
          f: {
            type: "F",
            id: 6
          },
          g: {
            type: "string",
            id: 7
          },
          h: {
            type: "uint64",
            id: 10
          },
          i: {
            type: "uint64",
            id: 11
          },
          j: {
            type: "uint64",
            id: 13
          }
        },
        nested: {
          F: {
            fields: {
              q1: {
                type: "uint64",
                id: 1
              },
              q3: {
                type: "uint64",
                id: 3
              },
              q4: {
                type: "string",
                id: 4
              },
              q5: {
                type: "uint64",
                id: 5
              }
            }
          }
        }
      },
      PreMessage: {
        fields: {
          cmd: {
            type: "uint32",
            id: 1
          },
          sequenceId: {
            type: "uint32",
            id: 2
          },
          sdkVersion: {
            type: "string",
            id: 3
          },
          token: {
            type: "string",
            id: 4
          },
          refer: {
            type: "uint32",
            id: 5
          },
          inboxType: {
            type: "uint32",
            id: 6
          },
          buildNumber: {
            type: "string",
            id: 7
          },
          sendMessageBody: {
            type: "SendMessageBody",
            id: 8
          },
          aa: {
            type: "string",
            id: 9
          },
          devicePlatform: {
            type: "string",
            id: 11
          },
          headers: {
            rule: "repeated",
            type: "HeadersList",
            id: 15
          },
          authType: {
            type: "uint32",
            id: 18
          },
          biz: {
            type: "string",
            id: 21
          },
          access: {
            type: "string",
            id: 22
          }
        }
      },
      HeadersList: {
        fields: {
          key: {
            type: "string",
            id: 1
          },
          value: {
            type: "string",
            id: 2
          }
        }
      },
      LiveShoppingMessage: {
        fields: {
          common: {
            type: "Common",
            id: 1
          },
          msgType: {
            type: "int32",
            id: 2
          },
          promotionId: {
            type: "int64",
            id: 4
          }
        }
      },
      RoomStatsMessage: {
        fields: {
          common: {
            type: "Common",
            id: 1
          },
          displayShort: {
            type: "string",
            id: 2
          },
          displayMiddle: {
            type: "string",
            id: 3
          },
          displayLong: {
            type: "string",
            id: 4
          },
          displayValue: {
            type: "int64",
            id: 5
          },
          displayVersion: {
            type: "int64",
            id: 6
          },
          incremental: {
            type: "bool",
            id: 7
          },
          isHidden: {
            type: "bool",
            id: 8
          },
          total: {
            type: "int64",
            id: 9
          },
          displayType: {
            type: "int64",
            id: 10
          }
        }
      },
      CommentTypeTag: {
        values: {
          COMMENTTYPETAGUNKNOWN: 0,
          COMMENTTYPETAGSTAR: 1
        }
      },
      ProductInfo: {
        fields: {
          promotionId: {
            type: "int64",
            id: 1
          },
          index: {
            type: "int32",
            id: 2
          },
          targetFlashUidsList: {
            rule: "repeated",
            type: "int64",
            id: 3
          },
          explainType: {
            type: "int64",
            id: 4
          }
        }
      },
      CategoryInfo: {
        fields: {
          id: {
            type: "int32",
            id: 1
          },
          name: {
            type: "string",
            id: 2
          },
          promotionIdsList: {
            rule: "repeated",
            type: "int64",
            id: 3
          },
          type: {
            type: "string",
            id: 4
          },
          uniqueIndex: {
            type: "string",
            id: 5
          }
        }
      },
      ProductChangeMessage: {
        fields: {
          common: {
            type: "Common",
            id: 1
          },
          updateTimestamp: {
            type: "int64",
            id: 2
          },
          updateToast: {
            type: "string",
            id: 3
          },
          updateProductInfoList: {
            rule: "repeated",
            type: "ProductInfo",
            id: 4
          },
          total: {
            type: "int64",
            id: 5
          },
          updateCategoryInfoList: {
            rule: "repeated",
            type: "CategoryInfo",
            id: 8
          }
        }
      },
      ControlMessage: {
        fields: {
          common: {
            type: "Common",
            id: 1
          },
          status: {
            type: "int32",
            id: 2
          }
        }
      },
      FansclubMessage: {
        fields: {
          commonInfo: {
            type: "Common",
            id: 1
          },
          type: {
            type: "int32",
            id: 2
          },
          content: {
            type: "string",
            id: 3
          },
          user: {
            type: "User",
            id: 4
          }
        }
      },
      RoomRankMessage: {
        fields: {
          common: {
            type: "Common",
            id: 1
          },
          ranksList: {
            rule: "repeated",
            type: "RoomRank",
            id: 2
          }
        },
        nested: {
          RoomRank: {
            fields: {
              user: {
                type: "User",
                id: 1
              },
              scoreStr: {
                type: "string",
                id: 2
              },
              profileHidden: {
                type: "bool",
                id: 3
              }
            }
          }
        }
      },
      RoomMsgTypeEnum: {
        values: {
          DEFAULTROOMMSG: 0,
          ECOMLIVEREPLAYSAVEROOMMSG: 1,
          CONSUMERRELATIONROOMMSG: 2,
          JUMANJIDATAAUTHNOTIFYMSG: 3,
          VSWELCOMEMSG: 4,
          MINORREFUNDMSG: 5,
          PAIDLIVEROOMNOTIFYANCHORMSG: 6,
          HOSTTEAMSYSTEMMSG: 7
        }
      },
      RoomMessage: {
        fields: {
          common: {
            type: "Common",
            id: 1
          },
          content: {
            type: "string",
            id: 2
          },
          supprotLandscape: {
            type: "bool",
            id: 3
          },
          roommessagetype: {
            type: "RoomMsgTypeEnum",
            id: 4
          },
          systemTopMsg: {
            type: "bool",
            id: 5
          },
          forcedGuarantee: {
            type: "bool",
            id: 6
          },
          bizScene: {
            type: "string",
            id: 20
          },
          buriedPointMap: {
            keyType: "string",
            type: "string",
            id: 30
          }
        }
      }
    }
  }
};
