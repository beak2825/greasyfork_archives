// ==UserScript==
// @name         BIM360 DLL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  TEMP
// @author       You
// @match        https://docs.b360.autodesk.com/projects/e85ae27c-5c16-48cd-ab63-26824d9d3871/folders/urn:adsk.wipprod:fs.folder:co.C0yyLeaHRDe6PpXuAtkYkQ/detail
// @icon         https://www.google.com/s2/favicons?domain=autodesk.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433606/BIM360%20DLL.user.js
// @updateURL https://update.greasyfork.org/scripts/433606/BIM360%20DLL.meta.js
// ==/UserScript==

// Markups and issues should ideally be input through component frameowrk
//import { store, ReactUIUtils, ReactUIConsts, actions, mixpanel } from '@adsk/docs-react-ui';

angular.module('DM').directive('bimviewer', [
  '$rootScope',
  '$timeout',
  '$state',
  '$window',
  '$sce',
  'TokenService',
  'UtilService',
  'DmConstants',
  'DocumentService',
  'DownloadService',
  'ConnectViewerDocumentService',
  'ViewerModalService',
  'SharedDataService',
  'FolderService',
  'MODAL_SIDE_PANEL',
  'eventing',
  'FileTypeService',
  'MatrixModulesService',
  'ViewHistoryService',
  'CalloutLinkDocumentService',
  'ActivitiesService',
  'IssuesUiConfigurationService',
  'FeatureToggleService',
  'BubbleService',
  'ConnectReduxService',
  (
    $rootScope,
    $timeout,
    $state,
    $window,
    $sce,
    TokenService,
    UtilService,
    DmConstants,
    DocumentService,
    DownloadService,
    ConnectViewerDocumentService,
    ViewerModalService,
    SharedDataService,
    FolderService,
    MODAL_SIDE_PANEL,
    eventing,
    FileTypeService,
    MatrixModulesService,
    ViewHistoryService,
    CalloutLinkDocumentService,
    ActivitiesService,
    IssuesUiConfigurationService,
    FeatureToggleService,
    BubbleService,
    ConnectReduxService
  ) => ({
    restrict: 'E',
    templateUrl: 'bimviewer_layout.html',
    replace: false,
    link(scope) {
      // Private vars
      const { emitter } = eventing;
      const { events } = eventing;

      // scope vars
      scope.activePanel = {};
      scope.bimViewerApp = null;
      scope.bimViewerContainerId = 'bimViewerContainer';
      scope.bimViewerOptions = {};
      scope.fullScreen = false;
      scope.issueEditEnabled = false;
      scope.layoutOptions = {};
      scope.markupEditEnabled = false;
      scope.showLoadingFailurePage = false;
      scope.showFailureTitle = false;
      scope.showLoadingPage = true;
      scope.versionListSelected = false;
      scope.viewerPromise = null;
      scope.viewerConfig = {};
      scope.imageCropAreaSelected = false;
      scope.row = {};
      scope.foldersMap = {};
      scope.displayEntityFolder = {};
      scope.moreActions = {};
      scope.showMoreActions = false;
      scope.showPreparingToDownload = false;
      scope.inDiffMode = false;
      scope.showCropImageSpinner = false;
      scope.bim360LmvViewer = null;
      scope.showPlaceMeHeader = false;

      // Compare from document list
      if (scope.multiBimViewerOptions && scope.multiBimViewerOptions.documents) {
        if (scope.multiBimViewerOptions.documents.length === 2) {
          scope.inCompareMode = true;
          scope.showCompareHeader = true;
        }
      }

      let _getParentFolderPromise = Promise.resolve();
      let _VersionsP = null;
      let _dropMeViewerObserver = null;
      // We use this _showPlaceMeHeader variable instead of scope.showPlaceMeHeader directly
      // because sometimes we don't want scope.$watch('showPlaceMeHeader') to be called immediately.
      let _showPlaceMeHeader = false;

      let _processedVersionUrn = '';

      const _emitterKeys = new Set(); // Used to remove listeners on scope destroyed.
      const onEmitterEvent = (key, fn) => {
        _emitterKeys.add(key);
        emitter.on(key, fn);
      };

      const _addDropMeViewerObserver = () => {
        if (!_dropMeViewerObserver) {
          _dropMeViewerObserver = new scope.bim360LmvViewer.DropMeViewerObserver();
          scope.bimViewerApp.addViewerObserver(_dropMeViewerObserver);
        }
      };

      scope.setBimViewerApp = (bimViewerApp) => {
        scope.bimViewerApp = bimViewerApp;
      };

      scope.getDocumentVersions = function() {
        const _viewerDocument = scope.getDisplayDocEntity();

        // If haven't request yet or the document changed, request versions again
        if (!_VersionsP || _VersionsP.urn !== _viewerDocument.fileUrn) {
          _VersionsP = DocumentService.getVersionedFileList(
            SharedDataService.currentProject.id,
            _viewerDocument.selectedFolderUrn || _viewerDocument.parentFolderUrn,
            _viewerDocument.fileUrn
          );
          _VersionsP.urn = _viewerDocument.fileUrn;
        }

        return _VersionsP;
      };

      scope.getDisplayDocEntity = () => ViewerModalService.getViewerOptions().getDisplayDocEntity();

      scope.getViewable = () => ViewerModalService.getViewerOptions().getViewable();

      scope.exportVisible = function(currentDoc) {
        return (
          FileTypeService.getFileExtension(currentDoc.file_name) === 'pdf' &&
          !DocumentService.isProcessFailure(currentDoc) &&
          !DocumentService.isProcessing(currentDoc)
        );
      };

      scope.printVisible = (versionedFile) => {
        // For now, isAllowedAction needs to pass parent folder to check permission
        // This is OK for folder view, but will be a problem for Sets view.
        // It is because SharedDataService.selectedFolder maybe null when init Sets view
        // and SharedDataService.selectedFolder is the default folder of isAllowedAction function
        // If no folder is passed, all the permission check results(except admin) are false
        return (
          scope.viewerInstance &&
          scope.viewerInstance.model &&
          !scope.inCompareMode &&
          !scope.splitViewActived &&
          !scope.isShowOfficeViewer &&
          !scope.isShowVideoViewer &&
          scope.isAllowedAction('print', scope.displayEntityFolder)
        );
      };

      scope.downloadVersionedSourceFile = (versionedFile) => {
        const { currentDoc } = scope.getDisplayDocEntity();
        const formattedVersionedFile = {
          file_name: ConnectViewerDocumentService.folderVisibleTypeIsDocument(versionedFile)
            ? versionedFile.parent_lineage_file_name
            : versionedFile.name
        };
        Object.assign(formattedVersionedFile, versionedFile);
        DownloadService.downloadSourceFile([{ ...currentDoc, current_version: formattedVersionedFile }]);
      };

      scope.exportVersionedFile = (versionedFile) => {
        const folder = scope.displayEntityFolder;
        const formattedVersionedFile = {
          parent_folder_urn: folder.urn,
          file_name: versionedFile.name
        };
        Object.assign(formattedVersionedFile, versionedFile);
        DownloadService.exportPDF([formattedVersionedFile], { folder });
      };

      scope.print = (file) => {
        scope.bim360LmvViewer.printScreen(scope.viewerInstance);
      };

      scope.savePrintEvent = () => {
        const file = scope.getDisplayDocEntity();
        store.dispatch(
          actions.logMixpanel({
            event: mixpanel.MixpanelEvents.print,
            params: [file.currentDoc, FolderService.getFolderType()]
          })
        );
        ActivitiesService.postPrintActivity(file, scope.versionedFile.urn);
      };

      scope.shareLink = (versionedFile, parentFolderUrn) => {
        const item = {
          ...versionedFile,
          parent_folder_urn: parentFolderUrn,
          version_urn: versionedFile.urn,
          parent_folder: scope.displayEntityFolder
        };
        store.dispatch(
          actions.showShareLinkModal({
            sharedEntity: item,
            uiEntrance: mixpanel.MIXPANEL_CONSTS.UI_ENTRANCE.VIEWER_HEADER
          })
        );
      };

      scope.resizeViewer = () => {
        if (scope.bimViewerApp) {
          // Use timeout to resize the viewer righ after the container is resized.
          $timeout(function() {
            if (scope.bimViewerApp) {
              const viewer = scope.bimViewerApp.viewer;
              viewer && viewer.resize();
            }
          }, 0);
        }
      };

      scope.showViewerPanel = function(show) {
        const viewerExplorer = document.querySelector('div#bimViewerExplorerContainer');
        const viewerContainer = document.querySelector('div#viewerContainer');
        // ??? Title block need reset view panel width
        // ??? currently add an option to do that.
        // ??? Later, need refactor bim viewer layout
        // ??? so that user can add new css class to redefine view panel width.
        if (viewerExplorer && viewerContainer) {
          if (show) {
            const { viewPanelWidth } = scope.layoutOptions;
            viewerExplorer.style.width = viewPanelWidth;
            viewerExplorer.style.display = 'block';
            viewerContainer.style.marginLeft = viewPanelWidth;
          } else {
            viewerExplorer.style.width = 0;
            viewerExplorer.style.display = 'none';
            viewerContainer.style.marginLeft = 0;
          }
        }
        scope.resizeViewer();
      };

      scope.showViewerToolbar = (viewer, show) => {
        if (viewer && viewer.toolbar && viewer.toolbar.container) {
          const toolbarContainer = viewer.toolbar.container;
          toolbarContainer.style.display = show ? 'block' : 'none';
        }
      };

      scope.onClickPivotItem = function(item) {
        store.dispatch(actions.logMixpanel({ event: mixpanel.MixpanelEvents.openViewerPanel, params: [item.id] }));
        scope.showViewerPanel(true);
        scope.activePanel = item;
      };

      scope.closeViewerPanel = function() {
        scope.activePanel = {};
        scope.showViewerPanel(false);
      };

      // ??? TODO: Temporary function, needs refactor later.
      scope.onViewerError = function(errorMsg, errorTitle) {
        scope.showLoadingPage = false;
        scope.showLoadingFailurePage = true;
        scope.showFailureTitle = !!errorTitle;
        scope.failureTitle = errorTitle;
        scope.txtLoading = errorMsg;
        scope.$evalAsync();
      };

      scope.closeFailurePage = () => {
        scope.showLoadingFailurePage = false;
      };

      // //////////////////////////////////////////////////////////////////// #
      // Method list for define a new title block
      // //////////////////////////////////////////////////////////////////// #
      scope.createTitleBlock = function() {
        if (scope.bimViewerApp) {
          const viewer = scope.bimViewerApp.viewer;
          viewer && viewer.fireEvent({ type: Autodesk.Viewing.IMAGE_CROP_EVENT });
          scope.showCropImageSpinner = true;

          $timeout(function() {
            if (scope.fullScreen) {
              viewer && viewer.nextScreenMode();
            }
          });
        }
      };

      $rootScope.$on('showCropImageSpinner', (_event, value) => {
        scope.showCropImageSpinner = value;
      });

      scope.openSwitchDocumentDialog = () => $rootScope.$broadcast('titleBlockSwitchDocument');

      scope.openSheetListItem = function() {
        const sheetItem = ViewerModalService.getViewerOptions().getSidePanelItemByID(MODAL_SIDE_PANEL.SHEETLIST);
        if (sheetItem) {
          scope.onClickPivotItem(sheetItem);
        }
      };

      scope.isDefineNewTitleBlock = function() {
        const viewableGuid = _.get(scope, 'currentTitleBlock.current_version.document_viewable_guid');
        return !viewableGuid;
      };
      // //////////////////////////////////////////////////////////////////// #

      const _initViewPanel = function(sidePanelItems) {
        const viewerContainer = document.querySelector('div#viewerContainer');
        const pivotBar = document.querySelector('div#bimViewerPivotBar');
        const pivotBarWidth = scope.layoutOptions.sidePanel.enabled ? pivotBar.clientWidth : 0;
        viewerContainer.style.left = pivotBarWidth + 'px';
      };

      const getDefaultModalTitle = () => scope.getDisplayDocEntity().name;

      const _moreActionsVisible = (folder) => {
        return (
          SharedDataService.permission.isAdmin() ||
          ['download', 'shareLink', 'print'].some((action) => scope.isAllowedAction(action, folder))
        );
      };

      const isLatestVersion = () => {
        const { currentDoc, versionedFile } = scope.getDisplayDocEntity();
        const currentVersionNum = Number(scope.getDisplayDocEntity().currentVersionNum);
        if (versionedFile) {
          return versionedFile.version_number === currentDoc.latest_version;
        }
        return _.get(currentDoc, 'latest_version') === currentVersionNum;
      };

      // ALEX-34671: [Title Block] PDF content cannot be loaded during defining title block.
      // This function is to get the documentVersion used in viewer.loadDocumentAndItem.
      // In viewer.loadDocumentAndItem, it will not call loadItem() if we call loadDocumentAndItem twice with documentVersion = NaN.
      // So do not call Number() if the currentVersionNum is undefined, otherwise it would be NaN.
      const _getDocumentVersionNumber = () => {
        const { currentVersionNum } = scope.getDisplayDocEntity();
        return currentVersionNum && Number(currentVersionNum);
      };

      const _updateTitleBarInfo = () => {
        const { currentDoc, versionedFile } = scope.getDisplayDocEntity();
        const currentVersionNum = Number(scope.getDisplayDocEntity().currentVersionNum);
        scope.layoutOptions = scope.viewerConfig.getModalDisplayOptions();
        scope.row.entity = currentDoc;
        if (versionedFile) {
          scope.layoutOptions.titleBar.title = versionedFile.name;
          scope.layoutOptions.titleBar.versionNumber = 'V' + versionedFile.revision_number;
          scope.layoutOptions.titleBar.setsName = _.get(versionedFile, 'sets[0].name');
          scope.layoutOptions.titleBar.isCurrentSet = versionedFile.version_number === currentDoc.current_set_version;
          scope.versionedFile = versionedFile;
        } else {
          const revisionNumber = _.get(currentDoc, 'current_version.revision_number');
          scope.layoutOptions.titleBar.title = getDefaultModalTitle();
          scope.layoutOptions.titleBar.versionNumber = revisionNumber ? 'V' + revisionNumber : '';
          scope.layoutOptions.titleBar.setsName = _.get(currentDoc, 'current_version.sets[0].name');
          scope.layoutOptions.titleBar.isCurrentSet = _.get(currentDoc, 'current_set_version') === currentVersionNum;
          scope.versionedFile = { ..._.get(currentDoc, 'current_version'), lineage_urn: _.get(currentDoc, 'urn') };
        }
        scope.layoutOptions.titleBar.isLatestVersion = isLatestVersion();
        scope.layoutOptions.titleBar.currentSetIsUnknown = _.get(currentDoc, 'current_set_version') === undefined;
        const index = _.findIndex(_.get(store.getState(), 'modalDownload.files') || [], (doc) => {
          const versionFile = doc.current_version || doc;
          return (
            versionFile.urn === scope.versionedFile.urn && !['error', 'retry', 'cancelled'].includes(doc.exportStatus)
          );
        });
        scope.showPreparingToDownload = index > -1;
        if (!currentDoc || _processedVersionUrn === (versionedFile || currentDoc.current_version).urn) {
          return;
        }
        _processedVersionUrn = '';
        scope.showProcessingIndicator =
          !ConnectViewerDocumentService.isImageSupportImageViewFile() &&
          DocumentService.isProcessing(versionedFile || currentDoc);
        scope.showProcessingDone = false;
      };

      scope.onLatestVersionUpdated = (latestVersionNumber) => {
        const { currentDoc } = scope.getDisplayDocEntity();
        currentDoc.latest_version = latestVersionNumber;
        _updateTitleBarInfo();
        scope.$evalAsync();
      };

      const _initTitleBar = () => {
        let titleHeight = 0;
        const body = document.querySelector('div#bimViewerBody');

        if (scope.viewerConfig.getModalDisplayOptions().titleBar.enabled) {
          const title = document.querySelector('div#bimViewerTitle');
          titleHeight += title.clientHeight;
          if (!scope.viewerConfig.getModalDisplayOptions().titleBar.title) {
            _updateTitleBarInfo();
          }
        }
        if (body) {
          body.style.top = titleHeight + 'px';
        }
      };

      // Get parent folder for more action button or for create published markups,
      // if isAdmin we do not need to get the folder
      const _getParentFolder = (doc) => {
        if (!doc) {
          // when define title block, doc is undefined
          return Promise.resolve();
        }
        const parentFolderUrn = doc.parent_folder_urn || doc.parentFolderUrn;

        if (SharedDataService.permission.isAdmin()) {
          scope.displayEntityFolder = {
            urn: parentFolderUrn,
            folder_type: ConnectViewerDocumentService.folderVisibleTypeIsDocument() ? 'plan' : 'normal'
          };
          scope.showMoreActions = true;
          return Promise.resolve();
        }

        let folder = scope.foldersMap[parentFolderUrn];
        if (folder) {
          scope.displayEntityFolder = folder;
          scope.showMoreActions = _moreActionsVisible(folder);
          return Promise.resolve();
        }

        return FolderService.getFolderInfo(SharedDataService.currentProject.id, parentFolderUrn).then((result) => {
          folder = result.attributes || {};
          scope.foldersMap[folder.urn] = folder;
          scope.displayEntityFolder = folder;
          scope.showMoreActions = _moreActionsVisible(folder);
          return Promise.resolve();
        });
      };

      const _resetSidePanel = function() {
        if (!scope.viewerConfig.getModalDisplayOptions().sidePanel.enabled) {
          return;
        }
        ConnectViewerDocumentService.resetSidePanelItems({
          inCompareMode: scope.inCompareMode,
          showPlaceMeHeader: _showPlaceMeHeader
        });
        const activePanelId = scope.activePanel.id;
        if (activePanelId && !_.get(scope.viewerConfig.getSidePanelItemByID(activePanelId), 'visible')) {
          scope.showViewerPanel(false);
          scope.activePanel = {};
        }
      };

      const _initLayout = function() {
        _resetSidePanel();
        if (scope.viewerConfig.getViewerContainerId()) {
          scope.bimViewerContainerId = scope.viewerConfig.getViewerContainerId();
        }

        _initTitleBar();

        if (scope.viewerConfig.getModalDisplayOptions().sidePanel.enabled) {
          _initViewPanel(scope.viewerConfig.getModalDisplayOptions().sidePanel.items);
        }

        if (!_.isEmpty(ViewerModalService.getViewerOptions().getOpenPanel())) {
          scope.activePanel = ViewerModalService.getViewerOptions().getOpenPanel();
          scope.showViewerPanel(true);
        }
      };

      scope.getAccessToken = function(onGetAccessToken) {
        // Should use the getCurrentToken since it will check and refresh token by synchronous request
        // if token is invalid.
        const token = TokenService.getCurrentToken('viewer');
        const expiration = (TokenService.tokenObject.expirationTime - Date.now()) / 1000;
        scope.bimViewerOptions.accessToken = token;
        if (scope.bimViewerApp) {
          scope.bimViewerApp.viewer.config.accessToken = token;
        }
        onGetAccessToken(token, expiration);
      };

      scope.getAcmSession = function(onGetAcmSession) {
        new DSRestClient().getACMSessionID(
          TokenService.getCurrentToken('viewer'),
          (sessionObject) => {
            onGetAcmSession(sessionObject.acmsession);
          },
          () => {
            console.error('get error when call ds get acm session id');
          }
        );
      };

      const _initViewerOptions = function() {
        // extension objects go right on the viewer config object
        // and dont live in their own extensionOptions object
        const bimViewerOptions = scope.viewerConfig.getExtensionOptions();
        if (!_.isEmpty(scope.viewerConfig.getExtensions())) {
          bimViewerOptions.extensions = scope.viewerConfig.getExtensions();
        }

        // Don't enable OTG when using IE, they don't deserve it.
        const isOtgEnabled = FeatureToggleService.isOtgEnabled() && !UtilService.isIEBrowser();

        bimViewerOptions.extensionsWhiteList = scope.viewerConfig.getExtensionsWhiteList();
        bimViewerOptions.hideSettingsToolbar = scope.viewerConfig.getHideSettingsToolbar();
        bimViewerOptions.staticAssetsDomain = window.DM_CONFIG.CDN_DOMAIN || '';
        bimViewerOptions.env = UtilService.getViewerEnvironment(isOtgEnabled) || '';
        bimViewerOptions.urlEnv = window.DM_CONFIG.URLENV;
        bimViewerOptions.getAccessToken = scope.getAccessToken;
        bimViewerOptions.getAcmSession = scope.getAcmSession;
        bimViewerOptions.postCalibrationProperties = scope.postCalibrationProperties;
        bimViewerOptions.getCalibrationProperties = scope.getCalibrationProperties;
        bimViewerOptions.enableCalibrationSaving = true;
        bimViewerOptions.accessToken = TokenService.getCurrentToken('initViewer') || '';
        if (scope.permission) {
          bimViewerOptions.isAdmin = scope.permission.isAdmin();
        }
        bimViewerOptions.documentId = scope.getViewable().documentId || '';
        bimViewerOptions.bimviewerContainer = scope.bimViewerContainerId || '';
        bimViewerOptions.acmNamespace = ACM_NAMESPACE || '';
        // `debugViewerWithoutScopes` is to help debug random 401 error from DS (https://jira.autodesk.com/browse/ALEX-25288)
        // Debug use only, not valid in Production env.
        // Should be removed after 1000 projects support is released
        // bimViewerOptions.acmScopes = ReactUIUtils.AcmUtil.acmScopes();
        bimViewerOptions.acmScopes =
          bimViewerOptions.env !== 'AutodeskProduction' && !!window.debugViewerWithoutScopes
            ? null
            : ReactUIUtils.AcmUtil.acmScopes();
        let lang = $rootScope.I18n.locale;

        // NOTE: TEMP: this is a temp code to manually enable LMV leaflet
        // in browser for testing.
        // NOTE: remove this once we confirm to use LMV leaflet for sure.
        if (window._useLMVLeaflet === undefined) {
          window._useLMVLeaflet = true;
        }
        bimViewerOptions.useLMVleaflet = !!window._useLMVLeaflet;

        if (lang === 'pt-BR') {
          lang = 'pt-br';
        }

        bimViewerOptions.language = lang;
        bimViewerOptions.api = UtilService.getViewerDerivativeRegion(isOtgEnabled);
        bimViewerOptions.skipHiddenFragments = true;
        bimViewerOptions.theme = 'bim-theme';
        bimViewerOptions.shouldInitializeAuth = true;
        bimViewerOptions.tokenExpirationBuffer = 300; // 300 seconds == 5 min.
        bimViewerOptions.productId = 'BIM360Docs'; // Product Id for LMV Mixpanel analytics

        const vectorPdfViewingEnabled =
          SharedDataService.currentProject.vector_pdf_viewing_enabled;
        // Feature flags from Launch darkly should be added here.
        bimViewerOptions.featureFlags = {
          fixMarkupsPositionByOriginalRes: true,
          useLeafletOnly: !vectorPdfViewingEnabled,
          generateIssueThumbnail: true,
          generateRFIThumbnail: false,
          enableHypermodeling: FeatureToggleService.isHyperModelingEnabled(),
          showLocations: true,
          disableDwfSorting: FeatureToggleService.isDwfSortingDisabled()
        };

        scope.bimViewerOptions = bimViewerOptions;
      };

      const _isSheetableFile = function() {
        const sheetPanel = scope.viewerConfig.getSidePanelItemByID(MODAL_SIDE_PANEL.SHEETLIST);
        return !ConnectViewerDocumentService.folderVisibleTypeIsDocument() && sheetPanel && sheetPanel.visible;
      };

      const _isIssueState = () =>
        $state.includes('base.dm.viewer.issues_ui') || $state.includes('base.dm.folders.documents.viewer.issues_ui');

      const _isProgressiveViewable = () => {
        const { versionedFile, currentDoc = {} } = scope.getDisplayDocEntity();
        return DocumentService.isProgressiveViewableState(
          _.get(versionedFile || currentDoc.current_version, 'process_state')
        );
      };

      const _initDocument = function() {
        if (scope.inCompareMode) {
          const rowEntity = scope.multiBimViewerOptions.currentDocument;
          ViewerModalService.getViewerOptions().setDocumentFromRowEntity(rowEntity);
        }

        const displayDocEntity = scope.getDisplayDocEntity();

        if (_.isEmpty(displayDocEntity) || _.isEmpty(scope.getViewable())) {
          scope.showLoadingFailurePage = true;
        } else {
          _getParentFolderPromise = _getParentFolder(displayDocEntity.currentDoc);
        }
      };

      const _init = function() {
        scope.txtLoading = scope.translate('bimviewer.loading');
        scope.layoutOptions = scope.viewerConfig.getModalDisplayOptions();
        if (scope.inCompareMode) {
          scope.layoutOptions.titleBar.enabled = true;
          scope.showCompareHeader = true;
        }
        const { selectedFolder } = SharedDataService.selectedFolder;
        const folderUrn = _.get(selectedFolder, 'urn');
        folderUrn && (scope.foldersMap[folderUrn] = selectedFolder);

        ConnectViewerDocumentService.initCurrentView();
        _initDocument();
        _initLayout();

        if (ConnectViewerDocumentService.isReviewView()) {
          scope.activePanel = scope.viewerConfig.getSidePanelItemByID(MODAL_SIDE_PANEL.COMMENTS);
          scope.showViewerPanel(true);
        } else if (
          _.isEmpty(scope.activePanel) &&
          _isSheetableFile() &&
          !_isIssueState() &&
          !window.inFrame &&
          !scope.inCompareMode
        ) {
          scope.activePanel = scope.viewerConfig.getSidePanelItemByID(MODAL_SIDE_PANEL.SHEETLIST);
          scope.showViewerPanel(true);
        }

        _initViewerOptions();
      };

      scope.canNavigate = function() {
        if (!scope.bimViewerApp) {
          return false;
        }

        if (
          scope.markupEditEnabled ||
          scope.issueEditEnabled ||
          (ViewHistoryService.getHistoryStack().length > 0 && ViewHistoryService.isShowHistoryBack()) ||
          _showPlaceMeHeader
        ) {
          return false;
        }

        const doc = _.get(scope.getDisplayDocEntity(), 'currentDoc');
        if (!doc) {
          return false;
        }
        return ConnectViewerDocumentService.getDocumentList().some((item) => item.urn === doc.urn);
      };

      scope.isReviewView = () => ConnectViewerDocumentService.isReviewView();

      scope.refreshUI = () => {
        scope.$apply();
        $timeout(() => {
          _initTitleBar();
          _initViewPanel();
          scope.$digest();
          scope.resizeViewer();
        }, 0);
      };

      scope.getCalibrationProperties = () => scope.calibrationProperties('get');
      scope.postCalibrationProperties = (body, hasCalibrationData) =>
        scope.calibrationProperties(hasCalibrationData ? 'patch' : 'post', body);

      scope.calibrationProperties = function(method, body) {
        const versionUrn = scope.versionedFile && scope.versionedFile.urn;
        if (!versionUrn) {
          return Promise.resolve();
        }
        const projectID = SharedDataService.currentProject.id;
        const url = '/projects/' + projectID + '/versions/' + encodeURIComponent(versionUrn) + '/properties';
        return ConnectReduxService.dmV2()
          [method](url, body)
          .catch(() => {});
      };

      const compareTool = {
        cachedLayoutOptions: {},
        compareService: null,
        enabled() {
          return (
            !ConnectViewerDocumentService.isImageSupportImageViewFile() &&
            !ConnectViewerDocumentService.isImageSupportLeafletViewFile() &&
            scope.layoutOptions.compareTool.enable &&
            SharedDataService.permission.isCompareAvailable()
          );
        },

        compareDocuments() {
          if (ConnectViewerDocumentService.folderVisibleTypeIsDocument()) {
            compareTool.loadCompareService(scope.bimViewerApp);
            if (!compareTool.compareService.container) {
              compareTool.compareService.container = {};
            }
            const documents = scope.multiBimViewerOptions.documents;
            compareTool.compareService.compare(documents[0], documents[1]);
          } else {
            new DSRestClient().getACMSessionID(
              TokenService.getCurrentToken('compare'),
              (sessionObject) => {
                const {
                  documents: [firstDocVersion, secondDocVersion],
                  currentDocument: { urn, parent_folder_urn }
                } = scope.multiBimViewerOptions;
                compareTool.loadCompareService(scope.bimViewerApp, sessionObject.acmsession);
                const firstDocument = { currentVersion: firstDocVersion, parent_folder_urn, urn };
                const secondDocument = { currentVersion: secondDocVersion, parent_folder_urn, urn };
                const options = {
                  onCancel: compareTool.exitComparing,
                  saveCache: true
                };
                compareTool.compareService.openCompareModal(
                  firstDocument,
                  secondDocument,
                  document.getElementById('compare-modal-container-outside'),
                  options
                );
                compareTool.compareService.originalDoc = null; // Clean originalDoc in order that when quiting the compare tool, it won't
              },
              () => {
                console.error('get error when call ds get acm session id');
              }
            );
          }
        },

        loadCompareService(viewerApp, acmSessionID) {
          if (compareTool.enabled() && !compareTool.compareService) {
            const onErrorCB = () => {
              if (scope.inCompareMode && !scope.showMultiBIMViewer.value) {
                return;
              }
              $rootScope.growl('error', scope.translate(`bimviewer.errorMessage.failedUnknownError`));
            };
            const compareServiceOptions = {
              viewerApp,
              getRootFolders: () => FolderService.getRootFolders(SharedDataService.currentProject.id),
              getFolderContents: FolderService.getFolderContents,
              getSubFolders: (folderUrn) => FolderService.getSubFolders(SharedDataService.currentProject.id, folderUrn),
              folderIsProjectFolder: FolderService.folderIsProjectFolder,
              getDocumentVersions: (folderUrn, documentUrn) =>
                DocumentService.getVersionedFileList(SharedDataService.currentProject.id, folderUrn, documentUrn),
              acmSessionId: acmSessionID || (viewerApp.loadedItem && viewerApp.loadedItem.getDocument().acmSessionId),
              accessToken: scope.bimViewerOptions.accessToken,
              getViewerAppOptions: () => scope.bimViewerOptions /* necessary only if viewerApp doesn't exist */,
              container: scope.bimViewerContainerId,
              onError: onErrorCB,
              onDiffModeChanged: () => {
                if (scope.showLoadingPage) {
                  scope.showLoadingPage = false;
                  scope.$evalAsync();
                }
              },
              exitComparing: scope.inCompareMode ? compareTool.exitDiffMode : null
            };

            compareTool.compareService = new scope.bim360LmvViewer.CompareService(compareServiceOptions);
          }
        },

        loadViewerExtension(viewer, doc, item) {
          // load compare tool
          if (compareTool.enabled()) {
            const options = {
              currentDocument: scope.getDisplayDocEntity(),
              compareService: compareTool.compareService
            };
            scope.bim360LmvViewer
              .loadCompareExt(viewer, options)
              .then(() => {})
              .catch(() => {});
            compareTool.viewer = viewer;
          }
        },

        addViewerEventListeners(viewer) {
          const events = [
            { type: Autodesk.Viewing.DIFF_TOOL_ENTER_DIFF_MODE, processHandle: compareTool.enterDiffMode },
            { type: Autodesk.Viewing.DIFF_TOOL_EXIT_DIFF_MODE, processHandle: compareTool.exitDiffMode }
          ];
          const addViewerEventListener = ({ type, processHandle } = event) => {
            if (!viewer.hasEventListener(type, processHandle)) {
              viewer.addEventListener(type, processHandle);
            }
          };
          events.forEach((event) => {
            addViewerEventListener(event);
          });
        },

        exitComparing() {
          if (scope.inCompareMode) {
            compareTool.exitDiffMode(); // The only reason we need this case, is because there are no event listeners when we are on `inCompareMode`.
          } else {
            compareTool.compareService._onExitCompareButtonClicked();
          }
        },

        enterDiffMode() {
          if (scope.inDiffMode) {
            return;
          }
          scope.inDiffMode = true;
          scope.showCompareHeader = true;
          ['sidePanel', 'titleBar', 'documentNavigation'].forEach((key) => {
            compareTool.cachedLayoutOptions[key] = scope.layoutOptions[key].enabled;
            scope.layoutOptions[key].enabled = key === 'titleBar';
          });
          if (window.inFrame) {
            scope.layoutOptions.titleBar.enabled = false;
          }
          compareTool.cachedLayoutOptions.historyBack = ViewHistoryService.isShowHistoryBack();
          ViewHistoryService.setShowHistoryBack(false);
          scope.showViewerPanel(false);
          scope.refreshUI();
        },

        exitDiffMode() {
          if (scope.inCompareMode) {
            scope.showMultiBIMViewer.value = false;
            $timeout(() => $rootScope.$broadcast('typhoon.modal.close'), 0);
            return;
          }

          scope.inDiffMode = false;
          scope.showCompareHeader = false;
          ['sidePanel', 'titleBar', 'documentNavigation'].forEach((key) => {
            scope.layoutOptions[key].enabled = compareTool.cachedLayoutOptions[key];
          });
          ViewHistoryService.setShowHistoryBack(compareTool.cachedLayoutOptions.historyBack);
          ViewHistoryService.setKeepHistoryStack(true);
          if (!_.isEmpty(scope.activePanel)) {
            scope.showViewerPanel(true);
          }
          scope.refreshUI();
        }
      };

      const isRevitFile = function() {
        const fileName = ConnectViewerDocumentService.getRawDocument().file_name;
        if (!fileName) {
          return false;
        }
        const extendName = FileTypeService.getFileExtension(fileName);
        if (!extendName) {
          return false;
        }
        return extendName.toLowerCase() === 'rvt';
      };

      const fullScreenModeEvent = function(e) {
        scope.fullScreen = e.mode !== Autodesk.Viewing.ScreenMode.kNormal;
        return scope.$digest();
      };

      const imageCropSelectedEvent = function(event) {
        scope.imageCropAreaSelected = event.areaSelected;
        return scope.$apply();
      };

      const splitViewActived = function(event) {
        scope.splitViewActived = true;
      };

      const splitViewDeactived = function(event) {
        scope.splitViewActived = false;
      };

      const drawingPrinted = function(event) {
        scope.savePrintEvent();
      };

      const loadViewerExtension = function(viewer, doc, item) {
        let options;
        if (!viewer.model) {
          return;
        }
        const is2d = viewer.impl.is2d;
        // load mini map
        viewer.unloadExtension('Autodesk.BIM360.Minimap');
        if (is2d && !ConnectViewerDocumentService.isImageSupportImageViewFile()) {
          options = {
            acmSessionId: doc.acmSessionId,
            docId: doc.myPath,
            itemId: item.guid && item.guid()
          };
          viewer
            .loadExtension('Autodesk.BIM360.Minimap', options)
            .then(() => {})
            .catch(() => {});
        }

        // only enable split view for revit file
        viewer.unloadExtension('Autodesk.BIM360.Extensions.SplitView');
        if (isRevitFile()) {
          options = {
            item,
            doc
          };

          const loadSplitExt = () => {
            scope.bim360LmvViewer.loadSplitViewExt(viewer, options).then(() => {
              // Add split view listener
              const SPLIT_VIEW_ACTIVATED_EVENT = 'splitView.activated';
              const SPLIT_VIEW_DEACTIVATED_EVENT = 'splitView.deactivated';
              if (!viewer.hasEventListener(SPLIT_VIEW_ACTIVATED_EVENT, splitViewActived)) {
                viewer.addEventListener(SPLIT_VIEW_ACTIVATED_EVENT, splitViewActived);
              }
              if (!viewer.hasEventListener(SPLIT_VIEW_DEACTIVATED_EVENT, splitViewDeactived)) {
                viewer.addEventListener(SPLIT_VIEW_DEACTIVATED_EVENT, splitViewDeactived);
              }
            });
          };

          const getSeedUrn = () => {
            const bubbleResUrn = _.get(
              scope.getDisplayDocEntity(),
              'currentDoc.current_version.bubble_viewable_resource_urn'
            );
            const bubbleResPath = bubbleResUrn && bubbleResUrn.split(':')[3];
            return bubbleResPath && bubbleResPath.split('/')[0];
          };

          if (
            !ConnectViewerDocumentService.folderVisibleTypeIsSeedFile() &&
            _.get(scope.getDisplayDocEntity(), 'currentDoc.current_version.action') === 'copy'
          ) {
            const encodedSeedUrn = getSeedUrn();
            scope.bimViewerApp.disableObservers();
            scope.bimViewerApp
              .loadDocument(encodedSeedUrn)
              .then(
                (originalDoc) => {
                  options.doc = originalDoc;
                },
                (error) => {
                  console.log('error: ', error);
                }
              )
              .then(() => {
                scope.bimViewerApp.enableObservers();
                loadSplitExt();
              });
          } else {
            loadSplitExt();
          }
        }
      };

      const logViewDocumentActivity = () => {
        const doc = scope.getDisplayDocEntity().currentDoc;
        if (doc) {
          const urn = _.get(scope.getDisplayDocEntity(), 'versionedFile.urn', doc.urn);
          DocumentService.viewDocument(SharedDataService.currentProject.ea_project_id, doc.parent_folder_urn, urn);
        }
      };

      const ViewerObserver = function() {
        this.onViewerStarted = (viewerApp) => $rootScope.$broadcast('bimViewerStarted', viewerApp);

        this.onViewerStartFailed = () =>
          scope.onViewerError(
            scope.translate(
              `bimviewer.${_isProgressiveViewable() ? 'errorMessage.extractionNotFinished' : 'failedToStart'}`
            )
          );

        this.onDocumentLoading = (viewerApp, docId) => {
          scope.txtLoading = scope.translate('bimviewer.loading');
          if (scope.viewerConfig.getModalDisplayOptions().titleBar.enabled) {
            _updateTitleBarInfo();
          }
        };

        this.onDocumentLoaded = function(viewerApp, doc) {
          // Set sheetlist in BubbleService
          if (viewerApp && doc) {
            const bubble = doc.myData;
            BubbleService.setBubble(bubble);
          }
          scope.doc = doc;
          // hidden loading&failure page.
          scope.showLoadingPage = false;
          scope.showLoadingFailurePage = false;
          scope.$evalAsync();
        };

        this.onDocumentLoadFailed = function(viewerApp, err) {
          const errorMsg = scope.translate(
            `bimviewer.errorMessage.${_isProgressiveViewable() ? 'extractionNotFinished' : 'UnexpectedError'}`
          );
          return scope.onViewerError(errorMsg);
        };

        this.onItemSelected = function(viewerApp, viewer, item, viewGeometryItem) {
          // update title name
          if (scope.viewerConfig.getModalDisplayOptions().titleBar.enabled) {
            _updateTitleBarInfo();
          }

          // Make sure loading or failure page is not active
          if (scope.showLoadingFailurePage || scope.showLoadingPage) {
            scope.showLoadingFailurePage = false;
            scope.showLoadingPage = false;
          }
          // Clear selected image area after use change sheet from sheet list panel
          scope.imageCropAreaSelected = false;
          scope.showExitPlaceMe && scope.exitPlaceMe(false);
          logViewDocumentActivity();
        };

        this.onItemLoadFailed = function(viewerApp, err = {}) {
          let errorMsg;
          store.dispatch(
            actions.logMixpanel({
              event: mixpanel.MixpanelEvents.openFile,
              params: [{ currentDoc: scope.getDisplayDocEntity().currentDoc }, 'Failure']
            })
          );
          if (_isSheetableFile()) {
            store.dispatch(
              actions.logMixpanel({
                event: mixpanel.MixpanelEvents.viewSheet,
                params: [scope.getDisplayDocEntity(), 'Failure']
              })
            );
          }
          if (_showPlaceMeHeader || scope.showPlaceMeHeader) {
            _showPlaceMeHeader = false;
            scope.showPlaceMeHeader = false;
            _resetSidePanel();
          }

          if (
            err.errorCode === Autodesk.Viewing.ErrorCodes.BROWSER_WEBGL_DISABLED ||
            err.errorCode === Autodesk.Viewing.ErrorCodes.BROWSER_WEBGL_NOT_SUPPORTED
          ) {
            errorMsg = scope.translate('bimviewer.errorMessage.webGLError');
            return scope.onViewerError(errorMsg);
          } else {
            if (err.errorMessage === 'Forbidden' || err.errorCode === 403) {
              if (ConnectViewerDocumentService.isImageSupportImageViewFile()) {
                return scope.onViewerError(
                  scope.translate('bimviewer.errorMessage.imageViewNoPermissionError'),
                  scope.translate('bimviewer.errorTitle.imageViewNoPermissionError')
                );
              }
            }
            return scope.onViewerError(
              err.errorMsg ||
                scope.translate(
                  `bimviewer.errorMessage.${_isProgressiveViewable() ? 'extractionNotFinished' : 'UnexpectedError'}`
                )
            );
          }
        };

        this.onItemLoaded = function(viewerApp, viewer, item, messages) {
          // ??? Since lmv doesn't support dutch
          // ??? we need manually enable nl for bim viewer.
          if ($rootScope.I18n.locale === 'nl') {
            Autodesk.Viewing.Private.setLanguage('nl');
          }
          if (scope.showPlaceMeHeader && !_showPlaceMeHeader) {
            _resetSidePanel();
          }
          scope.showPlaceMeHeader = _showPlaceMeHeader;
          compareTool.loadCompareService(viewerApp);
          compareTool.loadViewerExtension(viewer, scope.doc, item);
          scope.inCompareMode && scope.showViewerToolbar(viewer, false);
          loadViewerExtension(viewer, scope.doc, item);
          store.dispatch(
            actions.logMixpanel({
              event: mixpanel.MixpanelEvents.openFile,
              params: [{ currentDoc: scope.getDisplayDocEntity().currentDoc }, 'Success']
            })
          );
          if (_isSheetableFile()) {
            store.dispatch(
              actions.logMixpanel({
                event: mixpanel.MixpanelEvents.viewSheet,
                params: [scope.getDisplayDocEntity(), 'Success']
              })
            );
            // update item guid in viewer config
            scope.viewerConfig.getViewable().guid = item.guid && item.guid();
          }

          // hidden loading page.
          if (scope.showLoadingPage) {
            scope.showLoadingPage = false;
            scope.$evalAsync();
          }

          // Add full screen mode listener
          if (!viewer.hasEventListener(Autodesk.Viewing.FULLSCREEN_MODE_EVENT, fullScreenModeEvent)) {
            viewer.addEventListener(Autodesk.Viewing.FULLSCREEN_MODE_EVENT, fullScreenModeEvent);
          }

          // Add image crop event listener
          if (!viewer.hasEventListener(Autodesk.Viewing.IMAGE_CROP_SELECTED_EVENT, imageCropSelectedEvent)) {
            viewer.addEventListener(Autodesk.Viewing.IMAGE_CROP_SELECTED_EVENT, imageCropSelectedEvent);
          }

          // Add compare tool event listener
          if (Autodesk.Viewing.DIFF_TOOL_ENTER_DIFF_MODE && Autodesk.Viewing.DIFF_TOOL_EXIT_DIFF_MODE) {
            compareTool.addViewerEventListeners(viewer);
          } else {
            $timeout(() => {
              compareTool.addViewerEventListeners(viewer);
            }, 0);
          }

          // Add print event listener
          const PRINTED_EVENT = 'print.image.event';
          if (!viewer.hasEventListener(PRINTED_EVENT, drawingPrinted)) {
            viewer.addEventListener(PRINTED_EVENT, drawingPrinted);
          }

          const DROP_ME_EVENT = Autodesk.Viewing.DROP_ME_COMPLETED;
          if (!viewer.hasEventListener(DROP_ME_EVENT)) {
            viewer.addEventListener(DROP_ME_EVENT, ({ onClickedCB }) => {
              if (!scope.showExitPlaceMe) {
                scope.showExitPlaceMe = true;
                const showHistoryBack = ViewHistoryService.isShowHistoryBack();
                ViewHistoryService.setShowHistoryBack(false);
                scope.exitPlaceMe = (isClick) => {
                  _showPlaceMeHeader = false;
                  scope.showExitPlaceMe = false;
                  ViewHistoryService.setShowHistoryBack(showHistoryBack);
                  isClick && onClickedCB();
                };
              }
            });
          }

          const DROP_ME_START_EVENT = Autodesk.Viewing.DROP_ME_STARTED;
          if (!viewer.hasEventListener(DROP_ME_START_EVENT)) {
            viewer.addEventListener(DROP_ME_START_EVENT, ({ name }) => {
              if (!ConnectViewerDocumentService.folderVisibleTypeIsSeedFile()) {
                _showPlaceMeHeader = true;
                _resetSidePanel();
                scope.placeMeDocumentName = name;
              }
            });
          }

          const EXTENSION_LOADED_EVENT = Autodesk.Viewing.EXTENSION_LOADED_EVENT;
          if (!viewer.hasEventListener(EXTENSION_LOADED_EVENT)) {
            viewer.addEventListener(EXTENSION_LOADED_EVENT, ({ extensionId }) => {
              // ALEX-29792: Remove rollCamera extension during defining title block
              if (
                extensionId === 'Autodesk.BIM360.Extensions.RollCamera' &&
                scope.layoutOptions.titleBlockActionBar.enabled
              ) {
                const toolbarName = viewer.config.hideSettingsToolbar
                  ? Autodesk.Viewing.TOOLBAR.NAVTOOLSID
                  : Autodesk.Viewing.TOOLBAR.SETTINGSTOOLSID;
                const controlGroup = viewer.getToolbar(false).getControl(toolbarName);
                const button = controlGroup.getControl('toolbar-rool-camera');
                controlGroup.removeControl(button);
              }

              if (extensionId === 'Autodesk.BIM360.Extensions.Compare' && _showPlaceMeHeader) {
                const controlGroup = viewer.getToolbar(false).getControl('compare');
                const compareButton = controlGroup.getControl('toolbar-compare');
                controlGroup.removeControl(compareButton);
              }
            });
          }
        };

        this.onModelAdded = function(viewerApp) {
          scope.viewerInstance = viewerApp.viewer;
        };

        this.onViewerStopped = function(viewerApp) {
          scope.viewerInstance = null;
          return viewerApp.removeViewerObserver(this);
        };
      };

      const showBIMViewerModal = function() {
        if ($rootScope.modalDetails.open) {
          return;
        }

        $rootScope.modalDetails.open = true;

        scope.viewerConfig = ViewerModalService.getViewerOptions();

        if (!scope.viewerConfig) {
          scope.showLoadingFailurePage = true;
          return;
        }

        if (_.isEmpty(scope.viewerConfig.getModalDisplayOptions())) {
          ViewerModalService.resetViewerOptions().createViewerOptions();
        }

        const viewFunc =
          scope.viewerConfig.viewFunc ||
          function(viewer, scope) {
            if (scope.getViewable().bubble_urn) {
              scope.showLoadingPage = true;
              scope.showLoadingFailurePage = false;
              scope.$evalAsync();
              _addDropMeViewerObserver();

              const documentVersion = _getDocumentVersionNumber();

              viewer.loadDocumentAndItem(
                scope.getViewable().documentId,
                scope.getViewable().guid,
                undefined,
                undefined,
                { documentVersion }
              );
            } else {
              if (scope.getViewable().oss_urn) {
                viewer.loadImage(scope.getViewable().oss_urn);
              }
            }
          };

        // initialize bim viewer layout
        _init();
        ViewerModalService.getViewerOptions()
          .getLmvViewerPromise()
          .then((bim360LmvViewer) => {
            scope.bim360LmvViewer = bim360LmvViewer;
            scope.viewerPromise = ViewerModalService.getViewerOptions().getCurrentViewerPromise(scope.bimViewerOptions);
            scope.viewerPromise
              .then((bimViewerApp) => {
                scope.bimViewerApp = bimViewerApp;
                scope.bimViewerApp.addViewerObserver(new ViewerObserver());
                scope.$broadcast('viewerAppInitialized');
                scope.$evalAsync();
                // turn off api call to settoken in viewer. reference: https://wiki.autodesk.com/x/Ww8OEw
                window.LMV_THIRD_PARTY_COOKIE = false;
                return scope.bimViewerApp.initViewer();
              })
              .then(() => {
                _getParentFolderPromise
                  .then(() => {
                    scope.isShowOfficeViewer = ConnectViewerDocumentService.isViewableOfficeFile();
                    scope.isShowVideoViewer = ConnectViewerDocumentService.isViewableVideoFile();
                    scope.isShowRcpViewer = ConnectViewerDocumentService.isViewableRcpFile();
                    if (scope.isShowOfficeViewer) {
                      scope.openOfficeViewer();
                    } else if (scope.isShowVideoViewer) {
                      scope.openVideoViewer();
                    } else if (scope.isShowRcpViewer) {
                      scope.openRcpViewer();
                    } else if (scope.inCompareMode) {
                      compareTool.compareDocuments();
                    } else {
                      viewFunc(scope.bimViewerApp, scope);
                    }
                  })
                  .catch((error) => {
                    if (error.status === 403) {
                      scope.onViewerError(scope.translate('bimviewer.errorMessage.noPermissionError'));
                    } else {
                      throw error;
                    }
                  });
              });
          });
      };

      const closeBIMViewerModal = function() {
        scope.showBIMViewer.value = false;
        if ($rootScope.pageContentMsg) {
          $rootScope.pageContentMsg.isKeep = true;
        }
        $rootScope.$broadcast('continueLoadSelectedFolderDocumentList');
        ConnectViewerDocumentService.backToDocumentList();
      };

      const _loadDocument = function(doc, options = {}) {
        if (!doc) return;

        scope.viewerConfig.setDocumentFromRowEntity(doc);

        const viewableItem = scope.viewerConfig.getViewable();

        // when switch to another type of folder
        // need reset viewer side panel
        _resetSidePanel();

        scope.isShowOfficeViewer = ConnectViewerDocumentService.isViewableOfficeFile();
        if (scope.isShowOfficeViewer) {
          _updateTitleBarInfo();
          scope.openOfficeViewer();
          return;
        }

        scope.isShowVideoViewer = ConnectViewerDocumentService.isViewableVideoFile();
        if (scope.isShowVideoViewer) {
          _updateTitleBarInfo();
          scope.openVideoViewer();
          return;
        }

        scope.isShowRcpViewer = ConnectViewerDocumentService.isViewableRcpFile()
        if (scope.isShowRcpViewer) {
          _updateTitleBarInfo();
          scope.openRcpViewer();
          return;
        }

        if (!scope.bimViewerApp) {
          return;
        }

        if (viewableItem.bubble_urn) {
          // show loading page
          scope.showLoadingPage = true;
          scope.showLoadingFailurePage = false;

          _addDropMeViewerObserver();

          const documentVersion = _getDocumentVersionNumber();

          // For project folder hyperlink, there will be a pageNumber attribute
          if (doc.pageNumber) {
            scope.bimViewerApp.loadDocumentAndItem(viewableItem.documentId, null, null, doc.pageNumber, {
              ...options,
              documentVersion
            });
          } else {
            scope.bimViewerApp.loadDocumentAndItem(viewableItem.documentId, viewableItem.guid, undefined, undefined, {
              ...options,
              documentVersion
            });
          }
        } else {
          if (viewableItem.oss_urn) {
            scope.bimViewerApp.loadImage(viewableItem.oss_urn);
          }
        }
      };

      scope.loadDocumentAndItem = function(doc, options) {
        scope.showMoreActions = false;
        scope.isShowVideoViewer && store.dispatch.videoViewer.hide();

        return _getParentFolder(doc)
          .then(() => {
            _loadDocument(doc, options);
          })
          .catch(() => {});
      };

      scope.unloadOfficeViewer = () => {
        store.dispatch(actions.officeFileHideViewer());
      };

      const getOfficePayload = (doc) => {
        const isViewOnly =
          ConnectViewerDocumentService.isReviewView() ||
          ConnectViewerDocumentService.isTransmittalView() ||
          !isLatestVersion();
        const hostViewUrl = window.location.href;
        return DocumentService.getOfficeSharePayload({
          isViewOnly,
          lineageUrn: doc.urn,
          action: ReactUIConsts.OFFICE_FILE_ACTIONS.VIEW,
          hostViewUrl
        });
      };

      // Trigger state change to view / edit office.
      scope.enterOfficeFileEditor = () => {
        scope.unloadOfficeViewer();
        scope.$emit('closeBIMViewerModal');
        $state.go('base.dm.office', {
          ...$state.params,
          urn: scope.officeViewingUrn,
          url: window.location.href,
          cTag: new Date().getTime(),
          cId: 1
        });
      };

      scope.openOfficeViewer = (versionFile, needActivity = true) => {
        scope.showLoadingPage = false;
        scope.showLoadingFailurePage = false;
        needActivity && logViewDocumentActivity();
        store.dispatch(
          actions.logMixpanel({
            event: mixpanel.MixpanelEvents.openFile,
            params: [{ currentDoc: scope.getDisplayDocEntity().currentDoc }, 'Success']
          })
        );

        // If it switched from Version History. We should update the title bar
        if (versionFile) _updateTitleBarInfo();

        const doc = versionFile || ConnectViewerDocumentService.getRawDocument();
        scope.officeViewingUrn = doc.urn;

        const payload = {
          ...getOfficePayload(doc),
          title: _.get(doc, 'file_name') || _.get(doc, 'name'),
          urn: _.get(doc, 'current_version.urn') || _.get(doc, 'current_version_urn')
        };

        scope.unloadOfficeViewer();
        store.dispatch(actions.officeFileShowViewer(payload));
        scope.$broadcast('loadOfficeDocument');
        scope.$evalAsync();
      };

      scope.openVideoViewer = (versionFile, needActivity = true) => {
        scope.showLoadingPage = false;
        scope.showLoadingFailurePage = false;
        needActivity && logViewDocumentActivity();
        store.dispatch(
          actions.logMixpanel({
            event: mixpanel.MixpanelEvents.openFile,
            params: [{ currentDoc: scope.getDisplayDocEntity().currentDoc }, 'Success']
          })
        );

        let doc = ConnectViewerDocumentService.getRawDocument();
        // If it switched from Version History. We should update the title bar
        if (versionFile) {
          _updateTitleBarInfo();
          doc = { ...doc, current_version: versionFile };
        }
        const hasDownloadPermission = SharedDataService.permission.isAdmin() || scope.isAllowedAction('download', scope.displayEntityFolder);
        store.dispatch.videoViewer.show({ doc, hasDownloadPermission });
        scope.$broadcast('loadVideoDocument');
        scope.$evalAsync();
      };

      scope.openRcpViewer = (versionFile, needActivity = true) => {
        scope.showLoadingPage = false;
        scope.showLoadingFailurePage = false;
        needActivity && logViewDocumentActivity();
        store.dispatch(
          actions.logMixpanel({
            event: mixpanel.MixpanelEvents.openFile,
            params: [{ currentDoc: scope.getDisplayDocEntity().currentDoc }, 'Success']
          })
        );
        const folderUrn = scope.displayEntityFolder.urn;
        const projectId = SharedDataService.currentProject.id;

        let urn;
        if (versionFile) {
          _updateTitleBarInfo();
          urn = versionFile.urn;
        } else {
          const displayDocEntity = scope.getDisplayDocEntity();
          urn = _.get(displayDocEntity, 'versionedFile.urn', displayDocEntity.currentDoc.urn);
        }
        scope.rcpIframeSource = $sce.trustAsResourceUrl(UtilService.getRcpViewerEndpoint(projectId, folderUrn, urn));
        scope.$broadcast('loadRcpDocument');
        scope.$evalAsync();
      };

      onEmitterEvent(events.docsComponentApi.viewerModal.sidePanel.issues.active, (active) => {
        scope.issueEditEnabled = active;
        return scope.$evalAsync();
      });

      onEmitterEvent(events.docsComponentApi.viewerModal.sidePanel.markups.active, (active) => {
        scope.markupEditEnabled = active;
        return scope.$evalAsync();
      });

      onEmitterEvent(events.bim360.ui.contextMenu.updateView, () => scope.$digest());

      scope.$on('willEditIssues', function() {
        if (_.get(scope, 'bimViewerApp.viewer.model.is3d') && scope.bimViewerApp.viewer.model.is3d()) {
          scope.$broadcast('deselectMarkup');
        }
      });

      scope.$on('showViewerLoadingPage', () => {
        scope.showLoadingPage = true;
      });

      onEmitterEvent(ReactUIConsts.DM_EVENTS.PREPARE_EXPORT, () => {
        scope.showPreparingToDownload = true;
      });

      onEmitterEvent(ReactUIConsts.DM_EVENTS.EXPORT_DONE, (status) => {
        scope.showPreparingToDownload = false;
        if (['error', 'retry'].includes(status) && $rootScope.showBIMViewer && $rootScope.showBIMViewer.value) {
          $rootScope.growl('error', $rootScope.translate('error.export_error'));
        }
        scope.$digest();
      });

      const onDocumentsProcessCompleted = (documents) => {
        const { versionedFile, currentDoc } = scope.getDisplayDocEntity();
        if (!currentDoc) {
          return;
        }
        const publishedDocs = documents.filter((item) => item.urn === currentDoc.urn);
        if (publishedDocs.length === 0) {
          return;
        }
        const version = versionedFile || currentDoc.current_version;
        if (scope.showProcessingIndicator && publishedDocs.find((document) => document.version.urn === version.urn)) {
          scope.showProcessingIndicator = false;
          scope.showProcessingDone = version.process_state !== 'PROCESSING_PROMOTING';
          _processedVersionUrn = version.urn;
        }
        scope.$evalAsync();
      };

      onEmitterEvent(ReactUIConsts.DM_EVENTS.DOCUMENTS_PROCESS_COMPLETED, onDocumentsProcessCompleted);

      onEmitterEvent(ReactUIConsts.DM_EVENTS.DOCUMENTS_PUBLISHED, onDocumentsProcessCompleted);

      scope.reloadViewerDocument = () => {
        const { versionedFile, currentDoc } = scope.getDisplayDocEntity();
        scope.showProcessingDone = false;
        scope.showProcessingIndicator = false;

        if (versionedFile) {
          scope.$broadcast('reloadViewerDocument');
        } else {
          currentDoc.current_version.process_state = 'PROCESSING_COMPLETE';
          scope.loadDocumentAndItem(currentDoc, { documentNeedsRefresh: true });
        }
      };

      scope.closeBIMViewerModal = closeBIMViewerModal;

      scope.$on('closeBIMViewerModal', () => scope.closeBIMViewerModal());

      scope.bimViewerScope = scope;

      scope.exitBIMViewerComparing = () => {
        compareTool.exitComparing();
      };

      onEmitterEvent(events.docsComponentApi.viewerModal.close, function() {
        closeBIMViewerModal();
      });

      const officeMessageHandler = DocumentService.getOfficeMessageListener(() => scope.enterOfficeFileEditor());
      const rcpMessageHandler = DocumentService.getRcpMessageListener((msg, targetOrigin) => {
        const rcpIframe = document.getElementById('id-rcp-iframe');
        rcpIframe && rcpIframe.contentWindow.postMessage(msg, targetOrigin);
      });

      $window.addEventListener('message', officeMessageHandler, false);
      $window.addEventListener('message', rcpMessageHandler, false);

      scope.$on('$destroy', function() {
        try {
          scope.bimViewerApp.terminate();
        } catch (error) {
          console.error(error);
        }

        ViewerModalService.getViewerOptions().resetCurrentViewerPromise();
        $rootScope.modalContext = null;
        $rootScope.modalDetails.open = false;
        scope.bimViewerApp = null;
        scope.bim360LmvViewer = null;
        scope.showLoadingFailurePage = false;
        scope.showFailureTitle = false;
        scope.showLoadingPage = true;
        if (_.get(store.getState(), 'modal.fileNotViewable.isShown')) {
          store.dispatch(actions.hideFileNotViewableModal());
        }
        ViewerModalService.resetViewerOptions();
        CalloutLinkDocumentService.resetVars();
        ConnectViewerDocumentService.reset();
        IssuesUiConfigurationService.clearCache();
        _emitterKeys.forEach((type) => emitter.removeAllListeners(type));
        $window.removeEventListener('message', officeMessageHandler);
        $window.removeEventListener('message', rcpMessageHandler);
        return scope.$evalAsync();
      });

      showBIMViewerModal();
    }
  })
]);
