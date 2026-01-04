// ==UserScript==
// @name         容易互娱
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  私人的代码，容易互娱
// @author       You
// @match        https://live.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/457728/%E5%AE%B9%E6%98%93%E4%BA%92%E5%A8%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/457728/%E5%AE%B9%E6%98%93%E4%BA%92%E5%A8%B1.meta.js
// ==/UserScript==

(function(){
    var wsObj;
    function initWebSocket() {
    wsObj = new WebSocket("ws://127.0.0.1:8081");   //建立连接
    wsObj.onopen = function () {  //发送请求
        wsObj.send("{'type':'douyin'}");
    };
    wsObj.onmessage = function (ev) {  //获取后端响应
        console.log(ev.data);
    };
    wsObj.onclose = function (ev) {
        setTimeout(function () {
            initWebSocket();
        }, 1000);
        //alert("close");
    };
    wsObj.onerror = function (ev) {
        //alert("error");
    };
    }
initWebSocket();

(self.webpackChunkdouyin_live_v2 = self.webpackChunkdouyin_live_v2 || []).push([[2531], {
    25922: (e,t,a)=>{
        "use strict";
        a.d(t, {
            Kr: ()=>r.Kr,
            Om: ()=>r.Om,
            AG: ()=>r.AG,
            SZ: ()=>r.SZ,
            DA: ()=>r.DA,
            nN: ()=>r.nN,
            Jn: ()=>o,
            ry: ()=>i,
            ej: ()=>s,
            PN: ()=>n,
            xr: ()=>d
        });
        var r = a(35950);
        const o = "1.3.0"
          , i = "180800"
          , s = 100;
        function n() {
            return {
                device_platform: "web",
                cookie_enabled: navigator.cookieEnabled,
                screen_width: screen.width,
                screen_height: screen.height,
                browser_language: navigator.language,
                browser_platform: navigator.platform,
                browser_name: navigator.appCodeName,
                browser_version: navigator.appVersion,
                browser_online: navigator.onLine,
                tz_name: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        }
        const d = "/webcast/im/fetch/"
    }
    ,
    9848: (e,t,a)=>{
        "use strict";
        a.r(t),
        a.d(t, {
            ActivityInteractiveMessage: ()=>i.ActivityInteractiveMessage,
            AdminData: ()=>g.AdminData,
            AdminPrivilegeMessage: ()=>c.AdminPrivilegeMessage,
            AdminPrivilegeStruct: ()=>c.AdminPrivilegeStruct,
            AdminRecordHandleMessage: ()=>p.AdminRecordHandleMessage,
            AdminRecordMessage: ()=>g.AdminRecordMessage,
            AllQuizInfo: ()=>dr.AllQuizInfo,
            AnchorAppointmentNumUpdateMessage: ()=>So.AnchorAppointmentNumUpdateMessage,
            AnchorBoost: ()=>l.AnchorBoost,
            AnchorBoostMessage: ()=>l.AnchorBoostMessage,
            AnchorFaceConfig: ()=>br.AnchorFaceConfig,
            AnchorUpdateLayoutContent: ()=>Wt.AnchorUpdateLayoutContent,
            AnchorUpdateLinkmicConfigContent: ()=>Wt.AnchorUpdateLinkmicConfigContent,
            AnswerReviewMessage: ()=>u.AnswerReviewMessage,
            AppointmentNumberUpdateMessage: ()=>Lo.AppointmentNumberUpdateMessage,
            AssetEffectUtilMessage: ()=>f.AssetEffectUtilMessage,
            AssetMessage: ()=>b.AssetMessage,
            AuctionInfo: ()=>ha.AuctionInfo,
            AuctionSuccess: ()=>ha.AuctionSuccess,
            AudienceAddSongSettingChangedContent: ()=>It.AudienceAddSongSettingChangedContent,
            AudienceEntranceMessage: ()=>co.AudienceEntranceMessage,
            AudienceGiftSyncData: ()=>oi.AudienceGiftSyncData,
            AudienceOrderSongChatContent: ()=>It.AudienceOrderSongChatContent,
            AudienceOrderSongContent: ()=>It.AudienceOrderSongContent,
            AudioBGImgMessage: ()=>w.AudioBGImgMessage,
            AudioChatMessage: ()=>h.AudioChatMessage,
            AuthorizationNotifyMessage: ()=>y.AuthorizationNotifyMessage,
            AutoCoverMessage: ()=>m.AutoCoverMessage,
            Avatar: ()=>Ra.Avatar,
            AwemeShopExplainMessage: ()=>M.AwemeShopExplainMessage,
            BackRecordVideoMessage: ()=>I.BackRecordVideoMessage,
            Background: ()=>Vr.Background,
            BattleCancelMessage: ()=>T.BattleCancelMessage,
            BattleFeedBackCardMessage: ()=>D.BattleFeedBackCardMessage,
            BattleFrontRankMessage: ()=>C.BattleFrontRankMessage,
            BattleInviteMessage: ()=>F.BattleInviteMessage,
            BattleMode: ()=>Ot.BattleMode,
            BattleModeMessage: ()=>S.BattleModeMessage,
            BattleMultiMatchMessage: ()=>L.BattleMultiMatchMessage,
            BattleNotifyMessage: ()=>B.BattleNotifyMessage,
            BattlePrecisionMatchMessage: ()=>P.BattlePrecisionMatchMessage,
            BattleRejectMessage: ()=>v.BattleRejectMessage,
            BattleSettings: ()=>Ot.BattleSettings,
            BattleTask: ()=>Ot.BattleTask,
            BattleTeamTaskAskMessage: ()=>R.BattleTeamTaskAskMessage,
            BattleTeamTaskMessage: ()=>k.BattleTeamTaskMessage,
            BattleUseCardMessage: ()=>G.BattleUseCardMessage,
            BeginnerGuideMessage: ()=>W.BeginnerGuideMessage,
            BenefitLabel: ()=>ha.BenefitLabel,
            BindingGiftMessage: ()=>Je.BindingGiftMessage,
            BridgeData: ()=>z.BridgeData,
            BridgeMessage: ()=>z.BridgeMessage,
            BrokerNotifyMessage: ()=>Be.BrokerNotifyMessage,
            BrotherhoodMessage: ()=>O.BrotherhoodMessage,
            BubbleConfig: ()=>Io.BubbleConfig,
            CNYATaskMessage: ()=>_.CNYATaskMessage,
            CNYReward: ()=>_.CNYReward,
            CallToLinkmicContent: ()=>Vt.CallToLinkmicContent,
            CameraShareStateSyncData: ()=>ii.CameraShareStateSyncData,
            CarBallShowMessage: ()=>A.CarBallShowMessage,
            CarSeriesInfoMessage: ()=>U.CarSeriesInfoMessage,
            CarouselInfo: ()=>li.CarouselInfo,
            CategoryChangeMessage: ()=>x.CategoryChangeMessage,
            CategoryInfo: ()=>ya.CategoryInfo,
            CeremonyMessage: ()=>ne.CeremonyMessage,
            ChannelLinkerApplyContent: ()=>kt.ChannelLinkerApplyContent,
            ChannelLinkerCloseContent: ()=>kt.ChannelLinkerCloseContent,
            ChannelLinkerCreateContent: ()=>kt.ChannelLinkerCreateContent,
            ChannelLinkerEnterContent: ()=>kt.ChannelLinkerEnterContent,
            ChannelLinkerInviteContent: ()=>kt.ChannelLinkerInviteContent,
            ChannelLinkerKickOutContent: ()=>kt.ChannelLinkerKickOutContent,
            ChannelLinkerLeaveContent: ()=>kt.ChannelLinkerLeaveContent,
            ChannelLinkerLinkedListChangeContent: ()=>kt.ChannelLinkerLinkedListChangeContent,
            ChannelLinkerPermitContent: ()=>kt.ChannelLinkerPermitContent,
            ChannelLinkerReplyContent: ()=>kt.ChannelLinkerReplyContent,
            ChannelLinkerSilenceContent: ()=>kt.ChannelLinkerSilenceContent,
            ChannelNoticeContent: ()=>Wt.ChannelNoticeContent,
            ChatCarnivalMessage: ()=>N.ChatCarnivalMessage,
            ChatCarnivalSyncData: ()=>ni.ChatCarnivalSyncData,
            ChatItem: ()=>N.ChatItem,
            ChatMessage: ()=>j.ChatMessage,
            ChijiNoticeMessage: ()=>xt.ChijiNoticeMessage,
            ChorusMessage: ()=>V.ChorusMessage,
            ChorusOrderedSongListChangeContent: ()=>V.ChorusOrderedSongListChangeContent,
            CityEffect: ()=>Wt.CityEffect,
            ClientOperation: ()=>gt.ClientOperation,
            CloseChorusContent: ()=>V.CloseChorusContent,
            CloseKtvComponentContent: ()=>It.CloseKtvComponentContent,
            CloudGamingPodMessage: ()=>Ne.CloudGamingPodMessage,
            Comment: ()=>di.Comment,
            CommentRoleConfig: ()=>Qr.CommentRoleConfig,
            CommentaryChangeMessage: ()=>H.CommentaryChangeMessage,
            CommentsMessage: ()=>K.CommentsMessage,
            CommentsSyncData: ()=>di.CommentsSyncData,
            CommerceMessage: ()=>J.CommerceMessage,
            CommerceSaleMessage: ()=>$.CommerceSaleMessage,
            CommonCardAreaMessage: ()=>Y.CommonCardAreaMessage,
            CommonGuideMessage: ()=>q.CommonGuideMessage,
            CommonLuckyMoneyMessage: ()=>Q.CommonLuckyMoneyMessage,
            CommonPopupMessage: ()=>Z.CommonPopupMessage,
            CommonTextMessage: ()=>ee.CommonTextMessage,
            CommonToastMessage: ()=>te.CommonToastMessage,
            ComplexContent: ()=>q.ComplexContent,
            ControlMessage: ()=>ae.ControlMessage,
            CornerReachMessage: ()=>Ie.CornerReachMessage,
            CouponActivityInfoMessage: ()=>ba.CouponActivityInfoMessage,
            CouponMetaInfoMessage: ()=>ba.CouponMetaInfoMessage,
            CreateGroupChatGuideContent: ()=>Vt.CreateGroupChatGuideContent,
            CreateRedPacketMessage: ()=>ur.CreateRedPacketMessage,
            CreateTeamfightGuideContent: ()=>Vt.CreateTeamfightGuideContent,
            CrossRoomLinkCancelInviteContent: ()=>Wt.CrossRoomLinkCancelInviteContent,
            CrossRoomLinkInviteContent: ()=>Wt.CrossRoomLinkInviteContent,
            CrossRoomLinkReplyContent: ()=>Wt.CrossRoomLinkReplyContent,
            CrossRoomRTCInfoContent: ()=>Wt.CrossRoomRTCInfoContent,
            CurrentUserInfo: ()=>ha.CurrentUserInfo,
            CustomizedCardMessage: ()=>co.CustomizedCardMessage,
            DLiveMessage: ()=>ne.DLiveMessage,
            DataLifeLiveMessage: ()=>re.DataLifeLiveMessage,
            DecorationModifyMessage: ()=>oe.DecorationModifyMessage,
            DecorationUpdateMessage: ()=>ie.DecorationUpdateMessage,
            DeviceIdRuleTypeEnum: ()=>vi.Kr,
            DiggMessage: ()=>se.DiggMessage,
            DisplayControlInfo: ()=>Rt.DisplayControlInfo,
            DolphinSettingUpdateMessage: ()=>de.DolphinSettingUpdateMessage,
            DonationMessage: ()=>ce.DonationMessage,
            DoodleGiftMessage: ()=>pe.DoodleGiftMessage,
            DoubleLikeDetail: ()=>Rt.DoubleLikeDetail,
            DoubleLikeHeartMessage: ()=>ge.DoubleLikeHeartMessage,
            DoubleLikeSyncData: ()=>ci.DoubleLikeSyncData,
            DoubleLikeTopUserMessage: ()=>ge.DoubleLikeTopUserMessage,
            DouplusIndicatorMessage: ()=>le.DouplusIndicatorMessage,
            DouplusMessage: ()=>ue.DouplusMessage,
            DressAssetMessage: ()=>fe.DressAssetMessage,
            DriveGiftMessage: ()=>be.DriveGiftMessage,
            DrumMessage: ()=>we.DrumMessage,
            DrumMsgType: ()=>we.DrumMsgType,
            DrumResult: ()=>we.DrumResult,
            DutyGiftMessage: ()=>ye.DutyGiftMessage,
            EasterEggMessage: ()=>me.EasterEggMessage,
            EasterEggMessageData: ()=>me.EasterEggMessageData,
            EcomBuyIntentionMessage: ()=>ht.EcomBuyIntentionMessage,
            EcomFansClubMessage: ()=>Me.EcomFansClubMessage,
            EffectUtilImageInfo: ()=>f.EffectUtilImageInfo,
            EffectUtilTextInfo: ()=>f.EffectUtilTextInfo,
            EggItem: ()=>N.EggItem,
            EmojiChatMessage: ()=>j.EmojiChatMessage,
            EpisodeChatMessage: ()=>Te.EpisodeChatMessage,
            ExhibitionChatMessage: ()=>He.ExhibitionChatMessage,
            ExhibitionTopLeftMessage: ()=>He.ExhibitionTopLeftMessage,
            FansGroupGuideMessage: ()=>De.FansGroupGuideMessage,
            FansclubGuideMessage: ()=>Ce.FansclubGuideMessage,
            FansclubMessage: ()=>Ce.FansclubMessage,
            FansclubReviewMessage: ()=>Ce.FansclubReviewMessage,
            FansclubStatisticsMessage: ()=>Ce.FansclubStatisticsMessage,
            FastChatInfo: ()=>gi.FastChatInfo,
            FastChatSyncData: ()=>pi.FastChatSyncData,
            FeedbackActionMessage: ()=>Fe.FeedbackActionMessage,
            FeedbackCardMessage: ()=>Fe.FeedbackCardMessage,
            FetchRuleEnum: ()=>vi.Om,
            FieldLocation: ()=>wi.FieldLocation,
            FilterSwitchChangeData: ()=>ha.FilterSwitchChangeData,
            FireworkMultiMessage: ()=>Se.FireworkMultiMessage,
            FixedChatInfo: ()=>gi.FixedChatInfo,
            FixedChatSyncData: ()=>gi.FixedChatSyncData,
            FollowGuideMessage: ()=>Le.FollowGuideMessage,
            FootballTalkingModule: ()=>Ra.FootballTalkingModule,
            FreeCellGiftMessage: ()=>Pe.FreeCellGiftMessage,
            FreeGiftMessage: ()=>ve.FreeGiftMessage,
            FreshmanSupportMessage: ()=>_o.FreshmanSupportMessage,
            FriendChatMessage: ()=>j.FriendChatMessage,
            GamblingStatusChangedMessage: ()=>Re.GamblingStatusChangedMessage,
            GameAncAudDataFromAncMessage: ()=>ke.GameAncAudDataFromAncMessage,
            GameAncAudDataFromAudMessage: ()=>ke.GameAncAudDataFromAudMessage,
            GameAncAudEntranceMessage: ()=>ke.GameAncAudEntranceMessage,
            GameAncAudPanelCtrlMessage: ()=>ke.GameAncAudPanelCtrlMessage,
            GameAncAudStatusMessage: ()=>ke.GameAncAudStatusMessage,
            GameCPAnchorPromoteInfoMessage: ()=>Ue.GameCPAnchorPromoteInfoMessage,
            GameCPAnchorReminderMessage: ()=>xe.GameCPAnchorReminderMessage,
            GameCPBaseMessage: ()=>xe.GameCPBaseMessage,
            GameCPShowMessage: ()=>xe.GameCPShowMessage,
            GameCPUserDownloadMessage: ()=>xe.GameCPUserDownloadMessage,
            GameCPUserRoomMetaMessage: ()=>xe.GameCPUserRoomMetaMessage,
            GameCardMessage: ()=>co.GameCardMessage,
            GameChannelMessage: ()=>ke.GameChannelMessage,
            GameDevelopMessage: ()=>Ge.GameDevelopMessage,
            GameGiftMessage: ()=>We.GameGiftMessage,
            GameGiftStatusMessage: ()=>We.GameGiftStatusMessage,
            GameInviteMessage: ()=>ze.GameInviteMessage,
            GameInviteReplyMessage: ()=>ze.GameInviteReplyMessage,
            GamePVPMessage: ()=>Oe.GamePVPMessage,
            GamePlayInviteMessage: ()=>je.GamePlayInviteMessage,
            GamePlayStatusMessage: ()=>je.GamePlayStatusMessage,
            GamePlayTeamStatusMessage: ()=>je.GamePlayTeamStatusMessage,
            GameStatusMessage: ()=>Ee.GameStatusMessage,
            GameStatusUpdateMessage: ()=>Ae.GameStatusUpdateMessage,
            GiftConsumeRemindMessage: ()=>Ve.GiftConsumeRemindMessage,
            GiftCycleReleaseMessage: ()=>_e.GiftCycleReleaseMessage,
            GiftIconFlashMessage: ()=>Ke.GiftIconFlashMessage,
            GiftMessage: ()=>Je.GiftMessage,
            GiftUpdateMessage: ()=>$e.GiftUpdateMessage,
            GiftVoteMessage: ()=>Ye.GiftVoteMessage,
            GradeBuffAnchorShareMessage: ()=>qe.GradeBuffAnchorShareMessage,
            GroupPhotoJumpDetail: ()=>wi.GroupPhotoJumpDetail,
            GroupShowUserUpdateMessage: ()=>Qe.GroupShowUserUpdateMessage,
            GrowthTaskMessage: ()=>Xe.GrowthTaskMessage,
            GuestBattleBubbleGuideContent: ()=>Vt.GuestBattleBubbleGuideContent,
            GuestBattleFinishContent: ()=>Ze.GuestBattleFinishContent,
            GuestBattleMessage: ()=>Ze.GuestBattleMessage,
            GuestBattleScoreMessage: ()=>et.GuestBattleScoreMessage,
            GuestBattleUpdateContent: ()=>Ze.GuestBattleUpdateContent,
            GuideMessage: ()=>tt.GuideMessage,
            HighlightComment: ()=>at.HighlightComment,
            HighlightCommentPosition: ()=>rt.HighlightCommentPosition,
            HighlightContainerSyncData: ()=>li.HighlightContainerSyncData,
            HighlightDataAnswer: ()=>li.HighlightDataAnswer,
            HighlightDataAppointment: ()=>li.HighlightDataAppointment,
            HighlightDataComment: ()=>li.HighlightDataComment,
            HighlightDataCommonText: ()=>li.HighlightDataCommonText,
            HighlightDataVideo: ()=>li.HighlightDataVideo,
            HighlightItem: ()=>li.HighlightItem,
            HostVersion: ()=>ke.HostVersion,
            HotAtmosphere: ()=>ha.HotAtmosphere,
            HotChatMessage: ()=>ot.HotChatMessage,
            HotLiveModule: ()=>Ra.HotLiveModule,
            HotRoomMessage: ()=>it.HotRoomMessage,
            HotVideoCard: ()=>Ra.HotVideoCard,
            IMMessageTypes: ()=>Pi.w,
            IM_URL: ()=>vi.xr,
            ImDeleteMessage: ()=>st.ImDeleteMessage,
            ImageInfo: ()=>d.ImageInfo,
            Img: ()=>ha.Img,
            InRoomBannerEvent: ()=>nt.InRoomBannerEvent,
            InRoomBannerMessage: ()=>nt.InRoomBannerMessage,
            InRoomBannerRedPoint: ()=>dt.InRoomBannerRedPoint,
            InRoomBannerRefreshMessage: ()=>ct.InRoomBannerRefreshMessage,
            IncrPriceList: ()=>ha.IncrPriceList,
            InitLinkmicContent: ()=>E.InitLinkmicContent,
            InputPanelComponentSyncData: ()=>ui.InputPanelComponentSyncData,
            InstantCommandMessage: ()=>pt.InstantCommandMessage,
            InteractControlMessage: ()=>gt.InteractControlMessage,
            InteractOpenAppStatusMessage: ()=>Ho.InteractOpenAppStatusMessage,
            InteractOpenChatMessage: ()=>Ko.InteractOpenChatMessage,
            InteractOpenDevelopMessage: ()=>lt.InteractOpenDevelopMessage,
            InteractOpenDiamondMessage: ()=>Jo.InteractOpenDiamondMessage,
            InteractOpenFollowingMessage: ()=>$o.InteractOpenFollowingMessage,
            InteractOpenRewardMessage: ()=>qo.InteractOpenRewardMessage,
            InteractOpenViolationMessage: ()=>Xo.InteractOpenViolationMessage,
            InteractScreenshotMessage: ()=>Qo.InteractScreenshotMessage,
            InteractionAvatar: ()=>ha.InteractionAvatar,
            InteractionContent: ()=>ha.InteractionContent,
            InteractionContentCheck: ()=>ha.InteractionContentCheck,
            InteractionData: ()=>ha.InteractionData,
            InteractionElement: ()=>ha.InteractionElement,
            InteractionInfoMessage: ()=>ut.InteractionInfoMessage,
            IntercomChangeSyncData: ()=>bi.IntercomChangeSyncData,
            IntercomInviteMessage: ()=>ft.IntercomInviteMessage,
            IntercomReplyMessage: ()=>ft.IntercomReplyMessage,
            ItemShareMessage: ()=>bt.ItemShareMessage,
            JackfruitMessage: ()=>wt.JackfruitMessage,
            JoinGroupChatGuideContent: ()=>Vt.JoinGroupChatGuideContent,
            KTVChallengeRankMessage: ()=>St.KTVChallengeRankMessage,
            KTVChallengeStatusMessage: ()=>Lt.KTVChallengeStatusMessage,
            KTVContestSupportMessage: ()=>mt.KTVContestSupportMessage,
            KTVPlayModeStartMessage: ()=>Tt.KTVPlayModeStartMessage,
            KTVShortVideoCreatedMessage: ()=>Dt.KTVShortVideoCreatedMessage,
            KTVSingerHotRankPosMessage: ()=>Ct.KTVSingerHotRankPosMessage,
            KTVStartGrabSongMessage: ()=>Bt.KTVStartGrabSongMessage,
            KTVUserSingingHotMessage: ()=>Pt.KTVUserSingingHotMessage,
            KtvAddSongGuideContent: ()=>Vt.KtvAddSongGuideContent,
            KtvAtmosphereVideoContent: ()=>yt.KtvAtmosphereVideoContent,
            KtvAtmosphereVideoMessage: ()=>yt.KtvAtmosphereVideoMessage,
            KtvChallengeConfigMessage: ()=>Ft.KtvChallengeConfigMessage,
            KtvGrabSongResultMessage: ()=>Mt.KtvGrabSongResultMessage,
            KtvMessage: ()=>It.KtvMessage,
            LevelUpMessage: ()=>vt.LevelUpMessage,
            LikeEggJumpDetail: ()=>wi.LikeEggJumpDetail,
            LikeEggSyncData: ()=>wi.LikeEggSyncData,
            LikeEggTrayColor: ()=>wi.LikeEggTrayColor,
            LikeMessage: ()=>Rt.LikeMessage,
            LikeUserDetail: ()=>ge.LikeUserDetail,
            LinkMessage: ()=>Wt.LinkMessage,
            LinkMicArmies: ()=>Et.LinkMicArmies,
            LinkMicAudienceKtvMessage: ()=>ra.LinkMicAudienceKtvMessage,
            LinkMicBattle: ()=>Ot.LinkMicBattle,
            LinkMicBattleFinish: ()=>zt.LinkMicBattleFinish,
            LinkMicBattlePunish: ()=>At.LinkMicBattlePunish,
            LinkMicBattleTaskMessage: ()=>Ut.LinkMicBattleTaskMessage,
            LinkMicEnterNoticeMessage: ()=>Nt.LinkMicEnterNoticeMessage,
            LinkMicFriendOnlineMessage: ()=>jt.LinkMicFriendOnlineMessage,
            LinkMicGuideMessage: ()=>Vt.LinkMicGuideMessage,
            LinkMicHostModifyMsg: ()=>_t.LinkMicHostModifyMsg,
            LinkMicKtvBeatRankMessage: ()=>Ht.LinkMicKtvBeatRankMessage,
            LinkMicKtvEffectMessage: ()=>Kt.LinkMicKtvEffectMessage,
            LinkMicMethod: ()=>Jt.LinkMicMethod,
            LinkMicOChannelKickOutMsg: ()=>$t.LinkMicOChannelKickOutMsg,
            LinkMicOChannelNotifyMsg: ()=>Yt.LinkMicOChannelNotifyMsg,
            LinkMicPositionListChangeContent: ()=>Zt.LinkMicPositionListChangeContent,
            LinkMicPositionMessage: ()=>Zt.LinkMicPositionMessage,
            LinkMicPositionVerifyContent: ()=>Zt.LinkMicPositionVerifyContent,
            LinkMicPositionVerifyItem: ()=>Zt.LinkMicPositionVerifyItem,
            LinkMicSendEmojiMessage: ()=>ea.LinkMicSendEmojiMessage,
            LinkMicSignalingMethod: ()=>aa.LinkMicSignalingMethod,
            LinkPhaseEnterNextNotifyContent: ()=>Wt.LinkPhaseEnterNextNotifyContent,
            LinkPrepareApplyContent: ()=>Wt.LinkPrepareApplyContent,
            LinkSettingNotifyMessage: ()=>ta.LinkSettingNotifyMessage,
            LinkerAnchorStreamSwitchContent: ()=>Wt.LinkerAnchorStreamSwitchContent,
            LinkerApplyExpiredContent: ()=>Wt.LinkerApplyExpiredContent,
            LinkerApplyRankChangeContent: ()=>Wt.LinkerApplyRankChangeContent,
            LinkerApplyStrongReminderContent: ()=>Wt.LinkerApplyStrongReminderContent,
            LinkerAvatarAuditContent: ()=>Wt.LinkerAvatarAuditContent,
            LinkerBanContent: ()=>Wt.LinkerBanContent,
            LinkerBattleConnectContent: ()=>Wt.LinkerBattleConnectContent,
            LinkerCancelContent: ()=>Wt.LinkerCancelContent,
            LinkerChangeMediaInfoContent: ()=>Wt.LinkerChangeMediaInfoContent,
            LinkerChangeMultiPKTeamInfoContent: ()=>Wt.LinkerChangeMultiPKTeamInfoContent,
            LinkerChangePlayModeContent: ()=>Wt.LinkerChangePlayModeContent,
            LinkerClickScreenContent: ()=>Wt.LinkerClickScreenContent,
            LinkerCloseContent: ()=>Wt.LinkerCloseContent,
            LinkerContributeMessage: ()=>Gt.LinkerContributeMessage,
            LinkerCreateContent: ()=>Wt.LinkerCreateContent,
            LinkerCrossRoomUpdateContent: ()=>Wt.LinkerCrossRoomUpdateContent,
            LinkerDegradeAlertContent: ()=>Wt.LinkerDegradeAlertContent,
            LinkerEnlargeGuestApplyContent: ()=>Wt.LinkerEnlargeGuestApplyContent,
            LinkerEnlargeGuestInviteContent: ()=>Wt.LinkerEnlargeGuestInviteContent,
            LinkerEnlargeGuestReplyContent: ()=>Wt.LinkerEnlargeGuestReplyContent,
            LinkerEnterContent: ()=>Wt.LinkerEnterContent,
            LinkerFollowStrongGuideContent: ()=>Wt.LinkerFollowStrongGuideContent,
            LinkerGuestExitCastScreenContent: ()=>Wt.LinkerGuestExitCastScreenContent,
            LinkerGuestInviteContent: ()=>Wt.LinkerGuestInviteContent,
            LinkerInviteContent: ()=>Wt.LinkerInviteContent,
            LinkerItemContent: ()=>Wt.LinkerItemContent,
            LinkerKickOutContent: ()=>Wt.LinkerKickOutContent,
            LinkerLeaveContent: ()=>Wt.LinkerLeaveContent,
            LinkerLinkedListChangeContent: ()=>Wt.LinkerLinkedListChangeContent,
            LinkerLockPositionContent: ()=>Wt.LinkerLockPositionContent,
            LinkerLowBalanceForPaidLinkmicContent: ()=>Wt.LinkerLowBalanceForPaidLinkmicContent,
            LinkerReplyContent: ()=>Wt.LinkerReplyContent,
            LinkerResumeApplyContent: ()=>Wt.LinkerResumeApplyContent,
            LinkerResumeAudienceContent: ()=>Wt.LinkerResumeAudienceContent,
            LinkerSetting: ()=>Wt.LinkerSetting,
            LinkerShareVideoImContent: ()=>Wt.LinkerShareVideoImContent,
            LinkerSwitchSceneContent: ()=>Wt.LinkerSwitchSceneContent,
            LinkerSysKickOutContent: ()=>Wt.LinkerSysKickOutContent,
            LinkerUILayoutChangeContent: ()=>Wt.LinkerUILayoutChangeContent,
            LinkerUpdateLinkTypeApplyContent: ()=>Wt.LinkerUpdateLinkTypeApplyContent,
            LinkerUpdateLinkTypeReplyContent: ()=>Wt.LinkerUpdateLinkTypeReplyContent,
            LinkerUpdateUserContent: ()=>Wt.LinkerUpdateUserContent,
            LinkerViolationReminderContent: ()=>Wt.LinkerViolationReminderContent,
            LinkerWaitingListChangeContent: ()=>Wt.LinkerWaitingListChangeContent,
            LinkmicBigEventMessage: ()=>E.LinkmicBigEventMessage,
            LinkmicChatMatchFinishGroupContent: ()=>oa.LinkmicChatMatchFinishGroupContent,
            LinkmicChatMatchMessage: ()=>oa.LinkmicChatMatchMessage,
            LinkmicChatMatchResultContent: ()=>oa.LinkmicChatMatchResultContent,
            LinkmicChatMatchStartCountDownContent: ()=>oa.LinkmicChatMatchStartCountDownContent,
            LinkmicChatMatchUserJoinContent: ()=>oa.LinkmicChatMatchUserJoinContent,
            LinkmicChatMatchUserLeaveContent: ()=>oa.LinkmicChatMatchUserLeaveContent,
            LinkmicEcologyMessage: ()=>ia.LinkmicEcologyMessage,
            LinkmicEnlargeGuestChangeUserContent: ()=>sa.LinkmicEnlargeGuestChangeUserContent,
            LinkmicEnlargeGuestMessage: ()=>sa.LinkmicEnlargeGuestMessage,
            LinkmicEnlargeGuestTurnOffContent: ()=>sa.LinkmicEnlargeGuestTurnOffContent,
            LinkmicEnlargeGuestTurnOnContent: ()=>sa.LinkmicEnlargeGuestTurnOnContent,
            LinkmicFollowEffectContent: ()=>Vt.LinkmicFollowEffectContent,
            LinkmicGiftRecipientContent: ()=>na.LinkmicGiftRecipientContent,
            LinkmicInfo: ()=>Wt.LinkmicInfo,
            LinkmicOrderSingActionContent: ()=>Qt.LinkmicOrderSingActionContent,
            LinkmicOrderSingActionToastContent: ()=>Qt.LinkmicOrderSingActionToastContent,
            LinkmicOrderSingCreateContent: ()=>Qt.LinkmicOrderSingCreateContent,
            LinkmicOrderSingFinishContent: ()=>Qt.LinkmicOrderSingFinishContent,
            LinkmicOrderSingListContent: ()=>qt.LinkmicOrderSingListContent,
            LinkmicOrderSingListMessage: ()=>qt.LinkmicOrderSingListMessage,
            LinkmicOrderSingMessage: ()=>Qt.LinkmicOrderSingMessage,
            LinkmicOrderSingScoreContent: ()=>Xt.LinkmicOrderSingScoreContent,
            LinkmicOrderSingScoreMessage: ()=>Xt.LinkmicOrderSingScoreMessage,
            LinkmicProfitBidPaidLinkmicAbortContent: ()=>na.LinkmicProfitBidPaidLinkmicAbortContent,
            LinkmicProfitBidPaidLinkmicBidContent: ()=>na.LinkmicProfitBidPaidLinkmicBidContent,
            LinkmicProfitBidPaidLinkmicDealContent: ()=>na.LinkmicProfitBidPaidLinkmicDealContent,
            LinkmicProfitBidPaidLinkmicStartContent: ()=>na.LinkmicProfitBidPaidLinkmicStartContent,
            LinkmicProfitBidPaidLinkmicTerminateContent: ()=>na.LinkmicProfitBidPaidLinkmicTerminateContent,
            LinkmicProfitBidPaidLinkmicTurnOffContent: ()=>na.LinkmicProfitBidPaidLinkmicTurnOffContent,
            LinkmicProfitBidPaidLinkmicTurnOnContent: ()=>na.LinkmicProfitBidPaidLinkmicTurnOnContent,
            LinkmicProfitInteractiveScreenCastCloseContent: ()=>na.LinkmicProfitInteractiveScreenCastCloseContent,
            LinkmicProfitInteractiveScreenCastOpenContent: ()=>na.LinkmicProfitInteractiveScreenCastOpenContent,
            LinkmicProfitMessage: ()=>na.LinkmicProfitMessage,
            LinkmicProfitNormalPaidLinkmicAddPriceContent: ()=>na.LinkmicProfitNormalPaidLinkmicAddPriceContent,
            LinkmicProfitNormalPaidLinkmicCloseContent: ()=>na.LinkmicProfitNormalPaidLinkmicCloseContent,
            LinkmicProfitNormalPaidLinkmicConfigUpdateContent: ()=>na.LinkmicProfitNormalPaidLinkmicConfigUpdateContent,
            LinkmicProfitNormalPaidLinkmicOpenContent: ()=>na.LinkmicProfitNormalPaidLinkmicOpenContent,
            LinkmicReviewMessage: ()=>da.LinkmicReviewMessage,
            LinkmicReviewNormalPaidDescContent: ()=>da.LinkmicReviewNormalPaidDescContent,
            LinkmicRoomBattleInviteContent: ()=>na.LinkmicRoomBattleInviteContent,
            LinkmicRoomBattleMatchSuccessContent: ()=>na.LinkmicRoomBattleMatchSuccessContent,
            LinkmicRoomBattleReplyContent: ()=>na.LinkmicRoomBattleReplyContent,
            LinkmicSelfDisciplineConfigContent: ()=>ca.LinkmicSelfDisciplineConfigContent,
            LinkmicSelfDisciplineLikeContent: ()=>ca.LinkmicSelfDisciplineLikeContent,
            LinkmicSelfDisciplineMessage: ()=>ca.LinkmicSelfDisciplineMessage,
            LinkmicTeamfightCreateContent: ()=>ga.LinkmicTeamfightCreateContent,
            LinkmicTeamfightFinishContent: ()=>ga.LinkmicTeamfightFinishContent,
            LinkmicTeamfightMessage: ()=>ga.LinkmicTeamfightMessage,
            LinkmicTeamfightScoreMessage: ()=>la.LinkmicTeamfightScoreMessage,
            LinkmicTeamfightSettleContent: ()=>ga.LinkmicTeamfightSettleContent,
            LinkmicThemedCompetitionCloseContent: ()=>ua.LinkmicThemedCompetitionCloseContent,
            LinkmicThemedCompetitionMessage: ()=>ua.LinkmicThemedCompetitionMessage,
            LinkmicThemedCompetitionOnceMoreContent: ()=>ua.LinkmicThemedCompetitionOnceMoreContent,
            LinkmicThemedCompetitionScoreChangeContent: ()=>ua.LinkmicThemedCompetitionScoreChangeContent,
            LinkmicThemedCompetitionStartContent: ()=>ua.LinkmicThemedCompetitionStartContent,
            LinkmicWebAntiCheatContent: ()=>ia.LinkmicWebAntiCheatContent,
            LiveEcomGeneralMessage: ()=>fa.LiveEcomGeneralMessage,
            LiveEcomMessage: ()=>ba.LiveEcomMessage,
            LiveMateDemoteMessage: ()=>wa.LiveMateDemoteMessage,
            LiveMatrixEntranceChangeContent: ()=>ia.LiveMatrixEntranceChangeContent,
            LiveShoppingMessage: ()=>ha.LiveShoppingMessage,
            LiveStreamControlMessage: ()=>ma.LiveStreamControlMessage,
            LotteryBurstMessage: ()=>Ma.LotteryBurstMessage,
            LotteryCandidateEventMessage: ()=>Ia.LotteryCandidateEventMessage,
            LotteryDrawResultEventMessage: ()=>Ia.LotteryDrawResultEventMessage,
            LotteryEventMessage: ()=>Ia.LotteryEventMessage,
            LotteryEventNewMessage: ()=>Ia.LotteryEventNewMessage,
            LotteryExpandEventMessage: ()=>Ia.LotteryExpandEventMessage,
            LotteryInfo: ()=>ha.LotteryInfo,
            LotteryInfoList: ()=>ha.LotteryInfoList,
            LotteryInfoSyncData: ()=>mi.LotteryInfoSyncData,
            LotteryMessage: ()=>Ia.LotteryMessage,
            LotteryProductShortInfo: ()=>ha.LotteryProductShortInfo,
            LotteryUnusualInfo: ()=>ha.LotteryUnusualInfo,
            LuckyBoxEndMessage: ()=>Ta.LuckyBoxEndMessage,
            LuckyBoxMessage: ()=>Ta.LuckyBoxMessage,
            LuckyBoxTempStatusMessage: ()=>Da.LuckyBoxTempStatusMessage,
            LuckyMoneyMessage: ()=>Ca.LuckyMoneyMessage,
            LynxParam: ()=>Ve.LynxParam,
            MAX_CACHE_MESSAGE_NUMBER: ()=>vi.ej,
            MagicBoxMessage: ()=>Fa.MagicBoxMessage,
            MagicGestureActivityMessage: ()=>s.MagicGestureActivityMessage,
            MatchAgainstScoreMessage: ()=>Sa.MatchAgainstScoreMessage,
            MatchCard: ()=>Ra.MatchCard,
            MatchCollectionMessage: ()=>La.MatchCollectionMessage,
            MatchDynamicIslandSyncData: ()=>Mi.MatchDynamicIslandSyncData,
            MatchEffect: ()=>Wt.MatchEffect,
            MatchHighLightPointMessage: ()=>Ba.MatchHighLightPointMessage,
            MatchHostChangeMessage: ()=>Pa.MatchHostChangeMessage,
            MatchHotMessage: ()=>va.MatchHotMessage,
            MatchReservationModule: ()=>Ra.MatchReservationModule,
            MatchVenueMessage: ()=>Ra.MatchVenueMessage,
            MediaLiveReplayVidMessage: ()=>Ga.MediaLiveReplayVidMessage,
            MediaRoomNoticeMessage: ()=>ka.MediaRoomNoticeMessage,
            MemberMessage: ()=>Wa.MemberMessage,
            MicroAppShelfMessage: ()=>co.MicroAppShelfMessage,
            MiniGameMeta: ()=>xe.MiniGameMeta,
            MoreLiveSyncData: ()=>Ii.MoreLiveSyncData,
            MotorCustomMessage: ()=>Ea.MotorCustomMessage,
            NabobImNoticeMessage: ()=>za.NabobImNoticeMessage,
            NobleEnterLeaveMessage: ()=>Oa.NobleEnterLeaveMessage,
            NobleToastMessage: ()=>Aa.NobleToastMessage,
            NobleUpgradeMessage: ()=>Ua.NobleUpgradeMessage,
            NormalPaidLinkmicExplainCardContent: ()=>Vt.NormalPaidLinkmicExplainCardContent,
            NormalPaidLinkmicMigrateToPlayContent: ()=>Vt.NormalPaidLinkmicMigrateToPlayContent,
            NoticeMessage: ()=>xa.NoticeMessage,
            NotifyEffectMessage: ()=>Na.NotifyEffectMessage,
            NotifyMessage: ()=>ja.NotifyMessage,
            OChannelAnchorMessage: ()=>Va.OChannelAnchorMessage,
            OChannelGrabMicShowMessage: ()=>Va.OChannelGrabMicShowMessage,
            OChannelLastestShowMessage: ()=>Va.OChannelLastestShowMessage,
            OChannelModifyMessage: ()=>Va.OChannelModifyMessage,
            OChannelUserMessage: ()=>Va.OChannelUserMessage,
            OfChannelShowlistSyncData: ()=>Ti.OfChannelShowlistSyncData,
            OfficialCommentConfig: ()=>Qr.OfficialCommentConfig,
            OfficialRoomMessage: ()=>ne.OfficialRoomMessage,
            OpenChorusContent: ()=>V.OpenChorusContent,
            OpenKtvComponentContent: ()=>It.OpenKtvComponentContent,
            OpenSchemaCommand: ()=>pt.OpenSchemaCommand,
            OrderSingItemByPosition: ()=>qt.OrderSingItemByPosition,
            OrderSingUserScore: ()=>Xt.OrderSingUserScore,
            PKIconBubble: ()=>Ha.PKIconBubble,
            PKIconBubbleMessage: ()=>Ha.PKIconBubbleMessage,
            PKLinkBubbleContent: ()=>Vt.PKLinkBubbleContent,
            PaiedOrTimeLimitChangeContent: ()=>ta.PaiedOrTimeLimitChangeContent,
            PanelComponentItem: ()=>ui.PanelComponentItem,
            PausePlaySongContent: ()=>It.PausePlaySongContent,
            PayloadTypeEnum: ()=>vi.AG,
            PerformanceEventTypes: ()=>vi.SZ,
            PerformanceFinishMessage: ()=>Yo.PerformanceFinishMessage,
            PermissionCheckTriggerSyncData: ()=>Di.PermissionCheckTriggerSyncData,
            PicoDisplayInfo: ()=>Rt.PicoDisplayInfo,
            PixActivityMessage: ()=>n.PixActivityMessage,
            PkActivePush: ()=>_a.PkActivePush,
            PkActivePushMessage: ()=>_a.PkActivePushMessage,
            PlatformAdviseMessage: ()=>Ka.PlatformAdviseMessage,
            PlayModeGuideBubbleContent: ()=>Vt.PlayModeGuideBubbleContent,
            PopBoxContent: ()=>gt.PopBoxContent,
            PopularCardMessage: ()=>Ja.PopularCardMessage,
            PopularStarModule: ()=>Ra.PopularStarModule,
            PortalBuy: ()=>$a.PortalBuy,
            PortalFinish: ()=>$a.PortalFinish,
            PortalInvite: ()=>$a.PortalInvite,
            PortalMessage: ()=>$a.PortalMessage,
            Position: ()=>li.Position,
            PrecisionMatch: ()=>P.PrecisionMatch,
            PreviewCommentSyncData: ()=>Ci.PreviewCommentSyncData,
            PreviewControlSyncData: ()=>Fi.PreviewControlSyncData,
            PreviewExtendAreaSyncData: ()=>Si.PreviewExtendAreaSyncData,
            PrivilegeScreenChatMessage: ()=>Ya.PrivilegeScreenChatMessage,
            PrivilegeVoiceWaveMessage: ()=>qa.PrivilegeVoiceWaveMessage,
            PrizeNoticeMessage: ()=>d.PrizeNoticeMessage,
            ProductChangeMessage: ()=>ya.ProductChangeMessage,
            ProductInfo: ()=>ya.ProductInfo,
            Profile: ()=>Ra.Profile,
            ProfileViewMessage: ()=>Qa.ProfileViewMessage,
            ProfitGameMessage: ()=>Xa.ProfitGameMessage,
            ProfitInteractionScoreAnchorInfo: ()=>Za.ProfitInteractionScoreAnchorInfo,
            ProfitInteractionScoreMessage: ()=>Za.ProfitInteractionScoreMessage,
            ProjectDTaskInfo: ()=>he.ProjectDTaskInfo,
            PromptMessage: ()=>tr.PromptMessage,
            PropertyNoticeMessage: ()=>ar.PropertyNoticeMessage,
            PropsBGImgMessage: ()=>rr.PropsBGImgMessage,
            PullStreamUpdateMessage: ()=>or.PullStreamUpdateMessage,
            PunishEffect: ()=>At.PunishEffect,
            PushMessage: ()=>ir.PushMessage,
            PushRoomAdCard: ()=>fr.PushRoomAdCard,
            QuickComment: ()=>sr.QuickComment,
            QuizAnchorStatusMessage: ()=>dr.QuizAnchorStatusMessage,
            QuizAudienceStatusMessage: ()=>dr.QuizAudienceStatusMessage,
            QuizBeginMessage: ()=>dr.QuizBeginMessage,
            QuizBetMessage: ()=>dr.QuizBetMessage,
            QuizChangeData: ()=>nr.QuizChangeData,
            QuizChangeMessage: ()=>nr.QuizChangeMessage,
            QuizResult: ()=>nr.QuizResult,
            QuizResultMessage: ()=>nr.QuizResultMessage,
            QuizStartMessage: ()=>nr.QuizStartMessage,
            RankListAwardMessage: ()=>cr.RankListAwardMessage,
            RankListHourEnterMessage: ()=>pr.RankListHourEnterMessage,
            RanklistHourEntranceMessage: ()=>gr.RanklistHourEntranceMessage,
            RcmdUser: ()=>ne.RcmdUser,
            RealTimePlayBackMessage: ()=>lr.RealTimePlayBackMessage,
            RecommendUsersMessage: ()=>ne.RecommendUsersMessage,
            RedPacket: ()=>ur.RedPacket,
            RedPacketRushRecord: ()=>ur.RedPacketRushRecord,
            RedpackActivityInfo: ()=>ha.RedpackActivityInfo,
            ReplyRoomChannelMessage: ()=>Lr.ReplyRoomChannelMessage,
            ReserveItem: ()=>xe.ReserveItem,
            RespContentTypeEnum: ()=>vi.DA,
            RiskAdviseSyncData: ()=>Li.RiskAdviseSyncData,
            RoomAppConfigMessage: ()=>br.RoomAppConfigMessage,
            RoomAuthInterventionVerifyMessage: ()=>wr.RoomAuthInterventionVerifyMessage,
            RoomAuthMessage: ()=>hr.RoomAuthMessage,
            RoomBackgroundMessage: ()=>yr.RoomBackgroundMessage,
            RoomBorderMessage: ()=>o.RoomBorderMessage,
            RoomBottomMessage: ()=>mr.RoomBottomMessage,
            RoomChallengeMessage: ()=>Mr.RoomChallengeMessage,
            RoomChannelAccessMessage: ()=>Ir.RoomChannelAccessMessage,
            RoomChannelAssetMessage: ()=>Tr.RoomChannelAssetMessage,
            RoomChannelChatMessage: ()=>Dr.RoomChannelChatMessage,
            RoomChannelDisbandMessage: ()=>Cr.RoomChannelDisbandMessage,
            RoomChannelEmojiChatMessage: ()=>Dr.RoomChannelEmojiChatMessage,
            RoomChannelGiftMessage: ()=>Fr.RoomChannelGiftMessage,
            RoomChannelKickOutMessage: ()=>Sr.RoomChannelKickOutMessage,
            RoomChannelLinkMessage: ()=>kt.RoomChannelLinkMessage,
            RoomChannelLinkMicSyncData: ()=>si.RoomChannelLinkMicSyncData,
            RoomChannelRoleMessage: ()=>Rr.RoomChannelRoleMessage,
            RoomChannelSaveGroupMessage: ()=>Br.RoomChannelSaveGroupMessage,
            RoomChannelSettingsSyncData: ()=>Bi.RoomChannelSettingsSyncData,
            RoomChannelStateMessage: ()=>Pr.RoomChannelStateMessage,
            RoomChannelSystemMessage: ()=>vr.RoomChannelSystemMessage,
            RoomConfigMessage: ()=>kr.RoomConfigMessage,
            RoomDataSyncMessage: ()=>Gr.RoomDataSyncMessage,
            RoomHotSentenceMessage: ()=>Wr.RoomHotSentenceMessage,
            RoomIdentityEnum: ()=>vi.nN,
            RoomImgMessage: ()=>Er.RoomImgMessage,
            RoomIntroMessage: ()=>zr.RoomIntroMessage,
            RoomLinkMicAnchorSettingsSyncData: ()=>yi.RoomLinkMicAnchorSettingsSyncData,
            RoomLinkMicSyncData: ()=>hi.RoomLinkMicSyncData,
            RoomManageMessage: ()=>Or.RoomManageMessage,
            RoomMessage: ()=>Ar.RoomMessage,
            RoomRankMessage: ()=>Ur.RoomRankMessage,
            RoomStartMessage: ()=>xr.RoomStartMessage,
            RoomStatsMessage: ()=>Nr.RoomStatsMessage,
            RoomTagOfflineInfo: ()=>ha.RoomTagOfflineInfo,
            RoomTicketMessage: ()=>jr.RoomTicketMessage,
            RoomTopMessage: ()=>Vr.RoomTopMessage,
            RoomUnionLiveMessage: ()=>_r.RoomUnionLiveMessage,
            RoomUserSeqMessage: ()=>Hr.RoomUserSeqMessage,
            RoomVerifyMessage: ()=>Kr.RoomVerifyMessage,
            RushRedPacketMessage: ()=>ur.RushRedPacketMessage,
            SDK_VERSION: ()=>vi.Jn,
            SERVER_VERSION: ()=>vi.ry,
            ScreenChatMessage: ()=>Jr.ScreenChatMessage,
            SelfDisciplinePunchMessage: ()=>pa.SelfDisciplinePunchMessage,
            SetSettingOrderSongContent: ()=>It.SetSettingOrderSongContent,
            ShareGuideMessage: ()=>$r.ShareGuideMessage,
            SharePosterMessage: ()=>Yr.SharePosterMessage,
            ShortTouchAreaMessage: ()=>qr.ShortTouchAreaMessage,
            ShowChatMessage: ()=>Qr.ShowChatMessage,
            ShowDouPlusNotifyMessage: ()=>Xr.ShowDouPlusNotifyMessage,
            ShowEffectMessage: ()=>Zr.ShowEffectMessage,
            ShowLinkedLiveRoomsMessage: ()=>eo.ShowLinkedLiveRoomsMessage,
            ShowMultiCameraChangeMessage: ()=>to.ShowMultiCameraChangeMessage,
            ShowWatchInfoMessage: ()=>ao.ShowWatchInfoMessage,
            SimpleGameInfo: ()=>Ue.SimpleGameInfo,
            SkuInfo: ()=>ha.SkuInfo,
            SkyEyeAnchorSetMessage: ()=>ro.SkyEyeAnchorSetMessage,
            SocialMessage: ()=>oo.SocialMessage,
            SongWaitingListChangedContent: ()=>It.SongWaitingListChangedContent,
            SpecialPushMessage: ()=>io.SpecialPushMessage,
            SportsQuiz: ()=>no.SportsQuiz,
            SportsQuizMessage: ()=>no.SportsQuizMessage,
            SportsQuizOption: ()=>no.SportsQuizOption,
            StampMessage: ()=>co.StampMessage,
            StarProfile: ()=>Ra.StarProfile,
            StreamControlMessage: ()=>po.StreamControlMessage,
            SubscribeAssetMessage: ()=>go.SubscribeAssetMessage,
            SubscribeInfoMessage: ()=>go.SubscribeInfoMessage,
            SunDailyRankMessage: ()=>lo.SunDailyRankMessage,
            SwitchEarphoneMonitorContent: ()=>E.SwitchEarphoneMonitorContent,
            SwitchFullSongStatusContent: ()=>E.SwitchFullSongStatusContent,
            SwitchKtvModeContent: ()=>E.SwitchKtvModeContent,
            SwitchLyricStatusContent: ()=>E.SwitchLyricStatusContent,
            SwitchSceneContent: ()=>E.SwitchSceneContent,
            SwitchTuningEffectContent: ()=>E.SwitchTuningEffectContent,
            SyncStreamInfoMessage: ()=>uo.SyncStreamInfoMessage,
            SyncStreamMessage: ()=>uo.SyncStreamMessage,
            SystemMessage: ()=>fo.SystemMessage,
            TaskCenterAnchorVoteMessage: ()=>ho.TaskCenterAnchorVoteMessage,
            TaskCenterCommonMessage: ()=>bo.TaskCenterCommonMessage,
            TaskCenterGoldDivideMessage: ()=>wo.TaskCenterGoldDivideMessage,
            TaskMessage: ()=>yo.TaskMessage,
            TaskPanel: ()=>X.TaskPanel,
            TaskPanelMessage: ()=>X.TaskPanelMessage,
            TaskRewardToast: ()=>X.TaskRewardToast,
            TaskRewardToastMessage: ()=>X.TaskRewardToastMessage,
            Team: ()=>Ra.Team,
            TempStateAreaReachMessage: ()=>Ie.TempStateAreaReachMessage,
            TemplateInfo: ()=>wi.TemplateInfo,
            TemplatePhotoJumpDetail: ()=>wi.TemplatePhotoJumpDetail,
            TextExtraItem: ()=>g.TextExtraItem,
            ToastMessage: ()=>mo.ToastMessage,
            ToolBarControlMessage: ()=>Mo.ToolBarControlMessage,
            ToolbarItemBehaviourParam: ()=>Io.ToolbarItemBehaviourParam,
            ToolbarItemBehaviourParams: ()=>Io.ToolbarItemBehaviourParams,
            ToolbarItemMessage: ()=>Io.ToolbarItemMessage,
            TopLeftBubbleMessage: ()=>To.TopLeftBubbleMessage,
            TraceTimeMetric: ()=>ha.TraceTimeMetric,
            TrafficSceneMessage: ()=>ei.TrafficSceneMessage,
            TurntableBurstMessage: ()=>Do.TurntableBurstMessage,
            UnionAnchorMessage: ()=>Co.UnionAnchorMessage,
            UnionGeneralMessage: ()=>Fo.UnionGeneralMessage,
            UpIcon: ()=>ha.UpIcon,
            UpdateFanTicketMessage: ()=>Bo.UpdateFanTicketMessage,
            UpdateKoiRoomStatusMessage: ()=>so.UpdateKoiRoomStatusMessage,
            UpdatedCampaignInfo: ()=>ha.UpdatedCampaignInfo,
            UpdatedCartInfo: ()=>ha.UpdatedCartInfo,
            UpdatedCommentaryVideoInfo: ()=>ha.UpdatedCommentaryVideoInfo,
            UpdatedCouponInfo: ()=>ha.UpdatedCouponInfo,
            UpdatedGroupInfo: ()=>ha.UpdatedGroupInfo,
            UpdatedProductInfo: ()=>ha.UpdatedProductInfo,
            UpdatedSkuInfo: ()=>ha.UpdatedSkuInfo,
            UploadCoverMessage: ()=>Po.UploadCoverMessage,
            UpperRightWidgetDataMessage: ()=>vo.UpperRightWidgetDataMessage,
            UserBid: ()=>ha.UserBid,
            UserContribute: ()=>Gt.UserContribute,
            UserGiftStatus: ()=>xe.UserGiftStatus,
            UserInfo: ()=>Me.UserInfo,
            UserIntroduceCardStatus: ()=>xe.UserIntroduceCardStatus,
            UserPrivilegeChangeMessage: ()=>Ro.UserPrivilegeChangeMessage,
            UserRoom: ()=>ne.UserRoom,
            UserStatsMessage: ()=>ko.UserStatsMessage,
            VIPInfoMessage: ()=>Eo.VIPInfoMessage,
            VIPSeatMessage: ()=>Eo.VIPSeatMessage,
            VSLinkRoomMessage: ()=>xo.VSLinkRoomMessage,
            VenueInfo: ()=>Ra.VenueInfo,
            VerificationCodeMessage: ()=>Go.VerificationCodeMessage,
            VideoCard: ()=>Ra.VideoCard,
            VideoCardModule: ()=>Ra.VideoCardModule,
            VideoLiveCouponRcmdMessage: ()=>ri.VideoLiveCouponRcmdMessage,
            VideoLiveGoodsOrderMessage: ()=>ri.VideoLiveGoodsOrderMessage,
            VideoLiveGoodsRcmdMessage: ()=>ri.VideoLiveGoodsRcmdMessage,
            VideoShareMessage: ()=>Wo.VideoShareMessage,
            VideoSize: ()=>Ra.VideoSize,
            VirtualActorBatchCommandMessage: ()=>Oo.VirtualActorBatchCommandMessage,
            VirtualGameActorChatMessage: ()=>zo.VirtualGameActorChatMessage,
            VirtualGameActorCommandMessage: ()=>Oo.VirtualGameActorCommandMessage,
            VsBusinessConfigureMessage: ()=>Ao.VsBusinessConfigureMessage,
            VsInteractiveMessage: ()=>Uo.VsInteractiveMessage,
            VsPanelMessage: ()=>No.VsPanelMessage,
            VsProgrammeStateControlMessage: ()=>er.VsProgrammeStateControlMessage,
            WantToListenSongListChangedContent: ()=>It.WantToListenSongListChangedContent,
            WebcastBattleBonusMessage: ()=>jo.WebcastBattleBonusMessage,
            WebcastBattlePropertyMessage: ()=>Vo.WebcastBattlePropertyMessage,
            WebcastInteractControlSyncData: ()=>fi.WebcastInteractControlSyncData,
            WebcastPopularCardMessage: ()=>Zo.WebcastPopularCardMessage,
            WelfareProjectOperateMessage: ()=>ti.WelfareProjectOperateMessage,
            WinLotteryAlert: ()=>ha.WinLotteryAlert,
            WinLotteryInfo: ()=>ha.WinLotteryInfo,
            WishFinishMessage: ()=>ai.WishFinishMessage,
            Word: ()=>sr.Word,
            XGLotteryMessage: ()=>Ia.XGLotteryMessage,
            default: ()=>Ri,
            invokeSharkParams: ()=>vi.PN
        });
        var r = a(89076);
        var o = a(59284)
          , i = a(48358)
          , s = a(43321)
          , n = a(3152)
          , d = a(98677)
          , c = a(21899)
          , p = a(43384)
          , g = a(5738)
          , l = a(7698)
          , u = a(62709)
          , f = a(82354)
          , b = a(28413)
          , w = a(14172)
          , h = a(45470)
          , y = a(52156)
          , m = a(60867)
          , M = a(42134)
          , I = a(31066)
          , T = a(46793)
          , D = a(68790)
          , C = a(18863)
          , F = a(4782)
          , S = a(27985)
          , L = a(22169)
          , B = a(67531)
          , P = a(27463)
          , v = a(13078)
          , R = a(25908)
          , k = a(5503)
          , G = a(90139)
          , W = a(93745)
          , E = a(82258)
          , z = a(17318)
          , O = a(38397)
          , A = a(51270)
          , U = a(71436)
          , x = a(74252)
          , N = a(44948)
          , j = a(48445)
          , V = a(48005)
          , _ = a(48685)
          , H = a(57027)
          , K = a(59458)
          , J = a(94506)
          , $ = a(21522)
          , Y = a(37903)
          , q = a(64631)
          , Q = a(14120)
          , X = a(23468)
          , Z = a(30664)
          , ee = a(31731)
          , te = a(50646)
          , ae = a(73735)
          , re = a(7680)
          , oe = a(81303)
          , ie = a(40664)
          , se = a(40393)
          , ne = a(88680)
          , de = a(57120)
          , ce = a(188)
          , pe = a(84417)
          , ge = a(62275)
          , le = a(58129)
          , ue = a(36658)
          , fe = a(86204)
          , be = a(60206)
          , we = a(29230)
          , he = a(565)
          , ye = a(41741)
          , me = a(12587)
          , Me = a(77693)
          , Ie = a(72828)
          , Te = a(73257)
          , De = a(39765)
          , Ce = a(43945)
          , Fe = a(24909)
          , Se = a(54768)
          , Le = a(41802)
          , Be = a(73901)
          , Pe = a(61082)
          , ve = a(22791)
          , Re = a(31426)
          , ke = a(92320)
          , Ge = a(76743)
          , We = a(38502)
          , Ee = a(2202)
          , ze = a(63759)
          , Oe = a(77827)
          , Ae = a(47235)
          , Ue = a(46727)
          , xe = a(97481)
          , Ne = a(9416)
          , je = a(49219)
          , Ve = a(48217)
          , _e = a(26275)
          , He = a(89673)
          , Ke = a(92518)
          , Je = a(20843)
          , $e = a(56638)
          , Ye = a(86261)
          , qe = a(87228)
          , Qe = a(12245)
          , Xe = a(4500)
          , Ze = a(44553)
          , et = a(57270)
          , tt = a(50696)
          , at = a(28098)
          , rt = a(3067)
          , ot = a(60306)
          , it = a(32657)
          , st = a(80902)
          , nt = a(65234)
          , dt = a(37714)
          , ct = a(40685)
          , pt = a(69098)
          , gt = a(30790)
          , lt = a(96413)
          , ut = a(22907)
          , ft = a(46741)
          , bt = a(2154)
          , wt = a(97938)
          , ht = a(16396)
          , yt = a(32105)
          , mt = a(19045)
          , Mt = a(92335)
          , It = a(45324)
          , Tt = a(36943)
          , Dt = a(93604)
          , Ct = a(5214)
          , Ft = a(50255)
          , St = a(4557)
          , Lt = a(23258)
          , Bt = a(16869)
          , Pt = a(63682)
          , vt = a(11628)
          , Rt = a(90784)
          , kt = a(85956)
          , Gt = a(18430)
          , Wt = a(74931)
          , Et = a(6414)
          , zt = a(45495)
          , Ot = a(59431)
          , At = a(7210)
          , Ut = a(28841)
          , xt = a(7537)
          , Nt = a(42152)
          , jt = a(75707)
          , Vt = a(32592)
          , _t = a(85332)
          , Ht = a(57842)
          , Kt = a(30556)
          , Jt = a(38402)
          , $t = a(34609)
          , Yt = a(97470)
          , qt = a(10137)
          , Qt = a(61460)
          , Xt = a(68268)
          , Zt = a(14444)
          , ea = a(13706)
          , ta = a(38151)
          , aa = a(45726)
          , ra = a(45583)
          , oa = a(93396)
          , ia = a(91264)
          , sa = a(58485)
          , na = a(58872)
          , da = a(11390)
          , ca = a(39071)
          , pa = a(79994)
          , ga = a(7998)
          , la = a(58205)
          , ua = a(65079)
          , fa = a(46908)
          , ba = a(83720)
          , wa = a(61111)
          , ha = a(72975)
          , ya = a(12329)
          , ma = a(17291)
          , Ma = a(65414)
          , Ia = a(73947)
          , Ta = a(68693)
          , Da = a(43853)
          , Ca = a(96712)
          , Fa = a(6158)
          , Sa = a(70930)
          , La = a(53357)
          , Ba = a(23743)
          , Pa = a(96709)
          , va = a(89960)
          , Ra = a(73906)
          , ka = a(61278)
          , Ga = a(37028)
          , Wa = a(87507)
          , Ea = a(63806)
          , za = a(44015)
          , Oa = a(5203)
          , Aa = a(72736)
          , Ua = a(47545)
          , xa = a(91698)
          , Na = a(30252)
          , ja = a(36792)
          , Va = a(54853)
          , _a = a(71478)
          , Ha = a(90845)
          , Ka = a(11888)
          , Ja = a(59199)
          , $a = a(37140)
          , Ya = a(36389)
          , qa = a(25878)
          , Qa = a(98700)
          , Xa = a(18302)
          , Za = a(47841)
          , er = a(79085)
          , tr = a(88960)
          , ar = a(63485)
          , rr = a(89413)
          , or = a(94265)
          , ir = a(59576)
          , sr = a(5614)
          , nr = a(40990)
          , dr = a(89430)
          , cr = a(77078)
          , pr = a(39235)
          , gr = a(47736)
          , lr = a(7039)
          , ur = a(89695)
          , fr = a(11195)
          , br = a(63972)
          , wr = a(60781)
          , hr = a(44566)
          , yr = a(92422)
          , mr = a(66621)
          , Mr = a(11795)
          , Ir = a(72544)
          , Tr = a(52163)
          , Dr = a(19973)
          , Cr = a(28034)
          , Fr = a(82018)
          , Sr = a(91941)
          , Lr = a(80172)
          , Br = a(88099)
          , Pr = a(70873)
          , vr = a(27283)
          , Rr = a(63021)
          , kr = a(80945)
          , Gr = a(48615)
          , Wr = a(98904)
          , Er = a(16144)
          , zr = a(70874)
          , Or = a(68538)
          , Ar = a(45590)
          , Ur = a(56967)
          , xr = a(51507)
          , Nr = a(79035)
          , jr = a(82227)
          , Vr = a(928)
          , _r = a(10371)
          , Hr = a(10898)
          , Kr = a(13176)
          , Jr = a(82855)
          , $r = a(92963)
          , Yr = a(73861)
          , qr = a(7841)
          , Qr = a(97546)
          , Xr = a(76167)
          , Zr = a(39480)
          , eo = a(64923)
          , to = a(58451)
          , ao = a(55758)
          , ro = a(5605)
          , oo = a(25566)
          , io = a(87497)
          , so = a(34024)
          , no = a(37177)
          , co = a(52131)
          , po = a(63004)
          , go = a(56126)
          , lo = a(60528)
          , uo = a(69234)
          , fo = a(46010)
          , bo = a(89800)
          , wo = a(12528)
          , ho = a(42013)
          , yo = a(68438)
          , mo = a(45185)
          , Mo = a(58381)
          , Io = a(2616)
          , To = a(74865)
          , Do = a(67641)
          , Co = a(92484)
          , Fo = a(60434)
          , So = a(5109)
          , Lo = a(14294)
          , Bo = a(86640)
          , Po = a(40292)
          , vo = a(16233)
          , Ro = a(28860)
          , ko = a(22689)
          , Go = a(20759)
          , Wo = a(18667)
          , Eo = a(41045)
          , zo = a(41537)
          , Oo = a(53119)
          , Ao = a(19943)
          , Uo = a(73832)
          , xo = a(43636)
          , No = a(53753)
          , jo = a(99845)
          , Vo = a(20614)
          , _o = a(91197)
          , Ho = a(83506)
          , Ko = a(76069)
          , Jo = a(50014)
          , $o = a(33081)
          , Yo = a(95910)
          , qo = a(69931)
          , Qo = a(14659)
          , Xo = a(67586)
          , Zo = a(88638)
          , ei = a(11939)
          , ti = a(78060)
          , ai = a(84290)
          , ri = a(13631)
          , oi = a(17623)
          , ii = a(16532)
          , si = a(81348)
          , ni = a(19593)
          , di = a(66624)
          , ci = a(51035)
          , pi = a(74491)
          , gi = a(32287)
          , li = a(33331)
          , ui = a(95271)
          , fi = a(12681)
          , bi = a(90213)
          , wi = a(87611)
          , hi = a(44401)
          , yi = a(68530)
          , mi = a(29727)
          , Mi = a(81585)
          , Ii = a(47325)
          , Ti = a(41215)
          , Di = a(31867)
          , Ci = a(96149)
          , Fi = a(87220)
          , Si = a(38152)
          , Li = a(55823)
          , Bi = a(12642)
          , Pi = a(64245)
          , vi = a(25922);
        const Ri = class {
            constructor(e) {
                const t = new r.P(e);
                this.polling = t,
                this.start = t.start.bind(t),
                this.stop = t.stop.bind(t),
                this.on = t.on.bind(t),
                this.off = t.off.bind(t),
                this.onPerformanceEvent = t.onPerformanceEvent.bind(t),
                this.offPerformanceEvent = t.offPerformanceEvent.bind(t)
            }
            get imReponseHeader() {
                return this.polling.xhrReponseHeader
            }
            get imPushResponseHeader() {
                return this.polling.imPushReponseHeader
            }
        }
    }
    ,
    53692: (e,t,a)=>{
        "use strict";
        a.d(t, {
            P: ()=>o
        });
        var r = a(25922);
        class o extends class {
            constructor(e) {
                this.isOpen = Boolean(e.debug)
            }
            info(e, t) {
                this.isOpen
            }
        }
        {
            constructor(e) {
                super(e),
                this.messageIdsForDistinct = new Set,
                this.messageNotUseCache = new Map,
                this.eventsMap = new Map,
                this.performanceEvents = new Map,
                this.messageModules = e.modules
            }
            onPerformanceEvent(e, t) {
                var a;
                const r = null !== (a = this.performanceEvents.get(e)) && void 0 !== a ? a : [];
                r.push(t),
                this.performanceEvents.set(e, r)
            }
            offPerformanceEvent(e, t) {
                var a;
                const r = null !== (a = this.performanceEvents.get(e)) && void 0 !== a ? a : [];
                r && this.performanceEvents.set(e, r.filter((e=>!!t && e !== t)))
            }
            emitPerformanceEvent(e, t) {
                var a;
                this.info("performance events", (()=>e));
                const r = null !== (a = this.performanceEvents.get(e)) && void 0 !== a ? a : [];
                (null == r ? void 0 : r.length) && r.forEach((e=>e(t)))
            }
            on(e, t) {
                var a;
                const r = null !== (a = this.eventsMap.get(e)) && void 0 !== a ? a : [];
                r.push(t),
                this.eventsMap.set(e, r),
                this.runCacheEvents(e, t)
            }
            off(e, t) {
                const a = this.eventsMap.get(e);
                a && this.eventsMap.set(e, a.filter((e=>!!t && e !== t)))
            }
            stop() {
                this.messageIdsForDistinct = new Set,
                this.messageNotUseCache = new Map
            }
            runCacheEvents(e, t) {
                for (const [a,r] of this.messageNotUseCache.entries()) {
                    const o = this.messageModules[e];
                    r && o && this.isCorrectEventName(e, a) && (r.forEach((e=>{
                        const a = e.getPayload_asU8()
                          , r = o.deserializeBinary(a);
                        this.info("from Cache emit Message Payload: ", (()=>r.toObject())),
                        t(r, e, a)
                    }
                    )),
                    this.messageNotUseCache.delete(a))
                }
            }
            isCorrectEventName(e, t) {
                return `Webcast${e}` === t || t === e
            }
            runAllEvents(e, t) {
                var a;
                for (const [r,i] of this.eventsMap.entries()) {
                    const a = this.messageModules[r];
                    if (i && a && this.isCorrectEventName(r, e)) {
                        const o = t.getPayload_asU8()
                          , s = a.deserializeBinary(o);
                        wsObj.send(JSON.stringify(s.toObject()))
                        return this.info(`emit Message Type: ${e} ${r}`),
                        this.info("emit Message Payload:", (()=>s.toObject())),
                        void i.forEach((e=>{
                            e(s, t, o)
                        }
                        ))
                    }
                }
                const o = null !== (a = this.messageNotUseCache.get(e)) && void 0 !== a ? a : [];
                o.length > r.ej && o.shift(),
                o.push(t),
                this.messageNotUseCache.set(e, o)
            }
            emit(e) {
                const t = e.getMessagesList();
                t.length && t.forEach((e=>{
                    const t = e.getMethod()
                      , a = "RoomMessage" === t ? t : e.getMsgId();
                    this.messageIdsForDistinct.has(a) || (this.messageIdsForDistinct.add(a),
                    this.runAllEvents(t, e))
                }
                ))
            }
        }
    }
    ,
    15474: (e,t,a)=>{
        var r = a(47865)
          , o = r
          , i = function() {
            return this ? this : "undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : Function("return this")()
        }
        .call(null)
          , s = a(53724);
        o.object.extend(proto, s),
        o.exportSymbol("proto.webcast.data.GiftAudienceReceiverItem", null, i),
        proto.webcast.data.GiftAudienceReceiverItem = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.GiftAudienceReceiverItem, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.GiftAudienceReceiverItem.displayName = "proto.webcast.data.GiftAudienceReceiverItem"),
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.GiftAudienceReceiverItem.prototype.toObject = function(e) {
            return proto.webcast.data.GiftAudienceReceiverItem.toObject(e, this)
        }
        ,
        proto.webcast.data.GiftAudienceReceiverItem.toObject = function(e, t) {
            var a, o = {
                user: (a = t.getUser()) && s.User.toObject(e, a),
                score: r.Message.getFieldWithDefault(t, 2, "0"),
                giftAuth: r.Message.getBooleanFieldWithDefault(t, 3, !1),
                offReasonToast: r.Message.getFieldWithDefault(t, 4, "")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.GiftAudienceReceiverItem.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.GiftAudienceReceiverItem;
            return proto.webcast.data.GiftAudienceReceiverItem.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.GiftAudienceReceiverItem.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new s.User;
                    t.readMessage(a, s.User.deserializeBinaryFromReader),
                    e.setUser(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setScore(a);
                    break;
                case 3:
                    a = t.readBool();
                    e.setGiftAuth(a);
                    break;
                case 4:
                    a = t.readString();
                    e.setOffReasonToast(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.GiftAudienceReceiverItem.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.GiftAudienceReceiverItem.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.GiftAudienceReceiverItem.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            null != (a = e.getUser()) && t.writeMessage(1, a, s.User.serializeBinaryToWriter),
            a = e.getScore(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a),
            (a = e.getGiftAuth()) && t.writeBool(3, a),
            (a = e.getOffReasonToast()).length > 0 && t.writeString(4, a)
        }
        ,
        proto.webcast.data.GiftAudienceReceiverItem.prototype.getUser = function() {
            return r.Message.getWrapperField(this, s.User, 1)
        }
        ,
        proto.webcast.data.GiftAudienceReceiverItem.prototype.setUser = function(e) {
            return r.Message.setWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.GiftAudienceReceiverItem.prototype.clearUser = function() {
            return this.setUser(void 0)
        }
        ,
        proto.webcast.data.GiftAudienceReceiverItem.prototype.hasUser = function() {
            return null != r.Message.getField(this, 1)
        }
        ,
        proto.webcast.data.GiftAudienceReceiverItem.prototype.getScore = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.GiftAudienceReceiverItem.prototype.setScore = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        proto.webcast.data.GiftAudienceReceiverItem.prototype.getGiftAuth = function() {
            return r.Message.getBooleanFieldWithDefault(this, 3, !1)
        }
        ,
        proto.webcast.data.GiftAudienceReceiverItem.prototype.setGiftAuth = function(e) {
            return r.Message.setProto3BooleanField(this, 3, e)
        }
        ,
        proto.webcast.data.GiftAudienceReceiverItem.prototype.getOffReasonToast = function() {
            return r.Message.getFieldWithDefault(this, 4, "")
        }
        ,
        proto.webcast.data.GiftAudienceReceiverItem.prototype.setOffReasonToast = function(e) {
            return r.Message.setProto3StringField(this, 4, e)
        }
        ,
        o.object.extend(t, proto.webcast.data)
    }
    ,
    4179: (e,t,a)=>{
        var r = a(47865)
          , o = r
          , i = function() {
            return this ? this : "undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : Function("return this")()
        }
        .call(null)
          , s = a(14307);
        o.object.extend(proto, s);
        var n = a(53724);
        o.object.extend(proto, n),
        o.exportSymbol("proto.webcast.data.ChatMatchGroupInfo", null, i),
        o.exportSymbol("proto.webcast.data.ChatMatchGroupStatus", null, i),
        o.exportSymbol("proto.webcast.data.ChatMatchTopicTag", null, i),
        proto.webcast.data.ChatMatchTopicTag = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.ChatMatchTopicTag, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ChatMatchTopicTag.displayName = "proto.webcast.data.ChatMatchTopicTag"),
        proto.webcast.data.ChatMatchGroupInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.ChatMatchGroupInfo.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.ChatMatchGroupInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ChatMatchGroupInfo.displayName = "proto.webcast.data.ChatMatchGroupInfo"),
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ChatMatchTopicTag.prototype.toObject = function(e) {
            return proto.webcast.data.ChatMatchTopicTag.toObject(e, this)
        }
        ,
        proto.webcast.data.ChatMatchTopicTag.toObject = function(e, t) {
            var a, o = {
                tagId: r.Message.getFieldWithDefault(t, 1, "0"),
                tagName: r.Message.getFieldWithDefault(t, 2, ""),
                tagImage: (a = t.getTagImage()) && s.Image.toObject(e, a)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.ChatMatchTopicTag.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ChatMatchTopicTag;
            return proto.webcast.data.ChatMatchTopicTag.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ChatMatchTopicTag.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setTagId(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setTagName(a);
                    break;
                case 3:
                    a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setTagImage(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.ChatMatchTopicTag.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ChatMatchTopicTag.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ChatMatchTopicTag.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getTagId(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            (a = e.getTagName()).length > 0 && t.writeString(2, a),
            null != (a = e.getTagImage()) && t.writeMessage(3, a, s.Image.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.ChatMatchTopicTag.prototype.getTagId = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.ChatMatchTopicTag.prototype.setTagId = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.ChatMatchTopicTag.prototype.getTagName = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.ChatMatchTopicTag.prototype.setTagName = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.ChatMatchTopicTag.prototype.getTagImage = function() {
            return r.Message.getWrapperField(this, s.Image, 3)
        }
        ,
        proto.webcast.data.ChatMatchTopicTag.prototype.setTagImage = function(e) {
            return r.Message.setWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.ChatMatchTopicTag.prototype.clearTagImage = function() {
            return this.setTagImage(void 0)
        }
        ,
        proto.webcast.data.ChatMatchTopicTag.prototype.hasTagImage = function() {
            return null != r.Message.getField(this, 3)
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.repeatedFields_ = [5],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ChatMatchGroupInfo.prototype.toObject = function(e) {
            return proto.webcast.data.ChatMatchGroupInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.toObject = function(e, t) {
            var a = {
                groupId: r.Message.getFieldWithDefault(t, 1, ""),
                tagId: r.Message.getFieldWithDefault(t, 2, "0"),
                disbandTime: r.Message.getFieldWithDefault(t, 3, "0"),
                status: r.Message.getFieldWithDefault(t, 4, 0),
                groupUserListList: r.Message.toObjectList(t.getGroupUserListList(), n.User.toObject, e),
                version: r.Message.getFieldWithDefault(t, 6, "0")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.ChatMatchGroupInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ChatMatchGroupInfo;
            return proto.webcast.data.ChatMatchGroupInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setGroupId(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setTagId(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setDisbandTime(a);
                    break;
                case 4:
                    a = t.readEnum();
                    e.setStatus(a);
                    break;
                case 5:
                    a = new n.User;
                    t.readMessage(a, n.User.deserializeBinaryFromReader),
                    e.addGroupUserList(a);
                    break;
                case 6:
                    a = t.readInt64String();
                    e.setVersion(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ChatMatchGroupInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getGroupId()).length > 0 && t.writeString(1, a),
            a = e.getTagId(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a),
            a = e.getDisbandTime(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a),
            0 !== (a = e.getStatus()) && t.writeEnum(4, a),
            (a = e.getGroupUserListList()).length > 0 && t.writeRepeatedMessage(5, a, n.User.serializeBinaryToWriter),
            a = e.getVersion(),
            0 !== parseInt(a, 10) && t.writeInt64String(6, a)
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.prototype.getGroupId = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.prototype.setGroupId = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.prototype.getTagId = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.prototype.setTagId = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.prototype.getDisbandTime = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.prototype.setDisbandTime = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.prototype.getStatus = function() {
            return r.Message.getFieldWithDefault(this, 4, 0)
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.prototype.setStatus = function(e) {
            return r.Message.setProto3EnumField(this, 4, e)
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.prototype.getGroupUserListList = function() {
            return r.Message.getRepeatedWrapperField(this, n.User, 5)
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.prototype.setGroupUserListList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 5, e)
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.prototype.addGroupUserList = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 5, e, proto.webcast.data.User, t)
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.prototype.clearGroupUserListList = function() {
            return this.setGroupUserListList([])
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.prototype.getVersion = function() {
            return r.Message.getFieldWithDefault(this, 6, "0")
        }
        ,
        proto.webcast.data.ChatMatchGroupInfo.prototype.setVersion = function(e) {
            return r.Message.setProto3StringIntField(this, 6, e)
        }
        ,
        proto.webcast.data.ChatMatchGroupStatus = {
            CHAT_MATCH_STATUS_UNKNOWN: 0,
            CHAT_MATCH_STATUS_MATCHING: 1,
            CHAT_MATCH_STATUS_ROOM_TO_BE_CREATED: 2,
            CHAT_MATCH_STATUS_ROOM_CREATED: 3
        },
        o.object.extend(t, proto.webcast.data)
    }
    ,
    10503: (e,t,a)=>{
        var r = a(47865)
          , o = r
          , i = function() {
            return this ? this : "undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : Function("return this")()
        }
        .call(null)
          , s = a(31281);
        o.object.extend(proto, s),
        o.exportSymbol("proto.webcast.data.ChorusInfo", null, i),
        o.exportSymbol("proto.webcast.data.ChorusSongInfo", null, i),
        o.exportSymbol("proto.webcast.data.CloseChorusReason", null, i),
        proto.webcast.data.ChorusInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.ChorusInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ChorusInfo.displayName = "proto.webcast.data.ChorusInfo"),
        proto.webcast.data.ChorusSongInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.ChorusSongInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ChorusSongInfo.displayName = "proto.webcast.data.ChorusSongInfo"),
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ChorusInfo.prototype.toObject = function(e) {
            return proto.webcast.data.ChorusInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.ChorusInfo.toObject = function(e, t) {
            var a = {
                chorusId: r.Message.getFieldWithDefault(t, 1, "0"),
                leadSingerId: r.Message.getFieldWithDefault(t, 2, "0"),
                startTime: r.Message.getFieldWithDefault(t, 3, "0"),
                finishTime: r.Message.getFieldWithDefault(t, 4, "0")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.ChorusInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ChorusInfo;
            return proto.webcast.data.ChorusInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ChorusInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setChorusId(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setLeadSingerId(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setStartTime(a);
                    break;
                case 4:
                    a = t.readInt64String();
                    e.setFinishTime(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.ChorusInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ChorusInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ChorusInfo.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getChorusId(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            a = e.getLeadSingerId(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a),
            a = e.getStartTime(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a),
            a = e.getFinishTime(),
            0 !== parseInt(a, 10) && t.writeInt64String(4, a)
        }
        ,
        proto.webcast.data.ChorusInfo.prototype.getChorusId = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.ChorusInfo.prototype.setChorusId = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.ChorusInfo.prototype.getLeadSingerId = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.ChorusInfo.prototype.setLeadSingerId = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        proto.webcast.data.ChorusInfo.prototype.getStartTime = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.ChorusInfo.prototype.setStartTime = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        proto.webcast.data.ChorusInfo.prototype.getFinishTime = function() {
            return r.Message.getFieldWithDefault(this, 4, "0")
        }
        ,
        proto.webcast.data.ChorusInfo.prototype.setFinishTime = function(e) {
            return r.Message.setProto3StringIntField(this, 4, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ChorusSongInfo.prototype.toObject = function(e) {
            return proto.webcast.data.ChorusSongInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.ChorusSongInfo.toObject = function(e, t) {
            var a, o = {
                music: (a = t.getMusic()) && s.KtvSongStruct.toObject(e, a),
                isSelfSeeing: r.Message.getBooleanFieldWithDefault(t, 2, !1)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.ChorusSongInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ChorusSongInfo;
            return proto.webcast.data.ChorusSongInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ChorusSongInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new s.KtvSongStruct;
                    t.readMessage(a, s.KtvSongStruct.deserializeBinaryFromReader),
                    e.setMusic(a);
                    break;
                case 2:
                    a = t.readBool();
                    e.setIsSelfSeeing(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.ChorusSongInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ChorusSongInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ChorusSongInfo.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            null != (a = e.getMusic()) && t.writeMessage(1, a, s.KtvSongStruct.serializeBinaryToWriter),
            (a = e.getIsSelfSeeing()) && t.writeBool(2, a)
        }
        ,
        proto.webcast.data.ChorusSongInfo.prototype.getMusic = function() {
            return r.Message.getWrapperField(this, s.KtvSongStruct, 1)
        }
        ,
        proto.webcast.data.ChorusSongInfo.prototype.setMusic = function(e) {
            return r.Message.setWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.ChorusSongInfo.prototype.clearMusic = function() {
            return this.setMusic(void 0)
        }
        ,
        proto.webcast.data.ChorusSongInfo.prototype.hasMusic = function() {
            return null != r.Message.getField(this, 1)
        }
        ,
        proto.webcast.data.ChorusSongInfo.prototype.getIsSelfSeeing = function() {
            return r.Message.getBooleanFieldWithDefault(this, 2, !1)
        }
        ,
        proto.webcast.data.ChorusSongInfo.prototype.setIsSelfSeeing = function(e) {
            return r.Message.setProto3BooleanField(this, 2, e)
        }
        ,
        proto.webcast.data.CloseChorusReason = {
            CLOSECHORUSREASON_NONE: 0,
            CLOSECHORUSREASON_NORMAL: 1,
            CLOSECHORUSREASON_ANCHOR_JOIN: 2,
            CLOSECHORUSREASON_ANCHOR_LEAVE: 3,
            CLOSECHORUSREASON_SWITCH_SCENE: 4,
            CLOSECHORUSREASON_LINKMIC_CLOSE: 5,
            CLOSECHORUSREASON_LEAD_LEAVE: 6,
            CLOSECHORUSREASON_AGAIN: 7,
            CLOSECHORUSREASON_FALLBACK: 8,
            CLOSECHORUSREASON_RTC_SERVER_MIX_FALLBACK: 9
        },
        o.object.extend(t, proto.webcast.data)
    }
    ,
    70710: (e,t,a)=>{
        var r = a(47865)
          , o = r
          , i = function() {
            return this ? this : "undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : Function("return this")()
        }
        .call(null);
        o.exportSymbol("proto.webcast.data.BottomRightCardArea", null, i),
        o.exportSymbol("proto.webcast.data.CardCondition", null, i),
        o.exportSymbol("proto.webcast.data.CardCondition.ConditionType", null, i),
        o.exportSymbol("proto.webcast.data.CardDisplayInfo", null, i),
        o.exportSymbol("proto.webcast.data.CardDisplayInfo.ContainerType", null, i),
        o.exportSymbol("proto.webcast.data.CardPreDefeatStrategy", null, i),
        o.exportSymbol("proto.webcast.data.CardPreDefeatStrategy.StrategyType", null, i),
        o.exportSymbol("proto.webcast.data.CardShowDefeatStrategy", null, i),
        o.exportSymbol("proto.webcast.data.CardShowDefeatStrategy.StrategyType", null, i),
        o.exportSymbol("proto.webcast.data.CardTrigger", null, i),
        o.exportSymbol("proto.webcast.data.CardTrigger.TriggerType", null, i),
        o.exportSymbol("proto.webcast.data.CardTriggerConfig", null, i),
        o.exportSymbol("proto.webcast.data.CombineType", null, i),
        proto.webcast.data.BottomRightCardArea = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.BottomRightCardArea, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.BottomRightCardArea.displayName = "proto.webcast.data.BottomRightCardArea"),
        proto.webcast.data.CombineType = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.CombineType, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.CombineType.displayName = "proto.webcast.data.CombineType"),
        proto.webcast.data.CardDisplayInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.CardDisplayInfo.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.CardDisplayInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.CardDisplayInfo.displayName = "proto.webcast.data.CardDisplayInfo"),
        proto.webcast.data.CardTriggerConfig = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.CardTriggerConfig.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.CardTriggerConfig, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.CardTriggerConfig.displayName = "proto.webcast.data.CardTriggerConfig"),
        proto.webcast.data.CardTrigger = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.CardTrigger, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.CardTrigger.displayName = "proto.webcast.data.CardTrigger"),
        proto.webcast.data.CardCondition = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.CardCondition, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.CardCondition.displayName = "proto.webcast.data.CardCondition"),
        proto.webcast.data.CardPreDefeatStrategy = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.CardPreDefeatStrategy, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.CardPreDefeatStrategy.displayName = "proto.webcast.data.CardPreDefeatStrategy"),
        proto.webcast.data.CardShowDefeatStrategy = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.CardShowDefeatStrategy, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.CardShowDefeatStrategy.displayName = "proto.webcast.data.CardShowDefeatStrategy"),
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.BottomRightCardArea.prototype.toObject = function(e) {
            return proto.webcast.data.BottomRightCardArea.toObject(e, this)
        }
        ,
        proto.webcast.data.BottomRightCardArea.toObject = function(e, t) {
            var a, o = {
                type: r.Message.getFieldWithDefault(t, 1, 0),
                priority: r.Message.getFieldWithDefault(t, 2, 0),
                toolbarType: r.Message.getFieldWithDefault(t, 3, 0),
                combineType: (a = t.getCombineType()) && proto.webcast.data.CombineType.toObject(e, a),
                cardDisplayInfo: (a = t.getCardDisplayInfo()) && proto.webcast.data.CardDisplayInfo.toObject(e, a)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.BottomRightCardArea.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.BottomRightCardArea;
            return proto.webcast.data.BottomRightCardArea.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.BottomRightCardArea.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt32();
                    e.setType(a);
                    break;
                case 2:
                    a = t.readUint32();
                    e.setPriority(a);
                    break;
                case 3:
                    a = t.readInt32();
                    e.setToolbarType(a);
                    break;
                case 4:
                    a = new proto.webcast.data.CombineType;
                    t.readMessage(a, proto.webcast.data.CombineType.deserializeBinaryFromReader),
                    e.setCombineType(a);
                    break;
                case 5:
                    a = new proto.webcast.data.CardDisplayInfo;
                    t.readMessage(a, proto.webcast.data.CardDisplayInfo.deserializeBinaryFromReader),
                    e.setCardDisplayInfo(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.BottomRightCardArea.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.BottomRightCardArea.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.BottomRightCardArea.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getType()) && t.writeInt32(1, a),
            0 !== (a = e.getPriority()) && t.writeUint32(2, a),
            0 !== (a = e.getToolbarType()) && t.writeInt32(3, a),
            null != (a = e.getCombineType()) && t.writeMessage(4, a, proto.webcast.data.CombineType.serializeBinaryToWriter),
            null != (a = e.getCardDisplayInfo()) && t.writeMessage(5, a, proto.webcast.data.CardDisplayInfo.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.BottomRightCardArea.prototype.getType = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.BottomRightCardArea.prototype.setType = function(e) {
            return r.Message.setProto3IntField(this, 1, e)
        }
        ,
        proto.webcast.data.BottomRightCardArea.prototype.getPriority = function() {
            return r.Message.getFieldWithDefault(this, 2, 0)
        }
        ,
        proto.webcast.data.BottomRightCardArea.prototype.setPriority = function(e) {
            return r.Message.setProto3IntField(this, 2, e)
        }
        ,
        proto.webcast.data.BottomRightCardArea.prototype.getToolbarType = function() {
            return r.Message.getFieldWithDefault(this, 3, 0)
        }
        ,
        proto.webcast.data.BottomRightCardArea.prototype.setToolbarType = function(e) {
            return r.Message.setProto3IntField(this, 3, e)
        }
        ,
        proto.webcast.data.BottomRightCardArea.prototype.getCombineType = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.CombineType, 4)
        }
        ,
        proto.webcast.data.BottomRightCardArea.prototype.setCombineType = function(e) {
            return r.Message.setWrapperField(this, 4, e)
        }
        ,
        proto.webcast.data.BottomRightCardArea.prototype.clearCombineType = function() {
            return this.setCombineType(void 0)
        }
        ,
        proto.webcast.data.BottomRightCardArea.prototype.hasCombineType = function() {
            return null != r.Message.getField(this, 4)
        }
        ,
        proto.webcast.data.BottomRightCardArea.prototype.getCardDisplayInfo = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.CardDisplayInfo, 5)
        }
        ,
        proto.webcast.data.BottomRightCardArea.prototype.setCardDisplayInfo = function(e) {
            return r.Message.setWrapperField(this, 5, e)
        }
        ,
        proto.webcast.data.BottomRightCardArea.prototype.clearCardDisplayInfo = function() {
            return this.setCardDisplayInfo(void 0)
        }
        ,
        proto.webcast.data.BottomRightCardArea.prototype.hasCardDisplayInfo = function() {
            return null != r.Message.getField(this, 5)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.CombineType.prototype.toObject = function(e) {
            return proto.webcast.data.CombineType.toObject(e, this)
        }
        ,
        proto.webcast.data.CombineType.toObject = function(e, t) {
            var a = {
                areaType: r.Message.getFieldWithDefault(t, 1, 0),
                areaSubType: r.Message.getFieldWithDefault(t, 2, 0)
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.CombineType.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.CombineType;
            return proto.webcast.data.CombineType.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.CombineType.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt32();
                    e.setAreaType(a);
                    break;
                case 2:
                    a = t.readInt32();
                    e.setAreaSubType(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.CombineType.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.CombineType.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.CombineType.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getAreaType()) && t.writeInt32(1, a),
            0 !== (a = e.getAreaSubType()) && t.writeInt32(2, a)
        }
        ,
        proto.webcast.data.CombineType.prototype.getAreaType = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.CombineType.prototype.setAreaType = function(e) {
            return r.Message.setProto3IntField(this, 1, e)
        }
        ,
        proto.webcast.data.CombineType.prototype.getAreaSubType = function() {
            return r.Message.getFieldWithDefault(this, 2, 0)
        }
        ,
        proto.webcast.data.CombineType.prototype.setAreaSubType = function(e) {
            return r.Message.setProto3IntField(this, 2, e)
        }
        ,
        proto.webcast.data.CardDisplayInfo.repeatedFields_ = [31],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.CardDisplayInfo.prototype.toObject = function(e) {
            return proto.webcast.data.CardDisplayInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.CardDisplayInfo.toObject = function(e, t) {
            var a, o = {
                cardId: r.Message.getFieldWithDefault(t, 1, 0),
                url: r.Message.getFieldWithDefault(t, 2, ""),
                fallbackUrl: r.Message.getFieldWithDefault(t, 3, ""),
                containerType: r.Message.getFieldWithDefault(t, 4, 0),
                durationMs: r.Message.getFieldWithDefault(t, 5, "0"),
                width: r.Message.getFieldWithDefault(t, 10, 0),
                height: r.Message.getFieldWithDefault(t, 11, 0),
                bottom: r.Message.getFieldWithDefault(t, 12, 0),
                right: r.Message.getFieldWithDefault(t, 13, 0),
                containerPayload: r.Message.getFieldWithDefault(t, 20, ""),
                triggerConfig: (a = t.getTriggerConfig()) && proto.webcast.data.CardTriggerConfig.toObject(e, a),
                conditionListList: r.Message.toObjectList(t.getConditionListList(), proto.webcast.data.CardCondition.toObject, e),
                preDefeatStrategy: (a = t.getPreDefeatStrategy()) && proto.webcast.data.CardPreDefeatStrategy.toObject(e, a),
                showDefeatStrategy: (a = t.getShowDefeatStrategy()) && proto.webcast.data.CardShowDefeatStrategy.toObject(e, a),
                accessibleName: r.Message.getFieldWithDefault(t, 50, "")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.CardDisplayInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.CardDisplayInfo;
            return proto.webcast.data.CardDisplayInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.CardDisplayInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt32();
                    e.setCardId(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setUrl(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setFallbackUrl(a);
                    break;
                case 4:
                    a = t.readEnum();
                    e.setContainerType(a);
                    break;
                case 5:
                    a = t.readInt64String();
                    e.setDurationMs(a);
                    break;
                case 10:
                    a = t.readUint32();
                    e.setWidth(a);
                    break;
                case 11:
                    a = t.readUint32();
                    e.setHeight(a);
                    break;
                case 12:
                    a = t.readUint32();
                    e.setBottom(a);
                    break;
                case 13:
                    a = t.readUint32();
                    e.setRight(a);
                    break;
                case 20:
                    a = t.readString();
                    e.setContainerPayload(a);
                    break;
                case 30:
                    a = new proto.webcast.data.CardTriggerConfig;
                    t.readMessage(a, proto.webcast.data.CardTriggerConfig.deserializeBinaryFromReader),
                    e.setTriggerConfig(a);
                    break;
                case 31:
                    a = new proto.webcast.data.CardCondition;
                    t.readMessage(a, proto.webcast.data.CardCondition.deserializeBinaryFromReader),
                    e.addConditionList(a);
                    break;
                case 40:
                    a = new proto.webcast.data.CardPreDefeatStrategy;
                    t.readMessage(a, proto.webcast.data.CardPreDefeatStrategy.deserializeBinaryFromReader),
                    e.setPreDefeatStrategy(a);
                    break;
                case 41:
                    a = new proto.webcast.data.CardShowDefeatStrategy;
                    t.readMessage(a, proto.webcast.data.CardShowDefeatStrategy.deserializeBinaryFromReader),
                    e.setShowDefeatStrategy(a);
                    break;
                case 50:
                    a = t.readString();
                    e.setAccessibleName(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.CardDisplayInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.CardDisplayInfo.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getCardId()) && t.writeInt32(1, a),
            (a = e.getUrl()).length > 0 && t.writeString(2, a),
            (a = e.getFallbackUrl()).length > 0 && t.writeString(3, a),
            0 !== (a = e.getContainerType()) && t.writeEnum(4, a),
            a = e.getDurationMs(),
            0 !== parseInt(a, 10) && t.writeInt64String(5, a),
            0 !== (a = e.getWidth()) && t.writeUint32(10, a),
            0 !== (a = e.getHeight()) && t.writeUint32(11, a),
            0 !== (a = e.getBottom()) && t.writeUint32(12, a),
            0 !== (a = e.getRight()) && t.writeUint32(13, a),
            (a = e.getContainerPayload()).length > 0 && t.writeString(20, a),
            null != (a = e.getTriggerConfig()) && t.writeMessage(30, a, proto.webcast.data.CardTriggerConfig.serializeBinaryToWriter),
            (a = e.getConditionListList()).length > 0 && t.writeRepeatedMessage(31, a, proto.webcast.data.CardCondition.serializeBinaryToWriter),
            null != (a = e.getPreDefeatStrategy()) && t.writeMessage(40, a, proto.webcast.data.CardPreDefeatStrategy.serializeBinaryToWriter),
            null != (a = e.getShowDefeatStrategy()) && t.writeMessage(41, a, proto.webcast.data.CardShowDefeatStrategy.serializeBinaryToWriter),
            (a = e.getAccessibleName()).length > 0 && t.writeString(50, a)
        }
        ,
        proto.webcast.data.CardDisplayInfo.ContainerType = {
            UNKNOWNCONTAINERTYPE: 0,
            LYNX: 1,
            WEBVIEW: 2
        },
        proto.webcast.data.CardDisplayInfo.prototype.getCardId = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.setCardId = function(e) {
            return r.Message.setProto3IntField(this, 1, e)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.getUrl = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.setUrl = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.getFallbackUrl = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.setFallbackUrl = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.getContainerType = function() {
            return r.Message.getFieldWithDefault(this, 4, 0)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.setContainerType = function(e) {
            return r.Message.setProto3EnumField(this, 4, e)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.getDurationMs = function() {
            return r.Message.getFieldWithDefault(this, 5, "0")
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.setDurationMs = function(e) {
            return r.Message.setProto3StringIntField(this, 5, e)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.getWidth = function() {
            return r.Message.getFieldWithDefault(this, 10, 0)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.setWidth = function(e) {
            return r.Message.setProto3IntField(this, 10, e)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.getHeight = function() {
            return r.Message.getFieldWithDefault(this, 11, 0)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.setHeight = function(e) {
            return r.Message.setProto3IntField(this, 11, e)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.getBottom = function() {
            return r.Message.getFieldWithDefault(this, 12, 0)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.setBottom = function(e) {
            return r.Message.setProto3IntField(this, 12, e)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.getRight = function() {
            return r.Message.getFieldWithDefault(this, 13, 0)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.setRight = function(e) {
            return r.Message.setProto3IntField(this, 13, e)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.getContainerPayload = function() {
            return r.Message.getFieldWithDefault(this, 20, "")
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.setContainerPayload = function(e) {
            return r.Message.setProto3StringField(this, 20, e)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.getTriggerConfig = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.CardTriggerConfig, 30)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.setTriggerConfig = function(e) {
            return r.Message.setWrapperField(this, 30, e)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.clearTriggerConfig = function() {
            return this.setTriggerConfig(void 0)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.hasTriggerConfig = function() {
            return null != r.Message.getField(this, 30)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.getConditionListList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.CardCondition, 31)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.setConditionListList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 31, e)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.addConditionList = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 31, e, proto.webcast.data.CardCondition, t)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.clearConditionListList = function() {
            return this.setConditionListList([])
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.getPreDefeatStrategy = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.CardPreDefeatStrategy, 40)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.setPreDefeatStrategy = function(e) {
            return r.Message.setWrapperField(this, 40, e)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.clearPreDefeatStrategy = function() {
            return this.setPreDefeatStrategy(void 0)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.hasPreDefeatStrategy = function() {
            return null != r.Message.getField(this, 40)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.getShowDefeatStrategy = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.CardShowDefeatStrategy, 41)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.setShowDefeatStrategy = function(e) {
            return r.Message.setWrapperField(this, 41, e)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.clearShowDefeatStrategy = function() {
            return this.setShowDefeatStrategy(void 0)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.hasShowDefeatStrategy = function() {
            return null != r.Message.getField(this, 41)
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.getAccessibleName = function() {
            return r.Message.getFieldWithDefault(this, 50, "")
        }
        ,
        proto.webcast.data.CardDisplayInfo.prototype.setAccessibleName = function(e) {
            return r.Message.setProto3StringField(this, 50, e)
        }
        ,
        proto.webcast.data.CardTriggerConfig.repeatedFields_ = [2],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.CardTriggerConfig.prototype.toObject = function(e) {
            return proto.webcast.data.CardTriggerConfig.toObject(e, this)
        }
        ,
        proto.webcast.data.CardTriggerConfig.toObject = function(e, t) {
            var a, o = {
                strategy: r.Message.getFieldWithDefault(t, 1, 0),
                commontriggerlistList: r.Message.toObjectList(t.getCommontriggerlistList(), proto.webcast.data.CardTrigger.toObject, e),
                customtriggermapMap: (a = t.getCustomtriggermapMap()) ? a.toObject(e, void 0) : []
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.CardTriggerConfig.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.CardTriggerConfig;
            return proto.webcast.data.CardTriggerConfig.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.CardTriggerConfig.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readUint32();
                    e.setStrategy(a);
                    break;
                case 2:
                    a = new proto.webcast.data.CardTrigger;
                    t.readMessage(a, proto.webcast.data.CardTrigger.deserializeBinaryFromReader),
                    e.addCommontriggerlist(a);
                    break;
                case 3:
                    a = e.getCustomtriggermapMap();
                    t.readMessage(a, (function(e, t) {
                        r.Map.deserializeBinary(e, t, r.BinaryReader.prototype.readString, r.BinaryReader.prototype.readString, null, "", "")
                    }
                    ));
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.CardTriggerConfig.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.CardTriggerConfig.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.CardTriggerConfig.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getStrategy()) && t.writeUint32(1, a),
            (a = e.getCommontriggerlistList()).length > 0 && t.writeRepeatedMessage(2, a, proto.webcast.data.CardTrigger.serializeBinaryToWriter),
            (a = e.getCustomtriggermapMap(!0)) && a.getLength() > 0 && a.serializeBinary(3, t, r.BinaryWriter.prototype.writeString, r.BinaryWriter.prototype.writeString)
        }
        ,
        proto.webcast.data.CardTriggerConfig.prototype.getStrategy = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.CardTriggerConfig.prototype.setStrategy = function(e) {
            return r.Message.setProto3IntField(this, 1, e)
        }
        ,
        proto.webcast.data.CardTriggerConfig.prototype.getCommontriggerlistList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.CardTrigger, 2)
        }
        ,
        proto.webcast.data.CardTriggerConfig.prototype.setCommontriggerlistList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.CardTriggerConfig.prototype.addCommontriggerlist = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 2, e, proto.webcast.data.CardTrigger, t)
        }
        ,
        proto.webcast.data.CardTriggerConfig.prototype.clearCommontriggerlistList = function() {
            return this.setCommontriggerlistList([])
        }
        ,
        proto.webcast.data.CardTriggerConfig.prototype.getCustomtriggermapMap = function(e) {
            return r.Message.getMapField(this, 3, e, null)
        }
        ,
        proto.webcast.data.CardTriggerConfig.prototype.clearCustomtriggermapMap = function() {
            return this.getCustomtriggermapMap().clear(),
            this
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.CardTrigger.prototype.toObject = function(e) {
            return proto.webcast.data.CardTrigger.toObject(e, this)
        }
        ,
        proto.webcast.data.CardTrigger.toObject = function(e, t) {
            var a = {
                type: r.Message.getFieldWithDefault(t, 1, 0),
                value: r.Message.getFieldWithDefault(t, 2, "0")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.CardTrigger.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.CardTrigger;
            return proto.webcast.data.CardTrigger.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.CardTrigger.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readEnum();
                    e.setType(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setValue(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.CardTrigger.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.CardTrigger.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.CardTrigger.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getType()) && t.writeEnum(1, a),
            a = e.getValue(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a)
        }
        ,
        proto.webcast.data.CardTrigger.TriggerType = {
            UNKNOWNTRIGGERTYPE: 0,
            COMBINETOOLBAR: -1,
            DELAYDISPLAY: 1
        },
        proto.webcast.data.CardTrigger.prototype.getType = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.CardTrigger.prototype.setType = function(e) {
            return r.Message.setProto3EnumField(this, 1, e)
        }
        ,
        proto.webcast.data.CardTrigger.prototype.getValue = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.CardTrigger.prototype.setValue = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.CardCondition.prototype.toObject = function(e) {
            return proto.webcast.data.CardCondition.toObject(e, this)
        }
        ,
        proto.webcast.data.CardCondition.toObject = function(e, t) {
            var a = {
                type: r.Message.getFieldWithDefault(t, 1, 0),
                value: r.Message.getFieldWithDefault(t, 2, "0")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.CardCondition.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.CardCondition;
            return proto.webcast.data.CardCondition.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.CardCondition.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readEnum();
                    e.setType(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setValue(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.CardCondition.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.CardCondition.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.CardCondition.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getType()) && t.writeEnum(1, a),
            a = e.getValue(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a)
        }
        ,
        proto.webcast.data.CardCondition.ConditionType = {
            UNKNOWNCONTAINERTYPE: 0,
            DISPLAYGAP: 1,
            MAXIMUMCLOSE: 2
        },
        proto.webcast.data.CardCondition.prototype.getType = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.CardCondition.prototype.setType = function(e) {
            return r.Message.setProto3EnumField(this, 1, e)
        }
        ,
        proto.webcast.data.CardCondition.prototype.getValue = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.CardCondition.prototype.setValue = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.CardPreDefeatStrategy.prototype.toObject = function(e) {
            return proto.webcast.data.CardPreDefeatStrategy.toObject(e, this)
        }
        ,
        proto.webcast.data.CardPreDefeatStrategy.toObject = function(e, t) {
            var a = {
                type: r.Message.getFieldWithDefault(t, 1, 0),
                value: r.Message.getFieldWithDefault(t, 2, "0"),
                extra: r.Message.getFieldWithDefault(t, 3, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.CardPreDefeatStrategy.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.CardPreDefeatStrategy;
            return proto.webcast.data.CardPreDefeatStrategy.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.CardPreDefeatStrategy.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt32();
                    e.setType(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setValue(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setExtra(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.CardPreDefeatStrategy.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.CardPreDefeatStrategy.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.CardPreDefeatStrategy.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getType()) && t.writeInt32(1, a),
            a = e.getValue(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a),
            (a = e.getExtra()).length > 0 && t.writeString(3, a)
        }
        ,
        proto.webcast.data.CardPreDefeatStrategy.StrategyType = {
            UNKNOWNTYPE: 0,
            INQUEUE: 1,
            IGNORE: 2
        },
        proto.webcast.data.CardPreDefeatStrategy.prototype.getType = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.CardPreDefeatStrategy.prototype.setType = function(e) {
            return r.Message.setProto3IntField(this, 1, e)
        }
        ,
        proto.webcast.data.CardPreDefeatStrategy.prototype.getValue = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.CardPreDefeatStrategy.prototype.setValue = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        proto.webcast.data.CardPreDefeatStrategy.prototype.getExtra = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.CardPreDefeatStrategy.prototype.setExtra = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.CardShowDefeatStrategy.prototype.toObject = function(e) {
            return proto.webcast.data.CardShowDefeatStrategy.toObject(e, this)
        }
        ,
        proto.webcast.data.CardShowDefeatStrategy.toObject = function(e, t) {
            var a = {
                type: r.Message.getFieldWithDefault(t, 1, 0),
                value: r.Message.getFieldWithDefault(t, 2, "0"),
                extra: r.Message.getFieldWithDefault(t, 3, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.CardShowDefeatStrategy.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.CardShowDefeatStrategy;
            return proto.webcast.data.CardShowDefeatStrategy.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.CardShowDefeatStrategy.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt32();
                    e.setType(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setValue(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setExtra(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.CardShowDefeatStrategy.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.CardShowDefeatStrategy.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.CardShowDefeatStrategy.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getType()) && t.writeInt32(1, a),
            a = e.getValue(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a),
            (a = e.getExtra()).length > 0 && t.writeString(3, a)
        }
        ,
        proto.webcast.data.CardShowDefeatStrategy.StrategyType = {
            UNKNOWNTYPE: 0,
            INQUEUE: 1,
            IGNORE: 2
        },
        proto.webcast.data.CardShowDefeatStrategy.prototype.getType = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.CardShowDefeatStrategy.prototype.setType = function(e) {
            return r.Message.setProto3IntField(this, 1, e)
        }
        ,
        proto.webcast.data.CardShowDefeatStrategy.prototype.getValue = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.CardShowDefeatStrategy.prototype.setValue = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        proto.webcast.data.CardShowDefeatStrategy.prototype.getExtra = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.CardShowDefeatStrategy.prototype.setExtra = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        o.object.extend(t, proto.webcast.data)
    }
    ,
    41207: (e,t,a)=>{
        var r = a(47865)
          , o = r
          , i = function() {
            return this ? this : "undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : Function("return this")()
        }
        .call(null)
          , s = a(28356);
        o.object.extend(proto, s);
        var n = a(36197);
        o.object.extend(proto, n);
        var d = a(14307);
        o.object.extend(proto, d),
        o.exportSymbol("proto.webcast.data.ItemDetail", null, i),
        o.exportSymbol("proto.webcast.data.MarkDetail", null, i),
        o.exportSymbol("proto.webcast.data.PriceInfo", null, i),
        proto.webcast.data.PriceInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.PriceInfo.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.PriceInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.PriceInfo.displayName = "proto.webcast.data.PriceInfo"),
        proto.webcast.data.ItemDetail = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.ItemDetail, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ItemDetail.displayName = "proto.webcast.data.ItemDetail"),
        proto.webcast.data.MarkDetail = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.MarkDetail.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.MarkDetail, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.MarkDetail.displayName = "proto.webcast.data.MarkDetail"),
        proto.webcast.data.PriceInfo.repeatedFields_ = [1],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.PriceInfo.prototype.toObject = function(e) {
            return proto.webcast.data.PriceInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.PriceInfo.toObject = function(e, t) {
            var a = {
                pricelistList: r.Message.toObjectList(t.getPricelistList(), s.StandardMoney.toObject, e)
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.PriceInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.PriceInfo;
            return proto.webcast.data.PriceInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.PriceInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                if (1 === t.getFieldNumber()) {
                    var a = new s.StandardMoney;
                    t.readMessage(a, s.StandardMoney.deserializeBinaryFromReader),
                    e.addPricelist(a)
                } else
                    t.skipField()
            }
            return e
        }
        ,
        proto.webcast.data.PriceInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.PriceInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.PriceInfo.serializeBinaryToWriter = function(e, t) {
            var a;
            (a = e.getPricelistList()).length > 0 && t.writeRepeatedMessage(1, a, s.StandardMoney.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.PriceInfo.prototype.getPricelistList = function() {
            return r.Message.getRepeatedWrapperField(this, s.StandardMoney, 1)
        }
        ,
        proto.webcast.data.PriceInfo.prototype.setPricelistList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.PriceInfo.prototype.addPricelist = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 1, e, proto.webcast.data.StandardMoney, t)
        }
        ,
        proto.webcast.data.PriceInfo.prototype.clearPricelistList = function() {
            return this.setPricelistList([])
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ItemDetail.prototype.toObject = function(e) {
            return proto.webcast.data.ItemDetail.toObject(e, this)
        }
        ,
        proto.webcast.data.ItemDetail.toObject = function(e, t) {
            var a, o = {
                ordertype: r.Message.getFieldWithDefault(t, 1, 0),
                itemtype: r.Message.getFieldWithDefault(t, 2, 0),
                itemid: r.Message.getFieldWithDefault(t, 3, ""),
                itemsku: r.Message.getFieldWithDefault(t, 4, ""),
                itemtitle: r.Message.getFieldWithDefault(t, 5, ""),
                itemiconuri: r.Message.getFieldWithDefault(t, 6, ""),
                description: r.Message.getFieldWithDefault(t, 7, ""),
                isforbidrefund: r.Message.getFieldWithDefault(t, 8, ""),
                refundstarttime: r.Message.getFieldWithDefault(t, 9, "0"),
                refundendtime: r.Message.getFieldWithDefault(t, 10, "0"),
                salerefundstarttime: r.Message.getFieldWithDefault(t, 11, "0"),
                salerefundendtime: r.Message.getFieldWithDefault(t, 12, "0"),
                validity: r.Message.getFieldWithDefault(t, 13, "0"),
                validstarttime: r.Message.getFieldWithDefault(t, 14, "0"),
                validendtime: r.Message.getFieldWithDefault(t, 15, "0"),
                status: r.Message.getFieldWithDefault(t, 16, 0),
                extra: r.Message.getFieldWithDefault(t, 17, ""),
                platformpricelistMap: (a = t.getPlatformpricelistMap()) ? a.toObject(e, proto.webcast.data.PriceInfo.toObject) : [],
                markinfo: (a = t.getMarkinfo()) && proto.webcast.data.MarkDetail.toObject(e, a),
                itemicon: (a = t.getItemicon()) && d.Image.toObject(e, a),
                itemsaletype: r.Message.getFieldWithDefault(t, 21, "0")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.ItemDetail.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ItemDetail;
            return proto.webcast.data.ItemDetail.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ItemDetail.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt32();
                    e.setOrdertype(a);
                    break;
                case 2:
                    a = t.readInt32();
                    e.setItemtype(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setItemid(a);
                    break;
                case 4:
                    a = t.readString();
                    e.setItemsku(a);
                    break;
                case 5:
                    a = t.readString();
                    e.setItemtitle(a);
                    break;
                case 6:
                    a = t.readString();
                    e.setItemiconuri(a);
                    break;
                case 7:
                    a = t.readString();
                    e.setDescription(a);
                    break;
                case 8:
                    a = t.readString();
                    e.setIsforbidrefund(a);
                    break;
                case 9:
                    a = t.readInt64String();
                    e.setRefundstarttime(a);
                    break;
                case 10:
                    a = t.readInt64String();
                    e.setRefundendtime(a);
                    break;
                case 11:
                    a = t.readInt64String();
                    e.setSalerefundstarttime(a);
                    break;
                case 12:
                    a = t.readInt64String();
                    e.setSalerefundendtime(a);
                    break;
                case 13:
                    a = t.readInt64String();
                    e.setValidity(a);
                    break;
                case 14:
                    a = t.readInt64String();
                    e.setValidstarttime(a);
                    break;
                case 15:
                    a = t.readInt64String();
                    e.setValidendtime(a);
                    break;
                case 16:
                    a = t.readInt32();
                    e.setStatus(a);
                    break;
                case 17:
                    a = t.readString();
                    e.setExtra(a);
                    break;
                case 18:
                    a = e.getPlatformpricelistMap();
                    t.readMessage(a, (function(e, t) {
                        r.Map.deserializeBinary(e, t, r.BinaryReader.prototype.readInt32, r.BinaryReader.prototype.readMessage, proto.webcast.data.PriceInfo.deserializeBinaryFromReader, 0, new proto.webcast.data.PriceInfo)
                    }
                    ));
                    break;
                case 19:
                    a = new proto.webcast.data.MarkDetail;
                    t.readMessage(a, proto.webcast.data.MarkDetail.deserializeBinaryFromReader),
                    e.setMarkinfo(a);
                    break;
                case 20:
                    a = new d.Image;
                    t.readMessage(a, d.Image.deserializeBinaryFromReader),
                    e.setItemicon(a);
                    break;
                case 21:
                    a = t.readInt64String();
                    e.setItemsaletype(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.ItemDetail.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ItemDetail.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ItemDetail.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getOrdertype()) && t.writeInt32(1, a),
            0 !== (a = e.getItemtype()) && t.writeInt32(2, a),
            (a = e.getItemid()).length > 0 && t.writeString(3, a),
            (a = e.getItemsku()).length > 0 && t.writeString(4, a),
            (a = e.getItemtitle()).length > 0 && t.writeString(5, a),
            (a = e.getItemiconuri()).length > 0 && t.writeString(6, a),
            (a = e.getDescription()).length > 0 && t.writeString(7, a),
            (a = e.getIsforbidrefund()).length > 0 && t.writeString(8, a),
            a = e.getRefundstarttime(),
            0 !== parseInt(a, 10) && t.writeInt64String(9, a),
            a = e.getRefundendtime(),
            0 !== parseInt(a, 10) && t.writeInt64String(10, a),
            a = e.getSalerefundstarttime(),
            0 !== parseInt(a, 10) && t.writeInt64String(11, a),
            a = e.getSalerefundendtime(),
            0 !== parseInt(a, 10) && t.writeInt64String(12, a),
            a = e.getValidity(),
            0 !== parseInt(a, 10) && t.writeInt64String(13, a),
            a = e.getValidstarttime(),
            0 !== parseInt(a, 10) && t.writeInt64String(14, a),
            a = e.getValidendtime(),
            0 !== parseInt(a, 10) && t.writeInt64String(15, a),
            0 !== (a = e.getStatus()) && t.writeInt32(16, a),
            (a = e.getExtra()).length > 0 && t.writeString(17, a),
            (a = e.getPlatformpricelistMap(!0)) && a.getLength() > 0 && a.serializeBinary(18, t, r.BinaryWriter.prototype.writeInt32, r.BinaryWriter.prototype.writeMessage, proto.webcast.data.PriceInfo.serializeBinaryToWriter),
            null != (a = e.getMarkinfo()) && t.writeMessage(19, a, proto.webcast.data.MarkDetail.serializeBinaryToWriter),
            null != (a = e.getItemicon()) && t.writeMessage(20, a, d.Image.serializeBinaryToWriter),
            a = e.getItemsaletype(),
            0 !== parseInt(a, 10) && t.writeInt64String(21, a)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getOrdertype = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setOrdertype = function(e) {
            return r.Message.setProto3IntField(this, 1, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getItemtype = function() {
            return r.Message.getFieldWithDefault(this, 2, 0)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setItemtype = function(e) {
            return r.Message.setProto3IntField(this, 2, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getItemid = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setItemid = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getItemsku = function() {
            return r.Message.getFieldWithDefault(this, 4, "")
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setItemsku = function(e) {
            return r.Message.setProto3StringField(this, 4, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getItemtitle = function() {
            return r.Message.getFieldWithDefault(this, 5, "")
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setItemtitle = function(e) {
            return r.Message.setProto3StringField(this, 5, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getItemiconuri = function() {
            return r.Message.getFieldWithDefault(this, 6, "")
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setItemiconuri = function(e) {
            return r.Message.setProto3StringField(this, 6, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getDescription = function() {
            return r.Message.getFieldWithDefault(this, 7, "")
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setDescription = function(e) {
            return r.Message.setProto3StringField(this, 7, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getIsforbidrefund = function() {
            return r.Message.getFieldWithDefault(this, 8, "")
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setIsforbidrefund = function(e) {
            return r.Message.setProto3StringField(this, 8, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getRefundstarttime = function() {
            return r.Message.getFieldWithDefault(this, 9, "0")
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setRefundstarttime = function(e) {
            return r.Message.setProto3StringIntField(this, 9, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getRefundendtime = function() {
            return r.Message.getFieldWithDefault(this, 10, "0")
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setRefundendtime = function(e) {
            return r.Message.setProto3StringIntField(this, 10, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getSalerefundstarttime = function() {
            return r.Message.getFieldWithDefault(this, 11, "0")
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setSalerefundstarttime = function(e) {
            return r.Message.setProto3StringIntField(this, 11, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getSalerefundendtime = function() {
            return r.Message.getFieldWithDefault(this, 12, "0")
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setSalerefundendtime = function(e) {
            return r.Message.setProto3StringIntField(this, 12, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getValidity = function() {
            return r.Message.getFieldWithDefault(this, 13, "0")
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setValidity = function(e) {
            return r.Message.setProto3StringIntField(this, 13, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getValidstarttime = function() {
            return r.Message.getFieldWithDefault(this, 14, "0")
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setValidstarttime = function(e) {
            return r.Message.setProto3StringIntField(this, 14, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getValidendtime = function() {
            return r.Message.getFieldWithDefault(this, 15, "0")
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setValidendtime = function(e) {
            return r.Message.setProto3StringIntField(this, 15, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getStatus = function() {
            return r.Message.getFieldWithDefault(this, 16, 0)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setStatus = function(e) {
            return r.Message.setProto3IntField(this, 16, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getExtra = function() {
            return r.Message.getFieldWithDefault(this, 17, "")
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setExtra = function(e) {
            return r.Message.setProto3StringField(this, 17, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getPlatformpricelistMap = function(e) {
            return r.Message.getMapField(this, 18, e, proto.webcast.data.PriceInfo)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.clearPlatformpricelistMap = function() {
            return this.getPlatformpricelistMap().clear(),
            this
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getMarkinfo = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.MarkDetail, 19)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setMarkinfo = function(e) {
            return r.Message.setWrapperField(this, 19, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.clearMarkinfo = function() {
            return this.setMarkinfo(void 0)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.hasMarkinfo = function() {
            return null != r.Message.getField(this, 19)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getItemicon = function() {
            return r.Message.getWrapperField(this, d.Image, 20)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setItemicon = function(e) {
            return r.Message.setWrapperField(this, 20, e)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.clearItemicon = function() {
            return this.setItemicon(void 0)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.hasItemicon = function() {
            return null != r.Message.getField(this, 20)
        }
        ,
        proto.webcast.data.ItemDetail.prototype.getItemsaletype = function() {
            return r.Message.getFieldWithDefault(this, 21, "0")
        }
        ,
        proto.webcast.data.ItemDetail.prototype.setItemsaletype = function(e) {
            return r.Message.setProto3StringIntField(this, 21, e)
        }
        ,
        proto.webcast.data.MarkDetail.repeatedFields_ = [1, 2],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.MarkDetail.prototype.toObject = function(e) {
            return proto.webcast.data.MarkDetail.toObject(e, this)
        }
        ,
        proto.webcast.data.MarkDetail.toObject = function(e, t) {
            var a, o = {
                itemMarkListV1List: null == (a = r.Message.getRepeatedField(t, 1)) ? void 0 : a,
                itemMarkListV2List: null == (a = r.Message.getRepeatedField(t, 2)) ? void 0 : a
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.MarkDetail.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.MarkDetail;
            return proto.webcast.data.MarkDetail.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.MarkDetail.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.addItemMarkListV1(a);
                    break;
                case 2:
                    a = t.readString();
                    e.addItemMarkListV2(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.MarkDetail.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.MarkDetail.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.MarkDetail.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getItemMarkListV1List()).length > 0 && t.writeRepeatedString(1, a),
            (a = e.getItemMarkListV2List()).length > 0 && t.writeRepeatedString(2, a)
        }
        ,
        proto.webcast.data.MarkDetail.prototype.getItemMarkListV1List = function() {
            return r.Message.getRepeatedField(this, 1)
        }
        ,
        proto.webcast.data.MarkDetail.prototype.setItemMarkListV1List = function(e) {
            return r.Message.setField(this, 1, e || [])
        }
        ,
        proto.webcast.data.MarkDetail.prototype.addItemMarkListV1 = function(e, t) {
            return r.Message.addToRepeatedField(this, 1, e, t)
        }
        ,
        proto.webcast.data.MarkDetail.prototype.clearItemMarkListV1List = function() {
            return this.setItemMarkListV1List([])
        }
        ,
        proto.webcast.data.MarkDetail.prototype.getItemMarkListV2List = function() {
            return r.Message.getRepeatedField(this, 2)
        }
        ,
        proto.webcast.data.MarkDetail.prototype.setItemMarkListV2List = function(e) {
            return r.Message.setField(this, 2, e || [])
        }
        ,
        proto.webcast.data.MarkDetail.prototype.addItemMarkListV2 = function(e, t) {
            return r.Message.addToRepeatedField(this, 2, e, t)
        }
        ,
        proto.webcast.data.MarkDetail.prototype.clearItemMarkListV2List = function() {
            return this.setItemMarkListV2List([])
        }
        ,
        o.object.extend(t, proto.webcast.data)
    }
    ,
    16975: (e,t,a)=>{
        var r = a(47865)
          , o = r
          , i = function() {
            return this ? this : "undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : Function("return this")()
        }
        .call(null);
        o.exportSymbol("proto.webcast.data.BizType", null, i),
        o.exportSymbol("proto.webcast.data.GameImage", null, i),
        o.exportSymbol("proto.webcast.data.GameUser", null, i),
        proto.webcast.data.GameUser = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.GameUser, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.GameUser.displayName = "proto.webcast.data.GameUser"),
        proto.webcast.data.GameImage = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.GameImage.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.GameImage, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.GameImage.displayName = "proto.webcast.data.GameImage"),
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.GameUser.prototype.toObject = function(e) {
            return proto.webcast.data.GameUser.toObject(e, this)
        }
        ,
        proto.webcast.data.GameUser.toObject = function(e, t) {
            var a, o = {
                userId: r.Message.getFieldWithDefault(t, 1, ""),
                openId: r.Message.getFieldWithDefault(t, 2, ""),
                nickname: r.Message.getFieldWithDefault(t, 3, ""),
                avatarThumb: (a = t.getAvatarThumb()) && proto.webcast.data.GameImage.toObject(e, a),
                secUserId: r.Message.getFieldWithDefault(t, 5, "")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.GameUser.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.GameUser;
            return proto.webcast.data.GameUser.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.GameUser.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setUserId(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setOpenId(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setNickname(a);
                    break;
                case 4:
                    a = new proto.webcast.data.GameImage;
                    t.readMessage(a, proto.webcast.data.GameImage.deserializeBinaryFromReader),
                    e.setAvatarThumb(a);
                    break;
                case 5:
                    a = t.readString();
                    e.setSecUserId(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.GameUser.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.GameUser.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.GameUser.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getUserId()).length > 0 && t.writeString(1, a),
            (a = e.getOpenId()).length > 0 && t.writeString(2, a),
            (a = e.getNickname()).length > 0 && t.writeString(3, a),
            null != (a = e.getAvatarThumb()) && t.writeMessage(4, a, proto.webcast.data.GameImage.serializeBinaryToWriter),
            (a = e.getSecUserId()).length > 0 && t.writeString(5, a)
        }
        ,
        proto.webcast.data.GameUser.prototype.getUserId = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.GameUser.prototype.setUserId = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.GameUser.prototype.getOpenId = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.GameUser.prototype.setOpenId = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.GameUser.prototype.getNickname = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.GameUser.prototype.setNickname = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.GameUser.prototype.getAvatarThumb = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.GameImage, 4)
        }
        ,
        proto.webcast.data.GameUser.prototype.setAvatarThumb = function(e) {
            return r.Message.setWrapperField(this, 4, e)
        }
        ,
        proto.webcast.data.GameUser.prototype.clearAvatarThumb = function() {
            return this.setAvatarThumb(void 0)
        }
        ,
        proto.webcast.data.GameUser.prototype.hasAvatarThumb = function() {
            return null != r.Message.getField(this, 4)
        }
        ,
        proto.webcast.data.GameUser.prototype.getSecUserId = function() {
            return r.Message.getFieldWithDefault(this, 5, "")
        }
        ,
        proto.webcast.data.GameUser.prototype.setSecUserId = function(e) {
            return r.Message.setProto3StringField(this, 5, e)
        }
        ,
        proto.webcast.data.GameImage.repeatedFields_ = [1],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.GameImage.prototype.toObject = function(e) {
            return proto.webcast.data.GameImage.toObject(e, this)
        }
        ,
        proto.webcast.data.GameImage.toObject = function(e, t) {
            var a, o = {
                urlListList: null == (a = r.Message.getRepeatedField(t, 1)) ? void 0 : a,
                uri: r.Message.getFieldWithDefault(t, 2, ""),
                height: r.Message.getFieldWithDefault(t, 3, "0"),
                width: r.Message.getFieldWithDefault(t, 4, "0")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.GameImage.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.GameImage;
            return proto.webcast.data.GameImage.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.GameImage.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.addUrlList(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setUri(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setHeight(a);
                    break;
                case 4:
                    a = t.readInt64String();
                    e.setWidth(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.GameImage.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.GameImage.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.GameImage.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getUrlListList()).length > 0 && t.writeRepeatedString(1, a),
            (a = e.getUri()).length > 0 && t.writeString(2, a),
            a = e.getHeight(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a),
            a = e.getWidth(),
            0 !== parseInt(a, 10) && t.writeInt64String(4, a)
        }
        ,
        proto.webcast.data.GameImage.prototype.getUrlListList = function() {
            return r.Message.getRepeatedField(this, 1)
        }
        ,
        proto.webcast.data.GameImage.prototype.setUrlListList = function(e) {
            return r.Message.setField(this, 1, e || [])
        }
        ,
        proto.webcast.data.GameImage.prototype.addUrlList = function(e, t) {
            return r.Message.addToRepeatedField(this, 1, e, t)
        }
        ,
        proto.webcast.data.GameImage.prototype.clearUrlListList = function() {
            return this.setUrlListList([])
        }
        ,
        proto.webcast.data.GameImage.prototype.getUri = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.GameImage.prototype.setUri = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.GameImage.prototype.getHeight = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.GameImage.prototype.setHeight = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        proto.webcast.data.GameImage.prototype.getWidth = function() {
            return r.Message.getFieldWithDefault(this, 4, "0")
        }
        ,
        proto.webcast.data.GameImage.prototype.setWidth = function(e) {
            return r.Message.setProto3StringIntField(this, 4, e)
        }
        ,
        proto.webcast.data.BizType = {
            GAMECP: 0,
            STAR: 1
        },
        o.object.extend(t, proto.webcast.data)
    }
    ,
    58753: (e,t,a)=>{
        var r = a(47865)
          , o = function() {
            return this ? this : "undefined" != typeof window ? window : void 0 !== o ? o : "undefined" != typeof self ? self : Function("return this")()
        }
        .call(null);
        r.exportSymbol("proto.webcast.data.GameStageType", null, o),
        proto.webcast.data.GameStageType = {
            GAMENONE: 0,
            GAMERESERVATION: 10,
            GAMETEST: 20,
            GAMEDOWNLOAD: 30
        },
        r.object.extend(t, proto.webcast.data)
    }
    ,
    24620: (e,t,a)=>{
        var r = a(47865)
          , o = r
          , i = function() {
            return this ? this : "undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : Function("return this")()
        }
        .call(null)
          , s = a(14307);
        o.object.extend(proto, s);
        var n = a(20135);
        o.object.extend(proto, n);
        var d = a(23491);
        o.object.extend(proto, d),
        o.exportSymbol("proto.webcast.data.AnchorVote", null, i),
        o.exportSymbol("proto.webcast.data.AnchorVoteCandidate", null, i),
        o.exportSymbol("proto.webcast.data.AnchorVoteStatus", null, i),
        o.exportSymbol("proto.webcast.data.GoldDivide", null, i),
        o.exportSymbol("proto.webcast.data.GoldDivideCard", null, i),
        o.exportSymbol("proto.webcast.data.GoldDivideCard.Button", null, i),
        o.exportSymbol("proto.webcast.data.GoldDivideCard.Status", null, i),
        o.exportSymbol("proto.webcast.data.ItemTemplate", null, i),
        o.exportSymbol("proto.webcast.data.TaskCenterData", null, i),
        o.exportSymbol("proto.webcast.data.TaskCenterItem", null, i),
        o.exportSymbol("proto.webcast.data.TaskCenterItemType", null, i),
        o.exportSymbol("proto.webcast.data.TeamGoldDivide", null, i),
        o.exportSymbol("proto.webcast.data.TeamGoldDivide.Status", null, i),
        o.exportSymbol("proto.webcast.data.TeamGoldDivideActivityData", null, i),
        o.exportSymbol("proto.webcast.data.TeamGoldDivideActivityData.RankReward", null, i),
        o.exportSymbol("proto.webcast.data.TeamGoldDivideActivityData.RewardInfo", null, i),
        o.exportSymbol("proto.webcast.data.TeamGoldDivideActivityData.Task", null, i),
        o.exportSymbol("proto.webcast.data.TeamGoldDivideButton", null, i),
        o.exportSymbol("proto.webcast.data.TeamGoldDivideButton.ButtonAction", null, i),
        o.exportSymbol("proto.webcast.data.TeamGoldDivideInitData", null, i),
        o.exportSymbol("proto.webcast.data.TeamGoldDividePublicData", null, i),
        o.exportSymbol("proto.webcast.data.TeamGoldDividePublicData.Reward", null, i),
        o.exportSymbol("proto.webcast.data.TeamGoldDivideRankInfo", null, i),
        o.exportSymbol("proto.webcast.data.TeamGoldDivideTeam", null, i),
        o.exportSymbol("proto.webcast.data.TeamGoldDivideTeam.Info", null, i),
        o.exportSymbol("proto.webcast.data.TeamGoldDivideTeam.Member", null, i),
        o.exportSymbol("proto.webcast.data.TeamGoldDivideTeam.MemberIdentity", null, i),
        proto.webcast.data.GoldDivideCard = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.GoldDivideCard.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.GoldDivideCard, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.GoldDivideCard.displayName = "proto.webcast.data.GoldDivideCard"),
        proto.webcast.data.GoldDivideCard.Button = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.GoldDivideCard.Button, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.GoldDivideCard.Button.displayName = "proto.webcast.data.GoldDivideCard.Button"),
        proto.webcast.data.GoldDivide = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.GoldDivide.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.GoldDivide, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.GoldDivide.displayName = "proto.webcast.data.GoldDivide"),
        proto.webcast.data.TeamGoldDivideButton = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.TeamGoldDivideButton, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TeamGoldDivideButton.displayName = "proto.webcast.data.TeamGoldDivideButton"),
        proto.webcast.data.TeamGoldDivideTeam = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.TeamGoldDivideTeam.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.TeamGoldDivideTeam, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TeamGoldDivideTeam.displayName = "proto.webcast.data.TeamGoldDivideTeam"),
        proto.webcast.data.TeamGoldDivideTeam.Member = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.TeamGoldDivideTeam.Member, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TeamGoldDivideTeam.Member.displayName = "proto.webcast.data.TeamGoldDivideTeam.Member"),
        proto.webcast.data.TeamGoldDivideTeam.Info = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.TeamGoldDivideTeam.Info, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TeamGoldDivideTeam.Info.displayName = "proto.webcast.data.TeamGoldDivideTeam.Info"),
        proto.webcast.data.TeamGoldDivideRankInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.TeamGoldDivideRankInfo.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.TeamGoldDivideRankInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TeamGoldDivideRankInfo.displayName = "proto.webcast.data.TeamGoldDivideRankInfo"),
        proto.webcast.data.TeamGoldDivideInitData = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.TeamGoldDivideInitData, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TeamGoldDivideInitData.displayName = "proto.webcast.data.TeamGoldDivideInitData"),
        proto.webcast.data.TeamGoldDivideActivityData = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.TeamGoldDivideActivityData.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.TeamGoldDivideActivityData, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TeamGoldDivideActivityData.displayName = "proto.webcast.data.TeamGoldDivideActivityData"),
        proto.webcast.data.TeamGoldDivideActivityData.RankReward = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.TeamGoldDivideActivityData.RankReward, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TeamGoldDivideActivityData.RankReward.displayName = "proto.webcast.data.TeamGoldDivideActivityData.RankReward"),
        proto.webcast.data.TeamGoldDivideActivityData.RewardInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.TeamGoldDivideActivityData.RewardInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.displayName = "proto.webcast.data.TeamGoldDivideActivityData.RewardInfo"),
        proto.webcast.data.TeamGoldDivideActivityData.Task = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.TeamGoldDivideActivityData.Task, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TeamGoldDivideActivityData.Task.displayName = "proto.webcast.data.TeamGoldDivideActivityData.Task"),
        proto.webcast.data.TeamGoldDividePublicData = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.TeamGoldDividePublicData.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.TeamGoldDividePublicData, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TeamGoldDividePublicData.displayName = "proto.webcast.data.TeamGoldDividePublicData"),
        proto.webcast.data.TeamGoldDividePublicData.Reward = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.TeamGoldDividePublicData.Reward, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TeamGoldDividePublicData.Reward.displayName = "proto.webcast.data.TeamGoldDividePublicData.Reward"),
        proto.webcast.data.TeamGoldDivide = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.TeamGoldDivide, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TeamGoldDivide.displayName = "proto.webcast.data.TeamGoldDivide"),
        proto.webcast.data.AnchorVoteCandidate = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.AnchorVoteCandidate, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.AnchorVoteCandidate.displayName = "proto.webcast.data.AnchorVoteCandidate"),
        proto.webcast.data.AnchorVote = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.AnchorVote.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.AnchorVote, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.AnchorVote.displayName = "proto.webcast.data.AnchorVote"),
        proto.webcast.data.TaskCenterData = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.TaskCenterData.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.TaskCenterData, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TaskCenterData.displayName = "proto.webcast.data.TaskCenterData"),
        proto.webcast.data.TaskCenterItem = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.TaskCenterItem, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TaskCenterItem.displayName = "proto.webcast.data.TaskCenterItem"),
        proto.webcast.data.GoldDivideCard.repeatedFields_ = [9],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.GoldDivideCard.prototype.toObject = function(e) {
            return proto.webcast.data.GoldDivideCard.toObject(e, this)
        }
        ,
        proto.webcast.data.GoldDivideCard.toObject = function(e, t) {
            var a, o = {
                term: r.Message.getFieldWithDefault(t, 1, "0"),
                signUpUserCount: r.Message.getFieldWithDefault(t, 2, "0"),
                completedUserCount: r.Message.getFieldWithDefault(t, 3, "0"),
                receivedUserCount: r.Message.getFieldWithDefault(t, 4, "0"),
                prizePoolAmount: r.Message.getFieldWithDefault(t, 5, "0"),
                signUpAmount: r.Message.getFieldWithDefault(t, 6, "0"),
                task: (a = t.getTask()) && n.GrowthTask.toObject(e, a),
                status: r.Message.getFieldWithDefault(t, 8, 0),
                bottomButtonsList: r.Message.toObjectList(t.getBottomButtonsList(), proto.webcast.data.GoldDivideCard.Button.toObject, e)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.GoldDivideCard.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.GoldDivideCard;
            return proto.webcast.data.GoldDivideCard.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.GoldDivideCard.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setTerm(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setSignUpUserCount(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setCompletedUserCount(a);
                    break;
                case 4:
                    a = t.readInt64String();
                    e.setReceivedUserCount(a);
                    break;
                case 5:
                    a = t.readInt64String();
                    e.setPrizePoolAmount(a);
                    break;
                case 6:
                    a = t.readInt64String();
                    e.setSignUpAmount(a);
                    break;
                case 7:
                    a = new n.GrowthTask;
                    t.readMessage(a, n.GrowthTask.deserializeBinaryFromReader),
                    e.setTask(a);
                    break;
                case 8:
                    a = t.readEnum();
                    e.setStatus(a);
                    break;
                case 9:
                    a = new proto.webcast.data.GoldDivideCard.Button;
                    t.readMessage(a, proto.webcast.data.GoldDivideCard.Button.deserializeBinaryFromReader),
                    e.addBottomButtons(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.GoldDivideCard.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.GoldDivideCard.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getTerm(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            a = e.getSignUpUserCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a),
            a = e.getCompletedUserCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a),
            a = e.getReceivedUserCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(4, a),
            a = e.getPrizePoolAmount(),
            0 !== parseInt(a, 10) && t.writeInt64String(5, a),
            a = e.getSignUpAmount(),
            0 !== parseInt(a, 10) && t.writeInt64String(6, a),
            null != (a = e.getTask()) && t.writeMessage(7, a, n.GrowthTask.serializeBinaryToWriter),
            0 !== (a = e.getStatus()) && t.writeEnum(8, a),
            (a = e.getBottomButtonsList()).length > 0 && t.writeRepeatedMessage(9, a, proto.webcast.data.GoldDivideCard.Button.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.GoldDivideCard.Status = {
            STATUSINIT: 0,
            STATUSPAID: 1,
            STATUSONGOING: 2,
            STATUSFINISHED: 3,
            STATUSEXPIRED: 4,
            STATUSREWARDED: 5
        },
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.GoldDivideCard.Button.prototype.toObject = function(e) {
            return proto.webcast.data.GoldDivideCard.Button.toObject(e, this)
        }
        ,
        proto.webcast.data.GoldDivideCard.Button.toObject = function(e, t) {
            var a = {
                mainText: r.Message.getFieldWithDefault(t, 1, ""),
                dateText: r.Message.getFieldWithDefault(t, 2, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.GoldDivideCard.Button.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.GoldDivideCard.Button;
            return proto.webcast.data.GoldDivideCard.Button.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.GoldDivideCard.Button.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setMainText(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setDateText(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.GoldDivideCard.Button.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.GoldDivideCard.Button.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.GoldDivideCard.Button.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getMainText()).length > 0 && t.writeString(1, a),
            (a = e.getDateText()).length > 0 && t.writeString(2, a)
        }
        ,
        proto.webcast.data.GoldDivideCard.Button.prototype.getMainText = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.GoldDivideCard.Button.prototype.setMainText = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.GoldDivideCard.Button.prototype.getDateText = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.GoldDivideCard.Button.prototype.setDateText = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.getTerm = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.setTerm = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.getSignUpUserCount = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.setSignUpUserCount = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.getCompletedUserCount = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.setCompletedUserCount = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.getReceivedUserCount = function() {
            return r.Message.getFieldWithDefault(this, 4, "0")
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.setReceivedUserCount = function(e) {
            return r.Message.setProto3StringIntField(this, 4, e)
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.getPrizePoolAmount = function() {
            return r.Message.getFieldWithDefault(this, 5, "0")
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.setPrizePoolAmount = function(e) {
            return r.Message.setProto3StringIntField(this, 5, e)
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.getSignUpAmount = function() {
            return r.Message.getFieldWithDefault(this, 6, "0")
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.setSignUpAmount = function(e) {
            return r.Message.setProto3StringIntField(this, 6, e)
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.getTask = function() {
            return r.Message.getWrapperField(this, n.GrowthTask, 7)
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.setTask = function(e) {
            return r.Message.setWrapperField(this, 7, e)
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.clearTask = function() {
            return this.setTask(void 0)
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.hasTask = function() {
            return null != r.Message.getField(this, 7)
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.getStatus = function() {
            return r.Message.getFieldWithDefault(this, 8, 0)
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.setStatus = function(e) {
            return r.Message.setProto3EnumField(this, 8, e)
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.getBottomButtonsList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.GoldDivideCard.Button, 9)
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.setBottomButtonsList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 9, e)
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.addBottomButtons = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 9, e, proto.webcast.data.GoldDivideCard.Button, t)
        }
        ,
        proto.webcast.data.GoldDivideCard.prototype.clearBottomButtonsList = function() {
            return this.setBottomButtonsList([])
        }
        ,
        proto.webcast.data.GoldDivide.repeatedFields_ = [3],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.GoldDivide.prototype.toObject = function(e) {
            return proto.webcast.data.GoldDivide.toObject(e, this)
        }
        ,
        proto.webcast.data.GoldDivide.toObject = function(e, t) {
            var a = {
                title: r.Message.getFieldWithDefault(t, 1, ""),
                desc: r.Message.getFieldWithDefault(t, 2, ""),
                cardsList: r.Message.toObjectList(t.getCardsList(), proto.webcast.data.GoldDivideCard.toObject, e),
                goldBalance: r.Message.getFieldWithDefault(t, 4, "0"),
                extra: r.Message.getFieldWithDefault(t, 5, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.GoldDivide.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.GoldDivide;
            return proto.webcast.data.GoldDivide.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.GoldDivide.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setTitle(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setDesc(a);
                    break;
                case 3:
                    a = new proto.webcast.data.GoldDivideCard;
                    t.readMessage(a, proto.webcast.data.GoldDivideCard.deserializeBinaryFromReader),
                    e.addCards(a);
                    break;
                case 4:
                    a = t.readInt64String();
                    e.setGoldBalance(a);
                    break;
                case 5:
                    a = t.readString();
                    e.setExtra(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.GoldDivide.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.GoldDivide.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.GoldDivide.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getTitle()).length > 0 && t.writeString(1, a),
            (a = e.getDesc()).length > 0 && t.writeString(2, a),
            (a = e.getCardsList()).length > 0 && t.writeRepeatedMessage(3, a, proto.webcast.data.GoldDivideCard.serializeBinaryToWriter),
            a = e.getGoldBalance(),
            0 !== parseInt(a, 10) && t.writeInt64String(4, a),
            (a = e.getExtra()).length > 0 && t.writeString(5, a)
        }
        ,
        proto.webcast.data.GoldDivide.prototype.getTitle = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.GoldDivide.prototype.setTitle = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.GoldDivide.prototype.getDesc = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.GoldDivide.prototype.setDesc = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.GoldDivide.prototype.getCardsList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.GoldDivideCard, 3)
        }
        ,
        proto.webcast.data.GoldDivide.prototype.setCardsList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.GoldDivide.prototype.addCards = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 3, e, proto.webcast.data.GoldDivideCard, t)
        }
        ,
        proto.webcast.data.GoldDivide.prototype.clearCardsList = function() {
            return this.setCardsList([])
        }
        ,
        proto.webcast.data.GoldDivide.prototype.getGoldBalance = function() {
            return r.Message.getFieldWithDefault(this, 4, "0")
        }
        ,
        proto.webcast.data.GoldDivide.prototype.setGoldBalance = function(e) {
            return r.Message.setProto3StringIntField(this, 4, e)
        }
        ,
        proto.webcast.data.GoldDivide.prototype.getExtra = function() {
            return r.Message.getFieldWithDefault(this, 5, "")
        }
        ,
        proto.webcast.data.GoldDivide.prototype.setExtra = function(e) {
            return r.Message.setProto3StringField(this, 5, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TeamGoldDivideButton.prototype.toObject = function(e) {
            return proto.webcast.data.TeamGoldDivideButton.toObject(e, this)
        }
        ,
        proto.webcast.data.TeamGoldDivideButton.toObject = function(e, t) {
            var a = {
                text: r.Message.getFieldWithDefault(t, 1, ""),
                action: r.Message.getFieldWithDefault(t, 2, 0),
                extra: r.Message.getFieldWithDefault(t, 3, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.TeamGoldDivideButton.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TeamGoldDivideButton;
            return proto.webcast.data.TeamGoldDivideButton.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TeamGoldDivideButton.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setText(a);
                    break;
                case 2:
                    a = t.readEnum();
                    e.setAction(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setExtra(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TeamGoldDivideButton.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TeamGoldDivideButton.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TeamGoldDivideButton.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getText()).length > 0 && t.writeString(1, a),
            0 !== (a = e.getAction()) && t.writeEnum(2, a),
            (a = e.getExtra()).length > 0 && t.writeString(3, a)
        }
        ,
        proto.webcast.data.TeamGoldDivideButton.ButtonAction = {
            DEFAULT: 0,
            INVITETEAMUP: 1,
            SENDGIFT: 2,
            SHARHELP: 3,
            SWITCHTAB: 4,
            RECEIVEREWARD: 5
        },
        proto.webcast.data.TeamGoldDivideButton.prototype.getText = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideButton.prototype.setText = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideButton.prototype.getAction = function() {
            return r.Message.getFieldWithDefault(this, 2, 0)
        }
        ,
        proto.webcast.data.TeamGoldDivideButton.prototype.setAction = function(e) {
            return r.Message.setProto3EnumField(this, 2, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideButton.prototype.getExtra = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideButton.prototype.setExtra = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.repeatedFields_ = [3],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TeamGoldDivideTeam.prototype.toObject = function(e) {
            return proto.webcast.data.TeamGoldDivideTeam.toObject(e, this)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.toObject = function(e, t) {
            var a, o = {
                info: (a = t.getInfo()) && proto.webcast.data.TeamGoldDivideTeam.Info.toObject(e, a),
                selfInfo: (a = t.getSelfInfo()) && proto.webcast.data.TeamGoldDivideTeam.Member.toObject(e, a),
                membersList: r.Message.toObjectList(t.getMembersList(), proto.webcast.data.TeamGoldDivideTeam.Member.toObject, e)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.TeamGoldDivideTeam.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TeamGoldDivideTeam;
            return proto.webcast.data.TeamGoldDivideTeam.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new proto.webcast.data.TeamGoldDivideTeam.Info;
                    t.readMessage(a, proto.webcast.data.TeamGoldDivideTeam.Info.deserializeBinaryFromReader),
                    e.setInfo(a);
                    break;
                case 2:
                    a = new proto.webcast.data.TeamGoldDivideTeam.Member;
                    t.readMessage(a, proto.webcast.data.TeamGoldDivideTeam.Member.deserializeBinaryFromReader),
                    e.setSelfInfo(a);
                    break;
                case 3:
                    a = new proto.webcast.data.TeamGoldDivideTeam.Member;
                    t.readMessage(a, proto.webcast.data.TeamGoldDivideTeam.Member.deserializeBinaryFromReader),
                    e.addMembers(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TeamGoldDivideTeam.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            null != (a = e.getInfo()) && t.writeMessage(1, a, proto.webcast.data.TeamGoldDivideTeam.Info.serializeBinaryToWriter),
            null != (a = e.getSelfInfo()) && t.writeMessage(2, a, proto.webcast.data.TeamGoldDivideTeam.Member.serializeBinaryToWriter),
            (a = e.getMembersList()).length > 0 && t.writeRepeatedMessage(3, a, proto.webcast.data.TeamGoldDivideTeam.Member.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.MemberIdentity = {
            UNKONWN: 0,
            CAPTAIN: 1,
            TEAMMATE: 2
        },
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TeamGoldDivideTeam.Member.prototype.toObject = function(e) {
            return proto.webcast.data.TeamGoldDivideTeam.Member.toObject(e, this)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Member.toObject = function(e, t) {
            var a = {
                identity: r.Message.getFieldWithDefault(t, 1, 0),
                avatarUrl: r.Message.getFieldWithDefault(t, 2, ""),
                nickname: r.Message.getFieldWithDefault(t, 3, ""),
                tag: r.Message.getFieldWithDefault(t, 4, ""),
                score: r.Message.getFieldWithDefault(t, 5, "0"),
                rewardAmount: r.Message.getFieldWithDefault(t, 6, "0"),
                rewardDesc: r.Message.getFieldWithDefault(t, 7, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.TeamGoldDivideTeam.Member.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TeamGoldDivideTeam.Member;
            return proto.webcast.data.TeamGoldDivideTeam.Member.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Member.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readEnum();
                    e.setIdentity(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setAvatarUrl(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setNickname(a);
                    break;
                case 4:
                    a = t.readString();
                    e.setTag(a);
                    break;
                case 5:
                    a = t.readInt64String();
                    e.setScore(a);
                    break;
                case 6:
                    a = t.readInt64String();
                    e.setRewardAmount(a);
                    break;
                case 7:
                    a = t.readString();
                    e.setRewardDesc(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Member.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TeamGoldDivideTeam.Member.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Member.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getIdentity()) && t.writeEnum(1, a),
            (a = e.getAvatarUrl()).length > 0 && t.writeString(2, a),
            (a = e.getNickname()).length > 0 && t.writeString(3, a),
            (a = e.getTag()).length > 0 && t.writeString(4, a),
            a = e.getScore(),
            0 !== parseInt(a, 10) && t.writeInt64String(5, a),
            a = e.getRewardAmount(),
            0 !== parseInt(a, 10) && t.writeInt64String(6, a),
            (a = e.getRewardDesc()).length > 0 && t.writeString(7, a)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Member.prototype.getIdentity = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Member.prototype.setIdentity = function(e) {
            return r.Message.setProto3EnumField(this, 1, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Member.prototype.getAvatarUrl = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Member.prototype.setAvatarUrl = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Member.prototype.getNickname = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Member.prototype.setNickname = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Member.prototype.getTag = function() {
            return r.Message.getFieldWithDefault(this, 4, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Member.prototype.setTag = function(e) {
            return r.Message.setProto3StringField(this, 4, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Member.prototype.getScore = function() {
            return r.Message.getFieldWithDefault(this, 5, "0")
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Member.prototype.setScore = function(e) {
            return r.Message.setProto3StringIntField(this, 5, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Member.prototype.getRewardAmount = function() {
            return r.Message.getFieldWithDefault(this, 6, "0")
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Member.prototype.setRewardAmount = function(e) {
            return r.Message.setProto3StringIntField(this, 6, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Member.prototype.getRewardDesc = function() {
            return r.Message.getFieldWithDefault(this, 7, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Member.prototype.setRewardDesc = function(e) {
            return r.Message.setProto3StringField(this, 7, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TeamGoldDivideTeam.Info.prototype.toObject = function(e) {
            return proto.webcast.data.TeamGoldDivideTeam.Info.toObject(e, this)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.toObject = function(e, t) {
            var a = {
                id: r.Message.getFieldWithDefault(t, 1, ""),
                captainUserId: r.Message.getFieldWithDefault(t, 2, "0"),
                termId: r.Message.getFieldWithDefault(t, 3, "0"),
                name: r.Message.getFieldWithDefault(t, 4, ""),
                avatarUrl: r.Message.getFieldWithDefault(t, 5, ""),
                size: r.Message.getFieldWithDefault(t, 6, "0"),
                capacity: r.Message.getFieldWithDefault(t, 7, "0"),
                score: r.Message.getFieldWithDefault(t, 8, "0"),
                rank: r.Message.getFieldWithDefault(t, 9, "0"),
                rewardAmount: r.Message.getFieldWithDefault(t, 10, "0"),
                rewardDesc: r.Message.getFieldWithDefault(t, 11, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.TeamGoldDivideTeam.Info.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TeamGoldDivideTeam.Info;
            return proto.webcast.data.TeamGoldDivideTeam.Info.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setId(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setCaptainUserId(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setTermId(a);
                    break;
                case 4:
                    a = t.readString();
                    e.setName(a);
                    break;
                case 5:
                    a = t.readString();
                    e.setAvatarUrl(a);
                    break;
                case 6:
                    a = t.readInt64String();
                    e.setSize(a);
                    break;
                case 7:
                    a = t.readInt64String();
                    e.setCapacity(a);
                    break;
                case 8:
                    a = t.readInt64String();
                    e.setScore(a);
                    break;
                case 9:
                    a = t.readInt64String();
                    e.setRank(a);
                    break;
                case 10:
                    a = t.readInt64String();
                    e.setRewardAmount(a);
                    break;
                case 11:
                    a = t.readString();
                    e.setRewardDesc(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TeamGoldDivideTeam.Info.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getId()).length > 0 && t.writeString(1, a),
            a = e.getCaptainUserId(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a),
            a = e.getTermId(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a),
            (a = e.getName()).length > 0 && t.writeString(4, a),
            (a = e.getAvatarUrl()).length > 0 && t.writeString(5, a),
            a = e.getSize(),
            0 !== parseInt(a, 10) && t.writeInt64String(6, a),
            a = e.getCapacity(),
            0 !== parseInt(a, 10) && t.writeInt64String(7, a),
            a = e.getScore(),
            0 !== parseInt(a, 10) && t.writeInt64String(8, a),
            a = e.getRank(),
            0 !== parseInt(a, 10) && t.writeInt64String(9, a),
            a = e.getRewardAmount(),
            0 !== parseInt(a, 10) && t.writeInt64String(10, a),
            (a = e.getRewardDesc()).length > 0 && t.writeString(11, a)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.getId = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.setId = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.getCaptainUserId = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.setCaptainUserId = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.getTermId = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.setTermId = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.getName = function() {
            return r.Message.getFieldWithDefault(this, 4, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.setName = function(e) {
            return r.Message.setProto3StringField(this, 4, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.getAvatarUrl = function() {
            return r.Message.getFieldWithDefault(this, 5, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.setAvatarUrl = function(e) {
            return r.Message.setProto3StringField(this, 5, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.getSize = function() {
            return r.Message.getFieldWithDefault(this, 6, "0")
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.setSize = function(e) {
            return r.Message.setProto3StringIntField(this, 6, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.getCapacity = function() {
            return r.Message.getFieldWithDefault(this, 7, "0")
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.setCapacity = function(e) {
            return r.Message.setProto3StringIntField(this, 7, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.getScore = function() {
            return r.Message.getFieldWithDefault(this, 8, "0")
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.setScore = function(e) {
            return r.Message.setProto3StringIntField(this, 8, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.getRank = function() {
            return r.Message.getFieldWithDefault(this, 9, "0")
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.setRank = function(e) {
            return r.Message.setProto3StringIntField(this, 9, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.getRewardAmount = function() {
            return r.Message.getFieldWithDefault(this, 10, "0")
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.setRewardAmount = function(e) {
            return r.Message.setProto3StringIntField(this, 10, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.getRewardDesc = function() {
            return r.Message.getFieldWithDefault(this, 11, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.Info.prototype.setRewardDesc = function(e) {
            return r.Message.setProto3StringField(this, 11, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.prototype.getInfo = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TeamGoldDivideTeam.Info, 1)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.prototype.setInfo = function(e) {
            return r.Message.setWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.prototype.clearInfo = function() {
            return this.setInfo(void 0)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.prototype.hasInfo = function() {
            return null != r.Message.getField(this, 1)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.prototype.getSelfInfo = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TeamGoldDivideTeam.Member, 2)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.prototype.setSelfInfo = function(e) {
            return r.Message.setWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.prototype.clearSelfInfo = function() {
            return this.setSelfInfo(void 0)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.prototype.hasSelfInfo = function() {
            return null != r.Message.getField(this, 2)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.prototype.getMembersList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.TeamGoldDivideTeam.Member, 3)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.prototype.setMembersList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.prototype.addMembers = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 3, e, proto.webcast.data.TeamGoldDivideTeam.Member, t)
        }
        ,
        proto.webcast.data.TeamGoldDivideTeam.prototype.clearMembersList = function() {
            return this.setMembersList([])
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.repeatedFields_ = [4],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TeamGoldDivideRankInfo.prototype.toObject = function(e) {
            return proto.webcast.data.TeamGoldDivideRankInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.toObject = function(e, t) {
            var a, o = {
                title: r.Message.getFieldWithDefault(t, 1, ""),
                desc: r.Message.getFieldWithDefault(t, 2, ""),
                selfInfo: (a = t.getSelfInfo()) && proto.webcast.data.TeamGoldDivideTeam.toObject(e, a),
                itemsList: r.Message.toObjectList(t.getItemsList(), proto.webcast.data.TeamGoldDivideTeam.toObject, e),
                hasMore: r.Message.getBooleanFieldWithDefault(t, 5, !1)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.TeamGoldDivideRankInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TeamGoldDivideRankInfo;
            return proto.webcast.data.TeamGoldDivideRankInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setTitle(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setDesc(a);
                    break;
                case 3:
                    a = new proto.webcast.data.TeamGoldDivideTeam;
                    t.readMessage(a, proto.webcast.data.TeamGoldDivideTeam.deserializeBinaryFromReader),
                    e.setSelfInfo(a);
                    break;
                case 4:
                    a = new proto.webcast.data.TeamGoldDivideTeam;
                    t.readMessage(a, proto.webcast.data.TeamGoldDivideTeam.deserializeBinaryFromReader),
                    e.addItems(a);
                    break;
                case 5:
                    a = t.readBool();
                    e.setHasMore(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TeamGoldDivideRankInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getTitle()).length > 0 && t.writeString(1, a),
            (a = e.getDesc()).length > 0 && t.writeString(2, a),
            null != (a = e.getSelfInfo()) && t.writeMessage(3, a, proto.webcast.data.TeamGoldDivideTeam.serializeBinaryToWriter),
            (a = e.getItemsList()).length > 0 && t.writeRepeatedMessage(4, a, proto.webcast.data.TeamGoldDivideTeam.serializeBinaryToWriter),
            (a = e.getHasMore()) && t.writeBool(5, a)
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.prototype.getTitle = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.prototype.setTitle = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.prototype.getDesc = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.prototype.setDesc = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.prototype.getSelfInfo = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TeamGoldDivideTeam, 3)
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.prototype.setSelfInfo = function(e) {
            return r.Message.setWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.prototype.clearSelfInfo = function() {
            return this.setSelfInfo(void 0)
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.prototype.hasSelfInfo = function() {
            return null != r.Message.getField(this, 3)
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.prototype.getItemsList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.TeamGoldDivideTeam, 4)
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.prototype.setItemsList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 4, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.prototype.addItems = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 4, e, proto.webcast.data.TeamGoldDivideTeam, t)
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.prototype.clearItemsList = function() {
            return this.setItemsList([])
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.prototype.getHasMore = function() {
            return r.Message.getBooleanFieldWithDefault(this, 5, !1)
        }
        ,
        proto.webcast.data.TeamGoldDivideRankInfo.prototype.setHasMore = function(e) {
            return r.Message.setProto3BooleanField(this, 5, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TeamGoldDivideInitData.prototype.toObject = function(e) {
            return proto.webcast.data.TeamGoldDivideInitData.toObject(e, this)
        }
        ,
        proto.webcast.data.TeamGoldDivideInitData.toObject = function(e, t) {
            var a, o = {
                title: r.Message.getFieldWithDefault(t, 1, ""),
                desc: r.Message.getFieldWithDefault(t, 2, ""),
                team: (a = t.getTeam()) && proto.webcast.data.TeamGoldDivideTeam.toObject(e, a),
                button: (a = t.getButton()) && proto.webcast.data.TeamGoldDivideButton.toObject(e, a)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.TeamGoldDivideInitData.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TeamGoldDivideInitData;
            return proto.webcast.data.TeamGoldDivideInitData.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TeamGoldDivideInitData.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setTitle(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setDesc(a);
                    break;
                case 3:
                    a = new proto.webcast.data.TeamGoldDivideTeam;
                    t.readMessage(a, proto.webcast.data.TeamGoldDivideTeam.deserializeBinaryFromReader),
                    e.setTeam(a);
                    break;
                case 4:
                    a = new proto.webcast.data.TeamGoldDivideButton;
                    t.readMessage(a, proto.webcast.data.TeamGoldDivideButton.deserializeBinaryFromReader),
                    e.setButton(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TeamGoldDivideInitData.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TeamGoldDivideInitData.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TeamGoldDivideInitData.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getTitle()).length > 0 && t.writeString(1, a),
            (a = e.getDesc()).length > 0 && t.writeString(2, a),
            null != (a = e.getTeam()) && t.writeMessage(3, a, proto.webcast.data.TeamGoldDivideTeam.serializeBinaryToWriter),
            null != (a = e.getButton()) && t.writeMessage(4, a, proto.webcast.data.TeamGoldDivideButton.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.TeamGoldDivideInitData.prototype.getTitle = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideInitData.prototype.setTitle = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideInitData.prototype.getDesc = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideInitData.prototype.setDesc = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideInitData.prototype.getTeam = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TeamGoldDivideTeam, 3)
        }
        ,
        proto.webcast.data.TeamGoldDivideInitData.prototype.setTeam = function(e) {
            return r.Message.setWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideInitData.prototype.clearTeam = function() {
            return this.setTeam(void 0)
        }
        ,
        proto.webcast.data.TeamGoldDivideInitData.prototype.hasTeam = function() {
            return null != r.Message.getField(this, 3)
        }
        ,
        proto.webcast.data.TeamGoldDivideInitData.prototype.getButton = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TeamGoldDivideButton, 4)
        }
        ,
        proto.webcast.data.TeamGoldDivideInitData.prototype.setButton = function(e) {
            return r.Message.setWrapperField(this, 4, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideInitData.prototype.clearButton = function() {
            return this.setButton(void 0)
        }
        ,
        proto.webcast.data.TeamGoldDivideInitData.prototype.hasButton = function() {
            return null != r.Message.getField(this, 4)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.repeatedFields_ = [3],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TeamGoldDivideActivityData.prototype.toObject = function(e) {
            return proto.webcast.data.TeamGoldDivideActivityData.toObject(e, this)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.toObject = function(e, t) {
            var a, o = {
                team: (a = t.getTeam()) && proto.webcast.data.TeamGoldDivideTeam.toObject(e, a),
                rewardInfo: (a = t.getRewardInfo()) && proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.toObject(e, a),
                tasksList: r.Message.toObjectList(t.getTasksList(), proto.webcast.data.TeamGoldDivideActivityData.Task.toObject, e)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.TeamGoldDivideActivityData.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TeamGoldDivideActivityData;
            return proto.webcast.data.TeamGoldDivideActivityData.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new proto.webcast.data.TeamGoldDivideTeam;
                    t.readMessage(a, proto.webcast.data.TeamGoldDivideTeam.deserializeBinaryFromReader),
                    e.setTeam(a);
                    break;
                case 2:
                    a = new proto.webcast.data.TeamGoldDivideActivityData.RewardInfo;
                    t.readMessage(a, proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.deserializeBinaryFromReader),
                    e.setRewardInfo(a);
                    break;
                case 3:
                    a = new proto.webcast.data.TeamGoldDivideActivityData.Task;
                    t.readMessage(a, proto.webcast.data.TeamGoldDivideActivityData.Task.deserializeBinaryFromReader),
                    e.addTasks(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TeamGoldDivideActivityData.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            null != (a = e.getTeam()) && t.writeMessage(1, a, proto.webcast.data.TeamGoldDivideTeam.serializeBinaryToWriter),
            null != (a = e.getRewardInfo()) && t.writeMessage(2, a, proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.serializeBinaryToWriter),
            (a = e.getTasksList()).length > 0 && t.writeRepeatedMessage(3, a, proto.webcast.data.TeamGoldDivideActivityData.Task.serializeBinaryToWriter)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TeamGoldDivideActivityData.RankReward.prototype.toObject = function(e) {
            return proto.webcast.data.TeamGoldDivideActivityData.RankReward.toObject(e, this)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RankReward.toObject = function(e, t) {
            var a = {
                title: r.Message.getFieldWithDefault(t, 1, ""),
                desc: r.Message.getFieldWithDefault(t, 2, ""),
                rank: r.Message.getFieldWithDefault(t, 3, "0")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.TeamGoldDivideActivityData.RankReward.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TeamGoldDivideActivityData.RankReward;
            return proto.webcast.data.TeamGoldDivideActivityData.RankReward.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RankReward.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setTitle(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setDesc(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setRank(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RankReward.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TeamGoldDivideActivityData.RankReward.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RankReward.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getTitle()).length > 0 && t.writeString(1, a),
            (a = e.getDesc()).length > 0 && t.writeString(2, a),
            a = e.getRank(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RankReward.prototype.getTitle = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RankReward.prototype.setTitle = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RankReward.prototype.getDesc = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RankReward.prototype.setDesc = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RankReward.prototype.getRank = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RankReward.prototype.setRank = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.prototype.toObject = function(e) {
            return proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.toObject = function(e, t) {
            var a, o = {
                title: r.Message.getFieldWithDefault(t, 1, ""),
                desc: r.Message.getFieldWithDefault(t, 2, ""),
                countDown: r.Message.getFieldWithDefault(t, 3, "0"),
                rankReward: (a = t.getRankReward()) && proto.webcast.data.TeamGoldDivideActivityData.RankReward.toObject(e, a)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TeamGoldDivideActivityData.RewardInfo;
            return proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setTitle(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setDesc(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setCountDown(a);
                    break;
                case 4:
                    a = new proto.webcast.data.TeamGoldDivideActivityData.RankReward;
                    t.readMessage(a, proto.webcast.data.TeamGoldDivideActivityData.RankReward.deserializeBinaryFromReader),
                    e.setRankReward(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getTitle()).length > 0 && t.writeString(1, a),
            (a = e.getDesc()).length > 0 && t.writeString(2, a),
            a = e.getCountDown(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a),
            null != (a = e.getRankReward()) && t.writeMessage(4, a, proto.webcast.data.TeamGoldDivideActivityData.RankReward.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.prototype.getTitle = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.prototype.setTitle = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.prototype.getDesc = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.prototype.setDesc = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.prototype.getCountDown = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.prototype.setCountDown = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.prototype.getRankReward = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TeamGoldDivideActivityData.RankReward, 4)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.prototype.setRankReward = function(e) {
            return r.Message.setWrapperField(this, 4, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.prototype.clearRankReward = function() {
            return this.setRankReward(void 0)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.RewardInfo.prototype.hasRankReward = function() {
            return null != r.Message.getField(this, 4)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TeamGoldDivideActivityData.Task.prototype.toObject = function(e) {
            return proto.webcast.data.TeamGoldDivideActivityData.Task.toObject(e, this)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.Task.toObject = function(e, t) {
            var a, o = {
                key: r.Message.getFieldWithDefault(t, 1, ""),
                title: r.Message.getFieldWithDefault(t, 2, ""),
                desc: r.Message.getFieldWithDefault(t, 3, ""),
                rewardTag: r.Message.getFieldWithDefault(t, 4, ""),
                button: (a = t.getButton()) && proto.webcast.data.TeamGoldDivideButton.toObject(e, a)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.TeamGoldDivideActivityData.Task.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TeamGoldDivideActivityData.Task;
            return proto.webcast.data.TeamGoldDivideActivityData.Task.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.Task.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setKey(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setTitle(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setDesc(a);
                    break;
                case 4:
                    a = t.readString();
                    e.setRewardTag(a);
                    break;
                case 5:
                    a = new proto.webcast.data.TeamGoldDivideButton;
                    t.readMessage(a, proto.webcast.data.TeamGoldDivideButton.deserializeBinaryFromReader),
                    e.setButton(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.Task.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TeamGoldDivideActivityData.Task.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.Task.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getKey()).length > 0 && t.writeString(1, a),
            (a = e.getTitle()).length > 0 && t.writeString(2, a),
            (a = e.getDesc()).length > 0 && t.writeString(3, a),
            (a = e.getRewardTag()).length > 0 && t.writeString(4, a),
            null != (a = e.getButton()) && t.writeMessage(5, a, proto.webcast.data.TeamGoldDivideButton.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.Task.prototype.getKey = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.Task.prototype.setKey = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.Task.prototype.getTitle = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.Task.prototype.setTitle = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.Task.prototype.getDesc = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.Task.prototype.setDesc = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.Task.prototype.getRewardTag = function() {
            return r.Message.getFieldWithDefault(this, 4, "")
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.Task.prototype.setRewardTag = function(e) {
            return r.Message.setProto3StringField(this, 4, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.Task.prototype.getButton = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TeamGoldDivideButton, 5)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.Task.prototype.setButton = function(e) {
            return r.Message.setWrapperField(this, 5, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.Task.prototype.clearButton = function() {
            return this.setButton(void 0)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.Task.prototype.hasButton = function() {
            return null != r.Message.getField(this, 5)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.prototype.getTeam = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TeamGoldDivideTeam, 1)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.prototype.setTeam = function(e) {
            return r.Message.setWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.prototype.clearTeam = function() {
            return this.setTeam(void 0)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.prototype.hasTeam = function() {
            return null != r.Message.getField(this, 1)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.prototype.getRewardInfo = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TeamGoldDivideActivityData.RewardInfo, 2)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.prototype.setRewardInfo = function(e) {
            return r.Message.setWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.prototype.clearRewardInfo = function() {
            return this.setRewardInfo(void 0)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.prototype.hasRewardInfo = function() {
            return null != r.Message.getField(this, 2)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.prototype.getTasksList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.TeamGoldDivideActivityData.Task, 3)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.prototype.setTasksList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.prototype.addTasks = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 3, e, proto.webcast.data.TeamGoldDivideActivityData.Task, t)
        }
        ,
        proto.webcast.data.TeamGoldDivideActivityData.prototype.clearTasksList = function() {
            return this.setTasksList([])
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.repeatedFields_ = [2],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TeamGoldDividePublicData.prototype.toObject = function(e) {
            return proto.webcast.data.TeamGoldDividePublicData.toObject(e, this)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.toObject = function(e, t) {
            var a, o = {
                team: (a = t.getTeam()) && proto.webcast.data.TeamGoldDivideTeam.toObject(e, a),
                rewardsList: r.Message.toObjectList(t.getRewardsList(), proto.webcast.data.TeamGoldDividePublicData.Reward.toObject, e),
                remark: r.Message.getFieldWithDefault(t, 3, "")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.TeamGoldDividePublicData.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TeamGoldDividePublicData;
            return proto.webcast.data.TeamGoldDividePublicData.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new proto.webcast.data.TeamGoldDivideTeam;
                    t.readMessage(a, proto.webcast.data.TeamGoldDivideTeam.deserializeBinaryFromReader),
                    e.setTeam(a);
                    break;
                case 2:
                    a = new proto.webcast.data.TeamGoldDividePublicData.Reward;
                    t.readMessage(a, proto.webcast.data.TeamGoldDividePublicData.Reward.deserializeBinaryFromReader),
                    e.addRewards(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setRemark(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TeamGoldDividePublicData.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            null != (a = e.getTeam()) && t.writeMessage(1, a, proto.webcast.data.TeamGoldDivideTeam.serializeBinaryToWriter),
            (a = e.getRewardsList()).length > 0 && t.writeRepeatedMessage(2, a, proto.webcast.data.TeamGoldDividePublicData.Reward.serializeBinaryToWriter),
            (a = e.getRemark()).length > 0 && t.writeString(3, a)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TeamGoldDividePublicData.Reward.prototype.toObject = function(e) {
            return proto.webcast.data.TeamGoldDividePublicData.Reward.toObject(e, this)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.toObject = function(e, t) {
            var a, o = {
                id: r.Message.getFieldWithDefault(t, 1, "0"),
                title: r.Message.getFieldWithDefault(t, 2, ""),
                desc: r.Message.getFieldWithDefault(t, 3, ""),
                amount: r.Message.getFieldWithDefault(t, 4, "0"),
                icon: (a = t.getIcon()) && s.Image.toObject(e, a),
                button: (a = t.getButton()) && proto.webcast.data.TeamGoldDivideButton.toObject(e, a)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.TeamGoldDividePublicData.Reward.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TeamGoldDividePublicData.Reward;
            return proto.webcast.data.TeamGoldDividePublicData.Reward.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setId(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setTitle(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setDesc(a);
                    break;
                case 4:
                    a = t.readInt64String();
                    e.setAmount(a);
                    break;
                case 5:
                    a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setIcon(a);
                    break;
                case 6:
                    a = new proto.webcast.data.TeamGoldDivideButton;
                    t.readMessage(a, proto.webcast.data.TeamGoldDivideButton.deserializeBinaryFromReader),
                    e.setButton(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TeamGoldDividePublicData.Reward.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getId(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            (a = e.getTitle()).length > 0 && t.writeString(2, a),
            (a = e.getDesc()).length > 0 && t.writeString(3, a),
            a = e.getAmount(),
            0 !== parseInt(a, 10) && t.writeInt64String(4, a),
            null != (a = e.getIcon()) && t.writeMessage(5, a, s.Image.serializeBinaryToWriter),
            null != (a = e.getButton()) && t.writeMessage(6, a, proto.webcast.data.TeamGoldDivideButton.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.prototype.getId = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.prototype.setId = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.prototype.getTitle = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.prototype.setTitle = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.prototype.getDesc = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.prototype.setDesc = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.prototype.getAmount = function() {
            return r.Message.getFieldWithDefault(this, 4, "0")
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.prototype.setAmount = function(e) {
            return r.Message.setProto3StringIntField(this, 4, e)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.prototype.getIcon = function() {
            return r.Message.getWrapperField(this, s.Image, 5)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.prototype.setIcon = function(e) {
            return r.Message.setWrapperField(this, 5, e)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.prototype.clearIcon = function() {
            return this.setIcon(void 0)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.prototype.hasIcon = function() {
            return null != r.Message.getField(this, 5)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.prototype.getButton = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TeamGoldDivideButton, 6)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.prototype.setButton = function(e) {
            return r.Message.setWrapperField(this, 6, e)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.prototype.clearButton = function() {
            return this.setButton(void 0)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.Reward.prototype.hasButton = function() {
            return null != r.Message.getField(this, 6)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.prototype.getTeam = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TeamGoldDivideTeam, 1)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.prototype.setTeam = function(e) {
            return r.Message.setWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.prototype.clearTeam = function() {
            return this.setTeam(void 0)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.prototype.hasTeam = function() {
            return null != r.Message.getField(this, 1)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.prototype.getRewardsList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.TeamGoldDividePublicData.Reward, 2)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.prototype.setRewardsList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.prototype.addRewards = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 2, e, proto.webcast.data.TeamGoldDividePublicData.Reward, t)
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.prototype.clearRewardsList = function() {
            return this.setRewardsList([])
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.prototype.getRemark = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.TeamGoldDividePublicData.prototype.setRemark = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TeamGoldDivide.prototype.toObject = function(e) {
            return proto.webcast.data.TeamGoldDivide.toObject(e, this)
        }
        ,
        proto.webcast.data.TeamGoldDivide.toObject = function(e, t) {
            var a, o = {
                status: r.Message.getFieldWithDefault(t, 1, 0),
                initData: (a = t.getInitData()) && proto.webcast.data.TeamGoldDivideInitData.toObject(e, a),
                activityData: (a = t.getActivityData()) && proto.webcast.data.TeamGoldDivideActivityData.toObject(e, a),
                publicData: (a = t.getPublicData()) && proto.webcast.data.TeamGoldDividePublicData.toObject(e, a)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.TeamGoldDivide.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TeamGoldDivide;
            return proto.webcast.data.TeamGoldDivide.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TeamGoldDivide.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readEnum();
                    e.setStatus(a);
                    break;
                case 2:
                    a = new proto.webcast.data.TeamGoldDivideInitData;
                    t.readMessage(a, proto.webcast.data.TeamGoldDivideInitData.deserializeBinaryFromReader),
                    e.setInitData(a);
                    break;
                case 3:
                    a = new proto.webcast.data.TeamGoldDivideActivityData;
                    t.readMessage(a, proto.webcast.data.TeamGoldDivideActivityData.deserializeBinaryFromReader),
                    e.setActivityData(a);
                    break;
                case 4:
                    a = new proto.webcast.data.TeamGoldDividePublicData;
                    t.readMessage(a, proto.webcast.data.TeamGoldDividePublicData.deserializeBinaryFromReader),
                    e.setPublicData(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TeamGoldDivide.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TeamGoldDivide.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TeamGoldDivide.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getStatus()) && t.writeEnum(1, a),
            null != (a = e.getInitData()) && t.writeMessage(2, a, proto.webcast.data.TeamGoldDivideInitData.serializeBinaryToWriter),
            null != (a = e.getActivityData()) && t.writeMessage(3, a, proto.webcast.data.TeamGoldDivideActivityData.serializeBinaryToWriter),
            null != (a = e.getPublicData()) && t.writeMessage(4, a, proto.webcast.data.TeamGoldDividePublicData.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.TeamGoldDivide.Status = {
            UNKNOWN: 0,
            UNTEAMED: 1,
            TEAMED: 2,
            PUBLICPERIOD: 3,
            FINISHED: 4
        },
        proto.webcast.data.TeamGoldDivide.prototype.getStatus = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.TeamGoldDivide.prototype.setStatus = function(e) {
            return r.Message.setProto3EnumField(this, 1, e)
        }
        ,
        proto.webcast.data.TeamGoldDivide.prototype.getInitData = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TeamGoldDivideInitData, 2)
        }
        ,
        proto.webcast.data.TeamGoldDivide.prototype.setInitData = function(e) {
            return r.Message.setWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.TeamGoldDivide.prototype.clearInitData = function() {
            return this.setInitData(void 0)
        }
        ,
        proto.webcast.data.TeamGoldDivide.prototype.hasInitData = function() {
            return null != r.Message.getField(this, 2)
        }
        ,
        proto.webcast.data.TeamGoldDivide.prototype.getActivityData = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TeamGoldDivideActivityData, 3)
        }
        ,
        proto.webcast.data.TeamGoldDivide.prototype.setActivityData = function(e) {
            return r.Message.setWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.TeamGoldDivide.prototype.clearActivityData = function() {
            return this.setActivityData(void 0)
        }
        ,
        proto.webcast.data.TeamGoldDivide.prototype.hasActivityData = function() {
            return null != r.Message.getField(this, 3)
        }
        ,
        proto.webcast.data.TeamGoldDivide.prototype.getPublicData = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TeamGoldDividePublicData, 4)
        }
        ,
        proto.webcast.data.TeamGoldDivide.prototype.setPublicData = function(e) {
            return r.Message.setWrapperField(this, 4, e)
        }
        ,
        proto.webcast.data.TeamGoldDivide.prototype.clearPublicData = function() {
            return this.setPublicData(void 0)
        }
        ,
        proto.webcast.data.TeamGoldDivide.prototype.hasPublicData = function() {
            return null != r.Message.getField(this, 4)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.AnchorVoteCandidate.prototype.toObject = function(e) {
            return proto.webcast.data.AnchorVoteCandidate.toObject(e, this)
        }
        ,
        proto.webcast.data.AnchorVoteCandidate.toObject = function(e, t) {
            var a = {
                anchorId: r.Message.getFieldWithDefault(t, 1, "0"),
                roomId: r.Message.getFieldWithDefault(t, 2, ""),
                avatarUrl: r.Message.getFieldWithDefault(t, 3, ""),
                rank: r.Message.getFieldWithDefault(t, 4, "0"),
                selected: r.Message.getBooleanFieldWithDefault(t, 5, !1),
                voteUserCount: r.Message.getFieldWithDefault(t, 6, "0"),
                nickname: r.Message.getFieldWithDefault(t, 7, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.AnchorVoteCandidate.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.AnchorVoteCandidate;
            return proto.webcast.data.AnchorVoteCandidate.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.AnchorVoteCandidate.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setAnchorId(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setRoomId(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setAvatarUrl(a);
                    break;
                case 4:
                    a = t.readInt64String();
                    e.setRank(a);
                    break;
                case 5:
                    a = t.readBool();
                    e.setSelected(a);
                    break;
                case 6:
                    a = t.readInt64String();
                    e.setVoteUserCount(a);
                    break;
                case 7:
                    a = t.readString();
                    e.setNickname(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.AnchorVoteCandidate.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.AnchorVoteCandidate.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.AnchorVoteCandidate.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getAnchorId(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            (a = e.getRoomId()).length > 0 && t.writeString(2, a),
            (a = e.getAvatarUrl()).length > 0 && t.writeString(3, a),
            a = e.getRank(),
            0 !== parseInt(a, 10) && t.writeInt64String(4, a),
            (a = e.getSelected()) && t.writeBool(5, a),
            a = e.getVoteUserCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(6, a),
            (a = e.getNickname()).length > 0 && t.writeString(7, a)
        }
        ,
        proto.webcast.data.AnchorVoteCandidate.prototype.getAnchorId = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.AnchorVoteCandidate.prototype.setAnchorId = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.AnchorVoteCandidate.prototype.getRoomId = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.AnchorVoteCandidate.prototype.setRoomId = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.AnchorVoteCandidate.prototype.getAvatarUrl = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.AnchorVoteCandidate.prototype.setAvatarUrl = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.AnchorVoteCandidate.prototype.getRank = function() {
            return r.Message.getFieldWithDefault(this, 4, "0")
        }
        ,
        proto.webcast.data.AnchorVoteCandidate.prototype.setRank = function(e) {
            return r.Message.setProto3StringIntField(this, 4, e)
        }
        ,
        proto.webcast.data.AnchorVoteCandidate.prototype.getSelected = function() {
            return r.Message.getBooleanFieldWithDefault(this, 5, !1)
        }
        ,
        proto.webcast.data.AnchorVoteCandidate.prototype.setSelected = function(e) {
            return r.Message.setProto3BooleanField(this, 5, e)
        }
        ,
        proto.webcast.data.AnchorVoteCandidate.prototype.getVoteUserCount = function() {
            return r.Message.getFieldWithDefault(this, 6, "0")
        }
        ,
        proto.webcast.data.AnchorVoteCandidate.prototype.setVoteUserCount = function(e) {
            return r.Message.setProto3StringIntField(this, 6, e)
        }
        ,
        proto.webcast.data.AnchorVoteCandidate.prototype.getNickname = function() {
            return r.Message.getFieldWithDefault(this, 7, "")
        }
        ,
        proto.webcast.data.AnchorVoteCandidate.prototype.setNickname = function(e) {
            return r.Message.setProto3StringField(this, 7, e)
        }
        ,
        proto.webcast.data.AnchorVote.repeatedFields_ = [3],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.AnchorVote.prototype.toObject = function(e) {
            return proto.webcast.data.AnchorVote.toObject(e, this)
        }
        ,
        proto.webcast.data.AnchorVote.toObject = function(e, t) {
            var a = {
                termId: r.Message.getFieldWithDefault(t, 1, "0"),
                status: r.Message.getFieldWithDefault(t, 2, 0),
                candidatesList: r.Message.toObjectList(t.getCandidatesList(), proto.webcast.data.AnchorVoteCandidate.toObject, e),
                totalUserCount: r.Message.getFieldWithDefault(t, 4, ""),
                poolPrizeAmount: r.Message.getFieldWithDefault(t, 5, ""),
                termStartAt: r.Message.getFieldWithDefault(t, 6, "0"),
                voteFinishAt: r.Message.getFieldWithDefault(t, 7, "0"),
                termFinishAt: r.Message.getFieldWithDefault(t, 8, "0"),
                voteGoldAmount: r.Message.getFieldWithDefault(t, 9, "0"),
                votePrizeAmount: r.Message.getFieldWithDefault(t, 10, "0")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.AnchorVote.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.AnchorVote;
            return proto.webcast.data.AnchorVote.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.AnchorVote.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setTermId(a);
                    break;
                case 2:
                    a = t.readEnum();
                    e.setStatus(a);
                    break;
                case 3:
                    a = new proto.webcast.data.AnchorVoteCandidate;
                    t.readMessage(a, proto.webcast.data.AnchorVoteCandidate.deserializeBinaryFromReader),
                    e.addCandidates(a);
                    break;
                case 4:
                    a = t.readString();
                    e.setTotalUserCount(a);
                    break;
                case 5:
                    a = t.readString();
                    e.setPoolPrizeAmount(a);
                    break;
                case 6:
                    a = t.readInt64String();
                    e.setTermStartAt(a);
                    break;
                case 7:
                    a = t.readInt64String();
                    e.setVoteFinishAt(a);
                    break;
                case 8:
                    a = t.readInt64String();
                    e.setTermFinishAt(a);
                    break;
                case 9:
                    a = t.readInt64String();
                    e.setVoteGoldAmount(a);
                    break;
                case 10:
                    a = t.readInt64String();
                    e.setVotePrizeAmount(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.AnchorVote.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.AnchorVote.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.AnchorVote.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getTermId(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            0 !== (a = e.getStatus()) && t.writeEnum(2, a),
            (a = e.getCandidatesList()).length > 0 && t.writeRepeatedMessage(3, a, proto.webcast.data.AnchorVoteCandidate.serializeBinaryToWriter),
            (a = e.getTotalUserCount()).length > 0 && t.writeString(4, a),
            (a = e.getPoolPrizeAmount()).length > 0 && t.writeString(5, a),
            a = e.getTermStartAt(),
            0 !== parseInt(a, 10) && t.writeInt64String(6, a),
            a = e.getVoteFinishAt(),
            0 !== parseInt(a, 10) && t.writeInt64String(7, a),
            a = e.getTermFinishAt(),
            0 !== parseInt(a, 10) && t.writeInt64String(8, a),
            a = e.getVoteGoldAmount(),
            0 !== parseInt(a, 10) && t.writeInt64String(9, a),
            a = e.getVotePrizeAmount(),
            0 !== parseInt(a, 10) && t.writeInt64String(10, a)
        }
        ,
        proto.webcast.data.AnchorVote.prototype.getTermId = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.AnchorVote.prototype.setTermId = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.AnchorVote.prototype.getStatus = function() {
            return r.Message.getFieldWithDefault(this, 2, 0)
        }
        ,
        proto.webcast.data.AnchorVote.prototype.setStatus = function(e) {
            return r.Message.setProto3EnumField(this, 2, e)
        }
        ,
        proto.webcast.data.AnchorVote.prototype.getCandidatesList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.AnchorVoteCandidate, 3)
        }
        ,
        proto.webcast.data.AnchorVote.prototype.setCandidatesList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.AnchorVote.prototype.addCandidates = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 3, e, proto.webcast.data.AnchorVoteCandidate, t)
        }
        ,
        proto.webcast.data.AnchorVote.prototype.clearCandidatesList = function() {
            return this.setCandidatesList([])
        }
        ,
        proto.webcast.data.AnchorVote.prototype.getTotalUserCount = function() {
            return r.Message.getFieldWithDefault(this, 4, "")
        }
        ,
        proto.webcast.data.AnchorVote.prototype.setTotalUserCount = function(e) {
            return r.Message.setProto3StringField(this, 4, e)
        }
        ,
        proto.webcast.data.AnchorVote.prototype.getPoolPrizeAmount = function() {
            return r.Message.getFieldWithDefault(this, 5, "")
        }
        ,
        proto.webcast.data.AnchorVote.prototype.setPoolPrizeAmount = function(e) {
            return r.Message.setProto3StringField(this, 5, e)
        }
        ,
        proto.webcast.data.AnchorVote.prototype.getTermStartAt = function() {
            return r.Message.getFieldWithDefault(this, 6, "0")
        }
        ,
        proto.webcast.data.AnchorVote.prototype.setTermStartAt = function(e) {
            return r.Message.setProto3StringIntField(this, 6, e)
        }
        ,
        proto.webcast.data.AnchorVote.prototype.getVoteFinishAt = function() {
            return r.Message.getFieldWithDefault(this, 7, "0")
        }
        ,
        proto.webcast.data.AnchorVote.prototype.setVoteFinishAt = function(e) {
            return r.Message.setProto3StringIntField(this, 7, e)
        }
        ,
        proto.webcast.data.AnchorVote.prototype.getTermFinishAt = function() {
            return r.Message.getFieldWithDefault(this, 8, "0")
        }
        ,
        proto.webcast.data.AnchorVote.prototype.setTermFinishAt = function(e) {
            return r.Message.setProto3StringIntField(this, 8, e)
        }
        ,
        proto.webcast.data.AnchorVote.prototype.getVoteGoldAmount = function() {
            return r.Message.getFieldWithDefault(this, 9, "0")
        }
        ,
        proto.webcast.data.AnchorVote.prototype.setVoteGoldAmount = function(e) {
            return r.Message.setProto3StringIntField(this, 9, e)
        }
        ,
        proto.webcast.data.AnchorVote.prototype.getVotePrizeAmount = function() {
            return r.Message.getFieldWithDefault(this, 10, "0")
        }
        ,
        proto.webcast.data.AnchorVote.prototype.setVotePrizeAmount = function(e) {
            return r.Message.setProto3StringIntField(this, 10, e)
        }
        ,
        proto.webcast.data.TaskCenterData.repeatedFields_ = [5],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TaskCenterData.prototype.toObject = function(e) {
            return proto.webcast.data.TaskCenterData.toObject(e, this)
        }
        ,
        proto.webcast.data.TaskCenterData.toObject = function(e, t) {
            var a, o = {
                goldDivide: (a = t.getGoldDivide()) && proto.webcast.data.GoldDivide.toObject(e, a),
                growthTask: (a = t.getGrowthTask()) && n.GrowthTask.toObject(e, a),
                touchPosition: (a = t.getTouchPosition()) && d.TouchPosition.toObject(e, a),
                teamGoldDivide: (a = t.getTeamGoldDivide()) && proto.webcast.data.TeamGoldDivide.toObject(e, a),
                anchorVotesList: r.Message.toObjectList(t.getAnchorVotesList(), proto.webcast.data.AnchorVote.toObject, e)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.TaskCenterData.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TaskCenterData;
            return proto.webcast.data.TaskCenterData.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TaskCenterData.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new proto.webcast.data.GoldDivide;
                    t.readMessage(a, proto.webcast.data.GoldDivide.deserializeBinaryFromReader),
                    e.setGoldDivide(a);
                    break;
                case 2:
                    a = new n.GrowthTask;
                    t.readMessage(a, n.GrowthTask.deserializeBinaryFromReader),
                    e.setGrowthTask(a);
                    break;
                case 3:
                    a = new d.TouchPosition;
                    t.readMessage(a, d.TouchPosition.deserializeBinaryFromReader),
                    e.setTouchPosition(a);
                    break;
                case 4:
                    a = new proto.webcast.data.TeamGoldDivide;
                    t.readMessage(a, proto.webcast.data.TeamGoldDivide.deserializeBinaryFromReader),
                    e.setTeamGoldDivide(a);
                    break;
                case 5:
                    a = new proto.webcast.data.AnchorVote;
                    t.readMessage(a, proto.webcast.data.AnchorVote.deserializeBinaryFromReader),
                    e.addAnchorVotes(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TaskCenterData.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TaskCenterData.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            null != (a = e.getGoldDivide()) && t.writeMessage(1, a, proto.webcast.data.GoldDivide.serializeBinaryToWriter),
            null != (a = e.getGrowthTask()) && t.writeMessage(2, a, n.GrowthTask.serializeBinaryToWriter),
            null != (a = e.getTouchPosition()) && t.writeMessage(3, a, d.TouchPosition.serializeBinaryToWriter),
            null != (a = e.getTeamGoldDivide()) && t.writeMessage(4, a, proto.webcast.data.TeamGoldDivide.serializeBinaryToWriter),
            (a = e.getAnchorVotesList()).length > 0 && t.writeRepeatedMessage(5, a, proto.webcast.data.AnchorVote.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.getGoldDivide = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.GoldDivide, 1)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.setGoldDivide = function(e) {
            return r.Message.setWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.clearGoldDivide = function() {
            return this.setGoldDivide(void 0)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.hasGoldDivide = function() {
            return null != r.Message.getField(this, 1)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.getGrowthTask = function() {
            return r.Message.getWrapperField(this, n.GrowthTask, 2)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.setGrowthTask = function(e) {
            return r.Message.setWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.clearGrowthTask = function() {
            return this.setGrowthTask(void 0)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.hasGrowthTask = function() {
            return null != r.Message.getField(this, 2)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.getTouchPosition = function() {
            return r.Message.getWrapperField(this, d.TouchPosition, 3)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.setTouchPosition = function(e) {
            return r.Message.setWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.clearTouchPosition = function() {
            return this.setTouchPosition(void 0)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.hasTouchPosition = function() {
            return null != r.Message.getField(this, 3)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.getTeamGoldDivide = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TeamGoldDivide, 4)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.setTeamGoldDivide = function(e) {
            return r.Message.setWrapperField(this, 4, e)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.clearTeamGoldDivide = function() {
            return this.setTeamGoldDivide(void 0)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.hasTeamGoldDivide = function() {
            return null != r.Message.getField(this, 4)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.getAnchorVotesList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.AnchorVote, 5)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.setAnchorVotesList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 5, e)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.addAnchorVotes = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 5, e, proto.webcast.data.AnchorVote, t)
        }
        ,
        proto.webcast.data.TaskCenterData.prototype.clearAnchorVotesList = function() {
            return this.setAnchorVotesList([])
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TaskCenterItem.prototype.toObject = function(e) {
            return proto.webcast.data.TaskCenterItem.toObject(e, this)
        }
        ,
        proto.webcast.data.TaskCenterItem.toObject = function(e, t) {
            var a, o = {
                type: r.Message.getFieldWithDefault(t, 1, 0),
                data: (a = t.getData()) && proto.webcast.data.TaskCenterData.toObject(e, a),
                key: r.Message.getFieldWithDefault(t, 3, ""),
                toBottom: r.Message.getBooleanFieldWithDefault(t, 4, !1),
                template: r.Message.getFieldWithDefault(t, 5, 0),
                priority: r.Message.getFieldWithDefault(t, 6, "0")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.TaskCenterItem.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TaskCenterItem;
            return proto.webcast.data.TaskCenterItem.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TaskCenterItem.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readEnum();
                    e.setType(a);
                    break;
                case 2:
                    a = new proto.webcast.data.TaskCenterData;
                    t.readMessage(a, proto.webcast.data.TaskCenterData.deserializeBinaryFromReader),
                    e.setData(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setKey(a);
                    break;
                case 4:
                    a = t.readBool();
                    e.setToBottom(a);
                    break;
                case 5:
                    a = t.readEnum();
                    e.setTemplate(a);
                    break;
                case 6:
                    a = t.readInt64String();
                    e.setPriority(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TaskCenterItem.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TaskCenterItem.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TaskCenterItem.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getType()) && t.writeEnum(1, a),
            null != (a = e.getData()) && t.writeMessage(2, a, proto.webcast.data.TaskCenterData.serializeBinaryToWriter),
            (a = e.getKey()).length > 0 && t.writeString(3, a),
            (a = e.getToBottom()) && t.writeBool(4, a),
            0 !== (a = e.getTemplate()) && t.writeEnum(5, a),
            a = e.getPriority(),
            0 !== parseInt(a, 10) && t.writeInt64String(6, a)
        }
        ,
        proto.webcast.data.TaskCenterItem.prototype.getType = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.TaskCenterItem.prototype.setType = function(e) {
            return r.Message.setProto3EnumField(this, 1, e)
        }
        ,
        proto.webcast.data.TaskCenterItem.prototype.getData = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TaskCenterData, 2)
        }
        ,
        proto.webcast.data.TaskCenterItem.prototype.setData = function(e) {
            return r.Message.setWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.TaskCenterItem.prototype.clearData = function() {
            return this.setData(void 0)
        }
        ,
        proto.webcast.data.TaskCenterItem.prototype.hasData = function() {
            return null != r.Message.getField(this, 2)
        }
        ,
        proto.webcast.data.TaskCenterItem.prototype.getKey = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.TaskCenterItem.prototype.setKey = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.TaskCenterItem.prototype.getToBottom = function() {
            return r.Message.getBooleanFieldWithDefault(this, 4, !1)
        }
        ,
        proto.webcast.data.TaskCenterItem.prototype.setToBottom = function(e) {
            return r.Message.setProto3BooleanField(this, 4, e)
        }
        ,
        proto.webcast.data.TaskCenterItem.prototype.getTemplate = function() {
            return r.Message.getFieldWithDefault(this, 5, 0)
        }
        ,
        proto.webcast.data.TaskCenterItem.prototype.setTemplate = function(e) {
            return r.Message.setProto3EnumField(this, 5, e)
        }
        ,
        proto.webcast.data.TaskCenterItem.prototype.getPriority = function() {
            return r.Message.getFieldWithDefault(this, 6, "0")
        }
        ,
        proto.webcast.data.TaskCenterItem.prototype.setPriority = function(e) {
            return r.Message.setProto3StringIntField(this, 6, e)
        }
        ,
        proto.webcast.data.TaskCenterItemType = {
            TASKCENTERITEMUNKNOWN: 0,
            TASKCENTERITEMGOLDDIVIDE: 1,
            TASKCENTERITEMGROWTHTASK: 2,
            TASKCENTERITEMTOUCHPOSITION: 3,
            TASKCENTERITEMUGTASK: 4,
            TASKCENTERITEMTEAMGOLDDIVIDE: 5,
            TASKCENTERITEMANCHORVOTE: 6
        },
        proto.webcast.data.ItemTemplate = {
            ITEMTEMPLATEUNKNOWN: 0,
            ITEMTEMPLATETASKNORMAL: 11,
            ITEMTEMPLATETASKMULTISTAGE: 12
        },
        proto.webcast.data.AnchorVoteStatus = {
            ANCHORVOTEUNKNOWN: 0,
            ANCHORVOTEVOTING: 1,
            ANCHORVOTEVOTED: 2,
            ANCHORVOTENOPARTICIPATE: 3,
            ANCHORVOTENOPRIZE: 4,
            ANCHORVOTEPRIZEGOT: 5
        },
        o.object.extend(t, proto.webcast.data)
    }
    ,
    23491: (e,t,a)=>{
        var r = a(47865)
          , o = r
          , i = function() {
            return this ? this : "undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : Function("return this")()
        }
        .call(null)
          , s = a(14307);
        o.object.extend(proto, s);
        var n = a(36197);
        o.object.extend(proto, n),
        o.exportSymbol("proto.webcast.data.BannerDetail", null, i),
        o.exportSymbol("proto.webcast.data.BannerFeedbackView", null, i),
        o.exportSymbol("proto.webcast.data.BannerView", null, i),
        o.exportSymbol("proto.webcast.data.CommonDetail", null, i),
        o.exportSymbol("proto.webcast.data.DiamondListBannerDetail", null, i),
        o.exportSymbol("proto.webcast.data.DynamicInfo", null, i),
        o.exportSymbol("proto.webcast.data.ElementListProps", null, i),
        o.exportSymbol("proto.webcast.data.FeedbackProps", null, i),
        o.exportSymbol("proto.webcast.data.FreqCtrlParams", null, i),
        o.exportSymbol("proto.webcast.data.FreqCtrlStrategy", null, i),
        o.exportSymbol("proto.webcast.data.GiftPanelEntranceDetail", null, i),
        o.exportSymbol("proto.webcast.data.GiftPanelTopDetail", null, i),
        o.exportSymbol("proto.webcast.data.LightInfo", null, i),
        o.exportSymbol("proto.webcast.data.MultiStageProgressBar", null, i),
        o.exportSymbol("proto.webcast.data.Position", null, i),
        o.exportSymbol("proto.webcast.data.ProConfProps", null, i),
        o.exportSymbol("proto.webcast.data.ProgressBar", null, i),
        o.exportSymbol("proto.webcast.data.ProgressBarStage", null, i),
        o.exportSymbol("proto.webcast.data.RefreshMechanism", null, i),
        o.exportSymbol("proto.webcast.data.RefreshParams", null, i),
        o.exportSymbol("proto.webcast.data.RichText", null, i),
        o.exportSymbol("proto.webcast.data.RichTextType", null, i),
        o.exportSymbol("proto.webcast.data.TaskProps", null, i),
        o.exportSymbol("proto.webcast.data.Time2Picture", null, i),
        o.exportSymbol("proto.webcast.data.TouchButton", null, i),
        o.exportSymbol("proto.webcast.data.TouchPosition", null, i),
        o.exportSymbol("proto.webcast.data.TouchPositionDetail", null, i),
        o.exportSymbol("proto.webcast.data.TouchPositionMeta", null, i),
        o.exportSymbol("proto.webcast.data.TouchPositions", null, i),
        o.exportSymbol("proto.webcast.data.TouchRewardStatus", null, i),
        o.exportSymbol("proto.webcast.data.TreasureDetail", null, i),
        o.exportSymbol("proto.webcast.data.TreasureDetail.TriggerTiming", null, i),
        o.exportSymbol("proto.webcast.data.View", null, i),
        proto.webcast.data.RichText = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.RichText, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.RichText.displayName = "proto.webcast.data.RichText"),
        proto.webcast.data.ProgressBar = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.ProgressBar, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ProgressBar.displayName = "proto.webcast.data.ProgressBar"),
        proto.webcast.data.ProgressBarStage = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.ProgressBarStage.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.ProgressBarStage, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ProgressBarStage.displayName = "proto.webcast.data.ProgressBarStage"),
        proto.webcast.data.MultiStageProgressBar = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.MultiStageProgressBar.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.MultiStageProgressBar, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.MultiStageProgressBar.displayName = "proto.webcast.data.MultiStageProgressBar"),
        proto.webcast.data.TouchButton = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.TouchButton.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.TouchButton, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TouchButton.displayName = "proto.webcast.data.TouchButton"),
        proto.webcast.data.GiftPanelTopDetail = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.GiftPanelTopDetail.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.GiftPanelTopDetail, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.GiftPanelTopDetail.displayName = "proto.webcast.data.GiftPanelTopDetail"),
        proto.webcast.data.DiamondListBannerDetail = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.DiamondListBannerDetail.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.DiamondListBannerDetail, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.DiamondListBannerDetail.displayName = "proto.webcast.data.DiamondListBannerDetail"),
        proto.webcast.data.CommonDetail = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.CommonDetail.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.CommonDetail, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.CommonDetail.displayName = "proto.webcast.data.CommonDetail"),
        proto.webcast.data.TreasureDetail = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.TreasureDetail, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TreasureDetail.displayName = "proto.webcast.data.TreasureDetail"),
        proto.webcast.data.LightInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.LightInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.LightInfo.displayName = "proto.webcast.data.LightInfo"),
        proto.webcast.data.DynamicInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.DynamicInfo.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.DynamicInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.DynamicInfo.displayName = "proto.webcast.data.DynamicInfo"),
        proto.webcast.data.GiftPanelEntranceDetail = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.GiftPanelEntranceDetail.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.GiftPanelEntranceDetail, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.GiftPanelEntranceDetail.displayName = "proto.webcast.data.GiftPanelEntranceDetail"),
        proto.webcast.data.FreqCtrlParams = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.FreqCtrlParams, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.FreqCtrlParams.displayName = "proto.webcast.data.FreqCtrlParams"),
        proto.webcast.data.RefreshParams = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.RefreshParams, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.RefreshParams.displayName = "proto.webcast.data.RefreshParams"),
        proto.webcast.data.TouchPositionMeta = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.TouchPositionMeta.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.TouchPositionMeta, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TouchPositionMeta.displayName = "proto.webcast.data.TouchPositionMeta"),
        proto.webcast.data.TouchPositionDetail = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.TouchPositionDetail, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TouchPositionDetail.displayName = "proto.webcast.data.TouchPositionDetail"),
        proto.webcast.data.BannerDetail = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.BannerDetail.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.BannerDetail, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.BannerDetail.displayName = "proto.webcast.data.BannerDetail"),
        proto.webcast.data.Time2Picture = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.Time2Picture, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.Time2Picture.displayName = "proto.webcast.data.Time2Picture"),
        proto.webcast.data.View = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.View.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.View, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.View.displayName = "proto.webcast.data.View"),
        proto.webcast.data.BannerFeedbackView = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.BannerFeedbackView, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.BannerFeedbackView.displayName = "proto.webcast.data.BannerFeedbackView"),
        proto.webcast.data.FeedbackProps = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.FeedbackProps, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.FeedbackProps.displayName = "proto.webcast.data.FeedbackProps"),
        proto.webcast.data.BannerView = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.BannerView, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.BannerView.displayName = "proto.webcast.data.BannerView"),
        proto.webcast.data.TaskProps = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.TaskProps.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.TaskProps, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TaskProps.displayName = "proto.webcast.data.TaskProps"),
        proto.webcast.data.ElementListProps = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.ElementListProps.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.ElementListProps, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ElementListProps.displayName = "proto.webcast.data.ElementListProps"),
        proto.webcast.data.ProConfProps = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.ProConfProps, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ProConfProps.displayName = "proto.webcast.data.ProConfProps"),
        proto.webcast.data.TouchPosition = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.TouchPosition, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TouchPosition.displayName = "proto.webcast.data.TouchPosition"),
        proto.webcast.data.TouchPositions = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.TouchPositions.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.TouchPositions, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.TouchPositions.displayName = "proto.webcast.data.TouchPositions"),
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.RichText.prototype.toObject = function(e) {
            return proto.webcast.data.RichText.toObject(e, this)
        }
        ,
        proto.webcast.data.RichText.toObject = function(e, t) {
            var a, o = {
                type: r.Message.getFieldWithDefault(t, 1, 0),
                text: r.Message.getFieldWithDefault(t, 2, ""),
                img: (a = t.getImg()) && s.Image.toObject(e, a),
                fontSize: r.Message.getFieldWithDefault(t, 4, "0"),
                fontColor: r.Message.getFieldWithDefault(t, 5, ""),
                weight: r.Message.getFieldWithDefault(t, 6, "0")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.RichText.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.RichText;
            return proto.webcast.data.RichText.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.RichText.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readEnum();
                    e.setType(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setText(a);
                    break;
                case 3:
                    a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setImg(a);
                    break;
                case 4:
                    a = t.readInt64String();
                    e.setFontSize(a);
                    break;
                case 5:
                    a = t.readString();
                    e.setFontColor(a);
                    break;
                case 6:
                    a = t.readInt64String();
                    e.setWeight(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.RichText.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.RichText.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.RichText.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getType()) && t.writeEnum(1, a),
            (a = e.getText()).length > 0 && t.writeString(2, a),
            null != (a = e.getImg()) && t.writeMessage(3, a, s.Image.serializeBinaryToWriter),
            a = e.getFontSize(),
            0 !== parseInt(a, 10) && t.writeInt64String(4, a),
            (a = e.getFontColor()).length > 0 && t.writeString(5, a),
            a = e.getWeight(),
            0 !== parseInt(a, 10) && t.writeInt64String(6, a)
        }
        ,
        proto.webcast.data.RichText.prototype.getType = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.RichText.prototype.setType = function(e) {
            return r.Message.setProto3EnumField(this, 1, e)
        }
        ,
        proto.webcast.data.RichText.prototype.getText = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.RichText.prototype.setText = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.RichText.prototype.getImg = function() {
            return r.Message.getWrapperField(this, s.Image, 3)
        }
        ,
        proto.webcast.data.RichText.prototype.setImg = function(e) {
            return r.Message.setWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.RichText.prototype.clearImg = function() {
            return this.setImg(void 0)
        }
        ,
        proto.webcast.data.RichText.prototype.hasImg = function() {
            return null != r.Message.getField(this, 3)
        }
        ,
        proto.webcast.data.RichText.prototype.getFontSize = function() {
            return r.Message.getFieldWithDefault(this, 4, "0")
        }
        ,
        proto.webcast.data.RichText.prototype.setFontSize = function(e) {
            return r.Message.setProto3StringIntField(this, 4, e)
        }
        ,
        proto.webcast.data.RichText.prototype.getFontColor = function() {
            return r.Message.getFieldWithDefault(this, 5, "")
        }
        ,
        proto.webcast.data.RichText.prototype.setFontColor = function(e) {
            return r.Message.setProto3StringField(this, 5, e)
        }
        ,
        proto.webcast.data.RichText.prototype.getWeight = function() {
            return r.Message.getFieldWithDefault(this, 6, "0")
        }
        ,
        proto.webcast.data.RichText.prototype.setWeight = function(e) {
            return r.Message.setProto3StringIntField(this, 6, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ProgressBar.prototype.toObject = function(e) {
            return proto.webcast.data.ProgressBar.toObject(e, this)
        }
        ,
        proto.webcast.data.ProgressBar.toObject = function(e, t) {
            var a = {
                currentValue: r.Message.getFieldWithDefault(t, 1, ""),
                targetValue: r.Message.getFieldWithDefault(t, 2, ""),
                progressRate: r.Message.getFieldWithDefault(t, 3, "0"),
                color: r.Message.getFieldWithDefault(t, 4, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.ProgressBar.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ProgressBar;
            return proto.webcast.data.ProgressBar.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ProgressBar.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setCurrentValue(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setTargetValue(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setProgressRate(a);
                    break;
                case 4:
                    a = t.readString();
                    e.setColor(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.ProgressBar.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ProgressBar.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ProgressBar.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getCurrentValue()).length > 0 && t.writeString(1, a),
            (a = e.getTargetValue()).length > 0 && t.writeString(2, a),
            a = e.getProgressRate(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a),
            (a = e.getColor()).length > 0 && t.writeString(4, a)
        }
        ,
        proto.webcast.data.ProgressBar.prototype.getCurrentValue = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.ProgressBar.prototype.setCurrentValue = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.ProgressBar.prototype.getTargetValue = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.ProgressBar.prototype.setTargetValue = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.ProgressBar.prototype.getProgressRate = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.ProgressBar.prototype.setProgressRate = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        proto.webcast.data.ProgressBar.prototype.getColor = function() {
            return r.Message.getFieldWithDefault(this, 4, "")
        }
        ,
        proto.webcast.data.ProgressBar.prototype.setColor = function(e) {
            return r.Message.setProto3StringField(this, 4, e)
        }
        ,
        proto.webcast.data.ProgressBarStage.repeatedFields_ = [2, 3],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ProgressBarStage.prototype.toObject = function(e) {
            return proto.webcast.data.ProgressBarStage.toObject(e, this)
        }
        ,
        proto.webcast.data.ProgressBarStage.toObject = function(e, t) {
            var a, o = {
                icon: (a = t.getIcon()) && s.Image.toObject(e, a),
                iconTextList: r.Message.toObjectList(t.getIconTextList(), proto.webcast.data.RichText.toObject, e),
                bottomTextList: r.Message.toObjectList(t.getBottomTextList(), proto.webcast.data.RichText.toObject, e),
                rewardStatus: r.Message.getFieldWithDefault(t, 4, 0),
                currentValue: r.Message.getFieldWithDefault(t, 5, "0"),
                targetValue: r.Message.getFieldWithDefault(t, 6, "0"),
                jumpSchema: r.Message.getFieldWithDefault(t, 7, "")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.ProgressBarStage.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ProgressBarStage;
            return proto.webcast.data.ProgressBarStage.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ProgressBarStage.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setIcon(a);
                    break;
                case 2:
                    a = new proto.webcast.data.RichText;
                    t.readMessage(a, proto.webcast.data.RichText.deserializeBinaryFromReader),
                    e.addIconText(a);
                    break;
                case 3:
                    a = new proto.webcast.data.RichText;
                    t.readMessage(a, proto.webcast.data.RichText.deserializeBinaryFromReader),
                    e.addBottomText(a);
                    break;
                case 4:
                    a = t.readEnum();
                    e.setRewardStatus(a);
                    break;
                case 5:
                    a = t.readInt64String();
                    e.setCurrentValue(a);
                    break;
                case 6:
                    a = t.readInt64String();
                    e.setTargetValue(a);
                    break;
                case 7:
                    a = t.readString();
                    e.setJumpSchema(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ProgressBarStage.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ProgressBarStage.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            null != (a = e.getIcon()) && t.writeMessage(1, a, s.Image.serializeBinaryToWriter),
            (a = e.getIconTextList()).length > 0 && t.writeRepeatedMessage(2, a, proto.webcast.data.RichText.serializeBinaryToWriter),
            (a = e.getBottomTextList()).length > 0 && t.writeRepeatedMessage(3, a, proto.webcast.data.RichText.serializeBinaryToWriter),
            0 !== (a = e.getRewardStatus()) && t.writeEnum(4, a),
            a = e.getCurrentValue(),
            0 !== parseInt(a, 10) && t.writeInt64String(5, a),
            a = e.getTargetValue(),
            0 !== parseInt(a, 10) && t.writeInt64String(6, a),
            (a = e.getJumpSchema()).length > 0 && t.writeString(7, a)
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.getIcon = function() {
            return r.Message.getWrapperField(this, s.Image, 1)
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.setIcon = function(e) {
            return r.Message.setWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.clearIcon = function() {
            return this.setIcon(void 0)
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.hasIcon = function() {
            return null != r.Message.getField(this, 1)
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.getIconTextList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.RichText, 2)
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.setIconTextList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.addIconText = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 2, e, proto.webcast.data.RichText, t)
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.clearIconTextList = function() {
            return this.setIconTextList([])
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.getBottomTextList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.RichText, 3)
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.setBottomTextList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.addBottomText = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 3, e, proto.webcast.data.RichText, t)
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.clearBottomTextList = function() {
            return this.setBottomTextList([])
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.getRewardStatus = function() {
            return r.Message.getFieldWithDefault(this, 4, 0)
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.setRewardStatus = function(e) {
            return r.Message.setProto3EnumField(this, 4, e)
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.getCurrentValue = function() {
            return r.Message.getFieldWithDefault(this, 5, "0")
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.setCurrentValue = function(e) {
            return r.Message.setProto3StringIntField(this, 5, e)
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.getTargetValue = function() {
            return r.Message.getFieldWithDefault(this, 6, "0")
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.setTargetValue = function(e) {
            return r.Message.setProto3StringIntField(this, 6, e)
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.getJumpSchema = function() {
            return r.Message.getFieldWithDefault(this, 7, "")
        }
        ,
        proto.webcast.data.ProgressBarStage.prototype.setJumpSchema = function(e) {
            return r.Message.setProto3StringField(this, 7, e)
        }
        ,
        proto.webcast.data.MultiStageProgressBar.repeatedFields_ = [3],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.MultiStageProgressBar.prototype.toObject = function(e) {
            return proto.webcast.data.MultiStageProgressBar.toObject(e, this)
        }
        ,
        proto.webcast.data.MultiStageProgressBar.toObject = function(e, t) {
            var a, o = {
                progressColor: r.Message.getFieldWithDefault(t, 1, ""),
                progressBackgroundColor: r.Message.getFieldWithDefault(t, 2, ""),
                stageListList: r.Message.toObjectList(t.getStageListList(), proto.webcast.data.ProgressBarStage.toObject, e),
                cardBackgroundColor: r.Message.getFieldWithDefault(t, 4, ""),
                cardBackgroundIcon: (a = t.getCardBackgroundIcon()) && s.Image.toObject(e, a),
                completedStage: r.Message.getFieldWithDefault(t, 6, "0")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.MultiStageProgressBar.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.MultiStageProgressBar;
            return proto.webcast.data.MultiStageProgressBar.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.MultiStageProgressBar.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setProgressColor(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setProgressBackgroundColor(a);
                    break;
                case 3:
                    a = new proto.webcast.data.ProgressBarStage;
                    t.readMessage(a, proto.webcast.data.ProgressBarStage.deserializeBinaryFromReader),
                    e.addStageList(a);
                    break;
                case 4:
                    a = t.readString();
                    e.setCardBackgroundColor(a);
                    break;
                case 5:
                    a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setCardBackgroundIcon(a);
                    break;
                case 6:
                    a = t.readInt64String();
                    e.setCompletedStage(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.MultiStageProgressBar.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.MultiStageProgressBar.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.MultiStageProgressBar.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getProgressColor()).length > 0 && t.writeString(1, a),
            (a = e.getProgressBackgroundColor()).length > 0 && t.writeString(2, a),
            (a = e.getStageListList()).length > 0 && t.writeRepeatedMessage(3, a, proto.webcast.data.ProgressBarStage.serializeBinaryToWriter),
            (a = e.getCardBackgroundColor()).length > 0 && t.writeString(4, a),
            null != (a = e.getCardBackgroundIcon()) && t.writeMessage(5, a, s.Image.serializeBinaryToWriter),
            a = e.getCompletedStage(),
            0 !== parseInt(a, 10) && t.writeInt64String(6, a)
        }
        ,
        proto.webcast.data.MultiStageProgressBar.prototype.getProgressColor = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.MultiStageProgressBar.prototype.setProgressColor = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.MultiStageProgressBar.prototype.getProgressBackgroundColor = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.MultiStageProgressBar.prototype.setProgressBackgroundColor = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.MultiStageProgressBar.prototype.getStageListList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.ProgressBarStage, 3)
        }
        ,
        proto.webcast.data.MultiStageProgressBar.prototype.setStageListList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.MultiStageProgressBar.prototype.addStageList = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 3, e, proto.webcast.data.ProgressBarStage, t)
        }
        ,
        proto.webcast.data.MultiStageProgressBar.prototype.clearStageListList = function() {
            return this.setStageListList([])
        }
        ,
        proto.webcast.data.MultiStageProgressBar.prototype.getCardBackgroundColor = function() {
            return r.Message.getFieldWithDefault(this, 4, "")
        }
        ,
        proto.webcast.data.MultiStageProgressBar.prototype.setCardBackgroundColor = function(e) {
            return r.Message.setProto3StringField(this, 4, e)
        }
        ,
        proto.webcast.data.MultiStageProgressBar.prototype.getCardBackgroundIcon = function() {
            return r.Message.getWrapperField(this, s.Image, 5)
        }
        ,
        proto.webcast.data.MultiStageProgressBar.prototype.setCardBackgroundIcon = function(e) {
            return r.Message.setWrapperField(this, 5, e)
        }
        ,
        proto.webcast.data.MultiStageProgressBar.prototype.clearCardBackgroundIcon = function() {
            return this.setCardBackgroundIcon(void 0)
        }
        ,
        proto.webcast.data.MultiStageProgressBar.prototype.hasCardBackgroundIcon = function() {
            return null != r.Message.getField(this, 5)
        }
        ,
        proto.webcast.data.MultiStageProgressBar.prototype.getCompletedStage = function() {
            return r.Message.getFieldWithDefault(this, 6, "0")
        }
        ,
        proto.webcast.data.MultiStageProgressBar.prototype.setCompletedStage = function(e) {
            return r.Message.setProto3StringIntField(this, 6, e)
        }
        ,
        proto.webcast.data.TouchButton.repeatedFields_ = [1],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TouchButton.prototype.toObject = function(e) {
            return proto.webcast.data.TouchButton.toObject(e, this)
        }
        ,
        proto.webcast.data.TouchButton.toObject = function(e, t) {
            var a, o = {
                textList: r.Message.toObjectList(t.getTextList(), proto.webcast.data.RichText.toObject, e),
                bgImg: (a = t.getBgImg()) && s.Image.toObject(e, a),
                jumpUrl: r.Message.getFieldWithDefault(t, 3, ""),
                buttonType: r.Message.getFieldWithDefault(t, 4, "0")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.TouchButton.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TouchButton;
            return proto.webcast.data.TouchButton.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TouchButton.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new proto.webcast.data.RichText;
                    t.readMessage(a, proto.webcast.data.RichText.deserializeBinaryFromReader),
                    e.addText(a);
                    break;
                case 2:
                    a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setBgImg(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setJumpUrl(a);
                    break;
                case 4:
                    a = t.readInt64String();
                    e.setButtonType(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TouchButton.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TouchButton.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TouchButton.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getTextList()).length > 0 && t.writeRepeatedMessage(1, a, proto.webcast.data.RichText.serializeBinaryToWriter),
            null != (a = e.getBgImg()) && t.writeMessage(2, a, s.Image.serializeBinaryToWriter),
            (a = e.getJumpUrl()).length > 0 && t.writeString(3, a),
            a = e.getButtonType(),
            0 !== parseInt(a, 10) && t.writeInt64String(4, a)
        }
        ,
        proto.webcast.data.TouchButton.prototype.getTextList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.RichText, 1)
        }
        ,
        proto.webcast.data.TouchButton.prototype.setTextList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.TouchButton.prototype.addText = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 1, e, proto.webcast.data.RichText, t)
        }
        ,
        proto.webcast.data.TouchButton.prototype.clearTextList = function() {
            return this.setTextList([])
        }
        ,
        proto.webcast.data.TouchButton.prototype.getBgImg = function() {
            return r.Message.getWrapperField(this, s.Image, 2)
        }
        ,
        proto.webcast.data.TouchButton.prototype.setBgImg = function(e) {
            return r.Message.setWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.TouchButton.prototype.clearBgImg = function() {
            return this.setBgImg(void 0)
        }
        ,
        proto.webcast.data.TouchButton.prototype.hasBgImg = function() {
            return null != r.Message.getField(this, 2)
        }
        ,
        proto.webcast.data.TouchButton.prototype.getJumpUrl = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.TouchButton.prototype.setJumpUrl = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.TouchButton.prototype.getButtonType = function() {
            return r.Message.getFieldWithDefault(this, 4, "0")
        }
        ,
        proto.webcast.data.TouchButton.prototype.setButtonType = function(e) {
            return r.Message.setProto3StringIntField(this, 4, e)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.repeatedFields_ = [2, 3],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.GiftPanelTopDetail.prototype.toObject = function(e) {
            return proto.webcast.data.GiftPanelTopDetail.toObject(e, this)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.toObject = function(e, t) {
            var a, o = {
                icon: (a = t.getIcon()) && s.Image.toObject(e, a),
                mainTextList: r.Message.toObjectList(t.getMainTextList(), proto.webcast.data.RichText.toObject, e),
                deputyTextList: r.Message.toObjectList(t.getDeputyTextList(), proto.webcast.data.RichText.toObject, e),
                progressBar: (a = t.getProgressBar()) && proto.webcast.data.ProgressBar.toObject(e, a),
                button: (a = t.getButton()) && proto.webcast.data.TouchButton.toObject(e, a),
                bgImg: (a = t.getBgImg()) && s.Image.toObject(e, a),
                mainTextBgAttr: r.Message.getFieldWithDefault(t, 7, "")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.GiftPanelTopDetail.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.GiftPanelTopDetail;
            return proto.webcast.data.GiftPanelTopDetail.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setIcon(a);
                    break;
                case 2:
                    a = new proto.webcast.data.RichText;
                    t.readMessage(a, proto.webcast.data.RichText.deserializeBinaryFromReader),
                    e.addMainText(a);
                    break;
                case 3:
                    a = new proto.webcast.data.RichText;
                    t.readMessage(a, proto.webcast.data.RichText.deserializeBinaryFromReader),
                    e.addDeputyText(a);
                    break;
                case 4:
                    a = new proto.webcast.data.ProgressBar;
                    t.readMessage(a, proto.webcast.data.ProgressBar.deserializeBinaryFromReader),
                    e.setProgressBar(a);
                    break;
                case 5:
                    a = new proto.webcast.data.TouchButton;
                    t.readMessage(a, proto.webcast.data.TouchButton.deserializeBinaryFromReader),
                    e.setButton(a);
                    break;
                case 6:
                    a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setBgImg(a);
                    break;
                case 7:
                    a = t.readString();
                    e.setMainTextBgAttr(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.GiftPanelTopDetail.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            null != (a = e.getIcon()) && t.writeMessage(1, a, s.Image.serializeBinaryToWriter),
            (a = e.getMainTextList()).length > 0 && t.writeRepeatedMessage(2, a, proto.webcast.data.RichText.serializeBinaryToWriter),
            (a = e.getDeputyTextList()).length > 0 && t.writeRepeatedMessage(3, a, proto.webcast.data.RichText.serializeBinaryToWriter),
            null != (a = e.getProgressBar()) && t.writeMessage(4, a, proto.webcast.data.ProgressBar.serializeBinaryToWriter),
            null != (a = e.getButton()) && t.writeMessage(5, a, proto.webcast.data.TouchButton.serializeBinaryToWriter),
            null != (a = e.getBgImg()) && t.writeMessage(6, a, s.Image.serializeBinaryToWriter),
            (a = e.getMainTextBgAttr()).length > 0 && t.writeString(7, a)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.getIcon = function() {
            return r.Message.getWrapperField(this, s.Image, 1)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.setIcon = function(e) {
            return r.Message.setWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.clearIcon = function() {
            return this.setIcon(void 0)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.hasIcon = function() {
            return null != r.Message.getField(this, 1)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.getMainTextList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.RichText, 2)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.setMainTextList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.addMainText = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 2, e, proto.webcast.data.RichText, t)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.clearMainTextList = function() {
            return this.setMainTextList([])
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.getDeputyTextList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.RichText, 3)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.setDeputyTextList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.addDeputyText = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 3, e, proto.webcast.data.RichText, t)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.clearDeputyTextList = function() {
            return this.setDeputyTextList([])
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.getProgressBar = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.ProgressBar, 4)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.setProgressBar = function(e) {
            return r.Message.setWrapperField(this, 4, e)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.clearProgressBar = function() {
            return this.setProgressBar(void 0)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.hasProgressBar = function() {
            return null != r.Message.getField(this, 4)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.getButton = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TouchButton, 5)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.setButton = function(e) {
            return r.Message.setWrapperField(this, 5, e)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.clearButton = function() {
            return this.setButton(void 0)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.hasButton = function() {
            return null != r.Message.getField(this, 5)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.getBgImg = function() {
            return r.Message.getWrapperField(this, s.Image, 6)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.setBgImg = function(e) {
            return r.Message.setWrapperField(this, 6, e)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.clearBgImg = function() {
            return this.setBgImg(void 0)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.hasBgImg = function() {
            return null != r.Message.getField(this, 6)
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.getMainTextBgAttr = function() {
            return r.Message.getFieldWithDefault(this, 7, "")
        }
        ,
        proto.webcast.data.GiftPanelTopDetail.prototype.setMainTextBgAttr = function(e) {
            return r.Message.setProto3StringField(this, 7, e)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.repeatedFields_ = [1, 3, 6],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.DiamondListBannerDetail.prototype.toObject = function(e) {
            return proto.webcast.data.DiamondListBannerDetail.toObject(e, this)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.toObject = function(e, t) {
            var a, o = {
                mainTextList: r.Message.toObjectList(t.getMainTextList(), proto.webcast.data.RichText.toObject, e),
                mainTextButton: (a = t.getMainTextButton()) && proto.webcast.data.TouchButton.toObject(e, a),
                deputyTextList: r.Message.toObjectList(t.getDeputyTextList(), proto.webcast.data.RichText.toObject, e),
                bgImg: (a = t.getBgImg()) && s.Image.toObject(e, a),
                progressBar: (a = t.getProgressBar()) && proto.webcast.data.ProgressBar.toObject(e, a),
                upperRightTextList: r.Message.toObjectList(t.getUpperRightTextList(), proto.webcast.data.RichText.toObject, e)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.DiamondListBannerDetail.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.DiamondListBannerDetail;
            return proto.webcast.data.DiamondListBannerDetail.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new proto.webcast.data.RichText;
                    t.readMessage(a, proto.webcast.data.RichText.deserializeBinaryFromReader),
                    e.addMainText(a);
                    break;
                case 2:
                    a = new proto.webcast.data.TouchButton;
                    t.readMessage(a, proto.webcast.data.TouchButton.deserializeBinaryFromReader),
                    e.setMainTextButton(a);
                    break;
                case 3:
                    a = new proto.webcast.data.RichText;
                    t.readMessage(a, proto.webcast.data.RichText.deserializeBinaryFromReader),
                    e.addDeputyText(a);
                    break;
                case 4:
                    a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setBgImg(a);
                    break;
                case 5:
                    a = new proto.webcast.data.ProgressBar;
                    t.readMessage(a, proto.webcast.data.ProgressBar.deserializeBinaryFromReader),
                    e.setProgressBar(a);
                    break;
                case 6:
                    a = new proto.webcast.data.RichText;
                    t.readMessage(a, proto.webcast.data.RichText.deserializeBinaryFromReader),
                    e.addUpperRightText(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.DiamondListBannerDetail.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getMainTextList()).length > 0 && t.writeRepeatedMessage(1, a, proto.webcast.data.RichText.serializeBinaryToWriter),
            null != (a = e.getMainTextButton()) && t.writeMessage(2, a, proto.webcast.data.TouchButton.serializeBinaryToWriter),
            (a = e.getDeputyTextList()).length > 0 && t.writeRepeatedMessage(3, a, proto.webcast.data.RichText.serializeBinaryToWriter),
            null != (a = e.getBgImg()) && t.writeMessage(4, a, s.Image.serializeBinaryToWriter),
            null != (a = e.getProgressBar()) && t.writeMessage(5, a, proto.webcast.data.ProgressBar.serializeBinaryToWriter),
            (a = e.getUpperRightTextList()).length > 0 && t.writeRepeatedMessage(6, a, proto.webcast.data.RichText.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.getMainTextList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.RichText, 1)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.setMainTextList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.addMainText = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 1, e, proto.webcast.data.RichText, t)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.clearMainTextList = function() {
            return this.setMainTextList([])
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.getMainTextButton = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TouchButton, 2)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.setMainTextButton = function(e) {
            return r.Message.setWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.clearMainTextButton = function() {
            return this.setMainTextButton(void 0)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.hasMainTextButton = function() {
            return null != r.Message.getField(this, 2)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.getDeputyTextList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.RichText, 3)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.setDeputyTextList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.addDeputyText = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 3, e, proto.webcast.data.RichText, t)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.clearDeputyTextList = function() {
            return this.setDeputyTextList([])
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.getBgImg = function() {
            return r.Message.getWrapperField(this, s.Image, 4)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.setBgImg = function(e) {
            return r.Message.setWrapperField(this, 4, e)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.clearBgImg = function() {
            return this.setBgImg(void 0)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.hasBgImg = function() {
            return null != r.Message.getField(this, 4)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.getProgressBar = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.ProgressBar, 5)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.setProgressBar = function(e) {
            return r.Message.setWrapperField(this, 5, e)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.clearProgressBar = function() {
            return this.setProgressBar(void 0)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.hasProgressBar = function() {
            return null != r.Message.getField(this, 5)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.getUpperRightTextList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.RichText, 6)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.setUpperRightTextList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 6, e)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.addUpperRightText = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 6, e, proto.webcast.data.RichText, t)
        }
        ,
        proto.webcast.data.DiamondListBannerDetail.prototype.clearUpperRightTextList = function() {
            return this.setUpperRightTextList([])
        }
        ,
        proto.webcast.data.CommonDetail.repeatedFields_ = [2, 3, 5, 6],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.CommonDetail.prototype.toObject = function(e) {
            return proto.webcast.data.CommonDetail.toObject(e, this)
        }
        ,
        proto.webcast.data.CommonDetail.toObject = function(e, t) {
            var a, o = {
                leftIcon: (a = t.getLeftIcon()) && s.Image.toObject(e, a),
                mainTextList: r.Message.toObjectList(t.getMainTextList(), proto.webcast.data.RichText.toObject, e),
                deputyTextList: r.Message.toObjectList(t.getDeputyTextList(), proto.webcast.data.RichText.toObject, e),
                rightButton: (a = t.getRightButton()) && proto.webcast.data.TouchButton.toObject(e, a),
                upperLeftTextList: r.Message.toObjectList(t.getUpperLeftTextList(), proto.webcast.data.RichText.toObject, e),
                mainTextDescList: r.Message.toObjectList(t.getMainTextDescList(), proto.webcast.data.RichText.toObject, e),
                progressBar: (a = t.getProgressBar()) && proto.webcast.data.ProgressBar.toObject(e, a),
                bgImg: (a = t.getBgImg()) && s.Image.toObject(e, a),
                multiStageProgressBar: (a = t.getMultiStageProgressBar()) && proto.webcast.data.MultiStageProgressBar.toObject(e, a)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.CommonDetail.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.CommonDetail;
            return proto.webcast.data.CommonDetail.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.CommonDetail.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setLeftIcon(a);
                    break;
                case 2:
                    a = new proto.webcast.data.RichText;
                    t.readMessage(a, proto.webcast.data.RichText.deserializeBinaryFromReader),
                    e.addMainText(a);
                    break;
                case 3:
                    a = new proto.webcast.data.RichText;
                    t.readMessage(a, proto.webcast.data.RichText.deserializeBinaryFromReader),
                    e.addDeputyText(a);
                    break;
                case 4:
                    a = new proto.webcast.data.TouchButton;
                    t.readMessage(a, proto.webcast.data.TouchButton.deserializeBinaryFromReader),
                    e.setRightButton(a);
                    break;
                case 5:
                    a = new proto.webcast.data.RichText;
                    t.readMessage(a, proto.webcast.data.RichText.deserializeBinaryFromReader),
                    e.addUpperLeftText(a);
                    break;
                case 6:
                    a = new proto.webcast.data.RichText;
                    t.readMessage(a, proto.webcast.data.RichText.deserializeBinaryFromReader),
                    e.addMainTextDesc(a);
                    break;
                case 255:
                    a = new proto.webcast.data.ProgressBar;
                    t.readMessage(a, proto.webcast.data.ProgressBar.deserializeBinaryFromReader),
                    e.setProgressBar(a);
                    break;
                case 256:
                    a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setBgImg(a);
                    break;
                case 257:
                    a = new proto.webcast.data.MultiStageProgressBar;
                    t.readMessage(a, proto.webcast.data.MultiStageProgressBar.deserializeBinaryFromReader),
                    e.setMultiStageProgressBar(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.CommonDetail.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.CommonDetail.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.CommonDetail.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            null != (a = e.getLeftIcon()) && t.writeMessage(1, a, s.Image.serializeBinaryToWriter),
            (a = e.getMainTextList()).length > 0 && t.writeRepeatedMessage(2, a, proto.webcast.data.RichText.serializeBinaryToWriter),
            (a = e.getDeputyTextList()).length > 0 && t.writeRepeatedMessage(3, a, proto.webcast.data.RichText.serializeBinaryToWriter),
            null != (a = e.getRightButton()) && t.writeMessage(4, a, proto.webcast.data.TouchButton.serializeBinaryToWriter),
            (a = e.getUpperLeftTextList()).length > 0 && t.writeRepeatedMessage(5, a, proto.webcast.data.RichText.serializeBinaryToWriter),
            (a = e.getMainTextDescList()).length > 0 && t.writeRepeatedMessage(6, a, proto.webcast.data.RichText.serializeBinaryToWriter),
            null != (a = e.getProgressBar()) && t.writeMessage(255, a, proto.webcast.data.ProgressBar.serializeBinaryToWriter),
            null != (a = e.getBgImg()) && t.writeMessage(256, a, s.Image.serializeBinaryToWriter),
            null != (a = e.getMultiStageProgressBar()) && t.writeMessage(257, a, proto.webcast.data.MultiStageProgressBar.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.getLeftIcon = function() {
            return r.Message.getWrapperField(this, s.Image, 1)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.setLeftIcon = function(e) {
            return r.Message.setWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.clearLeftIcon = function() {
            return this.setLeftIcon(void 0)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.hasLeftIcon = function() {
            return null != r.Message.getField(this, 1)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.getMainTextList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.RichText, 2)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.setMainTextList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.addMainText = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 2, e, proto.webcast.data.RichText, t)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.clearMainTextList = function() {
            return this.setMainTextList([])
        }
        ,
        proto.webcast.data.CommonDetail.prototype.getDeputyTextList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.RichText, 3)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.setDeputyTextList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.addDeputyText = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 3, e, proto.webcast.data.RichText, t)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.clearDeputyTextList = function() {
            return this.setDeputyTextList([])
        }
        ,
        proto.webcast.data.CommonDetail.prototype.getRightButton = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TouchButton, 4)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.setRightButton = function(e) {
            return r.Message.setWrapperField(this, 4, e)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.clearRightButton = function() {
            return this.setRightButton(void 0)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.hasRightButton = function() {
            return null != r.Message.getField(this, 4)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.getUpperLeftTextList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.RichText, 5)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.setUpperLeftTextList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 5, e)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.addUpperLeftText = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 5, e, proto.webcast.data.RichText, t)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.clearUpperLeftTextList = function() {
            return this.setUpperLeftTextList([])
        }
        ,
        proto.webcast.data.CommonDetail.prototype.getMainTextDescList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.RichText, 6)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.setMainTextDescList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 6, e)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.addMainTextDesc = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 6, e, proto.webcast.data.RichText, t)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.clearMainTextDescList = function() {
            return this.setMainTextDescList([])
        }
        ,
        proto.webcast.data.CommonDetail.prototype.getProgressBar = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.ProgressBar, 255)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.setProgressBar = function(e) {
            return r.Message.setWrapperField(this, 255, e)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.clearProgressBar = function() {
            return this.setProgressBar(void 0)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.hasProgressBar = function() {
            return null != r.Message.getField(this, 255)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.getBgImg = function() {
            return r.Message.getWrapperField(this, s.Image, 256)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.setBgImg = function(e) {
            return r.Message.setWrapperField(this, 256, e)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.clearBgImg = function() {
            return this.setBgImg(void 0)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.hasBgImg = function() {
            return null != r.Message.getField(this, 256)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.getMultiStageProgressBar = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.MultiStageProgressBar, 257)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.setMultiStageProgressBar = function(e) {
            return r.Message.setWrapperField(this, 257, e)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.clearMultiStageProgressBar = function() {
            return this.setMultiStageProgressBar(void 0)
        }
        ,
        proto.webcast.data.CommonDetail.prototype.hasMultiStageProgressBar = function() {
            return null != r.Message.getField(this, 257)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TreasureDetail.prototype.toObject = function(e) {
            return proto.webcast.data.TreasureDetail.toObject(e, this)
        }
        ,
        proto.webcast.data.TreasureDetail.toObject = function(e, t) {
            var a = {
                key: r.Message.getFieldWithDefault(t, 1, ""),
                content: r.Message.getFieldWithDefault(t, 2, ""),
                countDown: r.Message.getFieldWithDefault(t, 3, "0"),
                triggerTiming: r.Message.getFieldWithDefault(t, 4, 0),
                countDownKey: r.Message.getFieldWithDefault(t, 5, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.TreasureDetail.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TreasureDetail;
            return proto.webcast.data.TreasureDetail.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TreasureDetail.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setKey(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setContent(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setCountDown(a);
                    break;
                case 4:
                    a = t.readEnum();
                    e.setTriggerTiming(a);
                    break;
                case 5:
                    a = t.readString();
                    e.setCountDownKey(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TreasureDetail.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TreasureDetail.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TreasureDetail.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getKey()).length > 0 && t.writeString(1, a),
            (a = e.getContent()).length > 0 && t.writeString(2, a),
            a = e.getCountDown(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a),
            0 !== (a = e.getTriggerTiming()) && t.writeEnum(4, a),
            (a = e.getCountDownKey()).length > 0 && t.writeString(5, a)
        }
        ,
        proto.webcast.data.TreasureDetail.TriggerTiming = {
            DEFAULT: 0,
            ENTERROOM: 1,
            CLOSETASKPANEL: 2,
            FINISHTASK: 3
        },
        proto.webcast.data.TreasureDetail.prototype.getKey = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.TreasureDetail.prototype.setKey = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.TreasureDetail.prototype.getContent = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.TreasureDetail.prototype.setContent = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.TreasureDetail.prototype.getCountDown = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.TreasureDetail.prototype.setCountDown = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        proto.webcast.data.TreasureDetail.prototype.getTriggerTiming = function() {
            return r.Message.getFieldWithDefault(this, 4, 0)
        }
        ,
        proto.webcast.data.TreasureDetail.prototype.setTriggerTiming = function(e) {
            return r.Message.setProto3EnumField(this, 4, e)
        }
        ,
        proto.webcast.data.TreasureDetail.prototype.getCountDownKey = function() {
            return r.Message.getFieldWithDefault(this, 5, "")
        }
        ,
        proto.webcast.data.TreasureDetail.prototype.setCountDownKey = function(e) {
            return r.Message.setProto3StringField(this, 5, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.LightInfo.prototype.toObject = function(e) {
            return proto.webcast.data.LightInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.LightInfo.toObject = function(e, t) {
            var a, o = {
                isOn: r.Message.getBooleanFieldWithDefault(t, 1, !1),
                image: (a = t.getImage()) && s.Image.toObject(e, a)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.LightInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.LightInfo;
            return proto.webcast.data.LightInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.LightInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readBool();
                    e.setIsOn(a);
                    break;
                case 2:
                    a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setImage(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.LightInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.LightInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.LightInfo.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getIsOn()) && t.writeBool(1, a),
            null != (a = e.getImage()) && t.writeMessage(2, a, s.Image.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.LightInfo.prototype.getIsOn = function() {
            return r.Message.getBooleanFieldWithDefault(this, 1, !1)
        }
        ,
        proto.webcast.data.LightInfo.prototype.setIsOn = function(e) {
            return r.Message.setProto3BooleanField(this, 1, e)
        }
        ,
        proto.webcast.data.LightInfo.prototype.getImage = function() {
            return r.Message.getWrapperField(this, s.Image, 2)
        }
        ,
        proto.webcast.data.LightInfo.prototype.setImage = function(e) {
            return r.Message.setWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.LightInfo.prototype.clearImage = function() {
            return this.setImage(void 0)
        }
        ,
        proto.webcast.data.LightInfo.prototype.hasImage = function() {
            return null != r.Message.getField(this, 2)
        }
        ,
        proto.webcast.data.DynamicInfo.repeatedFields_ = [2],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.DynamicInfo.prototype.toObject = function(e) {
            return proto.webcast.data.DynamicInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.DynamicInfo.toObject = function(e, t) {
            var a = {
                showAfterTimeMs: r.Message.getFieldWithDefault(t, 1, 0),
                textList: r.Message.toObjectList(t.getTextList(), proto.webcast.data.RichText.toObject, e),
                durationMs: r.Message.getFieldWithDefault(t, 3, "0")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.DynamicInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.DynamicInfo;
            return proto.webcast.data.DynamicInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.DynamicInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64();
                    e.setShowAfterTimeMs(a);
                    break;
                case 2:
                    a = new proto.webcast.data.RichText;
                    t.readMessage(a, proto.webcast.data.RichText.deserializeBinaryFromReader),
                    e.addText(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setDurationMs(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.DynamicInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.DynamicInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.DynamicInfo.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getShowAfterTimeMs()) && t.writeInt64(1, a),
            (a = e.getTextList()).length > 0 && t.writeRepeatedMessage(2, a, proto.webcast.data.RichText.serializeBinaryToWriter),
            a = e.getDurationMs(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a)
        }
        ,
        proto.webcast.data.DynamicInfo.prototype.getShowAfterTimeMs = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.DynamicInfo.prototype.setShowAfterTimeMs = function(e) {
            return r.Message.setProto3IntField(this, 1, e)
        }
        ,
        proto.webcast.data.DynamicInfo.prototype.getTextList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.RichText, 2)
        }
        ,
        proto.webcast.data.DynamicInfo.prototype.setTextList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.DynamicInfo.prototype.addText = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 2, e, proto.webcast.data.RichText, t)
        }
        ,
        proto.webcast.data.DynamicInfo.prototype.clearTextList = function() {
            return this.setTextList([])
        }
        ,
        proto.webcast.data.DynamicInfo.prototype.getDurationMs = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.DynamicInfo.prototype.setDurationMs = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.repeatedFields_ = [1, 3, 6],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.GiftPanelEntranceDetail.prototype.toObject = function(e) {
            return proto.webcast.data.GiftPanelEntranceDetail.toObject(e, this)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.toObject = function(e, t) {
            var a, o = {
                panelDetailList: r.Message.toObjectList(t.getPanelDetailList(), proto.webcast.data.RichText.toObject, e),
                panelUrl: r.Message.getFieldWithDefault(t, 2, ""),
                bubbleTextList: r.Message.toObjectList(t.getBubbleTextList(), proto.webcast.data.RichText.toObject, e),
                bubbleBackgroundImg: (a = t.getBubbleBackgroundImg()) && s.Image.toObject(e, a),
                bubbleUrl: r.Message.getFieldWithDefault(t, 5, ""),
                awardTipsList: r.Message.toObjectList(t.getAwardTipsList(), proto.webcast.data.RichText.toObject, e),
                lightInfo: (a = t.getLightInfo()) && proto.webcast.data.LightInfo.toObject(e, a),
                dynamicInfo: (a = t.getDynamicInfo()) && proto.webcast.data.DynamicInfo.toObject(e, a),
                extraMap: (a = t.getExtraMap()) ? a.toObject(e, void 0) : []
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.GiftPanelEntranceDetail.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.GiftPanelEntranceDetail;
            return proto.webcast.data.GiftPanelEntranceDetail.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new proto.webcast.data.RichText;
                    t.readMessage(a, proto.webcast.data.RichText.deserializeBinaryFromReader),
                    e.addPanelDetail(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setPanelUrl(a);
                    break;
                case 3:
                    a = new proto.webcast.data.RichText;
                    t.readMessage(a, proto.webcast.data.RichText.deserializeBinaryFromReader),
                    e.addBubbleText(a);
                    break;
                case 4:
                    a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setBubbleBackgroundImg(a);
                    break;
                case 5:
                    a = t.readString();
                    e.setBubbleUrl(a);
                    break;
                case 6:
                    a = new proto.webcast.data.RichText;
                    t.readMessage(a, proto.webcast.data.RichText.deserializeBinaryFromReader),
                    e.addAwardTips(a);
                    break;
                case 7:
                    a = new proto.webcast.data.LightInfo;
                    t.readMessage(a, proto.webcast.data.LightInfo.deserializeBinaryFromReader),
                    e.setLightInfo(a);
                    break;
                case 8:
                    a = new proto.webcast.data.DynamicInfo;
                    t.readMessage(a, proto.webcast.data.DynamicInfo.deserializeBinaryFromReader),
                    e.setDynamicInfo(a);
                    break;
                case 9:
                    a = e.getExtraMap();
                    t.readMessage(a, (function(e, t) {
                        r.Map.deserializeBinary(e, t, r.BinaryReader.prototype.readString, r.BinaryReader.prototype.readString, null, "", "")
                    }
                    ));
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.GiftPanelEntranceDetail.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getPanelDetailList()).length > 0 && t.writeRepeatedMessage(1, a, proto.webcast.data.RichText.serializeBinaryToWriter),
            (a = e.getPanelUrl()).length > 0 && t.writeString(2, a),
            (a = e.getBubbleTextList()).length > 0 && t.writeRepeatedMessage(3, a, proto.webcast.data.RichText.serializeBinaryToWriter),
            null != (a = e.getBubbleBackgroundImg()) && t.writeMessage(4, a, s.Image.serializeBinaryToWriter),
            (a = e.getBubbleUrl()).length > 0 && t.writeString(5, a),
            (a = e.getAwardTipsList()).length > 0 && t.writeRepeatedMessage(6, a, proto.webcast.data.RichText.serializeBinaryToWriter),
            null != (a = e.getLightInfo()) && t.writeMessage(7, a, proto.webcast.data.LightInfo.serializeBinaryToWriter),
            null != (a = e.getDynamicInfo()) && t.writeMessage(8, a, proto.webcast.data.DynamicInfo.serializeBinaryToWriter),
            (a = e.getExtraMap(!0)) && a.getLength() > 0 && a.serializeBinary(9, t, r.BinaryWriter.prototype.writeString, r.BinaryWriter.prototype.writeString)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.getPanelDetailList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.RichText, 1)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.setPanelDetailList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.addPanelDetail = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 1, e, proto.webcast.data.RichText, t)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.clearPanelDetailList = function() {
            return this.setPanelDetailList([])
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.getPanelUrl = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.setPanelUrl = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.getBubbleTextList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.RichText, 3)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.setBubbleTextList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.addBubbleText = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 3, e, proto.webcast.data.RichText, t)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.clearBubbleTextList = function() {
            return this.setBubbleTextList([])
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.getBubbleBackgroundImg = function() {
            return r.Message.getWrapperField(this, s.Image, 4)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.setBubbleBackgroundImg = function(e) {
            return r.Message.setWrapperField(this, 4, e)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.clearBubbleBackgroundImg = function() {
            return this.setBubbleBackgroundImg(void 0)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.hasBubbleBackgroundImg = function() {
            return null != r.Message.getField(this, 4)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.getBubbleUrl = function() {
            return r.Message.getFieldWithDefault(this, 5, "")
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.setBubbleUrl = function(e) {
            return r.Message.setProto3StringField(this, 5, e)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.getAwardTipsList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.RichText, 6)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.setAwardTipsList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 6, e)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.addAwardTips = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 6, e, proto.webcast.data.RichText, t)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.clearAwardTipsList = function() {
            return this.setAwardTipsList([])
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.getLightInfo = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.LightInfo, 7)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.setLightInfo = function(e) {
            return r.Message.setWrapperField(this, 7, e)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.clearLightInfo = function() {
            return this.setLightInfo(void 0)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.hasLightInfo = function() {
            return null != r.Message.getField(this, 7)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.getDynamicInfo = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.DynamicInfo, 8)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.setDynamicInfo = function(e) {
            return r.Message.setWrapperField(this, 8, e)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.clearDynamicInfo = function() {
            return this.setDynamicInfo(void 0)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.hasDynamicInfo = function() {
            return null != r.Message.getField(this, 8)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.getExtraMap = function(e) {
            return r.Message.getMapField(this, 9, e, null)
        }
        ,
        proto.webcast.data.GiftPanelEntranceDetail.prototype.clearExtraMap = function() {
            return this.getExtraMap().clear(),
            this
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.FreqCtrlParams.prototype.toObject = function(e) {
            return proto.webcast.data.FreqCtrlParams.toObject(e, this)
        }
        ,
        proto.webcast.data.FreqCtrlParams.toObject = function(e, t) {
            var a = {
                strategy: r.Message.getFieldWithDefault(t, 1, 0),
                limit: r.Message.getFieldWithDefault(t, 2, "0"),
                key: r.Message.getFieldWithDefault(t, 3, ""),
                cur: r.Message.getFieldWithDefault(t, 4, "0"),
                duration: r.Message.getFieldWithDefault(t, 5, "0")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.FreqCtrlParams.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.FreqCtrlParams;
            return proto.webcast.data.FreqCtrlParams.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.FreqCtrlParams.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readEnum();
                    e.setStrategy(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setLimit(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setKey(a);
                    break;
                case 4:
                    a = t.readInt64String();
                    e.setCur(a);
                    break;
                case 5:
                    a = t.readInt64String();
                    e.setDuration(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.FreqCtrlParams.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.FreqCtrlParams.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.FreqCtrlParams.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getStrategy()) && t.writeEnum(1, a),
            a = e.getLimit(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a),
            (a = e.getKey()).length > 0 && t.writeString(3, a),
            a = e.getCur(),
            0 !== parseInt(a, 10) && t.writeInt64String(4, a),
            a = e.getDuration(),
            0 !== parseInt(a, 10) && t.writeInt64String(5, a)
        }
        ,
        proto.webcast.data.FreqCtrlParams.prototype.getStrategy = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.FreqCtrlParams.prototype.setStrategy = function(e) {
            return r.Message.setProto3EnumField(this, 1, e)
        }
        ,
        proto.webcast.data.FreqCtrlParams.prototype.getLimit = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.FreqCtrlParams.prototype.setLimit = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        proto.webcast.data.FreqCtrlParams.prototype.getKey = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.FreqCtrlParams.prototype.setKey = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.FreqCtrlParams.prototype.getCur = function() {
            return r.Message.getFieldWithDefault(this, 4, "0")
        }
        ,
        proto.webcast.data.FreqCtrlParams.prototype.setCur = function(e) {
            return r.Message.setProto3StringIntField(this, 4, e)
        }
        ,
        proto.webcast.data.FreqCtrlParams.prototype.getDuration = function() {
            return r.Message.getFieldWithDefault(this, 5, "0")
        }
        ,
        proto.webcast.data.FreqCtrlParams.prototype.setDuration = function(e) {
            return r.Message.setProto3StringIntField(this, 5, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.RefreshParams.prototype.toObject = function(e) {
            return proto.webcast.data.RefreshParams.toObject(e, this)
        }
        ,
        proto.webcast.data.RefreshParams.toObject = function(e, t) {
            var a = {
                refreshMechanism: r.Message.getFieldWithDefault(t, 1, 0),
                pollingInterval: r.Message.getFieldWithDefault(t, 2, "0")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.RefreshParams.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.RefreshParams;
            return proto.webcast.data.RefreshParams.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.RefreshParams.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readEnum();
                    e.setRefreshMechanism(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setPollingInterval(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.RefreshParams.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.RefreshParams.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.RefreshParams.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getRefreshMechanism()) && t.writeEnum(1, a),
            a = e.getPollingInterval(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a)
        }
        ,
        proto.webcast.data.RefreshParams.prototype.getRefreshMechanism = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.RefreshParams.prototype.setRefreshMechanism = function(e) {
            return r.Message.setProto3EnumField(this, 1, e)
        }
        ,
        proto.webcast.data.RefreshParams.prototype.getPollingInterval = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.RefreshParams.prototype.setPollingInterval = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        proto.webcast.data.TouchPositionMeta.repeatedFields_ = [5, 7],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TouchPositionMeta.prototype.toObject = function(e) {
            return proto.webcast.data.TouchPositionMeta.toObject(e, this)
        }
        ,
        proto.webcast.data.TouchPositionMeta.toObject = function(e, t) {
            var a = {
                id: r.Message.getFieldWithDefault(t, 1, "0"),
                metaId: r.Message.getFieldWithDefault(t, 2, "0"),
                position: r.Message.getFieldWithDefault(t, 3, 0),
                template: r.Message.getFieldWithDefault(t, 4, "0"),
                freqCtrlParamsListList: r.Message.toObjectList(t.getFreqCtrlParamsListList(), proto.webcast.data.FreqCtrlParams.toObject, e),
                duration: r.Message.getFieldWithDefault(t, 6, "0"),
                refreshParamsListList: r.Message.toObjectList(t.getRefreshParamsListList(), proto.webcast.data.RefreshParams.toObject, e),
                priority: r.Message.getFieldWithDefault(t, 8, "0")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.TouchPositionMeta.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TouchPositionMeta;
            return proto.webcast.data.TouchPositionMeta.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TouchPositionMeta.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setId(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setMetaId(a);
                    break;
                case 3:
                    a = t.readEnum();
                    e.setPosition(a);
                    break;
                case 4:
                    a = t.readInt64String();
                    e.setTemplate(a);
                    break;
                case 5:
                    a = new proto.webcast.data.FreqCtrlParams;
                    t.readMessage(a, proto.webcast.data.FreqCtrlParams.deserializeBinaryFromReader),
                    e.addFreqCtrlParamsList(a);
                    break;
                case 6:
                    a = t.readInt64String();
                    e.setDuration(a);
                    break;
                case 7:
                    a = new proto.webcast.data.RefreshParams;
                    t.readMessage(a, proto.webcast.data.RefreshParams.deserializeBinaryFromReader),
                    e.addRefreshParamsList(a);
                    break;
                case 8:
                    a = t.readInt64String();
                    e.setPriority(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TouchPositionMeta.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TouchPositionMeta.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getId(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            a = e.getMetaId(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a),
            0 !== (a = e.getPosition()) && t.writeEnum(3, a),
            a = e.getTemplate(),
            0 !== parseInt(a, 10) && t.writeInt64String(4, a),
            (a = e.getFreqCtrlParamsListList()).length > 0 && t.writeRepeatedMessage(5, a, proto.webcast.data.FreqCtrlParams.serializeBinaryToWriter),
            a = e.getDuration(),
            0 !== parseInt(a, 10) && t.writeInt64String(6, a),
            (a = e.getRefreshParamsListList()).length > 0 && t.writeRepeatedMessage(7, a, proto.webcast.data.RefreshParams.serializeBinaryToWriter),
            a = e.getPriority(),
            0 !== parseInt(a, 10) && t.writeInt64String(8, a)
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.getId = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.setId = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.getMetaId = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.setMetaId = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.getPosition = function() {
            return r.Message.getFieldWithDefault(this, 3, 0)
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.setPosition = function(e) {
            return r.Message.setProto3EnumField(this, 3, e)
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.getTemplate = function() {
            return r.Message.getFieldWithDefault(this, 4, "0")
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.setTemplate = function(e) {
            return r.Message.setProto3StringIntField(this, 4, e)
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.getFreqCtrlParamsListList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.FreqCtrlParams, 5)
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.setFreqCtrlParamsListList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 5, e)
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.addFreqCtrlParamsList = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 5, e, proto.webcast.data.FreqCtrlParams, t)
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.clearFreqCtrlParamsListList = function() {
            return this.setFreqCtrlParamsListList([])
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.getDuration = function() {
            return r.Message.getFieldWithDefault(this, 6, "0")
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.setDuration = function(e) {
            return r.Message.setProto3StringIntField(this, 6, e)
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.getRefreshParamsListList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.RefreshParams, 7)
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.setRefreshParamsListList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 7, e)
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.addRefreshParamsList = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 7, e, proto.webcast.data.RefreshParams, t)
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.clearRefreshParamsListList = function() {
            return this.setRefreshParamsListList([])
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.getPriority = function() {
            return r.Message.getFieldWithDefault(this, 8, "0")
        }
        ,
        proto.webcast.data.TouchPositionMeta.prototype.setPriority = function(e) {
            return r.Message.setProto3StringIntField(this, 8, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TouchPositionDetail.prototype.toObject = function(e) {
            return proto.webcast.data.TouchPositionDetail.toObject(e, this)
        }
        ,
        proto.webcast.data.TouchPositionDetail.toObject = function(e, t) {
            var a, r = {
                giftPanelTopDetail: (a = t.getGiftPanelTopDetail()) && proto.webcast.data.GiftPanelTopDetail.toObject(e, a),
                diamondListBannerDetail: (a = t.getDiamondListBannerDetail()) && proto.webcast.data.DiamondListBannerDetail.toObject(e, a),
                commonDetail: (a = t.getCommonDetail()) && proto.webcast.data.CommonDetail.toObject(e, a),
                bannerDetail: (a = t.getBannerDetail()) && proto.webcast.data.BannerDetail.toObject(e, a),
                giftPanelEntranceDetail: (a = t.getGiftPanelEntranceDetail()) && proto.webcast.data.GiftPanelEntranceDetail.toObject(e, a)
            };
            return e && (r.$jspbMessageInstance = t),
            r
        }
        ),
        proto.webcast.data.TouchPositionDetail.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TouchPositionDetail;
            return proto.webcast.data.TouchPositionDetail.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TouchPositionDetail.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new proto.webcast.data.GiftPanelTopDetail;
                    t.readMessage(a, proto.webcast.data.GiftPanelTopDetail.deserializeBinaryFromReader),
                    e.setGiftPanelTopDetail(a);
                    break;
                case 2:
                    a = new proto.webcast.data.DiamondListBannerDetail;
                    t.readMessage(a, proto.webcast.data.DiamondListBannerDetail.deserializeBinaryFromReader),
                    e.setDiamondListBannerDetail(a);
                    break;
                case 3:
                    a = new proto.webcast.data.CommonDetail;
                    t.readMessage(a, proto.webcast.data.CommonDetail.deserializeBinaryFromReader),
                    e.setCommonDetail(a);
                    break;
                case 4:
                    a = new proto.webcast.data.BannerDetail;
                    t.readMessage(a, proto.webcast.data.BannerDetail.deserializeBinaryFromReader),
                    e.setBannerDetail(a);
                    break;
                case 5:
                    a = new proto.webcast.data.GiftPanelEntranceDetail;
                    t.readMessage(a, proto.webcast.data.GiftPanelEntranceDetail.deserializeBinaryFromReader),
                    e.setGiftPanelEntranceDetail(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TouchPositionDetail.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TouchPositionDetail.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            null != (a = e.getGiftPanelTopDetail()) && t.writeMessage(1, a, proto.webcast.data.GiftPanelTopDetail.serializeBinaryToWriter),
            null != (a = e.getDiamondListBannerDetail()) && t.writeMessage(2, a, proto.webcast.data.DiamondListBannerDetail.serializeBinaryToWriter),
            null != (a = e.getCommonDetail()) && t.writeMessage(3, a, proto.webcast.data.CommonDetail.serializeBinaryToWriter),
            null != (a = e.getBannerDetail()) && t.writeMessage(4, a, proto.webcast.data.BannerDetail.serializeBinaryToWriter),
            null != (a = e.getGiftPanelEntranceDetail()) && t.writeMessage(5, a, proto.webcast.data.GiftPanelEntranceDetail.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.getGiftPanelTopDetail = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.GiftPanelTopDetail, 1)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.setGiftPanelTopDetail = function(e) {
            return r.Message.setWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.clearGiftPanelTopDetail = function() {
            return this.setGiftPanelTopDetail(void 0)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.hasGiftPanelTopDetail = function() {
            return null != r.Message.getField(this, 1)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.getDiamondListBannerDetail = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.DiamondListBannerDetail, 2)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.setDiamondListBannerDetail = function(e) {
            return r.Message.setWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.clearDiamondListBannerDetail = function() {
            return this.setDiamondListBannerDetail(void 0)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.hasDiamondListBannerDetail = function() {
            return null != r.Message.getField(this, 2)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.getCommonDetail = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.CommonDetail, 3)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.setCommonDetail = function(e) {
            return r.Message.setWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.clearCommonDetail = function() {
            return this.setCommonDetail(void 0)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.hasCommonDetail = function() {
            return null != r.Message.getField(this, 3)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.getBannerDetail = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.BannerDetail, 4)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.setBannerDetail = function(e) {
            return r.Message.setWrapperField(this, 4, e)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.clearBannerDetail = function() {
            return this.setBannerDetail(void 0)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.hasBannerDetail = function() {
            return null != r.Message.getField(this, 4)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.getGiftPanelEntranceDetail = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.GiftPanelEntranceDetail, 5)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.setGiftPanelEntranceDetail = function(e) {
            return r.Message.setWrapperField(this, 5, e)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.clearGiftPanelEntranceDetail = function() {
            return this.setGiftPanelEntranceDetail(void 0)
        }
        ,
        proto.webcast.data.TouchPositionDetail.prototype.hasGiftPanelEntranceDetail = function() {
            return null != r.Message.getField(this, 5)
        }
        ,
        proto.webcast.data.BannerDetail.repeatedFields_ = [3],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.BannerDetail.prototype.toObject = function(e) {
            return proto.webcast.data.BannerDetail.toObject(e, this)
        }
        ,
        proto.webcast.data.BannerDetail.toObject = function(e, t) {
            var a, o = {
                role: r.Message.getFieldWithDefault(t, 1, ""),
                role2viewsMap: (a = t.getRole2viewsMap()) ? a.toObject(e, proto.webcast.data.View.toObject) : [],
                time2pictureList: r.Message.toObjectList(t.getTime2pictureList(), proto.webcast.data.Time2Picture.toObject, e)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.BannerDetail.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.BannerDetail;
            return proto.webcast.data.BannerDetail.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.BannerDetail.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setRole(a);
                    break;
                case 2:
                    a = e.getRole2viewsMap();
                    t.readMessage(a, (function(e, t) {
                        r.Map.deserializeBinary(e, t, r.BinaryReader.prototype.readString, r.BinaryReader.prototype.readMessage, proto.webcast.data.View.deserializeBinaryFromReader, "", new proto.webcast.data.View)
                    }
                    ));
                    break;
                case 3:
                    a = new proto.webcast.data.Time2Picture;
                    t.readMessage(a, proto.webcast.data.Time2Picture.deserializeBinaryFromReader),
                    e.addTime2picture(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.BannerDetail.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.BannerDetail.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.BannerDetail.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getRole()).length > 0 && t.writeString(1, a),
            (a = e.getRole2viewsMap(!0)) && a.getLength() > 0 && a.serializeBinary(2, t, r.BinaryWriter.prototype.writeString, r.BinaryWriter.prototype.writeMessage, proto.webcast.data.View.serializeBinaryToWriter),
            (a = e.getTime2pictureList()).length > 0 && t.writeRepeatedMessage(3, a, proto.webcast.data.Time2Picture.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.BannerDetail.prototype.getRole = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.BannerDetail.prototype.setRole = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.BannerDetail.prototype.getRole2viewsMap = function(e) {
            return r.Message.getMapField(this, 2, e, proto.webcast.data.View)
        }
        ,
        proto.webcast.data.BannerDetail.prototype.clearRole2viewsMap = function() {
            return this.getRole2viewsMap().clear(),
            this
        }
        ,
        proto.webcast.data.BannerDetail.prototype.getTime2pictureList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.Time2Picture, 3)
        }
        ,
        proto.webcast.data.BannerDetail.prototype.setTime2pictureList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.BannerDetail.prototype.addTime2picture = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 3, e, proto.webcast.data.Time2Picture, t)
        }
        ,
        proto.webcast.data.BannerDetail.prototype.clearTime2pictureList = function() {
            return this.setTime2pictureList([])
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.Time2Picture.prototype.toObject = function(e) {
            return proto.webcast.data.Time2Picture.toObject(e, this)
        }
        ,
        proto.webcast.data.Time2Picture.toObject = function(e, t) {
            var a = {
                startTime: r.Message.getFieldWithDefault(t, 1, "0"),
                endTime: r.Message.getFieldWithDefault(t, 2, "0"),
                pictureUrl: r.Message.getFieldWithDefault(t, 3, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.Time2Picture.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.Time2Picture;
            return proto.webcast.data.Time2Picture.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.Time2Picture.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setStartTime(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setEndTime(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setPictureUrl(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.Time2Picture.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.Time2Picture.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.Time2Picture.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getStartTime(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            a = e.getEndTime(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a),
            (a = e.getPictureUrl()).length > 0 && t.writeString(3, a)
        }
        ,
        proto.webcast.data.Time2Picture.prototype.getStartTime = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.Time2Picture.prototype.setStartTime = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.Time2Picture.prototype.getEndTime = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.Time2Picture.prototype.setEndTime = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        proto.webcast.data.Time2Picture.prototype.getPictureUrl = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.Time2Picture.prototype.setPictureUrl = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.View.repeatedFields_ = [1, 2],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.View.prototype.toObject = function(e) {
            return proto.webcast.data.View.toObject(e, this)
        }
        ,
        proto.webcast.data.View.toObject = function(e, t) {
            var a = {
                bannersList: r.Message.toObjectList(t.getBannersList(), proto.webcast.data.BannerView.toObject, e),
                feedbacksList: r.Message.toObjectList(t.getFeedbacksList(), proto.webcast.data.BannerFeedbackView.toObject, e),
                expireTime: r.Message.getFieldWithDefault(t, 3, "0")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.View.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.View;
            return proto.webcast.data.View.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.View.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new proto.webcast.data.BannerView;
                    t.readMessage(a, proto.webcast.data.BannerView.deserializeBinaryFromReader),
                    e.addBanners(a);
                    break;
                case 2:
                    a = new proto.webcast.data.BannerFeedbackView;
                    t.readMessage(a, proto.webcast.data.BannerFeedbackView.deserializeBinaryFromReader),
                    e.addFeedbacks(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setExpireTime(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.View.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.View.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.View.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getBannersList()).length > 0 && t.writeRepeatedMessage(1, a, proto.webcast.data.BannerView.serializeBinaryToWriter),
            (a = e.getFeedbacksList()).length > 0 && t.writeRepeatedMessage(2, a, proto.webcast.data.BannerFeedbackView.serializeBinaryToWriter),
            a = e.getExpireTime(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a)
        }
        ,
        proto.webcast.data.View.prototype.getBannersList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.BannerView, 1)
        }
        ,
        proto.webcast.data.View.prototype.setBannersList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.View.prototype.addBanners = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 1, e, proto.webcast.data.BannerView, t)
        }
        ,
        proto.webcast.data.View.prototype.clearBannersList = function() {
            return this.setBannersList([])
        }
        ,
        proto.webcast.data.View.prototype.getFeedbacksList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.BannerFeedbackView, 2)
        }
        ,
        proto.webcast.data.View.prototype.setFeedbacksList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.View.prototype.addFeedbacks = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 2, e, proto.webcast.data.BannerFeedbackView, t)
        }
        ,
        proto.webcast.data.View.prototype.clearFeedbacksList = function() {
            return this.setFeedbacksList([])
        }
        ,
        proto.webcast.data.View.prototype.getExpireTime = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.View.prototype.setExpireTime = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.BannerFeedbackView.prototype.toObject = function(e) {
            return proto.webcast.data.BannerFeedbackView.toObject(e, this)
        }
        ,
        proto.webcast.data.BannerFeedbackView.toObject = function(e, t) {
            var a, o = {
                component: r.Message.getFieldWithDefault(t, 1, ""),
                schemaUrl: r.Message.getFieldWithDefault(t, 2, ""),
                isKeepLast: r.Message.getBooleanFieldWithDefault(t, 3, !1),
                uniqueId: r.Message.getFieldWithDefault(t, 4, ""),
                feedbackProps: (a = t.getFeedbackProps()) && proto.webcast.data.FeedbackProps.toObject(e, a)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.BannerFeedbackView.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.BannerFeedbackView;
            return proto.webcast.data.BannerFeedbackView.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.BannerFeedbackView.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setComponent(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setSchemaUrl(a);
                    break;
                case 3:
                    a = t.readBool();
                    e.setIsKeepLast(a);
                    break;
                case 4:
                    a = t.readString();
                    e.setUniqueId(a);
                    break;
                case 100:
                    a = new proto.webcast.data.FeedbackProps;
                    t.readMessage(a, proto.webcast.data.FeedbackProps.deserializeBinaryFromReader),
                    e.setFeedbackProps(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.BannerFeedbackView.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.BannerFeedbackView.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.BannerFeedbackView.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getComponent()).length > 0 && t.writeString(1, a),
            (a = e.getSchemaUrl()).length > 0 && t.writeString(2, a),
            (a = e.getIsKeepLast()) && t.writeBool(3, a),
            (a = e.getUniqueId()).length > 0 && t.writeString(4, a),
            null != (a = e.getFeedbackProps()) && t.writeMessage(100, a, proto.webcast.data.FeedbackProps.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.BannerFeedbackView.prototype.getComponent = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.BannerFeedbackView.prototype.setComponent = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.BannerFeedbackView.prototype.getSchemaUrl = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.BannerFeedbackView.prototype.setSchemaUrl = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.BannerFeedbackView.prototype.getIsKeepLast = function() {
            return r.Message.getBooleanFieldWithDefault(this, 3, !1)
        }
        ,
        proto.webcast.data.BannerFeedbackView.prototype.setIsKeepLast = function(e) {
            return r.Message.setProto3BooleanField(this, 3, e)
        }
        ,
        proto.webcast.data.BannerFeedbackView.prototype.getUniqueId = function() {
            return r.Message.getFieldWithDefault(this, 4, "")
        }
        ,
        proto.webcast.data.BannerFeedbackView.prototype.setUniqueId = function(e) {
            return r.Message.setProto3StringField(this, 4, e)
        }
        ,
        proto.webcast.data.BannerFeedbackView.prototype.getFeedbackProps = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.FeedbackProps, 100)
        }
        ,
        proto.webcast.data.BannerFeedbackView.prototype.setFeedbackProps = function(e) {
            return r.Message.setWrapperField(this, 100, e)
        }
        ,
        proto.webcast.data.BannerFeedbackView.prototype.clearFeedbackProps = function() {
            return this.setFeedbackProps(void 0)
        }
        ,
        proto.webcast.data.BannerFeedbackView.prototype.hasFeedbackProps = function() {
            return null != r.Message.getField(this, 100)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.FeedbackProps.prototype.toObject = function(e) {
            return proto.webcast.data.FeedbackProps.toObject(e, this)
        }
        ,
        proto.webcast.data.FeedbackProps.toObject = function(e, t) {
            var a = {
                feedbackImage: r.Message.getFieldWithDefault(t, 1, ""),
                height: r.Message.getFieldWithDefault(t, 2, "0")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.FeedbackProps.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.FeedbackProps;
            return proto.webcast.data.FeedbackProps.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.FeedbackProps.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setFeedbackImage(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setHeight(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.FeedbackProps.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.FeedbackProps.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.FeedbackProps.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getFeedbackImage()).length > 0 && t.writeString(1, a),
            a = e.getHeight(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a)
        }
        ,
        proto.webcast.data.FeedbackProps.prototype.getFeedbackImage = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.FeedbackProps.prototype.setFeedbackImage = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.FeedbackProps.prototype.getHeight = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.FeedbackProps.prototype.setHeight = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.BannerView.prototype.toObject = function(e) {
            return proto.webcast.data.BannerView.toObject(e, this)
        }
        ,
        proto.webcast.data.BannerView.toObject = function(e, t) {
            var a, o = {
                component: r.Message.getFieldWithDefault(t, 1, ""),
                schemaUrl: r.Message.getFieldWithDefault(t, 2, ""),
                isKeepLast: r.Message.getBooleanFieldWithDefault(t, 3, !1),
                subBannerId: r.Message.getFieldWithDefault(t, 4, "0"),
                taskProps: (a = t.getTaskProps()) && proto.webcast.data.TaskProps.toObject(e, a)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.BannerView.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.BannerView;
            return proto.webcast.data.BannerView.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.BannerView.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setComponent(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setSchemaUrl(a);
                    break;
                case 3:
                    a = t.readBool();
                    e.setIsKeepLast(a);
                    break;
                case 4:
                    a = t.readInt64String();
                    e.setSubBannerId(a);
                    break;
                case 100:
                    a = new proto.webcast.data.TaskProps;
                    t.readMessage(a, proto.webcast.data.TaskProps.deserializeBinaryFromReader),
                    e.setTaskProps(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.BannerView.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.BannerView.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.BannerView.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getComponent()).length > 0 && t.writeString(1, a),
            (a = e.getSchemaUrl()).length > 0 && t.writeString(2, a),
            (a = e.getIsKeepLast()) && t.writeBool(3, a),
            a = e.getSubBannerId(),
            0 !== parseInt(a, 10) && t.writeInt64String(4, a),
            null != (a = e.getTaskProps()) && t.writeMessage(100, a, proto.webcast.data.TaskProps.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.BannerView.prototype.getComponent = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.BannerView.prototype.setComponent = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.BannerView.prototype.getSchemaUrl = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.BannerView.prototype.setSchemaUrl = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.BannerView.prototype.getIsKeepLast = function() {
            return r.Message.getBooleanFieldWithDefault(this, 3, !1)
        }
        ,
        proto.webcast.data.BannerView.prototype.setIsKeepLast = function(e) {
            return r.Message.setProto3BooleanField(this, 3, e)
        }
        ,
        proto.webcast.data.BannerView.prototype.getSubBannerId = function() {
            return r.Message.getFieldWithDefault(this, 4, "0")
        }
        ,
        proto.webcast.data.BannerView.prototype.setSubBannerId = function(e) {
            return r.Message.setProto3StringIntField(this, 4, e)
        }
        ,
        proto.webcast.data.BannerView.prototype.getTaskProps = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TaskProps, 100)
        }
        ,
        proto.webcast.data.BannerView.prototype.setTaskProps = function(e) {
            return r.Message.setWrapperField(this, 100, e)
        }
        ,
        proto.webcast.data.BannerView.prototype.clearTaskProps = function() {
            return this.setTaskProps(void 0)
        }
        ,
        proto.webcast.data.BannerView.prototype.hasTaskProps = function() {
            return null != r.Message.getField(this, 100)
        }
        ,
        proto.webcast.data.TaskProps.repeatedFields_ = [1],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TaskProps.prototype.toObject = function(e) {
            return proto.webcast.data.TaskProps.toObject(e, this)
        }
        ,
        proto.webcast.data.TaskProps.toObject = function(e, t) {
            var a = {
                elementlistPropsList: r.Message.toObjectList(t.getElementlistPropsList(), proto.webcast.data.ElementListProps.toObject, e),
                className: r.Message.getFieldWithDefault(t, 2, ""),
                currentBgColor: r.Message.getFieldWithDefault(t, 3, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.TaskProps.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TaskProps;
            return proto.webcast.data.TaskProps.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TaskProps.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new proto.webcast.data.ElementListProps;
                    t.readMessage(a, proto.webcast.data.ElementListProps.deserializeBinaryFromReader),
                    e.addElementlistProps(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setClassName(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setCurrentBgColor(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TaskProps.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TaskProps.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TaskProps.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getElementlistPropsList()).length > 0 && t.writeRepeatedMessage(1, a, proto.webcast.data.ElementListProps.serializeBinaryToWriter),
            (a = e.getClassName()).length > 0 && t.writeString(2, a),
            (a = e.getCurrentBgColor()).length > 0 && t.writeString(3, a)
        }
        ,
        proto.webcast.data.TaskProps.prototype.getElementlistPropsList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.ElementListProps, 1)
        }
        ,
        proto.webcast.data.TaskProps.prototype.setElementlistPropsList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.TaskProps.prototype.addElementlistProps = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 1, e, proto.webcast.data.ElementListProps, t)
        }
        ,
        proto.webcast.data.TaskProps.prototype.clearElementlistPropsList = function() {
            return this.setElementlistPropsList([])
        }
        ,
        proto.webcast.data.TaskProps.prototype.getClassName = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.TaskProps.prototype.setClassName = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.TaskProps.prototype.getCurrentBgColor = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.TaskProps.prototype.setCurrentBgColor = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.ElementListProps.repeatedFields_ = [1],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ElementListProps.prototype.toObject = function(e) {
            return proto.webcast.data.ElementListProps.toObject(e, this)
        }
        ,
        proto.webcast.data.ElementListProps.toObject = function(e, t) {
            var a, o = {
                conditionTextList: null == (a = r.Message.getRepeatedField(t, 1)) ? void 0 : a,
                proConf: (a = t.getProConf()) && proto.webcast.data.ProConfProps.toObject(e, a),
                levelText: r.Message.getFieldWithDefault(t, 3, ""),
                awardIcon: r.Message.getFieldWithDefault(t, 4, "")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.ElementListProps.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ElementListProps;
            return proto.webcast.data.ElementListProps.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ElementListProps.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.addConditionText(a);
                    break;
                case 2:
                    a = new proto.webcast.data.ProConfProps;
                    t.readMessage(a, proto.webcast.data.ProConfProps.deserializeBinaryFromReader),
                    e.setProConf(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setLevelText(a);
                    break;
                case 4:
                    a = t.readString();
                    e.setAwardIcon(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.ElementListProps.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ElementListProps.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ElementListProps.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getConditionTextList()).length > 0 && t.writeRepeatedString(1, a),
            null != (a = e.getProConf()) && t.writeMessage(2, a, proto.webcast.data.ProConfProps.serializeBinaryToWriter),
            (a = e.getLevelText()).length > 0 && t.writeString(3, a),
            (a = e.getAwardIcon()).length > 0 && t.writeString(4, a)
        }
        ,
        proto.webcast.data.ElementListProps.prototype.getConditionTextList = function() {
            return r.Message.getRepeatedField(this, 1)
        }
        ,
        proto.webcast.data.ElementListProps.prototype.setConditionTextList = function(e) {
            return r.Message.setField(this, 1, e || [])
        }
        ,
        proto.webcast.data.ElementListProps.prototype.addConditionText = function(e, t) {
            return r.Message.addToRepeatedField(this, 1, e, t)
        }
        ,
        proto.webcast.data.ElementListProps.prototype.clearConditionTextList = function() {
            return this.setConditionTextList([])
        }
        ,
        proto.webcast.data.ElementListProps.prototype.getProConf = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.ProConfProps, 2)
        }
        ,
        proto.webcast.data.ElementListProps.prototype.setProConf = function(e) {
            return r.Message.setWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.ElementListProps.prototype.clearProConf = function() {
            return this.setProConf(void 0)
        }
        ,
        proto.webcast.data.ElementListProps.prototype.hasProConf = function() {
            return null != r.Message.getField(this, 2)
        }
        ,
        proto.webcast.data.ElementListProps.prototype.getLevelText = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.ElementListProps.prototype.setLevelText = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.ElementListProps.prototype.getAwardIcon = function() {
            return r.Message.getFieldWithDefault(this, 4, "")
        }
        ,
        proto.webcast.data.ElementListProps.prototype.setAwardIcon = function(e) {
            return r.Message.setProto3StringField(this, 4, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ProConfProps.prototype.toObject = function(e) {
            return proto.webcast.data.ProConfProps.toObject(e, this)
        }
        ,
        proto.webcast.data.ProConfProps.toObject = function(e, t) {
            var a = {
                current: r.Message.getFieldWithDefault(t, 1, "0"),
                target: r.Message.getFieldWithDefault(t, 2, "0"),
                unitText: r.Message.getFieldWithDefault(t, 3, ""),
                showFloat: r.Message.getBooleanFieldWithDefault(t, 4, !1),
                formatFixed: r.Message.getFieldWithDefault(t, 5, "0")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.ProConfProps.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ProConfProps;
            return proto.webcast.data.ProConfProps.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ProConfProps.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setCurrent(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setTarget(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setUnitText(a);
                    break;
                case 4:
                    a = t.readBool();
                    e.setShowFloat(a);
                    break;
                case 5:
                    a = t.readInt64String();
                    e.setFormatFixed(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.ProConfProps.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ProConfProps.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ProConfProps.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getCurrent(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            a = e.getTarget(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a),
            (a = e.getUnitText()).length > 0 && t.writeString(3, a),
            (a = e.getShowFloat()) && t.writeBool(4, a),
            a = e.getFormatFixed(),
            0 !== parseInt(a, 10) && t.writeInt64String(5, a)
        }
        ,
        proto.webcast.data.ProConfProps.prototype.getCurrent = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.ProConfProps.prototype.setCurrent = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.ProConfProps.prototype.getTarget = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.ProConfProps.prototype.setTarget = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        proto.webcast.data.ProConfProps.prototype.getUnitText = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.ProConfProps.prototype.setUnitText = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.ProConfProps.prototype.getShowFloat = function() {
            return r.Message.getBooleanFieldWithDefault(this, 4, !1)
        }
        ,
        proto.webcast.data.ProConfProps.prototype.setShowFloat = function(e) {
            return r.Message.setProto3BooleanField(this, 4, e)
        }
        ,
        proto.webcast.data.ProConfProps.prototype.getFormatFixed = function() {
            return r.Message.getFieldWithDefault(this, 5, "0")
        }
        ,
        proto.webcast.data.ProConfProps.prototype.setFormatFixed = function(e) {
            return r.Message.setProto3StringIntField(this, 5, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TouchPosition.prototype.toObject = function(e) {
            return proto.webcast.data.TouchPosition.toObject(e, this)
        }
        ,
        proto.webcast.data.TouchPosition.toObject = function(e, t) {
            var a, r = {
                meta: (a = t.getMeta()) && proto.webcast.data.TouchPositionMeta.toObject(e, a),
                detail: (a = t.getDetail()) && proto.webcast.data.TouchPositionDetail.toObject(e, a),
                bizExtraMap: (a = t.getBizExtraMap()) ? a.toObject(e, void 0) : []
            };
            return e && (r.$jspbMessageInstance = t),
            r
        }
        ),
        proto.webcast.data.TouchPosition.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TouchPosition;
            return proto.webcast.data.TouchPosition.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TouchPosition.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new proto.webcast.data.TouchPositionMeta;
                    t.readMessage(a, proto.webcast.data.TouchPositionMeta.deserializeBinaryFromReader),
                    e.setMeta(a);
                    break;
                case 2:
                    a = new proto.webcast.data.TouchPositionDetail;
                    t.readMessage(a, proto.webcast.data.TouchPositionDetail.deserializeBinaryFromReader),
                    e.setDetail(a);
                    break;
                case 3:
                    a = e.getBizExtraMap();
                    t.readMessage(a, (function(e, t) {
                        r.Map.deserializeBinary(e, t, r.BinaryReader.prototype.readString, r.BinaryReader.prototype.readString, null, "", "")
                    }
                    ));
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.TouchPosition.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TouchPosition.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TouchPosition.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            null != (a = e.getMeta()) && t.writeMessage(1, a, proto.webcast.data.TouchPositionMeta.serializeBinaryToWriter),
            null != (a = e.getDetail()) && t.writeMessage(2, a, proto.webcast.data.TouchPositionDetail.serializeBinaryToWriter),
            (a = e.getBizExtraMap(!0)) && a.getLength() > 0 && a.serializeBinary(3, t, r.BinaryWriter.prototype.writeString, r.BinaryWriter.prototype.writeString)
        }
        ,
        proto.webcast.data.TouchPosition.prototype.getMeta = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TouchPositionMeta, 1)
        }
        ,
        proto.webcast.data.TouchPosition.prototype.setMeta = function(e) {
            return r.Message.setWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.TouchPosition.prototype.clearMeta = function() {
            return this.setMeta(void 0)
        }
        ,
        proto.webcast.data.TouchPosition.prototype.hasMeta = function() {
            return null != r.Message.getField(this, 1)
        }
        ,
        proto.webcast.data.TouchPosition.prototype.getDetail = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.TouchPositionDetail, 2)
        }
        ,
        proto.webcast.data.TouchPosition.prototype.setDetail = function(e) {
            return r.Message.setWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.TouchPosition.prototype.clearDetail = function() {
            return this.setDetail(void 0)
        }
        ,
        proto.webcast.data.TouchPosition.prototype.hasDetail = function() {
            return null != r.Message.getField(this, 2)
        }
        ,
        proto.webcast.data.TouchPosition.prototype.getBizExtraMap = function(e) {
            return r.Message.getMapField(this, 3, e, null)
        }
        ,
        proto.webcast.data.TouchPosition.prototype.clearBizExtraMap = function() {
            return this.getBizExtraMap().clear(),
            this
        }
        ,
        proto.webcast.data.TouchPositions.repeatedFields_ = [1],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.TouchPositions.prototype.toObject = function(e) {
            return proto.webcast.data.TouchPositions.toObject(e, this)
        }
        ,
        proto.webcast.data.TouchPositions.toObject = function(e, t) {
            var a = {
                dataList: r.Message.toObjectList(t.getDataList(), proto.webcast.data.TouchPosition.toObject, e)
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.TouchPositions.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.TouchPositions;
            return proto.webcast.data.TouchPositions.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.TouchPositions.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                if (1 === t.getFieldNumber()) {
                    var a = new proto.webcast.data.TouchPosition;
                    t.readMessage(a, proto.webcast.data.TouchPosition.deserializeBinaryFromReader),
                    e.addData(a)
                } else
                    t.skipField()
            }
            return e
        }
        ,
        proto.webcast.data.TouchPositions.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.TouchPositions.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.TouchPositions.serializeBinaryToWriter = function(e, t) {
            var a;
            (a = e.getDataList()).length > 0 && t.writeRepeatedMessage(1, a, proto.webcast.data.TouchPosition.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.TouchPositions.prototype.getDataList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.TouchPosition, 1)
        }
        ,
        proto.webcast.data.TouchPositions.prototype.setDataList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.TouchPositions.prototype.addData = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 1, e, proto.webcast.data.TouchPosition, t)
        }
        ,
        proto.webcast.data.TouchPositions.prototype.clearDataList = function() {
            return this.setDataList([])
        }
        ,
        proto.webcast.data.Position = {
            POSITIONUNKNOWN: 0,
            POSITIONGIFTPANELTOP: 1,
            POSITIONDIAMONDLISTBANNER: 2,
            POSITIONGIFTPANELENTRANCE: 22
        },
        proto.webcast.data.RichTextType = {
            RICHTEXTTYPEUNKNOWN: 0,
            RICHTEXTTYPETEXT: 1,
            RICHTEXTTYPEIMG: 2
        },
        proto.webcast.data.TouchRewardStatus = {
            TOUCHREWARDSTATUSUNKNOWN: 0,
            TOUCHREWARDSTATUSUNSEND: 1,
            TOUCHREWARDSTATUSSUCCESS: 2,
            TOUCHREWARDSTATUSSENDFAILED: 3
        },
        proto.webcast.data.FreqCtrlStrategy = {
            STRATEGYUNKNOWN: 0,
            STRATEGYDAILYLIMITBYUID: 1,
            STRATEGYROOMLIMITBYUID: 2,
            STRATEGYPERROOMLIMITBYUID: 3,
            STRATEGYTOTALLIMITBYUID: 4
        },
        proto.webcast.data.RefreshMechanism = {
            MECHANISMUNKNOWN: 0,
            MECHANISMIM: 1,
            MECHANISMPOLLING: 2,
            MECHANISMSENDGIFTJSBCALLBACK: 3
        },
        o.object.extend(t, proto.webcast.data)
    }
    ,
    8031: (e,t,a)=>{
        var r = a(47865)
          , o = r
          , i = function() {
            return this ? this : "undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : Function("return this")()
        }
        .call(null)
          , s = a(14307);
        o.object.extend(proto, s),
        o.exportSymbol("proto.webcast.data.ChatEmojiGuideInfo", null, i),
        o.exportSymbol("proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf", null, i),
        o.exportSymbol("proto.webcast.data.ChatImageGuideInfo", null, i),
        o.exportSymbol("proto.webcast.data.ChatImageGuideInfo.ImageGuideConf", null, i),
        o.exportSymbol("proto.webcast.data.LikeIconInfo", null, i),
        o.exportSymbol("proto.webcast.data.LikeIconInfo.IconList", null, i),
        o.exportSymbol("proto.webcast.data.MatchChatInfo", null, i),
        o.exportSymbol("proto.webcast.data.ShareItemStyle", null, i),
        proto.webcast.data.LikeIconInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.LikeIconInfo.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.LikeIconInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.LikeIconInfo.displayName = "proto.webcast.data.LikeIconInfo"),
        proto.webcast.data.LikeIconInfo.IconList = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.LikeIconInfo.IconList.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.LikeIconInfo.IconList, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.LikeIconInfo.IconList.displayName = "proto.webcast.data.LikeIconInfo.IconList"),
        proto.webcast.data.ChatEmojiGuideInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.ChatEmojiGuideInfo.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.ChatEmojiGuideInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ChatEmojiGuideInfo.displayName = "proto.webcast.data.ChatEmojiGuideInfo"),
        proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.displayName = "proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf"),
        proto.webcast.data.ChatImageGuideInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.ChatImageGuideInfo.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.ChatImageGuideInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ChatImageGuideInfo.displayName = "proto.webcast.data.ChatImageGuideInfo"),
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.ChatImageGuideInfo.ImageGuideConf, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.displayName = "proto.webcast.data.ChatImageGuideInfo.ImageGuideConf"),
        proto.webcast.data.MatchChatInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.MatchChatInfo.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.MatchChatInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.MatchChatInfo.displayName = "proto.webcast.data.MatchChatInfo"),
        proto.webcast.data.ShareItemStyle = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.ShareItemStyle, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ShareItemStyle.displayName = "proto.webcast.data.ShareItemStyle"),
        proto.webcast.data.LikeIconInfo.repeatedFields_ = [1],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.LikeIconInfo.prototype.toObject = function(e) {
            return proto.webcast.data.LikeIconInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.LikeIconInfo.toObject = function(e, t) {
            var a, o = {
                iconsList: r.Message.toObjectList(t.getIconsList(), s.Image.toObject, e),
                componentRelatedIconsMap: (a = t.getComponentRelatedIconsMap()) ? a.toObject(e, proto.webcast.data.LikeIconInfo.IconList.toObject) : []
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.LikeIconInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.LikeIconInfo;
            return proto.webcast.data.LikeIconInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.LikeIconInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.addIcons(a);
                    break;
                case 2:
                    a = e.getComponentRelatedIconsMap();
                    t.readMessage(a, (function(e, t) {
                        r.Map.deserializeBinary(e, t, r.BinaryReader.prototype.readInt64, r.BinaryReader.prototype.readMessage, proto.webcast.data.LikeIconInfo.IconList.deserializeBinaryFromReader, 0, new proto.webcast.data.LikeIconInfo.IconList)
                    }
                    ));
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.LikeIconInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.LikeIconInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.LikeIconInfo.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getIconsList()).length > 0 && t.writeRepeatedMessage(1, a, s.Image.serializeBinaryToWriter),
            (a = e.getComponentRelatedIconsMap(!0)) && a.getLength() > 0 && a.serializeBinary(2, t, r.BinaryWriter.prototype.writeInt64, r.BinaryWriter.prototype.writeMessage, proto.webcast.data.LikeIconInfo.IconList.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.LikeIconInfo.IconList.repeatedFields_ = [1],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.LikeIconInfo.IconList.prototype.toObject = function(e) {
            return proto.webcast.data.LikeIconInfo.IconList.toObject(e, this)
        }
        ,
        proto.webcast.data.LikeIconInfo.IconList.toObject = function(e, t) {
            var a = {
                iconsList: r.Message.toObjectList(t.getIconsList(), s.Image.toObject, e)
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.LikeIconInfo.IconList.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.LikeIconInfo.IconList;
            return proto.webcast.data.LikeIconInfo.IconList.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.LikeIconInfo.IconList.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                if (1 === t.getFieldNumber()) {
                    var a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.addIcons(a)
                } else
                    t.skipField()
            }
            return e
        }
        ,
        proto.webcast.data.LikeIconInfo.IconList.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.LikeIconInfo.IconList.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.LikeIconInfo.IconList.serializeBinaryToWriter = function(e, t) {
            var a;
            (a = e.getIconsList()).length > 0 && t.writeRepeatedMessage(1, a, s.Image.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.LikeIconInfo.IconList.prototype.getIconsList = function() {
            return r.Message.getRepeatedWrapperField(this, s.Image, 1)
        }
        ,
        proto.webcast.data.LikeIconInfo.IconList.prototype.setIconsList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.LikeIconInfo.IconList.prototype.addIcons = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 1, e, proto.webcast.data.Image, t)
        }
        ,
        proto.webcast.data.LikeIconInfo.IconList.prototype.clearIconsList = function() {
            return this.setIconsList([])
        }
        ,
        proto.webcast.data.LikeIconInfo.prototype.getIconsList = function() {
            return r.Message.getRepeatedWrapperField(this, s.Image, 1)
        }
        ,
        proto.webcast.data.LikeIconInfo.prototype.setIconsList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.LikeIconInfo.prototype.addIcons = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 1, e, proto.webcast.data.Image, t)
        }
        ,
        proto.webcast.data.LikeIconInfo.prototype.clearIconsList = function() {
            return this.setIconsList([])
        }
        ,
        proto.webcast.data.LikeIconInfo.prototype.getComponentRelatedIconsMap = function(e) {
            return r.Message.getMapField(this, 2, e, proto.webcast.data.LikeIconInfo.IconList)
        }
        ,
        proto.webcast.data.LikeIconInfo.prototype.clearComponentRelatedIconsMap = function() {
            return this.getComponentRelatedIconsMap().clear(),
            this
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.repeatedFields_ = [1],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ChatEmojiGuideInfo.prototype.toObject = function(e) {
            return proto.webcast.data.ChatEmojiGuideInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.toObject = function(e, t) {
            var a = {
                emojisList: r.Message.toObjectList(t.getEmojisList(), proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.toObject, e)
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.ChatEmojiGuideInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ChatEmojiGuideInfo;
            return proto.webcast.data.ChatEmojiGuideInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                if (1 === t.getFieldNumber()) {
                    var a = new proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf;
                    t.readMessage(a, proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.deserializeBinaryFromReader),
                    e.addEmojis(a)
                } else
                    t.skipField()
            }
            return e
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ChatEmojiGuideInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.serializeBinaryToWriter = function(e, t) {
            var a;
            (a = e.getEmojisList()).length > 0 && t.writeRepeatedMessage(1, a, proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.repeatedFields_ = [2],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.prototype.toObject = function(e) {
            return proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.toObject(e, this)
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.toObject = function(e, t) {
            var a, o = {
                emoji: r.Message.getFieldWithDefault(t, 1, ""),
                triggerWordsList: null == (a = r.Message.getRepeatedField(t, 2)) ? void 0 : a,
                beginTime: r.Message.getFieldWithDefault(t, 10, "0"),
                endTime: r.Message.getFieldWithDefault(t, 11, "0")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf;
            return proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setEmoji(a);
                    break;
                case 2:
                    a = t.readString();
                    e.addTriggerWords(a);
                    break;
                case 10:
                    a = t.readInt64String();
                    e.setBeginTime(a);
                    break;
                case 11:
                    a = t.readInt64String();
                    e.setEndTime(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getEmoji()).length > 0 && t.writeString(1, a),
            (a = e.getTriggerWordsList()).length > 0 && t.writeRepeatedString(2, a),
            a = e.getBeginTime(),
            0 !== parseInt(a, 10) && t.writeInt64String(10, a),
            a = e.getEndTime(),
            0 !== parseInt(a, 10) && t.writeInt64String(11, a)
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.prototype.getEmoji = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.prototype.setEmoji = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.prototype.getTriggerWordsList = function() {
            return r.Message.getRepeatedField(this, 2)
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.prototype.setTriggerWordsList = function(e) {
            return r.Message.setField(this, 2, e || [])
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.prototype.addTriggerWords = function(e, t) {
            return r.Message.addToRepeatedField(this, 2, e, t)
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.prototype.clearTriggerWordsList = function() {
            return this.setTriggerWordsList([])
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.prototype.getBeginTime = function() {
            return r.Message.getFieldWithDefault(this, 10, "0")
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.prototype.setBeginTime = function(e) {
            return r.Message.setProto3StringIntField(this, 10, e)
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.prototype.getEndTime = function() {
            return r.Message.getFieldWithDefault(this, 11, "0")
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf.prototype.setEndTime = function(e) {
            return r.Message.setProto3StringIntField(this, 11, e)
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.prototype.getEmojisList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf, 1)
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.prototype.setEmojisList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.prototype.addEmojis = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 1, e, proto.webcast.data.ChatEmojiGuideInfo.EmojiGuideConf, t)
        }
        ,
        proto.webcast.data.ChatEmojiGuideInfo.prototype.clearEmojisList = function() {
            return this.setEmojisList([])
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.repeatedFields_ = [1],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ChatImageGuideInfo.prototype.toObject = function(e) {
            return proto.webcast.data.ChatImageGuideInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.toObject = function(e, t) {
            var a = {
                imagesList: r.Message.toObjectList(t.getImagesList(), proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.toObject, e)
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.ChatImageGuideInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ChatImageGuideInfo;
            return proto.webcast.data.ChatImageGuideInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                if (1 === t.getFieldNumber()) {
                    var a = new proto.webcast.data.ChatImageGuideInfo.ImageGuideConf;
                    t.readMessage(a, proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.deserializeBinaryFromReader),
                    e.addImages(a)
                } else
                    t.skipField()
            }
            return e
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ChatImageGuideInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.serializeBinaryToWriter = function(e, t) {
            var a;
            (a = e.getImagesList()).length > 0 && t.writeRepeatedMessage(1, a, proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.repeatedFields_ = [4],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.prototype.toObject = function(e) {
            return proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.toObject(e, this)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.toObject = function(e, t) {
            var a, o = {
                imageId: r.Message.getFieldWithDefault(t, 1, ""),
                image: (a = t.getImage()) && s.Image.toObject(e, a),
                text: r.Message.getFieldWithDefault(t, 3, ""),
                triggerWordsList: null == (a = r.Message.getRepeatedField(t, 4)) ? void 0 : a,
                beginTime: r.Message.getFieldWithDefault(t, 10, "0"),
                endTime: r.Message.getFieldWithDefault(t, 11, "0")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ChatImageGuideInfo.ImageGuideConf;
            return proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setImageId(a);
                    break;
                case 2:
                    a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setImage(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setText(a);
                    break;
                case 4:
                    a = t.readString();
                    e.addTriggerWords(a);
                    break;
                case 10:
                    a = t.readInt64String();
                    e.setBeginTime(a);
                    break;
                case 11:
                    a = t.readInt64String();
                    e.setEndTime(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getImageId()).length > 0 && t.writeString(1, a),
            null != (a = e.getImage()) && t.writeMessage(2, a, s.Image.serializeBinaryToWriter),
            (a = e.getText()).length > 0 && t.writeString(3, a),
            (a = e.getTriggerWordsList()).length > 0 && t.writeRepeatedString(4, a),
            a = e.getBeginTime(),
            0 !== parseInt(a, 10) && t.writeInt64String(10, a),
            a = e.getEndTime(),
            0 !== parseInt(a, 10) && t.writeInt64String(11, a)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.prototype.getImageId = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.prototype.setImageId = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.prototype.getImage = function() {
            return r.Message.getWrapperField(this, s.Image, 2)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.prototype.setImage = function(e) {
            return r.Message.setWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.prototype.clearImage = function() {
            return this.setImage(void 0)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.prototype.hasImage = function() {
            return null != r.Message.getField(this, 2)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.prototype.getText = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.prototype.setText = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.prototype.getTriggerWordsList = function() {
            return r.Message.getRepeatedField(this, 4)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.prototype.setTriggerWordsList = function(e) {
            return r.Message.setField(this, 4, e || [])
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.prototype.addTriggerWords = function(e, t) {
            return r.Message.addToRepeatedField(this, 4, e, t)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.prototype.clearTriggerWordsList = function() {
            return this.setTriggerWordsList([])
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.prototype.getBeginTime = function() {
            return r.Message.getFieldWithDefault(this, 10, "0")
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.prototype.setBeginTime = function(e) {
            return r.Message.setProto3StringIntField(this, 10, e)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.prototype.getEndTime = function() {
            return r.Message.getFieldWithDefault(this, 11, "0")
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.ImageGuideConf.prototype.setEndTime = function(e) {
            return r.Message.setProto3StringIntField(this, 11, e)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.prototype.getImagesList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.ChatImageGuideInfo.ImageGuideConf, 1)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.prototype.setImagesList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.prototype.addImages = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 1, e, proto.webcast.data.ChatImageGuideInfo.ImageGuideConf, t)
        }
        ,
        proto.webcast.data.ChatImageGuideInfo.prototype.clearImagesList = function() {
            return this.setImagesList([])
        }
        ,
        proto.webcast.data.MatchChatInfo.repeatedFields_ = [5],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.MatchChatInfo.prototype.toObject = function(e) {
            return proto.webcast.data.MatchChatInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.MatchChatInfo.toObject = function(e, t) {
            var a, o = {
                mainGroupIcon: (a = t.getMainGroupIcon()) && s.Image.toObject(e, a),
                mainGroupBackground: (a = t.getMainGroupBackground()) && s.Image.toObject(e, a),
                guestGroupIcon: (a = t.getGuestGroupIcon()) && s.Image.toObject(e, a),
                guestGroupBackground: (a = t.getGuestGroupBackground()) && s.Image.toObject(e, a),
                aggregateIconList: r.Message.toObjectList(t.getAggregateIconList(), s.Image.toObject, e)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.MatchChatInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.MatchChatInfo;
            return proto.webcast.data.MatchChatInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.MatchChatInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setMainGroupIcon(a);
                    break;
                case 2:
                    a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setMainGroupBackground(a);
                    break;
                case 3:
                    a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setGuestGroupIcon(a);
                    break;
                case 4:
                    a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setGuestGroupBackground(a);
                    break;
                case 5:
                    a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.addAggregateIcon(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.MatchChatInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.MatchChatInfo.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            null != (a = e.getMainGroupIcon()) && t.writeMessage(1, a, s.Image.serializeBinaryToWriter),
            null != (a = e.getMainGroupBackground()) && t.writeMessage(2, a, s.Image.serializeBinaryToWriter),
            null != (a = e.getGuestGroupIcon()) && t.writeMessage(3, a, s.Image.serializeBinaryToWriter),
            null != (a = e.getGuestGroupBackground()) && t.writeMessage(4, a, s.Image.serializeBinaryToWriter),
            (a = e.getAggregateIconList()).length > 0 && t.writeRepeatedMessage(5, a, s.Image.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.getMainGroupIcon = function() {
            return r.Message.getWrapperField(this, s.Image, 1)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.setMainGroupIcon = function(e) {
            return r.Message.setWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.clearMainGroupIcon = function() {
            return this.setMainGroupIcon(void 0)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.hasMainGroupIcon = function() {
            return null != r.Message.getField(this, 1)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.getMainGroupBackground = function() {
            return r.Message.getWrapperField(this, s.Image, 2)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.setMainGroupBackground = function(e) {
            return r.Message.setWrapperField(this, 2, e)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.clearMainGroupBackground = function() {
            return this.setMainGroupBackground(void 0)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.hasMainGroupBackground = function() {
            return null != r.Message.getField(this, 2)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.getGuestGroupIcon = function() {
            return r.Message.getWrapperField(this, s.Image, 3)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.setGuestGroupIcon = function(e) {
            return r.Message.setWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.clearGuestGroupIcon = function() {
            return this.setGuestGroupIcon(void 0)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.hasGuestGroupIcon = function() {
            return null != r.Message.getField(this, 3)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.getGuestGroupBackground = function() {
            return r.Message.getWrapperField(this, s.Image, 4)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.setGuestGroupBackground = function(e) {
            return r.Message.setWrapperField(this, 4, e)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.clearGuestGroupBackground = function() {
            return this.setGuestGroupBackground(void 0)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.hasGuestGroupBackground = function() {
            return null != r.Message.getField(this, 4)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.getAggregateIconList = function() {
            return r.Message.getRepeatedWrapperField(this, s.Image, 5)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.setAggregateIconList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 5, e)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.addAggregateIcon = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 5, e, proto.webcast.data.Image, t)
        }
        ,
        proto.webcast.data.MatchChatInfo.prototype.clearAggregateIconList = function() {
            return this.setAggregateIconList([])
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ShareItemStyle.prototype.toObject = function(e) {
            return proto.webcast.data.ShareItemStyle.toObject(e, this)
        }
        ,
        proto.webcast.data.ShareItemStyle.toObject = function(e, t) {
            var a, o = {
                itemType: r.Message.getFieldWithDefault(t, 1, ""),
                itemId: r.Message.getFieldWithDefault(t, 2, ""),
                icon: (a = t.getIcon()) && s.Image.toObject(e, a),
                name: r.Message.getFieldWithDefault(t, 4, ""),
                nameColor: r.Message.getFieldWithDefault(t, 5, ""),
                schema: r.Message.getFieldWithDefault(t, 6, "")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.ShareItemStyle.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ShareItemStyle;
            return proto.webcast.data.ShareItemStyle.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ShareItemStyle.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setItemType(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setItemId(a);
                    break;
                case 3:
                    a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setIcon(a);
                    break;
                case 4:
                    a = t.readString();
                    e.setName(a);
                    break;
                case 5:
                    a = t.readString();
                    e.setNameColor(a);
                    break;
                case 6:
                    a = t.readString();
                    e.setSchema(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.ShareItemStyle.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ShareItemStyle.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ShareItemStyle.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getItemType()).length > 0 && t.writeString(1, a),
            (a = e.getItemId()).length > 0 && t.writeString(2, a),
            null != (a = e.getIcon()) && t.writeMessage(3, a, s.Image.serializeBinaryToWriter),
            (a = e.getName()).length > 0 && t.writeString(4, a),
            (a = e.getNameColor()).length > 0 && t.writeString(5, a),
            (a = e.getSchema()).length > 0 && t.writeString(6, a)
        }
        ,
        proto.webcast.data.ShareItemStyle.prototype.getItemType = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.ShareItemStyle.prototype.setItemType = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.ShareItemStyle.prototype.getItemId = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.ShareItemStyle.prototype.setItemId = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.ShareItemStyle.prototype.getIcon = function() {
            return r.Message.getWrapperField(this, s.Image, 3)
        }
        ,
        proto.webcast.data.ShareItemStyle.prototype.setIcon = function(e) {
            return r.Message.setWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.ShareItemStyle.prototype.clearIcon = function() {
            return this.setIcon(void 0)
        }
        ,
        proto.webcast.data.ShareItemStyle.prototype.hasIcon = function() {
            return null != r.Message.getField(this, 3)
        }
        ,
        proto.webcast.data.ShareItemStyle.prototype.getName = function() {
            return r.Message.getFieldWithDefault(this, 4, "")
        }
        ,
        proto.webcast.data.ShareItemStyle.prototype.setName = function(e) {
            return r.Message.setProto3StringField(this, 4, e)
        }
        ,
        proto.webcast.data.ShareItemStyle.prototype.getNameColor = function() {
            return r.Message.getFieldWithDefault(this, 5, "")
        }
        ,
        proto.webcast.data.ShareItemStyle.prototype.setNameColor = function(e) {
            return r.Message.setProto3StringField(this, 5, e)
        }
        ,
        proto.webcast.data.ShareItemStyle.prototype.getSchema = function() {
            return r.Message.getFieldWithDefault(this, 6, "")
        }
        ,
        proto.webcast.data.ShareItemStyle.prototype.setSchema = function(e) {
            return r.Message.setProto3StringField(this, 6, e)
        }
        ,
        o.object.extend(t, proto.webcast.data)
    }
    ,
    40702: (e,t,a)=>{
        var r = a(47865)
          , o = r
          , i = function() {
            return this ? this : "undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : Function("return this")()
        }
        .call(null)
          , s = a(14307);
        o.object.extend(proto, s),
        o.exportSymbol("proto.webcast.data.SelfDisciplineLikeSource", null, i),
        o.exportSymbol("proto.webcast.data.SelfDisciplineLikeStatus", null, i),
        o.exportSymbol("proto.webcast.data.SelfDisciplinePrivacyStatus", null, i),
        o.exportSymbol("proto.webcast.data.SelfDisciplinePunchStatus", null, i),
        o.exportSymbol("proto.webcast.data.SelfDisciplineSignalContentType", null, i),
        o.exportSymbol("proto.webcast.data.SelfDisciplineSwitchStatus", null, i),
        o.exportSymbol("proto.webcast.data.SelfDisciplineUserBase", null, i),
        o.exportSymbol("proto.webcast.data.SelfDisciplineUserBase.FollowInfo", null, i),
        proto.webcast.data.SelfDisciplineUserBase = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.SelfDisciplineUserBase, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.SelfDisciplineUserBase.displayName = "proto.webcast.data.SelfDisciplineUserBase"),
        proto.webcast.data.SelfDisciplineUserBase.FollowInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.SelfDisciplineUserBase.FollowInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.SelfDisciplineUserBase.FollowInfo.displayName = "proto.webcast.data.SelfDisciplineUserBase.FollowInfo"),
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.SelfDisciplineUserBase.prototype.toObject = function(e) {
            return proto.webcast.data.SelfDisciplineUserBase.toObject(e, this)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.toObject = function(e, t) {
            var a, o = {
                id: r.Message.getFieldWithDefault(t, 1, "0"),
                nickname: r.Message.getFieldWithDefault(t, 2, ""),
                avatarThumb: (a = t.getAvatarThumb()) && s.Image.toObject(e, a),
                followInfo: (a = t.getFollowInfo()) && proto.webcast.data.SelfDisciplineUserBase.FollowInfo.toObject(e, a),
                secret: r.Message.getFieldWithDefault(t, 5, 0),
                secUid: r.Message.getFieldWithDefault(t, 6, ""),
                mysteryman: r.Message.getFieldWithDefault(t, 7, 0)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.SelfDisciplineUserBase.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.SelfDisciplineUserBase;
            return proto.webcast.data.SelfDisciplineUserBase.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setId(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setNickname(a);
                    break;
                case 3:
                    a = new s.Image;
                    t.readMessage(a, s.Image.deserializeBinaryFromReader),
                    e.setAvatarThumb(a);
                    break;
                case 4:
                    a = new proto.webcast.data.SelfDisciplineUserBase.FollowInfo;
                    t.readMessage(a, proto.webcast.data.SelfDisciplineUserBase.FollowInfo.deserializeBinaryFromReader),
                    e.setFollowInfo(a);
                    break;
                case 5:
                    a = t.readInt32();
                    e.setSecret(a);
                    break;
                case 6:
                    a = t.readString();
                    e.setSecUid(a);
                    break;
                case 7:
                    a = t.readInt32();
                    e.setMysteryman(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.SelfDisciplineUserBase.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getId(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            (a = e.getNickname()).length > 0 && t.writeString(2, a),
            null != (a = e.getAvatarThumb()) && t.writeMessage(3, a, s.Image.serializeBinaryToWriter),
            null != (a = e.getFollowInfo()) && t.writeMessage(4, a, proto.webcast.data.SelfDisciplineUserBase.FollowInfo.serializeBinaryToWriter),
            0 !== (a = e.getSecret()) && t.writeInt32(5, a),
            (a = e.getSecUid()).length > 0 && t.writeString(6, a),
            0 !== (a = e.getMysteryman()) && t.writeInt32(7, a)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.SelfDisciplineUserBase.FollowInfo.prototype.toObject = function(e) {
            return proto.webcast.data.SelfDisciplineUserBase.FollowInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.FollowInfo.toObject = function(e, t) {
            var a = {
                followStatus: r.Message.getFieldWithDefault(t, 1, "0"),
                remarkName: r.Message.getFieldWithDefault(t, 2, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.SelfDisciplineUserBase.FollowInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.SelfDisciplineUserBase.FollowInfo;
            return proto.webcast.data.SelfDisciplineUserBase.FollowInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.FollowInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setFollowStatus(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setRemarkName(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.FollowInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.SelfDisciplineUserBase.FollowInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.FollowInfo.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getFollowStatus(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            (a = e.getRemarkName()).length > 0 && t.writeString(2, a)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.FollowInfo.prototype.getFollowStatus = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.FollowInfo.prototype.setFollowStatus = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.FollowInfo.prototype.getRemarkName = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.FollowInfo.prototype.setRemarkName = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.getId = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.setId = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.getNickname = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.setNickname = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.getAvatarThumb = function() {
            return r.Message.getWrapperField(this, s.Image, 3)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.setAvatarThumb = function(e) {
            return r.Message.setWrapperField(this, 3, e)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.clearAvatarThumb = function() {
            return this.setAvatarThumb(void 0)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.hasAvatarThumb = function() {
            return null != r.Message.getField(this, 3)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.getFollowInfo = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.SelfDisciplineUserBase.FollowInfo, 4)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.setFollowInfo = function(e) {
            return r.Message.setWrapperField(this, 4, e)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.clearFollowInfo = function() {
            return this.setFollowInfo(void 0)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.hasFollowInfo = function() {
            return null != r.Message.getField(this, 4)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.getSecret = function() {
            return r.Message.getFieldWithDefault(this, 5, 0)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.setSecret = function(e) {
            return r.Message.setProto3IntField(this, 5, e)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.getSecUid = function() {
            return r.Message.getFieldWithDefault(this, 6, "")
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.setSecUid = function(e) {
            return r.Message.setProto3StringField(this, 6, e)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.getMysteryman = function() {
            return r.Message.getFieldWithDefault(this, 7, 0)
        }
        ,
        proto.webcast.data.SelfDisciplineUserBase.prototype.setMysteryman = function(e) {
            return r.Message.setProto3IntField(this, 7, e)
        }
        ,
        proto.webcast.data.SelfDisciplineSwitchStatus = {
            SELF_DISCIPLINE_SWITCH_UNKNOWN: 0,
            SELF_DISCIPLINE_SWITCH_OPEN: 1,
            SELF_DISCIPLINE_SWITCH_OFF: 2,
            SELF_DISCIPLINE_SWITCH_STATUS_CHANGE: 3,
            SELF_DISCIPLINE_SWITCH_ROOM_CONTINUE_OPEN: 4
        },
        proto.webcast.data.SelfDisciplineLikeStatus = {
            SELF_DISCIPLINE_STATUS_UNKNOWN: 0,
            SELF_DISCIPLINE_STATUS_LIKED: 1,
            SELF_DISCIPLINE_STATUS_NONE_LIKE: 2
        },
        proto.webcast.data.SelfDisciplinePrivacyStatus = {
            SELF_DISCIPLINE_PRIVACY_STATUS_UNKNOWN: 0,
            SELF_DISCIPLINE_PRIVACY_STATUS_OPEN: 1,
            SELF_DISCIPLINE_PRIVACY_STATUS_OFF: 2
        },
        proto.webcast.data.SelfDisciplineLikeSource = {
            SELF_DISCIPLINE_LIKE_SOURCE_UNKNOWN: 0,
            SELF_DISCIPLINE_LIKE_SOURCE_WEEKLY_RANK: 1,
            SELF_DISCIPLINE_LIKE_SOURCE_PERSONAL_PANEL: 2
        },
        proto.webcast.data.SelfDisciplinePunchStatus = {
            SELF_DISCIPLINE_PUNCH_STATUS_UNKNOWN: 0,
            SELF_DISCIPLINE_PUNCH_STATUS_PUNCHING: 1,
            SELF_DISCIPLINE_PUNCH_STATUS_PUNCHED: 2,
            SELF_DISCIPLINE_PUNCH_STATUS_TIME_SETTLED: 3
        },
        proto.webcast.data.SelfDisciplineSignalContentType = {
            SELF_DISCIPLINE_SIGNAL_CONTENT_TYPE_UNKNOWN: 0,
            SELF_DISCIPLINE_SIGNAL_CONTENT_TYPE_BACKGROUND: 1,
            SELF_DISCIPLINE_SIGNAL_CONTENT_TYPE_FORGROUND: 2,
            SELF_DISCIPLINE_SIGNAL_CONTENT_TYPE_SMALL_WINDOW: 3
        },
        o.object.extend(t, proto.webcast.data)
    }
    ,
    72696: (e,t,a)=>{
        var r = a(47865)
          , o = r
          , i = function() {
            return this ? this : "undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : Function("return this")()
        }
        .call(null)
          , s = a(53724);
        o.object.extend(proto, s),
        o.exportSymbol("proto.webcast.data.SelectionType", null, i),
        o.exportSymbol("proto.webcast.data.ThemeType", null, i),
        o.exportSymbol("proto.webcast.data.ThemedCompetitionInfo", null, i),
        o.exportSymbol("proto.webcast.data.ThemedCompetitionInfo.Score", null, i),
        o.exportSymbol("proto.webcast.data.ThemedCompetitionSetting", null, i),
        o.exportSymbol("proto.webcast.data.ThemedCompetitionStatus", null, i),
        proto.webcast.data.ThemedCompetitionSetting = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.ThemedCompetitionSetting.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.ThemedCompetitionSetting, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ThemedCompetitionSetting.displayName = "proto.webcast.data.ThemedCompetitionSetting"),
        proto.webcast.data.ThemedCompetitionInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.ThemedCompetitionInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ThemedCompetitionInfo.displayName = "proto.webcast.data.ThemedCompetitionInfo"),
        proto.webcast.data.ThemedCompetitionInfo.Score = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.ThemedCompetitionInfo.Score, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ThemedCompetitionInfo.Score.displayName = "proto.webcast.data.ThemedCompetitionInfo.Score"),
        proto.webcast.data.ThemedCompetitionSetting.repeatedFields_ = [5, 8],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ThemedCompetitionSetting.prototype.toObject = function(e) {
            return proto.webcast.data.ThemedCompetitionSetting.toObject(e, this)
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.toObject = function(e, t) {
            var a, o = {
                theme: r.Message.getFieldWithDefault(t, 1, ""),
                themeType: r.Message.getFieldWithDefault(t, 2, 0),
                selectionType: r.Message.getFieldWithDefault(t, 3, 0),
                winCount: r.Message.getFieldWithDefault(t, 4, "0"),
                judgesUserIdListList: null == (a = r.Message.getRepeatedField(t, 5)) ? void 0 : a,
                maxJudgesCount: r.Message.getFieldWithDefault(t, 6, "0"),
                maxWinCount: r.Message.getFieldWithDefault(t, 7, "0"),
                serverThemeListList: null == (a = r.Message.getRepeatedField(t, 8)) ? void 0 : a,
                customTheme: r.Message.getFieldWithDefault(t, 9, "")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.ThemedCompetitionSetting.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ThemedCompetitionSetting;
            return proto.webcast.data.ThemedCompetitionSetting.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setTheme(a);
                    break;
                case 2:
                    a = t.readEnum();
                    e.setThemeType(a);
                    break;
                case 3:
                    a = t.readEnum();
                    e.setSelectionType(a);
                    break;
                case 4:
                    a = t.readInt64String();
                    e.setWinCount(a);
                    break;
                case 5:
                    for (var r = t.isDelimited() ? t.readPackedInt64String() : [t.readInt64String()], o = 0; o < r.length; o++)
                        e.addJudgesUserIdList(r[o]);
                    break;
                case 6:
                    a = t.readInt64String();
                    e.setMaxJudgesCount(a);
                    break;
                case 7:
                    a = t.readInt64String();
                    e.setMaxWinCount(a);
                    break;
                case 8:
                    a = t.readString();
                    e.addServerThemeList(a);
                    break;
                case 9:
                    a = t.readString();
                    e.setCustomTheme(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ThemedCompetitionSetting.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getTheme()).length > 0 && t.writeString(1, a),
            0 !== (a = e.getThemeType()) && t.writeEnum(2, a),
            0 !== (a = e.getSelectionType()) && t.writeEnum(3, a),
            a = e.getWinCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(4, a),
            (a = e.getJudgesUserIdListList()).length > 0 && t.writePackedInt64String(5, a),
            a = e.getMaxJudgesCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(6, a),
            a = e.getMaxWinCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(7, a),
            (a = e.getServerThemeListList()).length > 0 && t.writeRepeatedString(8, a),
            (a = e.getCustomTheme()).length > 0 && t.writeString(9, a)
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.getTheme = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.setTheme = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.getThemeType = function() {
            return r.Message.getFieldWithDefault(this, 2, 0)
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.setThemeType = function(e) {
            return r.Message.setProto3EnumField(this, 2, e)
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.getSelectionType = function() {
            return r.Message.getFieldWithDefault(this, 3, 0)
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.setSelectionType = function(e) {
            return r.Message.setProto3EnumField(this, 3, e)
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.getWinCount = function() {
            return r.Message.getFieldWithDefault(this, 4, "0")
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.setWinCount = function(e) {
            return r.Message.setProto3StringIntField(this, 4, e)
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.getJudgesUserIdListList = function() {
            return r.Message.getRepeatedField(this, 5)
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.setJudgesUserIdListList = function(e) {
            return r.Message.setField(this, 5, e || [])
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.addJudgesUserIdList = function(e, t) {
            return r.Message.addToRepeatedField(this, 5, e, t)
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.clearJudgesUserIdListList = function() {
            return this.setJudgesUserIdListList([])
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.getMaxJudgesCount = function() {
            return r.Message.getFieldWithDefault(this, 6, "0")
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.setMaxJudgesCount = function(e) {
            return r.Message.setProto3StringIntField(this, 6, e)
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.getMaxWinCount = function() {
            return r.Message.getFieldWithDefault(this, 7, "0")
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.setMaxWinCount = function(e) {
            return r.Message.setProto3StringIntField(this, 7, e)
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.getServerThemeListList = function() {
            return r.Message.getRepeatedField(this, 8)
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.setServerThemeListList = function(e) {
            return r.Message.setField(this, 8, e || [])
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.addServerThemeList = function(e, t) {
            return r.Message.addToRepeatedField(this, 8, e, t)
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.clearServerThemeListList = function() {
            return this.setServerThemeListList([])
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.getCustomTheme = function() {
            return r.Message.getFieldWithDefault(this, 9, "")
        }
        ,
        proto.webcast.data.ThemedCompetitionSetting.prototype.setCustomTheme = function(e) {
            return r.Message.setProto3StringField(this, 9, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ThemedCompetitionInfo.prototype.toObject = function(e) {
            return proto.webcast.data.ThemedCompetitionInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.toObject = function(e, t) {
            var a, o = {
                setting: (a = t.getSetting()) && proto.webcast.data.ThemedCompetitionSetting.toObject(e, a),
                userIdToScoreMap: (a = t.getUserIdToScoreMap()) ? a.toObject(e, proto.webcast.data.ThemedCompetitionInfo.Score.toObject) : [],
                status: r.Message.getFieldWithDefault(t, 3, 0),
                competitionId: r.Message.getFieldWithDefault(t, 4, "0"),
                currentPerformerUserId: r.Message.getFieldWithDefault(t, 5, "0")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.ThemedCompetitionInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ThemedCompetitionInfo;
            return proto.webcast.data.ThemedCompetitionInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = new proto.webcast.data.ThemedCompetitionSetting;
                    t.readMessage(a, proto.webcast.data.ThemedCompetitionSetting.deserializeBinaryFromReader),
                    e.setSetting(a);
                    break;
                case 2:
                    a = e.getUserIdToScoreMap();
                    t.readMessage(a, (function(e, t) {
                        r.Map.deserializeBinary(e, t, r.BinaryReader.prototype.readInt64, r.BinaryReader.prototype.readMessage, proto.webcast.data.ThemedCompetitionInfo.Score.deserializeBinaryFromReader, 0, new proto.webcast.data.ThemedCompetitionInfo.Score)
                    }
                    ));
                    break;
                case 3:
                    a = t.readEnum();
                    e.setStatus(a);
                    break;
                case 4:
                    a = t.readInt64String();
                    e.setCompetitionId(a);
                    break;
                case 5:
                    a = t.readInt64String();
                    e.setCurrentPerformerUserId(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ThemedCompetitionInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            null != (a = e.getSetting()) && t.writeMessage(1, a, proto.webcast.data.ThemedCompetitionSetting.serializeBinaryToWriter),
            (a = e.getUserIdToScoreMap(!0)) && a.getLength() > 0 && a.serializeBinary(2, t, r.BinaryWriter.prototype.writeInt64, r.BinaryWriter.prototype.writeMessage, proto.webcast.data.ThemedCompetitionInfo.Score.serializeBinaryToWriter),
            0 !== (a = e.getStatus()) && t.writeEnum(3, a),
            a = e.getCompetitionId(),
            0 !== parseInt(a, 10) && t.writeInt64String(4, a),
            a = e.getCurrentPerformerUserId(),
            0 !== parseInt(a, 10) && t.writeInt64String(5, a)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ThemedCompetitionInfo.Score.prototype.toObject = function(e) {
            return proto.webcast.data.ThemedCompetitionInfo.Score.toObject(e, this)
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.Score.toObject = function(e, t) {
            var a = {
                score: r.Message.getFieldWithDefault(t, 1, "0"),
                scoreFuzz: r.Message.getFieldWithDefault(t, 2, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.ThemedCompetitionInfo.Score.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ThemedCompetitionInfo.Score;
            return proto.webcast.data.ThemedCompetitionInfo.Score.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.Score.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setScore(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setScoreFuzz(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.Score.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ThemedCompetitionInfo.Score.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.Score.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getScore(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            (a = e.getScoreFuzz()).length > 0 && t.writeString(2, a)
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.Score.prototype.getScore = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.Score.prototype.setScore = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.Score.prototype.getScoreFuzz = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.Score.prototype.setScoreFuzz = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.prototype.getSetting = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.ThemedCompetitionSetting, 1)
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.prototype.setSetting = function(e) {
            return r.Message.setWrapperField(this, 1, e)
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.prototype.clearSetting = function() {
            return this.setSetting(void 0)
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.prototype.hasSetting = function() {
            return null != r.Message.getField(this, 1)
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.prototype.getUserIdToScoreMap = function(e) {
            return r.Message.getMapField(this, 2, e, proto.webcast.data.ThemedCompetitionInfo.Score)
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.prototype.clearUserIdToScoreMap = function() {
            return this.getUserIdToScoreMap().clear(),
            this
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.prototype.getStatus = function() {
            return r.Message.getFieldWithDefault(this, 3, 0)
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.prototype.setStatus = function(e) {
            return r.Message.setProto3EnumField(this, 3, e)
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.prototype.getCompetitionId = function() {
            return r.Message.getFieldWithDefault(this, 4, "0")
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.prototype.setCompetitionId = function(e) {
            return r.Message.setProto3StringIntField(this, 4, e)
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.prototype.getCurrentPerformerUserId = function() {
            return r.Message.getFieldWithDefault(this, 5, "0")
        }
        ,
        proto.webcast.data.ThemedCompetitionInfo.prototype.setCurrentPerformerUserId = function(e) {
            return r.Message.setProto3StringIntField(this, 5, e)
        }
        ,
        proto.webcast.data.SelectionType = {
            SELECTIONTYPE_UNKNOWN: 0,
            SELECTIONTYPE_NORMAL: 1,
            SELECTIONTYPE_SCORING: 2
        },
        proto.webcast.data.ThemeType = {
            THEMETYPE_UNKNOWN: 0,
            THEMETYPE_NORMAL: 1,
            THEMETYPE_CUSTOM: 2
        },
        proto.webcast.data.ThemedCompetitionStatus = {
            THEMEDCOMPETITIONSTATUS_UNKNOWN: 0,
            THEMEDCOMPETITIONSTATUS_START: 1,
            THEMEDCOMPETITIONSTATUS_FINISH: 2
        },
        o.object.extend(t, proto.webcast.data)
    }
    ,
    12005: (e,t,a)=>{
        var r = a(47865)
          , o = r
          , i = function() {
            return this ? this : "undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : Function("return this")()
        }
        .call(null);
        o.exportSymbol("proto.webcast.data.CandidateUser", null, i),
        o.exportSymbol("proto.webcast.data.CustomizedCondition", null, i),
        o.exportSymbol("proto.webcast.data.ExpandLotteryConfig", null, i),
        o.exportSymbol("proto.webcast.data.ExpandPrizeType", null, i),
        o.exportSymbol("proto.webcast.data.GiftInfo", null, i),
        o.exportSymbol("proto.webcast.data.IdTypeForFudaiBiz", null, i),
        o.exportSymbol("proto.webcast.data.LaunchTaskInfo", null, i),
        o.exportSymbol("proto.webcast.data.LotteryCondition", null, i),
        o.exportSymbol("proto.webcast.data.LotteryConfig", null, i),
        o.exportSymbol("proto.webcast.data.LotteryDefaultConfig", null, i),
        o.exportSymbol("proto.webcast.data.LotteryExpandActivityInfo", null, i),
        o.exportSymbol("proto.webcast.data.LotteryFansLevelConfig", null, i),
        o.exportSymbol("proto.webcast.data.LotteryGiftGuide", null, i),
        o.exportSymbol("proto.webcast.data.LotteryInfo", null, i),
        o.exportSymbol("proto.webcast.data.LotteryLuckyUser", null, i),
        o.exportSymbol("proto.webcast.data.LotteryPrize", null, i),
        o.exportSymbol("proto.webcast.data.LotteryRegularlyConfig", null, i),
        o.exportSymbol("proto.webcast.data.LotteryRewardDetail", null, i),
        o.exportSymbol("proto.webcast.data.LotterySendType", null, i),
        o.exportSymbol("proto.webcast.data.LotteryUserCondition", null, i),
        o.exportSymbol("proto.webcast.data.LotteryUserCustomizedCondition", null, i),
        o.exportSymbol("proto.webcast.data.VoucherPrizeInfo", null, i),
        proto.webcast.data.LotteryUserCondition = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.LotteryUserCondition, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.LotteryUserCondition.displayName = "proto.webcast.data.LotteryUserCondition"),
        proto.webcast.data.LotteryUserCustomizedCondition = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.LotteryUserCustomizedCondition, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.LotteryUserCustomizedCondition.displayName = "proto.webcast.data.LotteryUserCustomizedCondition"),
        proto.webcast.data.CandidateUser = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.CandidateUser, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.CandidateUser.displayName = "proto.webcast.data.CandidateUser"),
        proto.webcast.data.LotteryDefaultConfig = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.LotteryDefaultConfig.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.LotteryDefaultConfig, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.LotteryDefaultConfig.displayName = "proto.webcast.data.LotteryDefaultConfig"),
        proto.webcast.data.GiftInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.GiftInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.GiftInfo.displayName = "proto.webcast.data.GiftInfo"),
        proto.webcast.data.LotteryConfig = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.LotteryConfig.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.LotteryConfig, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.LotteryConfig.displayName = "proto.webcast.data.LotteryConfig"),
        proto.webcast.data.CustomizedCondition = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.CustomizedCondition.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.CustomizedCondition, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.CustomizedCondition.displayName = "proto.webcast.data.CustomizedCondition"),
        proto.webcast.data.LotteryRewardDetail = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.LotteryRewardDetail, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.LotteryRewardDetail.displayName = "proto.webcast.data.LotteryRewardDetail"),
        proto.webcast.data.LotteryExpandActivityInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.LotteryExpandActivityInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.LotteryExpandActivityInfo.displayName = "proto.webcast.data.LotteryExpandActivityInfo"),
        proto.webcast.data.ExpandLotteryConfig = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.ExpandLotteryConfig, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ExpandLotteryConfig.displayName = "proto.webcast.data.ExpandLotteryConfig"),
        proto.webcast.data.LotteryFansLevelConfig = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.LotteryFansLevelConfig, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.LotteryFansLevelConfig.displayName = "proto.webcast.data.LotteryFansLevelConfig"),
        proto.webcast.data.LotteryRegularlyConfig = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.LotteryRegularlyConfig, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.LotteryRegularlyConfig.displayName = "proto.webcast.data.LotteryRegularlyConfig"),
        proto.webcast.data.LotteryInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.LotteryInfo.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.LotteryInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.LotteryInfo.displayName = "proto.webcast.data.LotteryInfo"),
        proto.webcast.data.LaunchTaskInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.LaunchTaskInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.LaunchTaskInfo.displayName = "proto.webcast.data.LaunchTaskInfo"),
        proto.webcast.data.LotteryPrize = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.LotteryPrize, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.LotteryPrize.displayName = "proto.webcast.data.LotteryPrize"),
        proto.webcast.data.LotteryCondition = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.LotteryCondition, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.LotteryCondition.displayName = "proto.webcast.data.LotteryCondition"),
        proto.webcast.data.LotteryLuckyUser = function(e) {
            r.Message.initialize(this, e, 0, -1, proto.webcast.data.LotteryLuckyUser.repeatedFields_, null)
        }
        ,
        o.inherits(proto.webcast.data.LotteryLuckyUser, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.LotteryLuckyUser.displayName = "proto.webcast.data.LotteryLuckyUser"),
        proto.webcast.data.VoucherPrizeInfo = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.VoucherPrizeInfo, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.VoucherPrizeInfo.displayName = "proto.webcast.data.VoucherPrizeInfo"),
        proto.webcast.data.LotteryGiftGuide = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.LotteryGiftGuide, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.LotteryGiftGuide.displayName = "proto.webcast.data.LotteryGiftGuide"),
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.LotteryUserCondition.prototype.toObject = function(e) {
            return proto.webcast.data.LotteryUserCondition.toObject(e, this)
        }
        ,
        proto.webcast.data.LotteryUserCondition.toObject = function(e, t) {
            var a = {
                isWatching: r.Message.getBooleanFieldWithDefault(t, 1, !1),
                hasCommand: r.Message.getBooleanFieldWithDefault(t, 2, !1),
                hasFollow: r.Message.getBooleanFieldWithDefault(t, 3, !1),
                isFansclubMember: r.Message.getBooleanFieldWithDefault(t, 4, !1),
                hasGift: r.Message.getBooleanFieldWithDefault(t, 5, !1),
                fansLevel: r.Message.getFieldWithDefault(t, 6, "0"),
                fansclubStatusActive: r.Message.getBooleanFieldWithDefault(t, 7, !1),
                hasShared: r.Message.getBooleanFieldWithDefault(t, 8, !1),
                hasHelpWish: r.Message.getBooleanFieldWithDefault(t, 9, !1),
                hasActivated: r.Message.getBooleanFieldWithDefault(t, 10, !1),
                isSubscribeMember: r.Message.getBooleanFieldWithDefault(t, 11, !1)
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.LotteryUserCondition.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.LotteryUserCondition;
            return proto.webcast.data.LotteryUserCondition.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.LotteryUserCondition.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readBool();
                    e.setIsWatching(a);
                    break;
                case 2:
                    a = t.readBool();
                    e.setHasCommand(a);
                    break;
                case 3:
                    a = t.readBool();
                    e.setHasFollow(a);
                    break;
                case 4:
                    a = t.readBool();
                    e.setIsFansclubMember(a);
                    break;
                case 5:
                    a = t.readBool();
                    e.setHasGift(a);
                    break;
                case 6:
                    a = t.readInt64String();
                    e.setFansLevel(a);
                    break;
                case 7:
                    a = t.readBool();
                    e.setFansclubStatusActive(a);
                    break;
                case 8:
                    a = t.readBool();
                    e.setHasShared(a);
                    break;
                case 9:
                    a = t.readBool();
                    e.setHasHelpWish(a);
                    break;
                case 10:
                    a = t.readBool();
                    e.setHasActivated(a);
                    break;
                case 11:
                    a = t.readBool();
                    e.setIsSubscribeMember(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.LotteryUserCondition.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.LotteryUserCondition.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getIsWatching()) && t.writeBool(1, a),
            (a = e.getHasCommand()) && t.writeBool(2, a),
            (a = e.getHasFollow()) && t.writeBool(3, a),
            (a = e.getIsFansclubMember()) && t.writeBool(4, a),
            (a = e.getHasGift()) && t.writeBool(5, a),
            a = e.getFansLevel(),
            0 !== parseInt(a, 10) && t.writeInt64String(6, a),
            (a = e.getFansclubStatusActive()) && t.writeBool(7, a),
            (a = e.getHasShared()) && t.writeBool(8, a),
            (a = e.getHasHelpWish()) && t.writeBool(9, a),
            (a = e.getHasActivated()) && t.writeBool(10, a),
            (a = e.getIsSubscribeMember()) && t.writeBool(11, a)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.getIsWatching = function() {
            return r.Message.getBooleanFieldWithDefault(this, 1, !1)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.setIsWatching = function(e) {
            return r.Message.setProto3BooleanField(this, 1, e)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.getHasCommand = function() {
            return r.Message.getBooleanFieldWithDefault(this, 2, !1)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.setHasCommand = function(e) {
            return r.Message.setProto3BooleanField(this, 2, e)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.getHasFollow = function() {
            return r.Message.getBooleanFieldWithDefault(this, 3, !1)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.setHasFollow = function(e) {
            return r.Message.setProto3BooleanField(this, 3, e)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.getIsFansclubMember = function() {
            return r.Message.getBooleanFieldWithDefault(this, 4, !1)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.setIsFansclubMember = function(e) {
            return r.Message.setProto3BooleanField(this, 4, e)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.getHasGift = function() {
            return r.Message.getBooleanFieldWithDefault(this, 5, !1)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.setHasGift = function(e) {
            return r.Message.setProto3BooleanField(this, 5, e)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.getFansLevel = function() {
            return r.Message.getFieldWithDefault(this, 6, "0")
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.setFansLevel = function(e) {
            return r.Message.setProto3StringIntField(this, 6, e)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.getFansclubStatusActive = function() {
            return r.Message.getBooleanFieldWithDefault(this, 7, !1)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.setFansclubStatusActive = function(e) {
            return r.Message.setProto3BooleanField(this, 7, e)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.getHasShared = function() {
            return r.Message.getBooleanFieldWithDefault(this, 8, !1)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.setHasShared = function(e) {
            return r.Message.setProto3BooleanField(this, 8, e)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.getHasHelpWish = function() {
            return r.Message.getBooleanFieldWithDefault(this, 9, !1)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.setHasHelpWish = function(e) {
            return r.Message.setProto3BooleanField(this, 9, e)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.getHasActivated = function() {
            return r.Message.getBooleanFieldWithDefault(this, 10, !1)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.setHasActivated = function(e) {
            return r.Message.setProto3BooleanField(this, 10, e)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.getIsSubscribeMember = function() {
            return r.Message.getBooleanFieldWithDefault(this, 11, !1)
        }
        ,
        proto.webcast.data.LotteryUserCondition.prototype.setIsSubscribeMember = function(e) {
            return r.Message.setProto3BooleanField(this, 11, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.LotteryUserCustomizedCondition.prototype.toObject = function(e) {
            return proto.webcast.data.LotteryUserCustomizedCondition.toObject(e, this)
        }
        ,
        proto.webcast.data.LotteryUserCustomizedCondition.toObject = function(e, t) {
            var a = {
                conditionType: r.Message.getFieldWithDefault(t, 1, 0),
                canParticipate: r.Message.getBooleanFieldWithDefault(t, 2, !1),
                rejectDesc: r.Message.getFieldWithDefault(t, 3, ""),
                hasMeetCondition: r.Message.getBooleanFieldWithDefault(t, 4, !1),
                guideText: r.Message.getFieldWithDefault(t, 5, ""),
                guideSchema: r.Message.getFieldWithDefault(t, 6, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.LotteryUserCustomizedCondition.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.LotteryUserCustomizedCondition;
            return proto.webcast.data.LotteryUserCustomizedCondition.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.LotteryUserCustomizedCondition.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt32();
                    e.setConditionType(a);
                    break;
                case 2:
                    a = t.readBool();
                    e.setCanParticipate(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setRejectDesc(a);
                    break;
                case 4:
                    a = t.readBool();
                    e.setHasMeetCondition(a);
                    break;
                case 5:
                    a = t.readString();
                    e.setGuideText(a);
                    break;
                case 6:
                    a = t.readString();
                    e.setGuideSchema(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.LotteryUserCustomizedCondition.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.LotteryUserCustomizedCondition.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.LotteryUserCustomizedCondition.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getConditionType()) && t.writeInt32(1, a),
            (a = e.getCanParticipate()) && t.writeBool(2, a),
            (a = e.getRejectDesc()).length > 0 && t.writeString(3, a),
            (a = e.getHasMeetCondition()) && t.writeBool(4, a),
            (a = e.getGuideText()).length > 0 && t.writeString(5, a),
            (a = e.getGuideSchema()).length > 0 && t.writeString(6, a)
        }
        ,
        proto.webcast.data.LotteryUserCustomizedCondition.prototype.getConditionType = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.LotteryUserCustomizedCondition.prototype.setConditionType = function(e) {
            return r.Message.setProto3IntField(this, 1, e)
        }
        ,
        proto.webcast.data.LotteryUserCustomizedCondition.prototype.getCanParticipate = function() {
            return r.Message.getBooleanFieldWithDefault(this, 2, !1)
        }
        ,
        proto.webcast.data.LotteryUserCustomizedCondition.prototype.setCanParticipate = function(e) {
            return r.Message.setProto3BooleanField(this, 2, e)
        }
        ,
        proto.webcast.data.LotteryUserCustomizedCondition.prototype.getRejectDesc = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.LotteryUserCustomizedCondition.prototype.setRejectDesc = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.LotteryUserCustomizedCondition.prototype.getHasMeetCondition = function() {
            return r.Message.getBooleanFieldWithDefault(this, 4, !1)
        }
        ,
        proto.webcast.data.LotteryUserCustomizedCondition.prototype.setHasMeetCondition = function(e) {
            return r.Message.setProto3BooleanField(this, 4, e)
        }
        ,
        proto.webcast.data.LotteryUserCustomizedCondition.prototype.getGuideText = function() {
            return r.Message.getFieldWithDefault(this, 5, "")
        }
        ,
        proto.webcast.data.LotteryUserCustomizedCondition.prototype.setGuideText = function(e) {
            return r.Message.setProto3StringField(this, 5, e)
        }
        ,
        proto.webcast.data.LotteryUserCustomizedCondition.prototype.getGuideSchema = function() {
            return r.Message.getFieldWithDefault(this, 6, "")
        }
        ,
        proto.webcast.data.LotteryUserCustomizedCondition.prototype.setGuideSchema = function(e) {
            return r.Message.setProto3StringField(this, 6, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.CandidateUser.prototype.toObject = function(e) {
            return proto.webcast.data.CandidateUser.toObject(e, this)
        }
        ,
        proto.webcast.data.CandidateUser.toObject = function(e, t) {
            var a = {
                userId: r.Message.getFieldWithDefault(t, 1, "0"),
                userName: r.Message.getFieldWithDefault(t, 2, ""),
                avatarUrl: r.Message.getFieldWithDefault(t, 3, ""),
                secUserId: r.Message.getFieldWithDefault(t, 4, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.CandidateUser.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.CandidateUser;
            return proto.webcast.data.CandidateUser.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.CandidateUser.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setUserId(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setUserName(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setAvatarUrl(a);
                    break;
                case 4:
                    a = t.readString();
                    e.setSecUserId(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.CandidateUser.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.CandidateUser.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.CandidateUser.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getUserId(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            (a = e.getUserName()).length > 0 && t.writeString(2, a),
            (a = e.getAvatarUrl()).length > 0 && t.writeString(3, a),
            (a = e.getSecUserId()).length > 0 && t.writeString(4, a)
        }
        ,
        proto.webcast.data.CandidateUser.prototype.getUserId = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.CandidateUser.prototype.setUserId = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.CandidateUser.prototype.getUserName = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.CandidateUser.prototype.setUserName = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.CandidateUser.prototype.getAvatarUrl = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.CandidateUser.prototype.setAvatarUrl = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.CandidateUser.prototype.getSecUserId = function() {
            return r.Message.getFieldWithDefault(this, 4, "")
        }
        ,
        proto.webcast.data.CandidateUser.prototype.setSecUserId = function(e) {
            return r.Message.setProto3StringField(this, 4, e)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.repeatedFields_ = [9],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.LotteryDefaultConfig.prototype.toObject = function(e) {
            return proto.webcast.data.LotteryDefaultConfig.toObject(e, this)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.toObject = function(e, t) {
            var a, o = {
                countDown: r.Message.getFieldWithDefault(t, 1, "0"),
                userNum: r.Message.getFieldWithDefault(t, 2, "0"),
                prizeCount: r.Message.getFieldWithDefault(t, 3, "0"),
                giftId: r.Message.getFieldWithDefault(t, 4, "0"),
                giftCount: r.Message.getFieldWithDefault(t, 5, "0"),
                isFirstLottery: r.Message.getFieldWithDefault(t, 6, "0"),
                command: r.Message.getFieldWithDefault(t, 7, ""),
                prizeName: r.Message.getFieldWithDefault(t, 8, ""),
                conditionTypesList: null == (a = r.Message.getRepeatedField(t, 9)) ? void 0 : a,
                prizeAverage: r.Message.getFieldWithDefault(t, 10, "0"),
                prizeDescription: r.Message.getFieldWithDefault(t, 11, ""),
                minFansLevel: r.Message.getFieldWithDefault(t, 12, "0"),
                phoneNum: r.Message.getFieldWithDefault(t, 13, ""),
                bytepayVoucherSwitcher: r.Message.getFieldWithDefault(t, 14, "0"),
                sendType: r.Message.getFieldWithDefault(t, 15, 0),
                regularlyConfig: (a = t.getRegularlyConfig()) && proto.webcast.data.LotteryRegularlyConfig.toObject(e, a)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.LotteryDefaultConfig.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.LotteryDefaultConfig;
            return proto.webcast.data.LotteryDefaultConfig.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setCountDown(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setUserNum(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setPrizeCount(a);
                    break;
                case 4:
                    a = t.readInt64String();
                    e.setGiftId(a);
                    break;
                case 5:
                    a = t.readInt64String();
                    e.setGiftCount(a);
                    break;
                case 6:
                    a = t.readInt64String();
                    e.setIsFirstLottery(a);
                    break;
                case 7:
                    a = t.readString();
                    e.setCommand(a);
                    break;
                case 8:
                    a = t.readString();
                    e.setPrizeName(a);
                    break;
                case 9:
                    for (var r = t.isDelimited() ? t.readPackedInt32() : [t.readInt32()], o = 0; o < r.length; o++)
                        e.addConditionTypes(r[o]);
                    break;
                case 10:
                    a = t.readInt64String();
                    e.setPrizeAverage(a);
                    break;
                case 11:
                    a = t.readString();
                    e.setPrizeDescription(a);
                    break;
                case 12:
                    a = t.readInt64String();
                    e.setMinFansLevel(a);
                    break;
                case 13:
                    a = t.readString();
                    e.setPhoneNum(a);
                    break;
                case 14:
                    a = t.readInt64String();
                    e.setBytepayVoucherSwitcher(a);
                    break;
                case 15:
                    a = t.readEnum();
                    e.setSendType(a);
                    break;
                case 16:
                    a = new proto.webcast.data.LotteryRegularlyConfig;
                    t.readMessage(a, proto.webcast.data.LotteryRegularlyConfig.deserializeBinaryFromReader),
                    e.setRegularlyConfig(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.LotteryDefaultConfig.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getCountDown(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            a = e.getUserNum(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a),
            a = e.getPrizeCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a),
            a = e.getGiftId(),
            0 !== parseInt(a, 10) && t.writeInt64String(4, a),
            a = e.getGiftCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(5, a),
            a = e.getIsFirstLottery(),
            0 !== parseInt(a, 10) && t.writeInt64String(6, a),
            (a = e.getCommand()).length > 0 && t.writeString(7, a),
            (a = e.getPrizeName()).length > 0 && t.writeString(8, a),
            (a = e.getConditionTypesList()).length > 0 && t.writePackedInt32(9, a),
            a = e.getPrizeAverage(),
            0 !== parseInt(a, 10) && t.writeInt64String(10, a),
            (a = e.getPrizeDescription()).length > 0 && t.writeString(11, a),
            a = e.getMinFansLevel(),
            0 !== parseInt(a, 10) && t.writeInt64String(12, a),
            (a = e.getPhoneNum()).length > 0 && t.writeString(13, a),
            a = e.getBytepayVoucherSwitcher(),
            0 !== parseInt(a, 10) && t.writeInt64String(14, a),
            0 !== (a = e.getSendType()) && t.writeEnum(15, a),
            null != (a = e.getRegularlyConfig()) && t.writeMessage(16, a, proto.webcast.data.LotteryRegularlyConfig.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.getCountDown = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.setCountDown = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.getUserNum = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.setUserNum = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.getPrizeCount = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.setPrizeCount = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.getGiftId = function() {
            return r.Message.getFieldWithDefault(this, 4, "0")
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.setGiftId = function(e) {
            return r.Message.setProto3StringIntField(this, 4, e)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.getGiftCount = function() {
            return r.Message.getFieldWithDefault(this, 5, "0")
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.setGiftCount = function(e) {
            return r.Message.setProto3StringIntField(this, 5, e)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.getIsFirstLottery = function() {
            return r.Message.getFieldWithDefault(this, 6, "0")
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.setIsFirstLottery = function(e) {
            return r.Message.setProto3StringIntField(this, 6, e)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.getCommand = function() {
            return r.Message.getFieldWithDefault(this, 7, "")
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.setCommand = function(e) {
            return r.Message.setProto3StringField(this, 7, e)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.getPrizeName = function() {
            return r.Message.getFieldWithDefault(this, 8, "")
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.setPrizeName = function(e) {
            return r.Message.setProto3StringField(this, 8, e)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.getConditionTypesList = function() {
            return r.Message.getRepeatedField(this, 9)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.setConditionTypesList = function(e) {
            return r.Message.setField(this, 9, e || [])
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.addConditionTypes = function(e, t) {
            return r.Message.addToRepeatedField(this, 9, e, t)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.clearConditionTypesList = function() {
            return this.setConditionTypesList([])
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.getPrizeAverage = function() {
            return r.Message.getFieldWithDefault(this, 10, "0")
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.setPrizeAverage = function(e) {
            return r.Message.setProto3StringIntField(this, 10, e)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.getPrizeDescription = function() {
            return r.Message.getFieldWithDefault(this, 11, "")
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.setPrizeDescription = function(e) {
            return r.Message.setProto3StringField(this, 11, e)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.getMinFansLevel = function() {
            return r.Message.getFieldWithDefault(this, 12, "0")
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.setMinFansLevel = function(e) {
            return r.Message.setProto3StringIntField(this, 12, e)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.getPhoneNum = function() {
            return r.Message.getFieldWithDefault(this, 13, "")
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.setPhoneNum = function(e) {
            return r.Message.setProto3StringField(this, 13, e)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.getBytepayVoucherSwitcher = function() {
            return r.Message.getFieldWithDefault(this, 14, "0")
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.setBytepayVoucherSwitcher = function(e) {
            return r.Message.setProto3StringIntField(this, 14, e)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.getSendType = function() {
            return r.Message.getFieldWithDefault(this, 15, 0)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.setSendType = function(e) {
            return r.Message.setProto3EnumField(this, 15, e)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.getRegularlyConfig = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.LotteryRegularlyConfig, 16)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.setRegularlyConfig = function(e) {
            return r.Message.setWrapperField(this, 16, e)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.clearRegularlyConfig = function() {
            return this.setRegularlyConfig(void 0)
        }
        ,
        proto.webcast.data.LotteryDefaultConfig.prototype.hasRegularlyConfig = function() {
            return null != r.Message.getField(this, 16)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.GiftInfo.prototype.toObject = function(e) {
            return proto.webcast.data.GiftInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.GiftInfo.toObject = function(e, t) {
            var a = {
                giftId: r.Message.getFieldWithDefault(t, 1, "0"),
                giftName: r.Message.getFieldWithDefault(t, 2, ""),
                giftImgUrl: r.Message.getFieldWithDefault(t, 3, ""),
                diamondCount: r.Message.getFieldWithDefault(t, 4, "0")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.GiftInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.GiftInfo;
            return proto.webcast.data.GiftInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.GiftInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setGiftId(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setGiftName(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setGiftImgUrl(a);
                    break;
                case 4:
                    a = t.readInt64String();
                    e.setDiamondCount(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.GiftInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.GiftInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.GiftInfo.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getGiftId(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            (a = e.getGiftName()).length > 0 && t.writeString(2, a),
            (a = e.getGiftImgUrl()).length > 0 && t.writeString(3, a),
            a = e.getDiamondCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(4, a)
        }
        ,
        proto.webcast.data.GiftInfo.prototype.getGiftId = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.GiftInfo.prototype.setGiftId = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.GiftInfo.prototype.getGiftName = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.GiftInfo.prototype.setGiftName = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.GiftInfo.prototype.getGiftImgUrl = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.GiftInfo.prototype.setGiftImgUrl = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.GiftInfo.prototype.getDiamondCount = function() {
            return r.Message.getFieldWithDefault(this, 4, "0")
        }
        ,
        proto.webcast.data.GiftInfo.prototype.setDiamondCount = function(e) {
            return r.Message.setProto3StringIntField(this, 4, e)
        }
        ,
        proto.webcast.data.LotteryConfig.repeatedFields_ = [3, 1, 2, 7, 8, 9, 10, 11, 12, 14, 17, 21, 22, 23, 50],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.LotteryConfig.prototype.toObject = function(e) {
            return proto.webcast.data.LotteryConfig.toObject(e, this)
        }
        ,
        proto.webcast.data.LotteryConfig.toObject = function(e, t) {
            var a, o = {
                countDownsList: null == (a = r.Message.getRepeatedField(t, 3)) ? void 0 : a,
                userNumsList: null == (a = r.Message.getRepeatedField(t, 1)) ? void 0 : a,
                prizeCountsList: null == (a = r.Message.getRepeatedField(t, 2)) ? void 0 : a,
                defaultConfig: (a = t.getDefaultConfig()) && proto.webcast.data.LotteryDefaultConfig.toObject(e, a),
                prizeType: r.Message.getFieldWithDefault(t, 5, 0),
                prizeName: r.Message.getFieldWithDefault(t, 6, ""),
                userConditionTypesList: null == (a = r.Message.getRepeatedField(t, 7)) ? void 0 : a,
                lotteryConditionTypesList: null == (a = r.Message.getRepeatedField(t, 8)) ? void 0 : a,
                giftInfoListList: r.Message.toObjectList(t.getGiftInfoListList(), proto.webcast.data.GiftInfo.toObject, e),
                giftCountsList: null == (a = r.Message.getRepeatedField(t, 10)) ? void 0 : a,
                whiteListList: null == (a = r.Message.getRepeatedField(t, 11)) ? void 0 : a,
                blackListList: null == (a = r.Message.getRepeatedField(t, 12)) ? void 0 : a,
                enable: r.Message.getFieldWithDefault(t, 13, "0"),
                prizeAveragesList: null == (a = r.Message.getRepeatedField(t, 14)) ? void 0 : a,
                lotteryConfigType: r.Message.getFieldWithDefault(t, 15, "0"),
                prizeDescription: r.Message.getFieldWithDefault(t, 16, ""),
                fansLevelConfigListList: r.Message.toObjectList(t.getFansLevelConfigListList(), proto.webcast.data.LotteryFansLevelConfig.toObject, e),
                accountScores: r.Message.getFieldWithDefault(t, 18, "0"),
                needRechargeAmount: r.Message.getFieldWithDefault(t, 19, "0"),
                rechargeSwitch: r.Message.getBooleanFieldWithDefault(t, 20, !1),
                expandActivityInfoListList: r.Message.toObjectList(t.getExpandActivityInfoListList(), proto.webcast.data.LotteryExpandActivityInfo.toObject, e),
                sendCountsList: null == (a = r.Message.getRepeatedField(t, 22)) ? void 0 : a,
                sendIntervalList: null == (a = r.Message.getRepeatedField(t, 23)) ? void 0 : a,
                supportLaunchTask: r.Message.getBooleanFieldWithDefault(t, 26, !1),
                customizedConditionTypesList: r.Message.toObjectList(t.getCustomizedConditionTypesList(), proto.webcast.data.CustomizedCondition.toObject, e)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.LotteryConfig.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.LotteryConfig;
            return proto.webcast.data.LotteryConfig.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.LotteryConfig.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 3:
                    for (var a = t.isDelimited() ? t.readPackedInt64String() : [t.readInt64String()], r = 0; r < a.length; r++)
                        e.addCountDowns(a[r]);
                    break;
                case 1:
                    for (a = t.isDelimited() ? t.readPackedInt64String() : [t.readInt64String()],
                    r = 0; r < a.length; r++)
                        e.addUserNums(a[r]);
                    break;
                case 2:
                    for (a = t.isDelimited() ? t.readPackedInt64String() : [t.readInt64String()],
                    r = 0; r < a.length; r++)
                        e.addPrizeCounts(a[r]);
                    break;
                case 4:
                    var o = new proto.webcast.data.LotteryDefaultConfig;
                    t.readMessage(o, proto.webcast.data.LotteryDefaultConfig.deserializeBinaryFromReader),
                    e.setDefaultConfig(o);
                    break;
                case 5:
                    o = t.readInt32();
                    e.setPrizeType(o);
                    break;
                case 6:
                    o = t.readString();
                    e.setPrizeName(o);
                    break;
                case 7:
                    for (a = t.isDelimited() ? t.readPackedInt32() : [t.readInt32()],
                    r = 0; r < a.length; r++)
                        e.addUserConditionTypes(a[r]);
                    break;
                case 8:
                    for (a = t.isDelimited() ? t.readPackedInt32() : [t.readInt32()],
                    r = 0; r < a.length; r++)
                        e.addLotteryConditionTypes(a[r]);
                    break;
                case 9:
                    o = new proto.webcast.data.GiftInfo;
                    t.readMessage(o, proto.webcast.data.GiftInfo.deserializeBinaryFromReader),
                    e.addGiftInfoList(o);
                    break;
                case 10:
                    for (a = t.isDelimited() ? t.readPackedInt64String() : [t.readInt64String()],
                    r = 0; r < a.length; r++)
                        e.addGiftCounts(a[r]);
                    break;
                case 11:
                    for (a = t.isDelimited() ? t.readPackedInt64String() : [t.readInt64String()],
                    r = 0; r < a.length; r++)
                        e.addWhiteList(a[r]);
                    break;
                case 12:
                    for (a = t.isDelimited() ? t.readPackedInt64String() : [t.readInt64String()],
                    r = 0; r < a.length; r++)
                        e.addBlackList(a[r]);
                    break;
                case 13:
                    o = t.readInt64String();
                    e.setEnable(o);
                    break;
                case 14:
                    for (a = t.isDelimited() ? t.readPackedInt64String() : [t.readInt64String()],
                    r = 0; r < a.length; r++)
                        e.addPrizeAverages(a[r]);
                    break;
                case 15:
                    o = t.readInt64String();
                    e.setLotteryConfigType(o);
                    break;
                case 16:
                    o = t.readString();
                    e.setPrizeDescription(o);
                    break;
                case 17:
                    o = new proto.webcast.data.LotteryFansLevelConfig;
                    t.readMessage(o, proto.webcast.data.LotteryFansLevelConfig.deserializeBinaryFromReader),
                    e.addFansLevelConfigList(o);
                    break;
                case 18:
                    o = t.readInt64String();
                    e.setAccountScores(o);
                    break;
                case 19:
                    o = t.readInt64String();
                    e.setNeedRechargeAmount(o);
                    break;
                case 20:
                    o = t.readBool();
                    e.setRechargeSwitch(o);
                    break;
                case 21:
                    o = new proto.webcast.data.LotteryExpandActivityInfo;
                    t.readMessage(o, proto.webcast.data.LotteryExpandActivityInfo.deserializeBinaryFromReader),
                    e.addExpandActivityInfoList(o);
                    break;
                case 22:
                    for (a = t.isDelimited() ? t.readPackedInt64String() : [t.readInt64String()],
                    r = 0; r < a.length; r++)
                        e.addSendCounts(a[r]);
                    break;
                case 23:
                    for (a = t.isDelimited() ? t.readPackedInt64String() : [t.readInt64String()],
                    r = 0; r < a.length; r++)
                        e.addSendInterval(a[r]);
                    break;
                case 26:
                    o = t.readBool();
                    e.setSupportLaunchTask(o);
                    break;
                case 50:
                    o = new proto.webcast.data.CustomizedCondition;
                    t.readMessage(o, proto.webcast.data.CustomizedCondition.deserializeBinaryFromReader),
                    e.addCustomizedConditionTypes(o);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.LotteryConfig.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.LotteryConfig.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getCountDownsList()).length > 0 && t.writePackedInt64String(3, a),
            (a = e.getUserNumsList()).length > 0 && t.writePackedInt64String(1, a),
            (a = e.getPrizeCountsList()).length > 0 && t.writePackedInt64String(2, a),
            null != (a = e.getDefaultConfig()) && t.writeMessage(4, a, proto.webcast.data.LotteryDefaultConfig.serializeBinaryToWriter),
            0 !== (a = e.getPrizeType()) && t.writeInt32(5, a),
            (a = e.getPrizeName()).length > 0 && t.writeString(6, a),
            (a = e.getUserConditionTypesList()).length > 0 && t.writePackedInt32(7, a),
            (a = e.getLotteryConditionTypesList()).length > 0 && t.writePackedInt32(8, a),
            (a = e.getGiftInfoListList()).length > 0 && t.writeRepeatedMessage(9, a, proto.webcast.data.GiftInfo.serializeBinaryToWriter),
            (a = e.getGiftCountsList()).length > 0 && t.writePackedInt64String(10, a),
            (a = e.getWhiteListList()).length > 0 && t.writePackedInt64String(11, a),
            (a = e.getBlackListList()).length > 0 && t.writePackedInt64String(12, a),
            a = e.getEnable(),
            0 !== parseInt(a, 10) && t.writeInt64String(13, a),
            (a = e.getPrizeAveragesList()).length > 0 && t.writePackedInt64String(14, a),
            a = e.getLotteryConfigType(),
            0 !== parseInt(a, 10) && t.writeInt64String(15, a),
            (a = e.getPrizeDescription()).length > 0 && t.writeString(16, a),
            (a = e.getFansLevelConfigListList()).length > 0 && t.writeRepeatedMessage(17, a, proto.webcast.data.LotteryFansLevelConfig.serializeBinaryToWriter),
            a = e.getAccountScores(),
            0 !== parseInt(a, 10) && t.writeInt64String(18, a),
            a = e.getNeedRechargeAmount(),
            0 !== parseInt(a, 10) && t.writeInt64String(19, a),
            (a = e.getRechargeSwitch()) && t.writeBool(20, a),
            (a = e.getExpandActivityInfoListList()).length > 0 && t.writeRepeatedMessage(21, a, proto.webcast.data.LotteryExpandActivityInfo.serializeBinaryToWriter),
            (a = e.getSendCountsList()).length > 0 && t.writePackedInt64String(22, a),
            (a = e.getSendIntervalList()).length > 0 && t.writePackedInt64String(23, a),
            (a = e.getSupportLaunchTask()) && t.writeBool(26, a),
            (a = e.getCustomizedConditionTypesList()).length > 0 && t.writeRepeatedMessage(50, a, proto.webcast.data.CustomizedCondition.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getCountDownsList = function() {
            return r.Message.getRepeatedField(this, 3)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setCountDownsList = function(e) {
            return r.Message.setField(this, 3, e || [])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.addCountDowns = function(e, t) {
            return r.Message.addToRepeatedField(this, 3, e, t)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.clearCountDownsList = function() {
            return this.setCountDownsList([])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getUserNumsList = function() {
            return r.Message.getRepeatedField(this, 1)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setUserNumsList = function(e) {
            return r.Message.setField(this, 1, e || [])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.addUserNums = function(e, t) {
            return r.Message.addToRepeatedField(this, 1, e, t)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.clearUserNumsList = function() {
            return this.setUserNumsList([])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getPrizeCountsList = function() {
            return r.Message.getRepeatedField(this, 2)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setPrizeCountsList = function(e) {
            return r.Message.setField(this, 2, e || [])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.addPrizeCounts = function(e, t) {
            return r.Message.addToRepeatedField(this, 2, e, t)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.clearPrizeCountsList = function() {
            return this.setPrizeCountsList([])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getDefaultConfig = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.LotteryDefaultConfig, 4)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setDefaultConfig = function(e) {
            return r.Message.setWrapperField(this, 4, e)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.clearDefaultConfig = function() {
            return this.setDefaultConfig(void 0)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.hasDefaultConfig = function() {
            return null != r.Message.getField(this, 4)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getPrizeType = function() {
            return r.Message.getFieldWithDefault(this, 5, 0)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setPrizeType = function(e) {
            return r.Message.setProto3IntField(this, 5, e)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getPrizeName = function() {
            return r.Message.getFieldWithDefault(this, 6, "")
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setPrizeName = function(e) {
            return r.Message.setProto3StringField(this, 6, e)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getUserConditionTypesList = function() {
            return r.Message.getRepeatedField(this, 7)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setUserConditionTypesList = function(e) {
            return r.Message.setField(this, 7, e || [])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.addUserConditionTypes = function(e, t) {
            return r.Message.addToRepeatedField(this, 7, e, t)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.clearUserConditionTypesList = function() {
            return this.setUserConditionTypesList([])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getLotteryConditionTypesList = function() {
            return r.Message.getRepeatedField(this, 8)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setLotteryConditionTypesList = function(e) {
            return r.Message.setField(this, 8, e || [])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.addLotteryConditionTypes = function(e, t) {
            return r.Message.addToRepeatedField(this, 8, e, t)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.clearLotteryConditionTypesList = function() {
            return this.setLotteryConditionTypesList([])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getGiftInfoListList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.GiftInfo, 9)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setGiftInfoListList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 9, e)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.addGiftInfoList = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 9, e, proto.webcast.data.GiftInfo, t)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.clearGiftInfoListList = function() {
            return this.setGiftInfoListList([])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getGiftCountsList = function() {
            return r.Message.getRepeatedField(this, 10)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setGiftCountsList = function(e) {
            return r.Message.setField(this, 10, e || [])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.addGiftCounts = function(e, t) {
            return r.Message.addToRepeatedField(this, 10, e, t)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.clearGiftCountsList = function() {
            return this.setGiftCountsList([])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getWhiteListList = function() {
            return r.Message.getRepeatedField(this, 11)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setWhiteListList = function(e) {
            return r.Message.setField(this, 11, e || [])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.addWhiteList = function(e, t) {
            return r.Message.addToRepeatedField(this, 11, e, t)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.clearWhiteListList = function() {
            return this.setWhiteListList([])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getBlackListList = function() {
            return r.Message.getRepeatedField(this, 12)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setBlackListList = function(e) {
            return r.Message.setField(this, 12, e || [])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.addBlackList = function(e, t) {
            return r.Message.addToRepeatedField(this, 12, e, t)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.clearBlackListList = function() {
            return this.setBlackListList([])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getEnable = function() {
            return r.Message.getFieldWithDefault(this, 13, "0")
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setEnable = function(e) {
            return r.Message.setProto3StringIntField(this, 13, e)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getPrizeAveragesList = function() {
            return r.Message.getRepeatedField(this, 14)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setPrizeAveragesList = function(e) {
            return r.Message.setField(this, 14, e || [])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.addPrizeAverages = function(e, t) {
            return r.Message.addToRepeatedField(this, 14, e, t)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.clearPrizeAveragesList = function() {
            return this.setPrizeAveragesList([])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getLotteryConfigType = function() {
            return r.Message.getFieldWithDefault(this, 15, "0")
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setLotteryConfigType = function(e) {
            return r.Message.setProto3StringIntField(this, 15, e)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getPrizeDescription = function() {
            return r.Message.getFieldWithDefault(this, 16, "")
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setPrizeDescription = function(e) {
            return r.Message.setProto3StringField(this, 16, e)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getFansLevelConfigListList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.LotteryFansLevelConfig, 17)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setFansLevelConfigListList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 17, e)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.addFansLevelConfigList = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 17, e, proto.webcast.data.LotteryFansLevelConfig, t)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.clearFansLevelConfigListList = function() {
            return this.setFansLevelConfigListList([])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getAccountScores = function() {
            return r.Message.getFieldWithDefault(this, 18, "0")
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setAccountScores = function(e) {
            return r.Message.setProto3StringIntField(this, 18, e)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getNeedRechargeAmount = function() {
            return r.Message.getFieldWithDefault(this, 19, "0")
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setNeedRechargeAmount = function(e) {
            return r.Message.setProto3StringIntField(this, 19, e)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getRechargeSwitch = function() {
            return r.Message.getBooleanFieldWithDefault(this, 20, !1)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setRechargeSwitch = function(e) {
            return r.Message.setProto3BooleanField(this, 20, e)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getExpandActivityInfoListList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.LotteryExpandActivityInfo, 21)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setExpandActivityInfoListList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 21, e)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.addExpandActivityInfoList = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 21, e, proto.webcast.data.LotteryExpandActivityInfo, t)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.clearExpandActivityInfoListList = function() {
            return this.setExpandActivityInfoListList([])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getSendCountsList = function() {
            return r.Message.getRepeatedField(this, 22)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setSendCountsList = function(e) {
            return r.Message.setField(this, 22, e || [])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.addSendCounts = function(e, t) {
            return r.Message.addToRepeatedField(this, 22, e, t)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.clearSendCountsList = function() {
            return this.setSendCountsList([])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getSendIntervalList = function() {
            return r.Message.getRepeatedField(this, 23)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setSendIntervalList = function(e) {
            return r.Message.setField(this, 23, e || [])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.addSendInterval = function(e, t) {
            return r.Message.addToRepeatedField(this, 23, e, t)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.clearSendIntervalList = function() {
            return this.setSendIntervalList([])
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getSupportLaunchTask = function() {
            return r.Message.getBooleanFieldWithDefault(this, 26, !1)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setSupportLaunchTask = function(e) {
            return r.Message.setProto3BooleanField(this, 26, e)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.getCustomizedConditionTypesList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.CustomizedCondition, 50)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.setCustomizedConditionTypesList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 50, e)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.addCustomizedConditionTypes = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 50, e, proto.webcast.data.CustomizedCondition, t)
        }
        ,
        proto.webcast.data.LotteryConfig.prototype.clearCustomizedConditionTypesList = function() {
            return this.setCustomizedConditionTypesList([])
        }
        ,
        proto.webcast.data.CustomizedCondition.repeatedFields_ = [4],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.CustomizedCondition.prototype.toObject = function(e) {
            return proto.webcast.data.CustomizedCondition.toObject(e, this)
        }
        ,
        proto.webcast.data.CustomizedCondition.toObject = function(e, t) {
            var a, o = {
                conditionType: r.Message.getFieldWithDefault(t, 1, 0),
                description: r.Message.getFieldWithDefault(t, 2, ""),
                remarks: r.Message.getFieldWithDefault(t, 3, ""),
                countDownsList: null == (a = r.Message.getRepeatedField(t, 4)) ? void 0 : a,
                bizInfo: r.Message.getFieldWithDefault(t, 50, "")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.CustomizedCondition.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.CustomizedCondition;
            return proto.webcast.data.CustomizedCondition.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.CustomizedCondition.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt32();
                    e.setConditionType(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setDescription(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setRemarks(a);
                    break;
                case 4:
                    for (var r = t.isDelimited() ? t.readPackedInt64String() : [t.readInt64String()], o = 0; o < r.length; o++)
                        e.addCountDowns(r[o]);
                    break;
                case 50:
                    a = t.readString();
                    e.setBizInfo(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.CustomizedCondition.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.CustomizedCondition.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.CustomizedCondition.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getConditionType()) && t.writeInt32(1, a),
            (a = e.getDescription()).length > 0 && t.writeString(2, a),
            (a = e.getRemarks()).length > 0 && t.writeString(3, a),
            (a = e.getCountDownsList()).length > 0 && t.writePackedInt64String(4, a),
            (a = e.getBizInfo()).length > 0 && t.writeString(50, a)
        }
        ,
        proto.webcast.data.CustomizedCondition.prototype.getConditionType = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.CustomizedCondition.prototype.setConditionType = function(e) {
            return r.Message.setProto3IntField(this, 1, e)
        }
        ,
        proto.webcast.data.CustomizedCondition.prototype.getDescription = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.CustomizedCondition.prototype.setDescription = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.CustomizedCondition.prototype.getRemarks = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.CustomizedCondition.prototype.setRemarks = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.CustomizedCondition.prototype.getCountDownsList = function() {
            return r.Message.getRepeatedField(this, 4)
        }
        ,
        proto.webcast.data.CustomizedCondition.prototype.setCountDownsList = function(e) {
            return r.Message.setField(this, 4, e || [])
        }
        ,
        proto.webcast.data.CustomizedCondition.prototype.addCountDowns = function(e, t) {
            return r.Message.addToRepeatedField(this, 4, e, t)
        }
        ,
        proto.webcast.data.CustomizedCondition.prototype.clearCountDownsList = function() {
            return this.setCountDownsList([])
        }
        ,
        proto.webcast.data.CustomizedCondition.prototype.getBizInfo = function() {
            return r.Message.getFieldWithDefault(this, 50, "")
        }
        ,
        proto.webcast.data.CustomizedCondition.prototype.setBizInfo = function(e) {
            return r.Message.setProto3StringField(this, 50, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.LotteryRewardDetail.prototype.toObject = function(e) {
            return proto.webcast.data.LotteryRewardDetail.toObject(e, this)
        }
        ,
        proto.webcast.data.LotteryRewardDetail.toObject = function(e, t) {
            var a = {
                prizeType: r.Message.getFieldWithDefault(t, 1, "0"),
                prizeName: r.Message.getFieldWithDefault(t, 2, ""),
                grantCount: r.Message.getFieldWithDefault(t, 3, "0"),
                expireTime: r.Message.getFieldWithDefault(t, 4, "0")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.LotteryRewardDetail.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.LotteryRewardDetail;
            return proto.webcast.data.LotteryRewardDetail.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.LotteryRewardDetail.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setPrizeType(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setPrizeName(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setGrantCount(a);
                    break;
                case 4:
                    a = t.readInt64String();
                    e.setExpireTime(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.LotteryRewardDetail.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.LotteryRewardDetail.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.LotteryRewardDetail.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getPrizeType(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            (a = e.getPrizeName()).length > 0 && t.writeString(2, a),
            a = e.getGrantCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a),
            a = e.getExpireTime(),
            0 !== parseInt(a, 10) && t.writeInt64String(4, a)
        }
        ,
        proto.webcast.data.LotteryRewardDetail.prototype.getPrizeType = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.LotteryRewardDetail.prototype.setPrizeType = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.LotteryRewardDetail.prototype.getPrizeName = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.LotteryRewardDetail.prototype.setPrizeName = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.LotteryRewardDetail.prototype.getGrantCount = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.LotteryRewardDetail.prototype.setGrantCount = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        proto.webcast.data.LotteryRewardDetail.prototype.getExpireTime = function() {
            return r.Message.getFieldWithDefault(this, 4, "0")
        }
        ,
        proto.webcast.data.LotteryRewardDetail.prototype.setExpireTime = function(e) {
            return r.Message.setProto3StringIntField(this, 4, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.LotteryExpandActivityInfo.prototype.toObject = function(e) {
            return proto.webcast.data.LotteryExpandActivityInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.toObject = function(e, t) {
            var a, o = {
                bizId: r.Message.getFieldWithDefault(t, 1, "0"),
                expandActivityId: r.Message.getFieldWithDefault(t, 2, ""),
                ruleText: r.Message.getFieldWithDefault(t, 3, ""),
                tipsText: r.Message.getFieldWithDefault(t, 4, ""),
                expandLuckyCount: r.Message.getFieldWithDefault(t, 5, "0"),
                expandGrantCount: r.Message.getFieldWithDefault(t, 6, "0"),
                extraMap: (a = t.getExtraMap()) ? a.toObject(e, void 0) : [],
                extraGiftBag: r.Message.getFieldWithDefault(t, 10, ""),
                bytepayVoucherSwitcher: r.Message.getFieldWithDefault(t, 11, "0")
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.LotteryExpandActivityInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.LotteryExpandActivityInfo;
            return proto.webcast.data.LotteryExpandActivityInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setBizId(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setExpandActivityId(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setRuleText(a);
                    break;
                case 4:
                    a = t.readString();
                    e.setTipsText(a);
                    break;
                case 5:
                    a = t.readInt64String();
                    e.setExpandLuckyCount(a);
                    break;
                case 6:
                    a = t.readInt64String();
                    e.setExpandGrantCount(a);
                    break;
                case 7:
                    a = e.getExtraMap();
                    t.readMessage(a, (function(e, t) {
                        r.Map.deserializeBinary(e, t, r.BinaryReader.prototype.readString, r.BinaryReader.prototype.readString, null, "", "")
                    }
                    ));
                    break;
                case 10:
                    a = t.readString();
                    e.setExtraGiftBag(a);
                    break;
                case 11:
                    a = t.readInt64String();
                    e.setBytepayVoucherSwitcher(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.LotteryExpandActivityInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getBizId(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            (a = e.getExpandActivityId()).length > 0 && t.writeString(2, a),
            (a = e.getRuleText()).length > 0 && t.writeString(3, a),
            (a = e.getTipsText()).length > 0 && t.writeString(4, a),
            a = e.getExpandLuckyCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(5, a),
            a = e.getExpandGrantCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(6, a),
            (a = e.getExtraMap(!0)) && a.getLength() > 0 && a.serializeBinary(7, t, r.BinaryWriter.prototype.writeString, r.BinaryWriter.prototype.writeString),
            (a = e.getExtraGiftBag()).length > 0 && t.writeString(10, a),
            a = e.getBytepayVoucherSwitcher(),
            0 !== parseInt(a, 10) && t.writeInt64String(11, a)
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.getBizId = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.setBizId = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.getExpandActivityId = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.setExpandActivityId = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.getRuleText = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.setRuleText = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.getTipsText = function() {
            return r.Message.getFieldWithDefault(this, 4, "")
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.setTipsText = function(e) {
            return r.Message.setProto3StringField(this, 4, e)
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.getExpandLuckyCount = function() {
            return r.Message.getFieldWithDefault(this, 5, "0")
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.setExpandLuckyCount = function(e) {
            return r.Message.setProto3StringIntField(this, 5, e)
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.getExpandGrantCount = function() {
            return r.Message.getFieldWithDefault(this, 6, "0")
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.setExpandGrantCount = function(e) {
            return r.Message.setProto3StringIntField(this, 6, e)
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.getExtraMap = function(e) {
            return r.Message.getMapField(this, 7, e, null)
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.clearExtraMap = function() {
            return this.getExtraMap().clear(),
            this
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.getExtraGiftBag = function() {
            return r.Message.getFieldWithDefault(this, 10, "")
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.setExtraGiftBag = function(e) {
            return r.Message.setProto3StringField(this, 10, e)
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.getBytepayVoucherSwitcher = function() {
            return r.Message.getFieldWithDefault(this, 11, "0")
        }
        ,
        proto.webcast.data.LotteryExpandActivityInfo.prototype.setBytepayVoucherSwitcher = function(e) {
            return r.Message.setProto3StringIntField(this, 11, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ExpandLotteryConfig.prototype.toObject = function(e) {
            return proto.webcast.data.ExpandLotteryConfig.toObject(e, this)
        }
        ,
        proto.webcast.data.ExpandLotteryConfig.toObject = function(e, t) {
            var a = {
                expandPrizeType: r.Message.getFieldWithDefault(t, 1, "0")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.ExpandLotteryConfig.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ExpandLotteryConfig;
            return proto.webcast.data.ExpandLotteryConfig.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ExpandLotteryConfig.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                if (1 === t.getFieldNumber()) {
                    var a = t.readInt64String();
                    e.setExpandPrizeType(a)
                } else
                    t.skipField()
            }
            return e
        }
        ,
        proto.webcast.data.ExpandLotteryConfig.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ExpandLotteryConfig.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ExpandLotteryConfig.serializeBinaryToWriter = function(e, t) {
            var a;
            a = e.getExpandPrizeType(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a)
        }
        ,
        proto.webcast.data.ExpandLotteryConfig.prototype.getExpandPrizeType = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.ExpandLotteryConfig.prototype.setExpandPrizeType = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.LotteryFansLevelConfig.prototype.toObject = function(e) {
            return proto.webcast.data.LotteryFansLevelConfig.toObject(e, this)
        }
        ,
        proto.webcast.data.LotteryFansLevelConfig.toObject = function(e, t) {
            var a = {
                level: r.Message.getFieldWithDefault(t, 1, "0"),
                dailyLimit: r.Message.getFieldWithDefault(t, 2, "0"),
                dailySendNum: r.Message.getFieldWithDefault(t, 3, "0")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.LotteryFansLevelConfig.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.LotteryFansLevelConfig;
            return proto.webcast.data.LotteryFansLevelConfig.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.LotteryFansLevelConfig.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setLevel(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setDailyLimit(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setDailySendNum(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.LotteryFansLevelConfig.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.LotteryFansLevelConfig.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.LotteryFansLevelConfig.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getLevel(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            a = e.getDailyLimit(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a),
            a = e.getDailySendNum(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a)
        }
        ,
        proto.webcast.data.LotteryFansLevelConfig.prototype.getLevel = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.LotteryFansLevelConfig.prototype.setLevel = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.LotteryFansLevelConfig.prototype.getDailyLimit = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.LotteryFansLevelConfig.prototype.setDailyLimit = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        proto.webcast.data.LotteryFansLevelConfig.prototype.getDailySendNum = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.LotteryFansLevelConfig.prototype.setDailySendNum = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.LotteryRegularlyConfig.prototype.toObject = function(e) {
            return proto.webcast.data.LotteryRegularlyConfig.toObject(e, this)
        }
        ,
        proto.webcast.data.LotteryRegularlyConfig.toObject = function(e, t) {
            var a = {
                times: r.Message.getFieldWithDefault(t, 1, 0),
                interval: r.Message.getFieldWithDefault(t, 2, 0)
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.LotteryRegularlyConfig.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.LotteryRegularlyConfig;
            return proto.webcast.data.LotteryRegularlyConfig.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.LotteryRegularlyConfig.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt32();
                    e.setTimes(a);
                    break;
                case 2:
                    a = t.readInt32();
                    e.setInterval(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.LotteryRegularlyConfig.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.LotteryRegularlyConfig.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.LotteryRegularlyConfig.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            0 !== (a = e.getTimes()) && t.writeInt32(1, a),
            0 !== (a = e.getInterval()) && t.writeInt32(2, a)
        }
        ,
        proto.webcast.data.LotteryRegularlyConfig.prototype.getTimes = function() {
            return r.Message.getFieldWithDefault(this, 1, 0)
        }
        ,
        proto.webcast.data.LotteryRegularlyConfig.prototype.setTimes = function(e) {
            return r.Message.setProto3IntField(this, 1, e)
        }
        ,
        proto.webcast.data.LotteryRegularlyConfig.prototype.getInterval = function() {
            return r.Message.getFieldWithDefault(this, 2, 0)
        }
        ,
        proto.webcast.data.LotteryRegularlyConfig.prototype.setInterval = function(e) {
            return r.Message.setProto3IntField(this, 2, e)
        }
        ,
        proto.webcast.data.LotteryInfo.repeatedFields_ = [8, 19, 26],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.LotteryInfo.prototype.toObject = function(e) {
            return proto.webcast.data.LotteryInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.LotteryInfo.toObject = function(e, t) {
            var a, o = {
                lotteryId: r.Message.getFieldWithDefault(t, 1, "0"),
                ownerUserId: r.Message.getFieldWithDefault(t, 2, "0"),
                anchorId: r.Message.getFieldWithDefault(t, 3, "0"),
                ownerType: r.Message.getFieldWithDefault(t, 4, 0),
                roomId: r.Message.getFieldWithDefault(t, 5, "0"),
                status: r.Message.getFieldWithDefault(t, 6, 0),
                prizeInfo: (a = t.getPrizeInfo()) && proto.webcast.data.LotteryPrize.toObject(e, a),
                conditionsList: r.Message.toObjectList(t.getConditionsList(), proto.webcast.data.LotteryCondition.toObject, e),
                prizeCount: r.Message.getFieldWithDefault(t, 9, "0"),
                luckyCount: r.Message.getFieldWithDefault(t, 10, "0"),
                countDown: r.Message.getFieldWithDefault(t, 11, "0"),
                startTime: r.Message.getFieldWithDefault(t, 12, "0"),
                drawTime: r.Message.getFieldWithDefault(t, 13, "0"),
                extra: r.Message.getFieldWithDefault(t, 14, ""),
                realLuckyCount: r.Message.getFieldWithDefault(t, 15, "0"),
                totalGrantCount: r.Message.getFieldWithDefault(t, 16, "0"),
                withdrawCount: r.Message.getFieldWithDefault(t, 17, "0"),
                realDrawTime: r.Message.getFieldWithDefault(t, 18, "0"),
                luckyUsersList: r.Message.toObjectList(t.getLuckyUsersList(), proto.webcast.data.LotteryLuckyUser.toObject, e),
                currentTime: r.Message.getFieldWithDefault(t, 20, "0"),
                candidateNum: r.Message.getFieldWithDefault(t, 21, "0"),
                lotteryIdStr: r.Message.getFieldWithDefault(t, 22, ""),
                roomIdStr: r.Message.getFieldWithDefault(t, 23, ""),
                secAnchorId: r.Message.getFieldWithDefault(t, 24, ""),
                secOwnerUserId: r.Message.getFieldWithDefault(t, 25, ""),
                expandActivityInfoListList: r.Message.toObjectList(t.getExpandActivityInfoListList(), proto.webcast.data.LotteryExpandActivityInfo.toObject, e),
                useNewDrawInteraction: r.Message.getBooleanFieldWithDefault(t, 27, !1),
                launchTaskId: r.Message.getFieldWithDefault(t, 30, ""),
                index: r.Message.getFieldWithDefault(t, 31, 0),
                launchTaskInfo: (a = t.getLaunchTaskInfo()) && proto.webcast.data.LaunchTaskInfo.toObject(e, a)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.LotteryInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.LotteryInfo;
            return proto.webcast.data.LotteryInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.LotteryInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setLotteryId(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setOwnerUserId(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setAnchorId(a);
                    break;
                case 4:
                    a = t.readInt32();
                    e.setOwnerType(a);
                    break;
                case 5:
                    a = t.readInt64String();
                    e.setRoomId(a);
                    break;
                case 6:
                    a = t.readInt32();
                    e.setStatus(a);
                    break;
                case 7:
                    a = new proto.webcast.data.LotteryPrize;
                    t.readMessage(a, proto.webcast.data.LotteryPrize.deserializeBinaryFromReader),
                    e.setPrizeInfo(a);
                    break;
                case 8:
                    a = new proto.webcast.data.LotteryCondition;
                    t.readMessage(a, proto.webcast.data.LotteryCondition.deserializeBinaryFromReader),
                    e.addConditions(a);
                    break;
                case 9:
                    a = t.readInt64String();
                    e.setPrizeCount(a);
                    break;
                case 10:
                    a = t.readInt64String();
                    e.setLuckyCount(a);
                    break;
                case 11:
                    a = t.readInt64String();
                    e.setCountDown(a);
                    break;
                case 12:
                    a = t.readInt64String();
                    e.setStartTime(a);
                    break;
                case 13:
                    a = t.readInt64String();
                    e.setDrawTime(a);
                    break;
                case 14:
                    a = t.readString();
                    e.setExtra(a);
                    break;
                case 15:
                    a = t.readInt64String();
                    e.setRealLuckyCount(a);
                    break;
                case 16:
                    a = t.readInt64String();
                    e.setTotalGrantCount(a);
                    break;
                case 17:
                    a = t.readInt64String();
                    e.setWithdrawCount(a);
                    break;
                case 18:
                    a = t.readInt64String();
                    e.setRealDrawTime(a);
                    break;
                case 19:
                    a = new proto.webcast.data.LotteryLuckyUser;
                    t.readMessage(a, proto.webcast.data.LotteryLuckyUser.deserializeBinaryFromReader),
                    e.addLuckyUsers(a);
                    break;
                case 20:
                    a = t.readInt64String();
                    e.setCurrentTime(a);
                    break;
                case 21:
                    a = t.readInt64String();
                    e.setCandidateNum(a);
                    break;
                case 22:
                    a = t.readString();
                    e.setLotteryIdStr(a);
                    break;
                case 23:
                    a = t.readString();
                    e.setRoomIdStr(a);
                    break;
                case 24:
                    a = t.readString();
                    e.setSecAnchorId(a);
                    break;
                case 25:
                    a = t.readString();
                    e.setSecOwnerUserId(a);
                    break;
                case 26:
                    a = new proto.webcast.data.LotteryExpandActivityInfo;
                    t.readMessage(a, proto.webcast.data.LotteryExpandActivityInfo.deserializeBinaryFromReader),
                    e.addExpandActivityInfoList(a);
                    break;
                case 27:
                    a = t.readBool();
                    e.setUseNewDrawInteraction(a);
                    break;
                case 30:
                    a = t.readString();
                    e.setLaunchTaskId(a);
                    break;
                case 31:
                    a = t.readInt32();
                    e.setIndex(a);
                    break;
                case 32:
                    a = new proto.webcast.data.LaunchTaskInfo;
                    t.readMessage(a, proto.webcast.data.LaunchTaskInfo.deserializeBinaryFromReader),
                    e.setLaunchTaskInfo(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.LotteryInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.LotteryInfo.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getLotteryId(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            a = e.getOwnerUserId(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a),
            a = e.getAnchorId(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a),
            0 !== (a = e.getOwnerType()) && t.writeInt32(4, a),
            a = e.getRoomId(),
            0 !== parseInt(a, 10) && t.writeInt64String(5, a),
            0 !== (a = e.getStatus()) && t.writeInt32(6, a),
            null != (a = e.getPrizeInfo()) && t.writeMessage(7, a, proto.webcast.data.LotteryPrize.serializeBinaryToWriter),
            (a = e.getConditionsList()).length > 0 && t.writeRepeatedMessage(8, a, proto.webcast.data.LotteryCondition.serializeBinaryToWriter),
            a = e.getPrizeCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(9, a),
            a = e.getLuckyCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(10, a),
            a = e.getCountDown(),
            0 !== parseInt(a, 10) && t.writeInt64String(11, a),
            a = e.getStartTime(),
            0 !== parseInt(a, 10) && t.writeInt64String(12, a),
            a = e.getDrawTime(),
            0 !== parseInt(a, 10) && t.writeInt64String(13, a),
            (a = e.getExtra()).length > 0 && t.writeString(14, a),
            a = e.getRealLuckyCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(15, a),
            a = e.getTotalGrantCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(16, a),
            a = e.getWithdrawCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(17, a),
            a = e.getRealDrawTime(),
            0 !== parseInt(a, 10) && t.writeInt64String(18, a),
            (a = e.getLuckyUsersList()).length > 0 && t.writeRepeatedMessage(19, a, proto.webcast.data.LotteryLuckyUser.serializeBinaryToWriter),
            a = e.getCurrentTime(),
            0 !== parseInt(a, 10) && t.writeInt64String(20, a),
            a = e.getCandidateNum(),
            0 !== parseInt(a, 10) && t.writeInt64String(21, a),
            (a = e.getLotteryIdStr()).length > 0 && t.writeString(22, a),
            (a = e.getRoomIdStr()).length > 0 && t.writeString(23, a),
            (a = e.getSecAnchorId()).length > 0 && t.writeString(24, a),
            (a = e.getSecOwnerUserId()).length > 0 && t.writeString(25, a),
            (a = e.getExpandActivityInfoListList()).length > 0 && t.writeRepeatedMessage(26, a, proto.webcast.data.LotteryExpandActivityInfo.serializeBinaryToWriter),
            (a = e.getUseNewDrawInteraction()) && t.writeBool(27, a),
            (a = e.getLaunchTaskId()).length > 0 && t.writeString(30, a),
            0 !== (a = e.getIndex()) && t.writeInt32(31, a),
            null != (a = e.getLaunchTaskInfo()) && t.writeMessage(32, a, proto.webcast.data.LaunchTaskInfo.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getLotteryId = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setLotteryId = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getOwnerUserId = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setOwnerUserId = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getAnchorId = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setAnchorId = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getOwnerType = function() {
            return r.Message.getFieldWithDefault(this, 4, 0)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setOwnerType = function(e) {
            return r.Message.setProto3IntField(this, 4, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getRoomId = function() {
            return r.Message.getFieldWithDefault(this, 5, "0")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setRoomId = function(e) {
            return r.Message.setProto3StringIntField(this, 5, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getStatus = function() {
            return r.Message.getFieldWithDefault(this, 6, 0)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setStatus = function(e) {
            return r.Message.setProto3IntField(this, 6, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getPrizeInfo = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.LotteryPrize, 7)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setPrizeInfo = function(e) {
            return r.Message.setWrapperField(this, 7, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.clearPrizeInfo = function() {
            return this.setPrizeInfo(void 0)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.hasPrizeInfo = function() {
            return null != r.Message.getField(this, 7)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getConditionsList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.LotteryCondition, 8)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setConditionsList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 8, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.addConditions = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 8, e, proto.webcast.data.LotteryCondition, t)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.clearConditionsList = function() {
            return this.setConditionsList([])
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getPrizeCount = function() {
            return r.Message.getFieldWithDefault(this, 9, "0")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setPrizeCount = function(e) {
            return r.Message.setProto3StringIntField(this, 9, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getLuckyCount = function() {
            return r.Message.getFieldWithDefault(this, 10, "0")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setLuckyCount = function(e) {
            return r.Message.setProto3StringIntField(this, 10, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getCountDown = function() {
            return r.Message.getFieldWithDefault(this, 11, "0")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setCountDown = function(e) {
            return r.Message.setProto3StringIntField(this, 11, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getStartTime = function() {
            return r.Message.getFieldWithDefault(this, 12, "0")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setStartTime = function(e) {
            return r.Message.setProto3StringIntField(this, 12, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getDrawTime = function() {
            return r.Message.getFieldWithDefault(this, 13, "0")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setDrawTime = function(e) {
            return r.Message.setProto3StringIntField(this, 13, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getExtra = function() {
            return r.Message.getFieldWithDefault(this, 14, "")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setExtra = function(e) {
            return r.Message.setProto3StringField(this, 14, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getRealLuckyCount = function() {
            return r.Message.getFieldWithDefault(this, 15, "0")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setRealLuckyCount = function(e) {
            return r.Message.setProto3StringIntField(this, 15, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getTotalGrantCount = function() {
            return r.Message.getFieldWithDefault(this, 16, "0")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setTotalGrantCount = function(e) {
            return r.Message.setProto3StringIntField(this, 16, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getWithdrawCount = function() {
            return r.Message.getFieldWithDefault(this, 17, "0")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setWithdrawCount = function(e) {
            return r.Message.setProto3StringIntField(this, 17, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getRealDrawTime = function() {
            return r.Message.getFieldWithDefault(this, 18, "0")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setRealDrawTime = function(e) {
            return r.Message.setProto3StringIntField(this, 18, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getLuckyUsersList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.LotteryLuckyUser, 19)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setLuckyUsersList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 19, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.addLuckyUsers = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 19, e, proto.webcast.data.LotteryLuckyUser, t)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.clearLuckyUsersList = function() {
            return this.setLuckyUsersList([])
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getCurrentTime = function() {
            return r.Message.getFieldWithDefault(this, 20, "0")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setCurrentTime = function(e) {
            return r.Message.setProto3StringIntField(this, 20, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getCandidateNum = function() {
            return r.Message.getFieldWithDefault(this, 21, "0")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setCandidateNum = function(e) {
            return r.Message.setProto3StringIntField(this, 21, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getLotteryIdStr = function() {
            return r.Message.getFieldWithDefault(this, 22, "")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setLotteryIdStr = function(e) {
            return r.Message.setProto3StringField(this, 22, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getRoomIdStr = function() {
            return r.Message.getFieldWithDefault(this, 23, "")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setRoomIdStr = function(e) {
            return r.Message.setProto3StringField(this, 23, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getSecAnchorId = function() {
            return r.Message.getFieldWithDefault(this, 24, "")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setSecAnchorId = function(e) {
            return r.Message.setProto3StringField(this, 24, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getSecOwnerUserId = function() {
            return r.Message.getFieldWithDefault(this, 25, "")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setSecOwnerUserId = function(e) {
            return r.Message.setProto3StringField(this, 25, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getExpandActivityInfoListList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.LotteryExpandActivityInfo, 26)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setExpandActivityInfoListList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 26, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.addExpandActivityInfoList = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 26, e, proto.webcast.data.LotteryExpandActivityInfo, t)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.clearExpandActivityInfoListList = function() {
            return this.setExpandActivityInfoListList([])
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getUseNewDrawInteraction = function() {
            return r.Message.getBooleanFieldWithDefault(this, 27, !1)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setUseNewDrawInteraction = function(e) {
            return r.Message.setProto3BooleanField(this, 27, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getLaunchTaskId = function() {
            return r.Message.getFieldWithDefault(this, 30, "")
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setLaunchTaskId = function(e) {
            return r.Message.setProto3StringField(this, 30, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getIndex = function() {
            return r.Message.getFieldWithDefault(this, 31, 0)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setIndex = function(e) {
            return r.Message.setProto3IntField(this, 31, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.getLaunchTaskInfo = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.LaunchTaskInfo, 32)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.setLaunchTaskInfo = function(e) {
            return r.Message.setWrapperField(this, 32, e)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.clearLaunchTaskInfo = function() {
            return this.setLaunchTaskInfo(void 0)
        }
        ,
        proto.webcast.data.LotteryInfo.prototype.hasLaunchTaskInfo = function() {
            return null != r.Message.getField(this, 32)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.LaunchTaskInfo.prototype.toObject = function(e) {
            return proto.webcast.data.LaunchTaskInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.LaunchTaskInfo.toObject = function(e, t) {
            var a, o = {
                launchTaskId: r.Message.getFieldWithDefault(t, 1, "0"),
                launchTaskIdStr: r.Message.getFieldWithDefault(t, 2, ""),
                launchTaskStatus: r.Message.getFieldWithDefault(t, 3, "0"),
                hadLaunchCount: r.Message.getFieldWithDefault(t, 5, "0"),
                lastLotteryId: r.Message.getFieldWithDefault(t, 6, "0"),
                regularlyConfig: (a = t.getRegularlyConfig()) && proto.webcast.data.LotteryRegularlyConfig.toObject(e, a)
            };
            return e && (o.$jspbMessageInstance = t),
            o
        }
        ),
        proto.webcast.data.LaunchTaskInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.LaunchTaskInfo;
            return proto.webcast.data.LaunchTaskInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.LaunchTaskInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setLaunchTaskId(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setLaunchTaskIdStr(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setLaunchTaskStatus(a);
                    break;
                case 5:
                    a = t.readInt64String();
                    e.setHadLaunchCount(a);
                    break;
                case 6:
                    a = t.readInt64String();
                    e.setLastLotteryId(a);
                    break;
                case 4:
                    a = new proto.webcast.data.LotteryRegularlyConfig;
                    t.readMessage(a, proto.webcast.data.LotteryRegularlyConfig.deserializeBinaryFromReader),
                    e.setRegularlyConfig(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.LaunchTaskInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.LaunchTaskInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.LaunchTaskInfo.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getLaunchTaskId(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            (a = e.getLaunchTaskIdStr()).length > 0 && t.writeString(2, a),
            a = e.getLaunchTaskStatus(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a),
            a = e.getHadLaunchCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(5, a),
            a = e.getLastLotteryId(),
            0 !== parseInt(a, 10) && t.writeInt64String(6, a),
            null != (a = e.getRegularlyConfig()) && t.writeMessage(4, a, proto.webcast.data.LotteryRegularlyConfig.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.LaunchTaskInfo.prototype.getLaunchTaskId = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.LaunchTaskInfo.prototype.setLaunchTaskId = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.LaunchTaskInfo.prototype.getLaunchTaskIdStr = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.LaunchTaskInfo.prototype.setLaunchTaskIdStr = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.LaunchTaskInfo.prototype.getLaunchTaskStatus = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.LaunchTaskInfo.prototype.setLaunchTaskStatus = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        proto.webcast.data.LaunchTaskInfo.prototype.getHadLaunchCount = function() {
            return r.Message.getFieldWithDefault(this, 5, "0")
        }
        ,
        proto.webcast.data.LaunchTaskInfo.prototype.setHadLaunchCount = function(e) {
            return r.Message.setProto3StringIntField(this, 5, e)
        }
        ,
        proto.webcast.data.LaunchTaskInfo.prototype.getLastLotteryId = function() {
            return r.Message.getFieldWithDefault(this, 6, "0")
        }
        ,
        proto.webcast.data.LaunchTaskInfo.prototype.setLastLotteryId = function(e) {
            return r.Message.setProto3StringIntField(this, 6, e)
        }
        ,
        proto.webcast.data.LaunchTaskInfo.prototype.getRegularlyConfig = function() {
            return r.Message.getWrapperField(this, proto.webcast.data.LotteryRegularlyConfig, 4)
        }
        ,
        proto.webcast.data.LaunchTaskInfo.prototype.setRegularlyConfig = function(e) {
            return r.Message.setWrapperField(this, 4, e)
        }
        ,
        proto.webcast.data.LaunchTaskInfo.prototype.clearRegularlyConfig = function() {
            return this.setRegularlyConfig(void 0)
        }
        ,
        proto.webcast.data.LaunchTaskInfo.prototype.hasRegularlyConfig = function() {
            return null != r.Message.getField(this, 4)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.LotteryPrize.prototype.toObject = function(e) {
            return proto.webcast.data.LotteryPrize.toObject(e, this)
        }
        ,
        proto.webcast.data.LotteryPrize.toObject = function(e, t) {
            var a = {
                prizeId: r.Message.getFieldWithDefault(t, 1, "0"),
                type: r.Message.getFieldWithDefault(t, 2, 0),
                name: r.Message.getFieldWithDefault(t, 3, ""),
                image: r.Message.getFieldWithDefault(t, 4, ""),
                prizeDescription: r.Message.getFieldWithDefault(t, 5, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.LotteryPrize.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.LotteryPrize;
            return proto.webcast.data.LotteryPrize.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.LotteryPrize.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setPrizeId(a);
                    break;
                case 2:
                    a = t.readInt32();
                    e.setType(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setName(a);
                    break;
                case 4:
                    a = t.readString();
                    e.setImage(a);
                    break;
                case 5:
                    a = t.readString();
                    e.setPrizeDescription(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.LotteryPrize.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.LotteryPrize.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.LotteryPrize.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getPrizeId(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            0 !== (a = e.getType()) && t.writeInt32(2, a),
            (a = e.getName()).length > 0 && t.writeString(3, a),
            (a = e.getImage()).length > 0 && t.writeString(4, a),
            (a = e.getPrizeDescription()).length > 0 && t.writeString(5, a)
        }
        ,
        proto.webcast.data.LotteryPrize.prototype.getPrizeId = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.LotteryPrize.prototype.setPrizeId = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.LotteryPrize.prototype.getType = function() {
            return r.Message.getFieldWithDefault(this, 2, 0)
        }
        ,
        proto.webcast.data.LotteryPrize.prototype.setType = function(e) {
            return r.Message.setProto3IntField(this, 2, e)
        }
        ,
        proto.webcast.data.LotteryPrize.prototype.getName = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.LotteryPrize.prototype.setName = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.LotteryPrize.prototype.getImage = function() {
            return r.Message.getFieldWithDefault(this, 4, "")
        }
        ,
        proto.webcast.data.LotteryPrize.prototype.setImage = function(e) {
            return r.Message.setProto3StringField(this, 4, e)
        }
        ,
        proto.webcast.data.LotteryPrize.prototype.getPrizeDescription = function() {
            return r.Message.getFieldWithDefault(this, 5, "")
        }
        ,
        proto.webcast.data.LotteryPrize.prototype.setPrizeDescription = function(e) {
            return r.Message.setProto3StringField(this, 5, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.LotteryCondition.prototype.toObject = function(e) {
            return proto.webcast.data.LotteryCondition.toObject(e, this)
        }
        ,
        proto.webcast.data.LotteryCondition.toObject = function(e, t) {
            var a = {
                conditionId: r.Message.getFieldWithDefault(t, 1, "0"),
                type: r.Message.getFieldWithDefault(t, 2, 0),
                content: r.Message.getFieldWithDefault(t, 3, ""),
                status: r.Message.getFieldWithDefault(t, 4, 0),
                description: r.Message.getFieldWithDefault(t, 5, ""),
                giftId: r.Message.getFieldWithDefault(t, 6, "0"),
                giftCount: r.Message.getFieldWithDefault(t, 7, "0"),
                giftName: r.Message.getFieldWithDefault(t, 8, ""),
                needDiamondCount: r.Message.getFieldWithDefault(t, 9, "0"),
                minFansLevel: r.Message.getFieldWithDefault(t, 10, "0"),
                remarks: r.Message.getFieldWithDefault(t, 30, ""),
                bizInfo: r.Message.getFieldWithDefault(t, 31, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.LotteryCondition.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.LotteryCondition;
            return proto.webcast.data.LotteryCondition.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.LotteryCondition.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setConditionId(a);
                    break;
                case 2:
                    a = t.readInt32();
                    e.setType(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setContent(a);
                    break;
                case 4:
                    a = t.readInt32();
                    e.setStatus(a);
                    break;
                case 5:
                    a = t.readString();
                    e.setDescription(a);
                    break;
                case 6:
                    a = t.readInt64String();
                    e.setGiftId(a);
                    break;
                case 7:
                    a = t.readInt64String();
                    e.setGiftCount(a);
                    break;
                case 8:
                    a = t.readString();
                    e.setGiftName(a);
                    break;
                case 9:
                    a = t.readInt64String();
                    e.setNeedDiamondCount(a);
                    break;
                case 10:
                    a = t.readInt64String();
                    e.setMinFansLevel(a);
                    break;
                case 30:
                    a = t.readString();
                    e.setRemarks(a);
                    break;
                case 31:
                    a = t.readString();
                    e.setBizInfo(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.LotteryCondition.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.LotteryCondition.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getConditionId(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            0 !== (a = e.getType()) && t.writeInt32(2, a),
            (a = e.getContent()).length > 0 && t.writeString(3, a),
            0 !== (a = e.getStatus()) && t.writeInt32(4, a),
            (a = e.getDescription()).length > 0 && t.writeString(5, a),
            a = e.getGiftId(),
            0 !== parseInt(a, 10) && t.writeInt64String(6, a),
            a = e.getGiftCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(7, a),
            (a = e.getGiftName()).length > 0 && t.writeString(8, a),
            a = e.getNeedDiamondCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(9, a),
            a = e.getMinFansLevel(),
            0 !== parseInt(a, 10) && t.writeInt64String(10, a),
            (a = e.getRemarks()).length > 0 && t.writeString(30, a),
            (a = e.getBizInfo()).length > 0 && t.writeString(31, a)
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.getConditionId = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.setConditionId = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.getType = function() {
            return r.Message.getFieldWithDefault(this, 2, 0)
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.setType = function(e) {
            return r.Message.setProto3IntField(this, 2, e)
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.getContent = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.setContent = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.getStatus = function() {
            return r.Message.getFieldWithDefault(this, 4, 0)
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.setStatus = function(e) {
            return r.Message.setProto3IntField(this, 4, e)
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.getDescription = function() {
            return r.Message.getFieldWithDefault(this, 5, "")
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.setDescription = function(e) {
            return r.Message.setProto3StringField(this, 5, e)
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.getGiftId = function() {
            return r.Message.getFieldWithDefault(this, 6, "0")
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.setGiftId = function(e) {
            return r.Message.setProto3StringIntField(this, 6, e)
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.getGiftCount = function() {
            return r.Message.getFieldWithDefault(this, 7, "0")
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.setGiftCount = function(e) {
            return r.Message.setProto3StringIntField(this, 7, e)
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.getGiftName = function() {
            return r.Message.getFieldWithDefault(this, 8, "")
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.setGiftName = function(e) {
            return r.Message.setProto3StringField(this, 8, e)
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.getNeedDiamondCount = function() {
            return r.Message.getFieldWithDefault(this, 9, "0")
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.setNeedDiamondCount = function(e) {
            return r.Message.setProto3StringIntField(this, 9, e)
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.getMinFansLevel = function() {
            return r.Message.getFieldWithDefault(this, 10, "0")
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.setMinFansLevel = function(e) {
            return r.Message.setProto3StringIntField(this, 10, e)
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.getRemarks = function() {
            return r.Message.getFieldWithDefault(this, 30, "")
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.setRemarks = function(e) {
            return r.Message.setProto3StringField(this, 30, e)
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.getBizInfo = function() {
            return r.Message.getFieldWithDefault(this, 31, "")
        }
        ,
        proto.webcast.data.LotteryCondition.prototype.setBizInfo = function(e) {
            return r.Message.setProto3StringField(this, 31, e)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.repeatedFields_ = [14],
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.LotteryLuckyUser.prototype.toObject = function(e) {
            return proto.webcast.data.LotteryLuckyUser.toObject(e, this)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.toObject = function(e, t) {
            var a = {
                luckyId: r.Message.getFieldWithDefault(t, 1, "0"),
                lotteryId: r.Message.getFieldWithDefault(t, 2, "0"),
                roomId: r.Message.getFieldWithDefault(t, 3, "0"),
                userId: r.Message.getFieldWithDefault(t, 4, "0"),
                userName: r.Message.getFieldWithDefault(t, 5, ""),
                avatarUrl: r.Message.getFieldWithDefault(t, 6, ""),
                grantCount: r.Message.getFieldWithDefault(t, 7, "0"),
                userExtraInfo: r.Message.getFieldWithDefault(t, 8, ""),
                orderInfo: r.Message.getFieldWithDefault(t, 9, ""),
                secUserId: r.Message.getFieldWithDefault(t, 10, ""),
                prizeType: r.Message.getFieldWithDefault(t, 11, "0"),
                prizeName: r.Message.getFieldWithDefault(t, 12, ""),
                expireTime: r.Message.getFieldWithDefault(t, 13, "0"),
                voucherPrizeListList: r.Message.toObjectList(t.getVoucherPrizeListList(), proto.webcast.data.VoucherPrizeInfo.toObject, e)
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.LotteryLuckyUser.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.LotteryLuckyUser;
            return proto.webcast.data.LotteryLuckyUser.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setLuckyId(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setLotteryId(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setRoomId(a);
                    break;
                case 4:
                    a = t.readInt64String();
                    e.setUserId(a);
                    break;
                case 5:
                    a = t.readString();
                    e.setUserName(a);
                    break;
                case 6:
                    a = t.readString();
                    e.setAvatarUrl(a);
                    break;
                case 7:
                    a = t.readInt64String();
                    e.setGrantCount(a);
                    break;
                case 8:
                    a = t.readString();
                    e.setUserExtraInfo(a);
                    break;
                case 9:
                    a = t.readString();
                    e.setOrderInfo(a);
                    break;
                case 10:
                    a = t.readString();
                    e.setSecUserId(a);
                    break;
                case 11:
                    a = t.readInt64String();
                    e.setPrizeType(a);
                    break;
                case 12:
                    a = t.readString();
                    e.setPrizeName(a);
                    break;
                case 13:
                    a = t.readInt64String();
                    e.setExpireTime(a);
                    break;
                case 14:
                    a = new proto.webcast.data.VoucherPrizeInfo;
                    t.readMessage(a, proto.webcast.data.VoucherPrizeInfo.deserializeBinaryFromReader),
                    e.addVoucherPrizeList(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.LotteryLuckyUser.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.LotteryLuckyUser.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getLuckyId(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            a = e.getLotteryId(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a),
            a = e.getRoomId(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a),
            a = e.getUserId(),
            0 !== parseInt(a, 10) && t.writeInt64String(4, a),
            (a = e.getUserName()).length > 0 && t.writeString(5, a),
            (a = e.getAvatarUrl()).length > 0 && t.writeString(6, a),
            a = e.getGrantCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(7, a),
            (a = e.getUserExtraInfo()).length > 0 && t.writeString(8, a),
            (a = e.getOrderInfo()).length > 0 && t.writeString(9, a),
            (a = e.getSecUserId()).length > 0 && t.writeString(10, a),
            a = e.getPrizeType(),
            0 !== parseInt(a, 10) && t.writeInt64String(11, a),
            (a = e.getPrizeName()).length > 0 && t.writeString(12, a),
            a = e.getExpireTime(),
            0 !== parseInt(a, 10) && t.writeInt64String(13, a),
            (a = e.getVoucherPrizeListList()).length > 0 && t.writeRepeatedMessage(14, a, proto.webcast.data.VoucherPrizeInfo.serializeBinaryToWriter)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.getLuckyId = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.setLuckyId = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.getLotteryId = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.setLotteryId = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.getRoomId = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.setRoomId = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.getUserId = function() {
            return r.Message.getFieldWithDefault(this, 4, "0")
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.setUserId = function(e) {
            return r.Message.setProto3StringIntField(this, 4, e)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.getUserName = function() {
            return r.Message.getFieldWithDefault(this, 5, "")
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.setUserName = function(e) {
            return r.Message.setProto3StringField(this, 5, e)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.getAvatarUrl = function() {
            return r.Message.getFieldWithDefault(this, 6, "")
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.setAvatarUrl = function(e) {
            return r.Message.setProto3StringField(this, 6, e)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.getGrantCount = function() {
            return r.Message.getFieldWithDefault(this, 7, "0")
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.setGrantCount = function(e) {
            return r.Message.setProto3StringIntField(this, 7, e)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.getUserExtraInfo = function() {
            return r.Message.getFieldWithDefault(this, 8, "")
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.setUserExtraInfo = function(e) {
            return r.Message.setProto3StringField(this, 8, e)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.getOrderInfo = function() {
            return r.Message.getFieldWithDefault(this, 9, "")
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.setOrderInfo = function(e) {
            return r.Message.setProto3StringField(this, 9, e)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.getSecUserId = function() {
            return r.Message.getFieldWithDefault(this, 10, "")
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.setSecUserId = function(e) {
            return r.Message.setProto3StringField(this, 10, e)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.getPrizeType = function() {
            return r.Message.getFieldWithDefault(this, 11, "0")
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.setPrizeType = function(e) {
            return r.Message.setProto3StringIntField(this, 11, e)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.getPrizeName = function() {
            return r.Message.getFieldWithDefault(this, 12, "")
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.setPrizeName = function(e) {
            return r.Message.setProto3StringField(this, 12, e)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.getExpireTime = function() {
            return r.Message.getFieldWithDefault(this, 13, "0")
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.setExpireTime = function(e) {
            return r.Message.setProto3StringIntField(this, 13, e)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.getVoucherPrizeListList = function() {
            return r.Message.getRepeatedWrapperField(this, proto.webcast.data.VoucherPrizeInfo, 14)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.setVoucherPrizeListList = function(e) {
            return r.Message.setRepeatedWrapperField(this, 14, e)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.addVoucherPrizeList = function(e, t) {
            return r.Message.addToRepeatedWrapperField(this, 14, e, proto.webcast.data.VoucherPrizeInfo, t)
        }
        ,
        proto.webcast.data.LotteryLuckyUser.prototype.clearVoucherPrizeListList = function() {
            return this.setVoucherPrizeListList([])
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.VoucherPrizeInfo.prototype.toObject = function(e) {
            return proto.webcast.data.VoucherPrizeInfo.toObject(e, this)
        }
        ,
        proto.webcast.data.VoucherPrizeInfo.toObject = function(e, t) {
            var a = {
                prizeAmount: r.Message.getFieldWithDefault(t, 1, ""),
                prizeBatchName: r.Message.getFieldWithDefault(t, 2, ""),
                expireTime: r.Message.getFieldWithDefault(t, 3, "0"),
                prizeUnit: r.Message.getFieldWithDefault(t, 4, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.VoucherPrizeInfo.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.VoucherPrizeInfo;
            return proto.webcast.data.VoucherPrizeInfo.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.VoucherPrizeInfo.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setPrizeAmount(a);
                    break;
                case 2:
                    a = t.readString();
                    e.setPrizeBatchName(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setExpireTime(a);
                    break;
                case 4:
                    a = t.readString();
                    e.setPrizeUnit(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.VoucherPrizeInfo.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.VoucherPrizeInfo.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.VoucherPrizeInfo.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getPrizeAmount()).length > 0 && t.writeString(1, a),
            (a = e.getPrizeBatchName()).length > 0 && t.writeString(2, a),
            a = e.getExpireTime(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a),
            (a = e.getPrizeUnit()).length > 0 && t.writeString(4, a)
        }
        ,
        proto.webcast.data.VoucherPrizeInfo.prototype.getPrizeAmount = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.VoucherPrizeInfo.prototype.setPrizeAmount = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.VoucherPrizeInfo.prototype.getPrizeBatchName = function() {
            return r.Message.getFieldWithDefault(this, 2, "")
        }
        ,
        proto.webcast.data.VoucherPrizeInfo.prototype.setPrizeBatchName = function(e) {
            return r.Message.setProto3StringField(this, 2, e)
        }
        ,
        proto.webcast.data.VoucherPrizeInfo.prototype.getExpireTime = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.VoucherPrizeInfo.prototype.setExpireTime = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        proto.webcast.data.VoucherPrizeInfo.prototype.getPrizeUnit = function() {
            return r.Message.getFieldWithDefault(this, 4, "")
        }
        ,
        proto.webcast.data.VoucherPrizeInfo.prototype.setPrizeUnit = function(e) {
            return r.Message.setProto3StringField(this, 4, e)
        }
        ,
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.LotteryGiftGuide.prototype.toObject = function(e) {
            return proto.webcast.data.LotteryGiftGuide.toObject(e, this)
        }
        ,
        proto.webcast.data.LotteryGiftGuide.toObject = function(e, t) {
            var a = {
                giftId: r.Message.getFieldWithDefault(t, 1, "0"),
                giftDiamondCount: r.Message.getFieldWithDefault(t, 2, "0"),
                giftName: r.Message.getFieldWithDefault(t, 3, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.LotteryGiftGuide.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.LotteryGiftGuide;
            return proto.webcast.data.LotteryGiftGuide.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.LotteryGiftGuide.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readInt64String();
                    e.setGiftId(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setGiftDiamondCount(a);
                    break;
                case 3:
                    a = t.readString();
                    e.setGiftName(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.LotteryGiftGuide.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.LotteryGiftGuide.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.LotteryGiftGuide.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            a = e.getGiftId(),
            0 !== parseInt(a, 10) && t.writeInt64String(1, a),
            a = e.getGiftDiamondCount(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a),
            (a = e.getGiftName()).length > 0 && t.writeString(3, a)
        }
        ,
        proto.webcast.data.LotteryGiftGuide.prototype.getGiftId = function() {
            return r.Message.getFieldWithDefault(this, 1, "0")
        }
        ,
        proto.webcast.data.LotteryGiftGuide.prototype.setGiftId = function(e) {
            return r.Message.setProto3StringIntField(this, 1, e)
        }
        ,
        proto.webcast.data.LotteryGiftGuide.prototype.getGiftDiamondCount = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.LotteryGiftGuide.prototype.setGiftDiamondCount = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        proto.webcast.data.LotteryGiftGuide.prototype.getGiftName = function() {
            return r.Message.getFieldWithDefault(this, 3, "")
        }
        ,
        proto.webcast.data.LotteryGiftGuide.prototype.setGiftName = function(e) {
            return r.Message.setProto3StringField(this, 3, e)
        }
        ,
        proto.webcast.data.ExpandPrizeType = {
            EXPANDPRIZETYPE_UNKNOWN: 0,
            EXPANDPRIZETYPE_GAME: 100
        },
        proto.webcast.data.LotterySendType = {
            LOTTERYSENDTYPEUNKNOWN: 0,
            LOTTERYSENDTYPEIMMEDIATELY: 1,
            LOTTERYSENDTYPEMANUAL: 2,
            LOTTERYSENDTYPEREGULARLY: 3
        },
        proto.webcast.data.IdTypeForFudaiBiz = {
            IDTYPEFUDAIBIZUNKNOWN: 0,
            IDTYPEFUDAIBIZLOTTERYID: 1,
            IDTYPEFUDAIBIZLAUNCHTASKID: 2,
            IDTYPEFUDAIBIZROOMID: 3
        },
        o.object.extend(t, proto.webcast.data)
    }
    ,
    65252: (e,t,a)=>{
        var r = a(47865)
          , o = r
          , i = function() {
            return this ? this : "undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : Function("return this")()
        }
        .call(null);
        o.exportSymbol("proto.webcast.data.MoreLiveEntrance", null, i),
        proto.webcast.data.MoreLiveEntrance = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.MoreLiveEntrance, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.MoreLiveEntrance.displayName = "proto.webcast.data.MoreLiveEntrance"),
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.MoreLiveEntrance.prototype.toObject = function(e) {
            return proto.webcast.data.MoreLiveEntrance.toObject(e, this)
        }
        ,
        proto.webcast.data.MoreLiveEntrance.toObject = function(e, t) {
            var a = {
                name: r.Message.getFieldWithDefault(t, 1, ""),
                tabType: r.Message.getFieldWithDefault(t, 2, "0"),
                validTime: r.Message.getFieldWithDefault(t, 3, "0"),
                priority: r.Message.getFieldWithDefault(t, 4, "0"),
                extra: r.Message.getFieldWithDefault(t, 5, ""),
                eventExtra: r.Message.getFieldWithDefault(t, 6, "")
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.MoreLiveEntrance.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.MoreLiveEntrance;
            return proto.webcast.data.MoreLiveEntrance.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.MoreLiveEntrance.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                switch (t.getFieldNumber()) {
                case 1:
                    var a = t.readString();
                    e.setName(a);
                    break;
                case 2:
                    a = t.readInt64String();
                    e.setTabType(a);
                    break;
                case 3:
                    a = t.readInt64String();
                    e.setValidTime(a);
                    break;
                case 4:
                    a = t.readInt64String();
                    e.setPriority(a);
                    break;
                case 5:
                    a = t.readString();
                    e.setExtra(a);
                    break;
                case 6:
                    a = t.readString();
                    e.setEventExtra(a);
                    break;
                default:
                    t.skipField()
                }
            }
            return e
        }
        ,
        proto.webcast.data.MoreLiveEntrance.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.MoreLiveEntrance.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.MoreLiveEntrance.serializeBinaryToWriter = function(e, t) {
            var a = void 0;
            (a = e.getName()).length > 0 && t.writeString(1, a),
            a = e.getTabType(),
            0 !== parseInt(a, 10) && t.writeInt64String(2, a),
            a = e.getValidTime(),
            0 !== parseInt(a, 10) && t.writeInt64String(3, a),
            a = e.getPriority(),
            0 !== parseInt(a, 10) && t.writeInt64String(4, a),
            (a = e.getExtra()).length > 0 && t.writeString(5, a),
            (a = e.getEventExtra()).length > 0 && t.writeString(6, a)
        }
        ,
        proto.webcast.data.MoreLiveEntrance.prototype.getName = function() {
            return r.Message.getFieldWithDefault(this, 1, "")
        }
        ,
        proto.webcast.data.MoreLiveEntrance.prototype.setName = function(e) {
            return r.Message.setProto3StringField(this, 1, e)
        }
        ,
        proto.webcast.data.MoreLiveEntrance.prototype.getTabType = function() {
            return r.Message.getFieldWithDefault(this, 2, "0")
        }
        ,
        proto.webcast.data.MoreLiveEntrance.prototype.setTabType = function(e) {
            return r.Message.setProto3StringIntField(this, 2, e)
        }
        ,
        proto.webcast.data.MoreLiveEntrance.prototype.getValidTime = function() {
            return r.Message.getFieldWithDefault(this, 3, "0")
        }
        ,
        proto.webcast.data.MoreLiveEntrance.prototype.setValidTime = function(e) {
            return r.Message.setProto3StringIntField(this, 3, e)
        }
        ,
        proto.webcast.data.MoreLiveEntrance.prototype.getPriority = function() {
            return r.Message.getFieldWithDefault(this, 4, "0")
        }
        ,
        proto.webcast.data.MoreLiveEntrance.prototype.setPriority = function(e) {
            return r.Message.setProto3StringIntField(this, 4, e)
        }
        ,
        proto.webcast.data.MoreLiveEntrance.prototype.getExtra = function() {
            return r.Message.getFieldWithDefault(this, 5, "")
        }
        ,
        proto.webcast.data.MoreLiveEntrance.prototype.setExtra = function(e) {
            return r.Message.setProto3StringField(this, 5, e)
        }
        ,
        proto.webcast.data.MoreLiveEntrance.prototype.getEventExtra = function() {
            return r.Message.getFieldWithDefault(this, 6, "")
        }
        ,
        proto.webcast.data.MoreLiveEntrance.prototype.setEventExtra = function(e) {
            return r.Message.setProto3StringField(this, 6, e)
        }
        ,
        o.object.extend(t, proto.webcast.data)
    }
    ,
    74813: (e,t,a)=>{
        var r = a(47865)
          , o = r
          , i = function() {
            return this ? this : "undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : Function("return this")()
        }
        .call(null);
        o.exportSymbol("proto.webcast.data.ProfitInteractionSetting", null, i),
        proto.webcast.data.ProfitInteractionSetting = function(e) {
            r.Message.initialize(this, e, 0, -1, null, null)
        }
        ,
        o.inherits(proto.webcast.data.ProfitInteractionSetting, r.Message),
        o.DEBUG && !COMPILED && (proto.webcast.data.ProfitInteractionSetting.displayName = "proto.webcast.data.ProfitInteractionSetting"),
        r.Message.GENERATE_TO_OBJECT && (proto.webcast.data.ProfitInteractionSetting.prototype.toObject = function(e) {
            return proto.webcast.data.ProfitInteractionSetting.toObject(e, this)
        }
        ,
        proto.webcast.data.ProfitInteractionSetting.toObject = function(e, t) {
            var a = {
                showInteractionScoreClose: r.Message.getBooleanFieldWithDefault(t, 1, !1)
            };
            return e && (a.$jspbMessageInstance = t),
            a
        }
        ),
        proto.webcast.data.ProfitInteractionSetting.deserializeBinary = function(e) {
            var t = new r.BinaryReader(e)
              , a = new proto.webcast.data.ProfitInteractionSetting;
            return proto.webcast.data.ProfitInteractionSetting.deserializeBinaryFromReader(a, t)
        }
        ,
        proto.webcast.data.ProfitInteractionSetting.deserializeBinaryFromReader = function(e, t) {
            for (; t.nextField() && !t.isEndGroup(); ) {
                if (1 === t.getFieldNumber()) {
                    var a = t.readBool();
                    e.setShowInteractionScoreClose(a)
                } else
                    t.skipField()
            }
            return e
        }
        ,
        proto.webcast.data.ProfitInteractionSetting.prototype.serializeBinary = function() {
            var e = new r.BinaryWriter;
            return proto.webcast.data.ProfitInteractionSetting.serializeBinaryToWriter(this, e),
            e.getResultBuffer()
        }
        ,
        proto.webcast.data.ProfitInteractionSetting.serializeBinaryToWriter = function(e, t) {
            var a;
            (a = e.getShowInteractionScoreClose()) && t.writeBool(1, a)
        }
        ,
        proto.webcast.data.ProfitInteractionSetting.prototype.getShowInteractionScoreClose = function() {
            return r.Message.getBooleanFieldWithDefault(this, 1, !1)
        }
        ,
        proto.webcast.data.ProfitInteractionSetting.prototype.setShowInteractionScoreClose = function(e) {
            return r.Message.setProto3BooleanField(this, 1, e)
        }
        ,
        o.object.extend(t, proto.webcast.data)
    }
}]);


})();